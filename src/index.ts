import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import express, { Request, Response } from 'express';
import { StreamableHTTPServer } from './server.js';
import { logger } from './helpers/logs.js';
import { hostname } from 'node:os';

const log = logger('index');

const server = new StreamableHTTPServer(
  new Server(
    {
      name: 'powerpoint-http-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  )
);

const app = express();
app.use(express.json());

const router = express.Router();
const MCP_ENDPOINT = '/mcp';

router.post(MCP_ENDPOINT, async (req: Request, res: Response) => {
  await server.handlePostRequest(req, res);
});

router.get(MCP_ENDPOINT, async (req: Request, res: Response) => {
  await server.handleGetRequest(req, res);
});

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Root endpoint with info
router.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'MCP PowerPoint Server',
    version: '1.0.0',
    endpoints: {
      mcp: MCP_ENDPOINT,
      health: '/health'
    },
    description: 'Model Context Protocol server for creating PowerPoint presentations'
  });
});

app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  log.success(`MCP PowerPoint Streamable HTTP Server`);
  log.success(`MCP endpoint: http://${hostname()}:${PORT}${MCP_ENDPOINT}`);
  log.success(`Health check: http://${hostname()}:${PORT}/health`);
  log.success(`Press Ctrl+C to stop the server`);
});

process.on('SIGINT', async () => {
  log.error('Shutting down server...');
  await server.close();
  process.exit(0);
});
