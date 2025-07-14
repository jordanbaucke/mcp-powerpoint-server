import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  CallToolRequestSchema,
  JSONRPCError,
  JSONRPCNotification,
  ListToolsRequestSchema,
  LoggingMessageNotification,
  Notification,
} from '@modelcontextprotocol/sdk/types.js';
import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { logger } from './helpers/logs.js';
import { PowerPointTools } from './tools.js';

const log = logger('server');
const JSON_RPC = '2.0';
const JSON_RPC_ERROR = -32603;

export class StreamableHTTPServer {
  server: Server;

  constructor(server: Server) {
    this.server = server;
    this.setupServerRequestHandlers();
  }

  async close() {
    log.info('Shutting down server...');
    await this.server.close();
    log.info('Server shutdown complete.');
  }

  async handleGetRequest(req: Request, res: Response) {
    res.status(405).json(this.createRPCErrorResponse('Method not allowed.'));
    log.info('Responded to GET with 405 Method Not Allowed');
  }

  async handlePostRequest(req: Request, res: Response) {
    log.info(`POST ${req.originalUrl} (${req.ip}) - payload:`, req.body);
    
    // Simple authentication check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json(this.createRPCErrorResponse('Unauthorized: Missing or invalid Bearer token'));
      log.error('Unauthorized request: Missing or invalid Bearer token');
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    // Simple demo token validation (in production, use proper JWT validation)
    if (token !== 'abc') {
      res.status(401).json(this.createRPCErrorResponse('Unauthorized: Invalid token'));
      log.error('Unauthorized request: Invalid token');
      return;
    }

    try {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });

      log.info('Connecting transport to server...');

      await this.server.connect(transport);
      log.success('Transport connected. Handling request...');

      await transport.handleRequest(req, res, req.body);
      res.on('close', () => {
        log.success('Request closed by client');
        transport.close();
        this.server.close();
      });

      await this.sendMessages(transport);
      log.success(
        `POST request handled successfully (status=${res.statusCode})`
      );
    } catch (error) {
      log.error('Error handling MCP request:', error);
      if (!res.headersSent) {
        res
          .status(500)
          .json(this.createRPCErrorResponse('Internal server error.'));
        log.error('Responded with 500 Internal Server Error');
      }
    }
  }

  private setupServerRequestHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async (_request) => {
      return {
        jsonrpc: JSON_RPC,
        tools: PowerPointTools,
      };
    });
    
    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request, _extra) => {
        const args = request.params.arguments;
        const toolName = request.params.name;
        const tool = PowerPointTools.find((tool) => tool.name === toolName);

        log.info(`Handling CallToolRequest for tool: ${toolName}`);

        if (!tool) {
          log.error(`Tool ${toolName} not found.`);
          return this.createRPCErrorResponse(`Tool ${toolName} not found.`);
        }
        
        try {
          const result = await tool.execute(args as any);
          log.success(`Tool ${toolName} executed. Result:`, result);
          return {
            jsonrpc: JSON_RPC,
            content: [
              {
                type: 'text',
                text: result.content.join('\n'),
              },
            ],
          };
        } catch (error) {
          log.error(`Error executing tool ${toolName}:`, error);
          return this.createRPCErrorResponse(
            `Error executing tool ${toolName}: ${error}`
          );
        }
      }
    );
  }

  private async sendMessages(transport: StreamableHTTPServerTransport) {
    const message: LoggingMessageNotification = {
      method: 'notifications/message',
      params: { level: 'info', data: 'Connection established' },
    };
    log.info('Sending connection established notification.');
    this.sendNotification(transport, message);
  }

  private async sendNotification(
    transport: StreamableHTTPServerTransport,
    notification: Notification
  ) {
    const rpcNotification: JSONRPCNotification = {
      ...notification,
      jsonrpc: JSON_RPC,
    };
    log.info(`Sending notification: ${notification.method}`);
    await transport.send(rpcNotification);
  }

  private createRPCErrorResponse(message: string): JSONRPCError {
    return {
      jsonrpc: JSON_RPC,
      error: {
        code: JSON_RPC_ERROR,
        message: message,
      },
      id: randomUUID(),
    };
  }
}
