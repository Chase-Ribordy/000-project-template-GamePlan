import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { readFile, writeFile, access, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REGISTRY_FILE = join(__dirname, 'component-registry.json');
const COMPONENTS_DIR = join(__dirname, '..', 'components');

class ComponentRegistry {
  constructor() {
    this.components = new Map();
    this.cssNamespaces = new Set();
  }

  async load() {
    try {
      if (existsSync(REGISTRY_FILE)) {
        const data = await readFile(REGISTRY_FILE, 'utf8');
        const registry = JSON.parse(data);

        // Restore Map from JSON
        for (const [name, component] of Object.entries(registry.components || {})) {
          this.components.set(name, component);
          if (component.cssNamespace) {
            this.cssNamespaces.add(component.cssNamespace);
          }
        }

        console.error(`✅ Loaded ${this.components.size} components from registry`);
      } else {
        console.error('📝 No existing registry, starting fresh');
      }
    } catch (err) {
      console.error(`⚠️ Error loading registry: ${err.message}`);
    }
  }

  async save() {
    try {
      const registry = {
        version: '1.0.0',
        updated: new Date().toISOString(),
        components: Object.fromEntries(this.components)
      };

      await writeFile(REGISTRY_FILE, JSON.stringify(registry, null, 2), 'utf8');
      console.error(`💾 Saved ${this.components.size} components to registry`);
    } catch (err) {
      console.error(`❌ Error saving registry: ${err.message}`);
    }
  }

  async checkComponentExists(name) {
    const componentPath = join(COMPONENTS_DIR, name);
    try {
      await access(componentPath);
      return { exists: true, path: componentPath };
    } catch {
      return { exists: false, path: componentPath };
    }
  }

  async checkInjectionPoints(componentName, targetFile) {
    try {
      const content = await readFile(targetFile, 'utf8');
      const markers = [
        `<!-- INJECT:${componentName} -->`,
        `<!-- INJECT:${componentName}:HTML -->`,
        `/* INJECT:${componentName}:CSS */`,
        `// INJECT:${componentName}:JS`
      ];

      const found = markers.filter(marker => content.includes(marker));
      return {
        hasMarkers: found.length > 0,
        markers: found
      };
    } catch (err) {
      return {
        hasMarkers: false,
        markers: [],
        error: err.message
      };
    }
  }

  async createComponentMetadata(name, config) {
    const metadataPath = join(COMPONENTS_DIR, name, 'metadata.json');
    const metadata = {
      name,
      cssNamespace: config.cssNamespace,
      dependencies: config.dependencies || [],
      validated: false,
      integrated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      // Ensure component directory exists
      await mkdir(join(COMPONENTS_DIR, name), { recursive: true });
      await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
      return { success: true, path: metadataPath };
    } catch (err) {
      return { success: false, reason: `Failed to create metadata: ${err.message}` };
    }
  }

  async registerComponent(name, config) {
    // Check if component files exist
    const fileCheck = await this.checkComponentExists(name);

    // Check CSS namespace conflict
    if (this.cssNamespaces.has(config.cssNamespace)) {
      return {
        success: false,
        reason: `CSS namespace '${config.cssNamespace}' already in use`
      };
    }

    // Register component
    this.components.set(name, {
      name,
      cssNamespace: config.cssNamespace,
      dependencies: config.dependencies || [],
      filepath: config.filepath || join(COMPONENTS_DIR, name),
      status: 'registered',
      validated: false,
      integrated: false,
      registeredAt: new Date().toISOString()
    });

    this.cssNamespaces.add(config.cssNamespace);

    // Create metadata file
    await this.createComponentMetadata(name, config);

    // Save to persistent storage
    await this.save();

    return {
      success: true,
      message: `Component '${name}' registered successfully`,
      filesExist: fileCheck.exists,
      path: fileCheck.path
    };
  }

  async validateIntegration(componentName, targetFile) {
    const component = this.components.get(componentName);

    if (!component) {
      return {
        success: false,
        valid: false,
        reason: `Component '${componentName}' not found in registry`
      };
    }

    const errors = [];

    // Check if component files exist
    const fileCheck = await this.checkComponentExists(componentName);
    if (!fileCheck.exists) {
      errors.push(`Component folder does not exist: ${fileCheck.path}`);
    }

    // Check CSS namespace conflicts in target file
    try {
      const targetContent = await readFile(targetFile, 'utf8');
      if (targetContent.includes(component.cssNamespace)) {
        errors.push(`CSS namespace conflict: ${component.cssNamespace} already exists in target`);
      }
    } catch (err) {
      errors.push(`Could not read target file: ${err.message}`);
    }

    // Check injection points exist
    const injectionCheck = await this.checkInjectionPoints(componentName, targetFile);
    if (!injectionCheck.hasMarkers) {
      errors.push(`No injection markers found in ${targetFile}. Expected: <!-- INJECT:${componentName} -->`);
    }

    // Check dependencies are registered
    for (const dep of component.dependencies || []) {
      if (!this.components.has(dep)) {
        errors.push(`Missing dependency: ${dep}`);
      }
    }

    const isValid = errors.length === 0;

    // Update component validation status
    if (isValid) {
      component.validated = true;
      component.validatedAt = new Date().toISOString();
      await this.save();
    }

    return {
      success: isValid,
      valid: isValid,
      reason: isValid ? 'Component ready for integration' : errors.join('; '),
      errors,
      safeToIntegrate: isValid,
      injectionPoints: injectionCheck.markers
    };
  }

  async generateIntegrationPlan(componentName, targetFile) {
    const component = this.components.get(componentName);

    if (!component) {
      return {
        success: false,
        reason: `Component '${componentName}' not found`
      };
    }

    const injectionCheck = await this.checkInjectionPoints(componentName, targetFile);

    return {
      success: true,
      componentName,
      targetFile,
      injectionPoints: [
        `<!-- INJECT:${componentName} -->`,
        `<!-- INJECT:${componentName}:HTML -->`,
        `/* INJECT:${componentName}:CSS */`,
        `// INJECT:${componentName}:JS`
      ],
      existingMarkers: injectionCheck.markers,
      cssNamespace: component.cssNamespace,
      dependencies: component.dependencies,
      integrationSteps: [
        'Backup target file to references/',
        'Verify all dependencies are registered',
        'Check injection markers exist in target',
        'Validate CSS namespace conflicts',
        'Inject component code at markers',
        'Mark component as integrated',
        'Validate final output'
      ]
    };
  }

  listComponents() {
    const componentList = Array.from(this.components.values()).map(comp => ({
      name: comp.name,
      cssNamespace: comp.cssNamespace,
      filepath: comp.filepath,
      dependencies: comp.dependencies,
      status: comp.status,
      validated: comp.validated || false,
      integrated: comp.integrated || false,
      registeredAt: comp.registeredAt
    }));

    return {
      success: true,
      total: componentList.length,
      components: componentList
    };
  }

  async getComponentStatus(name) {
    const component = this.components.get(name);

    if (!component) {
      return {
        success: false,
        reason: `Component '${name}' not found`
      };
    }

    const fileCheck = await this.checkComponentExists(name);

    return {
      success: true,
      name: component.name,
      cssNamespace: component.cssNamespace,
      dependencies: component.dependencies,
      status: component.status,
      validated: component.validated || false,
      integrated: component.integrated || false,
      filesExist: fileCheck.exists,
      filepath: component.filepath,
      registeredAt: component.registeredAt,
      validatedAt: component.validatedAt,
      integratedAt: component.integratedAt
    };
  }
}

// MCP Server setup
const registry = new ComponentRegistry();

// Load registry on startup
await registry.load();

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

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'register_component',
        description: 'Register a component before integration with persistent storage',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Component name' },
            cssNamespace: { type: 'string', description: 'CSS namespace (e.g., .component-header)' },
            filepath: { type: 'string', description: 'Path to component files' },
            dependencies: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of component dependencies'
            }
          },
          required: ['name', 'cssNamespace']
        }
      },
      {
        name: 'validate_integration',
        description: 'Validate if component can be safely integrated into target file',
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
        description: 'Get detailed integration strategy for a component',
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
        name: 'list_components',
        description: 'List all registered components with their status',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_component_status',
        description: 'Get detailed status of a specific component',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Component name' }
          },
          required: ['name']
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;
    switch (name) {
      case 'register_component':
        result = await registry.registerComponent(args.name, args);
        break;

      case 'validate_integration':
        result = await registry.validateIntegration(args.componentName, args.targetFile);
        break;

      case 'get_integration_plan':
        result = await registry.generateIntegrationPlan(args.componentName, args.targetFile);
        break;

      case 'list_components':
        result = registry.listComponents();
        break;

      case 'get_component_status':
        result = await registry.getComponentStatus(args.name);
        break;

      default:
        result = {
          success: false,
          reason: `Unknown tool: ${name}`
        };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            reason: `Error: ${error.message}`
          }, null, 2)
        }
      ],
      isError: true
    };
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error('🚀 Component Registry MCP Server started');
console.error('📁 Registry file:', REGISTRY_FILE);
console.error('📂 Components directory:', COMPONENTS_DIR);
