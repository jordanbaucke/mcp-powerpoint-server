# Azure Deployment Guide

This guide will help you deploy the MCP PowerPoint Server to Azure Container Apps using the Azure Developer CLI (azd).

## Prerequisites ✅

The following tools should now be installed:
- ✅ Azure CLI (`az`)
- ✅ Azure Developer CLI (`azd`)
- ✅ Node.js (>=22)
- ✅ Docker (for local testing)

You can verify the installations:
```bash
az --version
azd version
node --version
docker --version
```

## Step 1: Authentication

First, authenticate with Azure:

```bash
# Login to Azure CLI
az login

# Login to Azure Developer CLI
azd auth login
```

For GitHub Codespaces or headless environments:
```bash
azd auth login --use-device-code
```

## Step 2: Initialize the Project

Initialize the Azure Developer environment:

```bash
azd init
```

When prompted:
- Choose "Use code in the current directory"
- Confirm the project name: `mcp-powerpoint-server`
- Select your preferred Azure region (e.g., `East US`, `West Europe`)

## Step 3: Deploy to Azure

### Option A: One-Command Deployment
Deploy everything at once:
```bash
azd up
```

This will:
1. Provision Azure resources (Resource Group, Container Registry, Container Apps Environment, Container App)
2. Build and push the Docker image
3. Deploy the application

### Option B: Step-by-Step Deployment
If you prefer more control:

1. **Provision infrastructure:**
   ```bash
   azd provision
   ```

2. **Deploy the application:**
   ```bash
   azd deploy
   ```

## Step 4: Test Your Deployment

After deployment, you'll get an output similar to:
```
Deploying services (azd deploy)

  (✓) Done: Deploying service mcp-powerpoint-server
  - Endpoint: https://mcp-powerpoint-server.abc123.eastus.azurecontainerapps.io/

SUCCESS: Your up workflow to provision and deploy to Azure completed in X minutes Y seconds.
```

### Test the Health Endpoint
```bash
curl https://your-app-url.azurecontainerapps.io/health
```

### Test the MCP Endpoint
```bash
curl -H "Authorization: Bearer abc" \
     -H "Content-Type: application/json" \
     -X POST \
     https://your-app-url.azurecontainerapps.io/mcp \
     -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

## Step 5: Configure VS Code

Update your `.vscode/mcp.json` file with your deployed URL:

```json
{
  "inputs": [
    {
      "password": true,
      "id": "mcp-server-token",
      "description": "Enter the token for the MCP server",
      "type": "promptString"
    }
  ],
  "servers": {
    "powerpoint-server-local": {
      "type": "http",
      "url": "http://localhost:3000/mcp",
      "headers": {
        "Authorization": "Bearer ${input:mcp-server-token}"
      }
    },
    "powerpoint-server-azure": {
      "type": "http",
      "url": "https://your-app-url.azurecontainerapps.io/mcp",
      "headers": {
        "Authorization": "Bearer ${input:mcp-server-token}"
      }
    }
  }
}
```

## Useful Commands

### View Deployment Status
```bash
azd show
```

### View Logs
```bash
az containerapp logs show \
  --name mcp-powerpoint-server \
  --resource-group rg-your-environment-name \
  --follow
```

### Update Application
After making code changes:
```bash
azd deploy
```

### Scale the Application
```bash
az containerapp update \
  --name mcp-powerpoint-server \
  --resource-group rg-your-environment-name \
  --min-replicas 1 \
  --max-replicas 5
```

### Clean Up Resources
To delete all Azure resources:
```bash
azd down --purge --force
```

## NPM Scripts

You can also use the provided npm scripts:

```bash
# Login to Azure
npm run azure:login

# Provision infrastructure only
npm run azure:provision

# Deploy application only  
npm run azure:deploy

# Provision and deploy in one command
npm run azure:up

# Clean up all resources
npm run azure:down
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   ```bash
   az account show  # Check if logged in
   azd auth login   # Re-authenticate if needed
   ```

2. **Build Failures**
   Test locally first:
   ```bash
   npm run build
   docker build -t mcp-powerpoint-server .
   docker run -p 3000:3000 mcp-powerpoint-server
   ```

3. **Deployment Timeout**
   Check the logs:
   ```bash
   azd show
   # Use the resource group name from the output
   az containerapp logs show --name mcp-powerpoint-server --resource-group <rg-name>
   ```

4. **Container App Not Starting**
   Verify environment variables and health endpoint:
   ```bash
   az containerapp show --name mcp-powerpoint-server --resource-group <rg-name>
   ```

### Getting Help

- [Azure Container Apps Documentation](https://docs.microsoft.com/en-us/azure/container-apps/)
- [Azure Developer CLI Documentation](https://docs.microsoft.com/en-us/azure/developer/azure-developer-cli/)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)

## Cost Optimization

- The deployment uses minimal resources (0.5 CPU, 1GB memory)
- Auto-scaling is configured (1-3 replicas)
- Consider using Azure Free Tier for development/testing
- Monitor costs in the Azure Portal
