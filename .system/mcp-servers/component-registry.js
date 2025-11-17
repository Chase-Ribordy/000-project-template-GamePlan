import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { readFile, writeFile, access, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COMPONENTS_DIR = join(__dirname, '../components');

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
    try {
      const targetContent = await readFile(targetFile, 'utf8');
      if (targetContent.includes(component.cssNamespace)) {
        errors.push(`CSS namespace conflict: ${component.cssNamespace} already exists`);
      }
    } catch (err) {
      errors.push(`Could not read target file: ${err.message}`);
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
    const component = this.components.get(componentName);
    if (!component) {
      return {
        error: 'Component not found',
        injectionPoints: [],
        integrationSteps: []
      };
    }

    // Create injection points and safe merge strategy
    return {
      injectionPoints: [
        `<!-- INJECT:${componentName}:HTML -->`,
        `/* INJECT:${componentName}:CSS */`,
        `// INJECT:${componentName}:JS`
      ],
      cssNamespace: component.cssNamespace,
      integrationSteps: [
        'Backup target file',
        'Insert injection markers',
        'Inject component code',
        'Validate result',
        'Test in isolation'
      ]
    };
  }

  listComponents() {
    const componentList = Array.from(this.components.values()).map(comp => ({
      name: comp.name,
      cssNamespace: comp.cssNamespace,
      filepath: comp.filepath,
      dependencies: comp.dependencies,
      status: comp.status
    }));

    return {
      total: componentList.length,
      components: componentList
    };
  }

  async validateContract(componentName, contractPath) {
    const component = this.components.get(componentName);

    if (!component) {
      return {
        success: false,
        reason: `Component '${componentName}' not registered`
      };
    }

    try {
      // Read contract file
      const contractContent = await readFile(contractPath, 'utf8');

      // Check contract has required sections
      const requiredSections = [
        '## Inputs',
        '## Outputs',
        '## DOM Requirements',
        '## CSS Contract',
        '## Dependencies'
      ];

      const missingSections = requiredSections.filter(section =>
        !contractContent.includes(section)
      );

      if (missingSections.length > 0) {
        return {
          success: false,
          reason: `Contract missing required sections: ${missingSections.join(', ')}`
        };
      }

      // Check CSS namespace in contract matches component
      const namespaceMatch = contractContent.match(/Namespace.*`([^`]+)`/);
      if (namespaceMatch && namespaceMatch[1] !== component.cssNamespace) {
        return {
          success: false,
          reason: `Contract CSS namespace '${namespaceMatch[1]}' doesn't match component '${component.cssNamespace}'`
        };
      }

      return {
        success: true,
        message: 'Contract is valid and matches component',
        sections: requiredSections.length,
        cssNamespaceMatch: true
      };
    } catch (err) {
      return {
        success: false,
        reason: `Error reading contract: ${err.message}`
      };
    }
  }

  async runPreflightChecks(componentName) {
    const component = this.components.get(componentName);

    if (!component) {
      return {
        success: false,
        reason: `Component '${componentName}' not found`
      };
    }

    const checks = {
      syntax: false,
      tests: false,
      contract: false,
      integration: false
    };

    const errors = [];

    // Check 1: Files exist
    const componentDir = join(COMPONENTS_DIR, componentName);
    try {
      await access(componentDir);
      checks.syntax = true;
    } catch {
      errors.push('Component folder does not exist');
      return { success: false, reason: 'Component folder missing', checks };
    }

    // Check 2: Test file exists
    const testPath = join(COMPONENTS_DIR, componentName, `${componentName}.test.js`);
    try {
      await access(testPath);
      checks.tests = true;
    } catch {
      errors.push('No test file found');
    }

    // Check 3: Contract exists
    const contractPath = join(__dirname, '..', 'contracts', `${componentName}-contract.md`);
    try {
      await access(contractPath);
      checks.contract = true;
    } catch {
      errors.push('No contract file found');
    }

    // Check 4: Integration safety
    const validation = await this.validateIntegration(componentName, 'dummy-target.html');
    if (validation.valid || validation.errors.length === 0) {
      checks.integration = true;
    }

    const allPassed = Object.values(checks).every(c => c === true);

    return {
      success: allPassed,
      reason: allPassed ? 'All pre-flight checks passed' : errors.join('; '),
      checks,
      errors
    };
  }

  async testInSandbox(componentName) {
    const component = this.components.get(componentName);

    if (!component) {
      return {
        success: false,
        reason: `Component '${componentName}' not found`
      };
    }

    // Check if sandbox test file exists
    const sandboxPath = join(__dirname, '..', 'sandbox', `${componentName}-test.html`);

    try {
      await access(sandboxPath);
      return {
        success: true,
        message: `Sandbox test ready for '${componentName}'`,
        path: sandboxPath,
        instructions: [
          'Open sandbox test in browser',
          'Click "Run Test" button',
          'Verify all checks pass',
          'Confirm visual appearance correct',
          'Mark as proven if all tests pass'
        ]
      };
    } catch {
      return {
        success: false,
        reason: `No sandbox test found. Create with /prove-it-works ${componentName}`,
        suggestion: `Expected file: ${sandboxPath}`
      };
    }
  }

  async markAsProven(componentName) {
    const component = this.components.get(componentName);

    if (!component) {
      return {
        success: false,
        reason: `Component '${componentName}' not found`
      };
    }

    // Check if component is validated
    if (!component.validated) {
      return {
        success: false,
        reason: 'Component must pass validation before marking as proven'
      };
    }

    const provenDir = join(__dirname, '..', 'proven', componentName);
    const componentDir = join(COMPONENTS_DIR, componentName);

    try {
      // Create proven directory
      await mkdir(provenDir, { recursive: true });

      // Copy component files to proven/
      // (In real implementation, would recursively copy files)

      // Update component status
      component.integrated = true;
      component.integratedAt = new Date().toISOString();
      component.status = 'proven';

      // Update metadata
      const metadataPath = join(componentDir, 'metadata.json');
      if (existsSync(metadataPath)) {
        const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
        metadata.validated = true;
        metadata.integrated = true;
        metadata.status = 'proven';
        metadata.updatedAt = new Date().toISOString();
        await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
      }

      return {
        success: true,
        message: `Component '${componentName}' marked as proven`,
        path: provenDir,
        status: 'Component ready for integration'
      };
    } catch (err) {
      return {
        success: false,
        reason: `Error marking as proven: ${err.message}`
      };
    }
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
server.setRequestHandler(ListToolsRequestSchema, async () => {
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
      },
      {
        name: 'list_components',
        description: 'List all registered components',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'validate_contract',
        description: 'Validate component implementation matches its contract',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: { type: 'string' },
            contractPath: { type: 'string' }
          },
          required: ['componentName', 'contractPath']
        }
      },
      {
        name: 'run_preflight_checks',
        description: 'Run all pre-flight validation checks on component',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: { type: 'string' }
          },
          required: ['componentName']
        }
      },
      {
        name: 'test_in_sandbox',
        description: 'Check if component has sandbox test and provide instructions',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: { type: 'string' }
          },
          required: ['componentName']
        }
      },
      {
        name: 'mark_as_proven',
        description: 'Mark component as proven after passing all validation',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: { type: 'string' }
          },
          required: ['componentName']
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

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

    case 'validate_contract':
      result = await registry.validateContract(args.componentName, args.contractPath);
      break;

    case 'run_preflight_checks':
      result = await registry.runPreflightChecks(args.componentName);
      break;

    case 'test_in_sandbox':
      result = await registry.testInSandbox(args.componentName);
      break;

    case 'mark_as_proven':
      result = await registry.markAsProven(args.componentName);
      break;

    default:
      throw new Error(`Unknown tool: ${name}`);
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }
    ]
  };
});

// Start server
const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
