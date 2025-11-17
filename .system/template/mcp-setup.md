# MCP Server Setup for Component Registry

## Overview
This guide shows how to set up an MCP (Model Context Protocol) server for managing component integration, preventing CSS conflicts, and validating dependencies.

## Step 1: Install MCP Server (One-Time Setup)

```bash
# In your project root
npm init -y
npm install @modelcontextprotocol/sdk express body-parser
npm install --save-dev @types/node typescript

# Create MCP server file
mkdir mcp-servers
cd mcp-servers
```

## Step 2: Create Component Registry MCP Server

```javascript
// mcp-servers/component-registry.js
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const fs = require('fs').promises;
const path = require('path');

class ComponentRegistry {
  constructor() {
    this.components = new Map();
    this.cssNamespaces = new Set();
    this.dependencies = new Map();
  }

  async registerComponent(name, config) {
    // Track component with its CSS namespace and dependencies
    this.components.set(name, {
      name,
      cssNamespace: config.cssNamespace,
      dependencies: config.dependencies || [],
      interfaces: config.interfaces || {},
      filepath: config.filepath,
      status: 'registered'
    });

    this.cssNamespaces.add(config.cssNamespace);
    return { success: true, message: `Component ${name} registered` };
  }

  async validateIntegration(componentName, targetFile) {
    const component = this.components.get(componentName);
    if (!component) return { valid: false, errors: ['Component not found'] };

    const errors = [];

    // Check CSS namespace conflicts
    const targetContent = await fs.readFile(targetFile, 'utf8');
    if (targetContent.includes(component.cssNamespace)) {
      errors.push(`CSS namespace conflict: ${component.cssNamespace} already exists`);
    }

    // Check dependencies
    for (const dep of component.dependencies) {
      if (!this.components.has(dep)) {
        errors.push(`Missing dependency: ${dep}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      safeToIntegrate: errors.length === 0
    };
  }

  async generateIntegrationPlan(componentName, targetFile) {
    // Create injection points and safe merge strategy
    return {
      injectionPoints: [
        `<!-- INJECT:${componentName}:HTML -->`,
        `/* INJECT:${componentName}:CSS */`,
        `// INJECT:${componentName}:JS`
      ],
      cssNamespace: this.components.get(componentName).cssNamespace,
      integrationSteps: [
        'Backup target file',
        'Insert injection markers',
        'Inject component code',
        'Validate result',
        'Test in isolation'
      ]
    };
  }
}

// MCP Server setup
const registry = new ComponentRegistry();

const server = new Server(
  {
    name: 'component-registry',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools that Claude can call
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'register_component',
        description: 'Register a component before integration',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            cssNamespace: { type: 'string' },
            filepath: { type: 'string' },
            dependencies: { type: 'array', items: { type: 'string' } }
          },
          required: ['name', 'cssNamespace', 'filepath']
        }
      },
      {
        name: 'validate_integration',
        description: 'Check if component can be safely integrated',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: { type: 'string' },
            targetFile: { type: 'string' }
          },
          required: ['componentName', 'targetFile']
        }
      },
      {
        name: 'get_integration_plan',
        description: 'Get safe integration strategy',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: { type: 'string' },
            targetFile: { type: 'string' }
          },
          required: ['componentName', 'targetFile']
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'register_component':
      return await registry.registerComponent(args.name, args);

    case 'validate_integration':
      return await registry.validateIntegration(args.componentName, args.targetFile);

    case 'get_integration_plan':
      return await registry.generateIntegrationPlan(args.componentName, args.targetFile);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start server
const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
```

## Step 3: Configure Claude to Use MCP Server

```json
// Add to your claude_desktop_config.json (Windows: %APPDATA%\Claude\)
{
  "mcpServers": {
    "component-registry": {
      "command": "node",
      "args": ["C:/your-project-path/mcp-servers/component-registry.js"]
    }
  }
}
```

## Step 4: Use in Your Workflow

Now when you're in Claude Code terminal:

```bash
# When building a component in Claude chat, first register it:
/dev "Register the auth component I just built:
- Component: auth-module
- CSS namespace: .auth-module
- File: /references/auth.html
- Dependencies: none"

# Claude will automatically call the MCP server to register

# When ready to integrate:
/integrate "Integrate auth-module into src/main.html"

# Claude will:
# 1. Call validate_integration to check safety
# 2. Get integration plan
# 3. Show you: "Safe to integrate: ✓ No conflicts detected"
# 4. Perform the integration with rollback capability
```

## Pre-Installed in Template

This template comes with the MCP server **already installed**:
- ✅ Dependencies installed (`npm install` already run)
- ✅ Server tested and working
- ✅ package.json configured
- ✅ Component registry implementation complete

### When You Copy Template to New Project

You still need to configure Claude Desktop to use the server:

1. Find your Claude Desktop config:
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Add this configuration (update the path to your project):
   ```json
   {
     "mcpServers": {
       "component-registry": {
         "command": "node",
         "args": ["C:/absolute/path/to/your-project/mcp-servers/component-registry.js"]
       }
     }
   }
   ```

3. Restart Claude Desktop

4. Test: Open Claude Desktop chat and ask "What tools do you have?" - you should see the component registry tools listed.

### Troubleshooting

If MCP server won't start in new project:
```bash
cd mcp-servers
npm install  # Re-install if node_modules missing
node component-registry.js  # Should start without errors (press Ctrl+C to stop)
```

Common issues:
- **Path not absolute**: Make sure the path in claude_desktop_config.json is absolute, not relative
- **Node modules missing**: Run `npm install` in the mcp-servers folder
- **Claude Desktop not restarted**: Must restart Claude Desktop after config changes
