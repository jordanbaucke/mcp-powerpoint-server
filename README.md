# MCP PowerPoint Server

A Model Context Protocol (MCP) server that provides tools for creating PowerPoint presentations programmatically. Built using Node.js, TypeScript, and designed to run on Azure Container Apps with HTTP transport.

## Features

- 🎯 Create PowerPoint presentations with multiple slides
- 📊 Support for different slide layouts (title, title-content, content-only)
- 🔘 Add bullet points to slides
- 📝 Set presentation metadata (title, author)
- 🌐 HTTP-based MCP server with authentication
- 🐳 Docker support for containerized deployment
- ☁️ Azure Container Apps ready

## Prerequisites

1. Install the latest version of [VS Code](https://code.visualstudio.com/)
2. Install [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) and [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extensions
3. [Node.js](https://nodejs.org/en/download/) (>=22) and npm
4. [git](https://git-scm.com/downloads) for cloning the repository

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd mcp-powerpoint-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Running the Server

### Local Development

Start the HTTP server locally:

```bash
npm run dev
```

You should see output similar to:
```
mcp:index 2025-07-13T12:00:00.000Z MCP PowerPoint Streamable HTTP Server
mcp:index 2025-07-13T12:00:00.000Z MCP endpoint: http://localhost:3000/mcp
mcp:index 2025-07-13T12:00:00.000Z Health check: http://localhost:3000/health
mcp:index 2025-07-13T12:00:00.000Z Press Ctrl+C to stop the server
```

### Using Docker

Build and run with Docker:

```bash
# Build the Docker image
docker build -t mcp-powerpoint-server .

# Run the container
docker run -p 3000:3000 -v $(pwd)/output:/app/output mcp-powerpoint-server
```

Or use Docker Compose:

```bash
docker-compose up --build
```

## Usage

This MCP server provides the following tools:

### `create_presentation`

Creates a new PowerPoint presentation with the specified slides.

**Parameters:**
- `title` (string, required): Title of the presentation
- `author` (string, optional): Author of the presentation
- `slides` (array, required): Array of slide objects
- `outputPath` (string, required): Output file path (must end with .pptx)

**Slide object structure:**
- `title` (string, required): Title of the slide
- `content` (string, optional): Content/text for the slide
- `layout` (string, optional): Layout type ('title', 'title-content', 'content-only')
- `bullets` (array, optional): Array of bullet point strings

### `add_slide_template`

Get a template for understanding slide structure and available layouts.

## Testing the MCP Server

### Option 1: VS Code with MCP Configuration

The quickest way to connect is using the provided `.vscode/mcp.json` configuration:

1. Open the `.vscode/mcp.json` file in VS Code
2. Click the "start" button to connect to the MCP server
3. When prompted for the token, enter: `abc`

### Option 2: Manual VS Code Setup

1. Open VS Code Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Run "MCP: Add Server"
3. Choose "HTTP" as the transport type
4. Enter URL: `http://localhost:3000/mcp`
5. Add Authorization header: `Authorization` with value `Bearer abc`
6. Give it a name like "PowerPoint Server"

### Option 3: MCP Inspector

1. Start the MCP Inspector:
   ```bash
   npm run inspect
   ```

2. Open the displayed URL in your browser
3. Configure:
   - Transport type: `Streamable HTTP`
   - URL: `http://localhost:3000/mcp`
   - Add header: `Authorization` with value `Bearer abc`
4. Connect and test the tools

## Example Usage

Here's an example of creating a presentation:

```json
{
  "tool": "create_presentation",
  "arguments": {
    "title": "My Presentation",
    "author": "John Doe",
    "slides": [
      {
        "title": "Welcome",
        "layout": "title"
      },
      {
        "title": "Introduction",
        "content": "This is an introduction slide",
        "layout": "title-content",
        "bullets": [
          "First point",
          "Second point",
          "Third point"
        ]
      },
      {
        "title": "Conclusion",
        "content": "Thank you for your attention!",
        "layout": "title-content"
      }
    ],
    "outputPath": "./output/presentation.pptx"
  }
}
```

## API Endpoints

- `GET /` - Server information
- `GET /health` - Health check
- `POST /mcp` - MCP endpoint (requires Bearer token authentication)
- `GET /mcp` - Returns 405 Method Not Allowed

## Authentication

The server uses simple Bearer token authentication. For demo purposes, the token is `abc`. In production, implement proper JWT validation.

## Development

- `npm run dev`: Build and start the server
- `npm run build`: Build the project
- `npm run watch`: Watch mode for TypeScript compilation
- `npm test`: Run tests
- `npm run inspect`: Start MCP Inspector

## Project Structure

```
src/
├── index.ts              # Main HTTP server setup
├── server.ts            # MCP HTTP server wrapper
├── tools.ts             # MCP tool definitions
├── services/
│   └── powerpoint.ts    # PowerPoint generation service
├── helpers/
│   ├── logs.ts          # Logging utilities
│   └── cache.ts         # Transport cache
└── types/
    └── officegen.d.ts   # Type definitions
```

## Dependencies

- `@modelcontextprotocol/sdk`: MCP SDK for building servers
- `express`: HTTP server framework
- `officegen`: Library for generating Office documents
- `fs-extra`: Enhanced file system operations
- `chalk`: Terminal colors for logging
- `debug`: Debug logging utilities

## License

MIT
