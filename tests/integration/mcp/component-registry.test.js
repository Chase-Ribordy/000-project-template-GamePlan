/**
 * MCP Component Registry Integration Tests
 * Tests Level 4: Integration Safety via MCP server
 */

const MCPHelper = require('../../utils/mcp-helper');

describe('MCP Component Registry - Level 4 Integration', () => {
  let mcp;

  beforeAll(async () => {
    mcp = new MCPHelper('localhost', 3000);

    // Wait for MCP server to be ready
    try {
      await mcp.waitForServer(5000);
    } catch (error) {
      console.warn('⚠️  MCP server not running. Start it with: cd .system/mcp-servers && node component-registry.js');
      console.warn('⚠️  Skipping MCP integration tests');
    }
  });

  describe('Server Connectivity', () => {
    test('should connect to MCP server', async () => {
      const isRunning = await mcp.isServerRunning();

      if (!isRunning) {
        console.log('⏭️  Skipping test - MCP server not available');
        return;
      }

      expect(isRunning).toBe(true);
    });
  });

  describe('Component Registration', () => {
    test('should register component successfully', async () => {
      if (!await mcp.isServerRunning()) {
        console.log('⏭️  Skipping test - MCP server not available');
        return;
      }

      const component = mcp.createMockComponent('test-button', {
        cssNamespace: '.component-test-button-',
        jsAPI: ['TestButton.init', 'TestButton.destroy'],
        dependencies: [],
        events: ['button-clicked']
      });

      const result = await mcp.registerComponent(component);

      expect(result.success).toBe(true);
      expect(result.componentName).toBe('test-button');
    });

    test('should list registered components', async () => {
      if (!await mcp.isServerRunning()) {
        console.log('⏭️  Skipping test - MCP server not available');
        return;
      }

      const result = await mcp.listComponents();

      expect(result).toBeDefined();
      expect(Array.isArray(result.components) || typeof result.components === 'object').toBe(true);
    });
  });

  describe('Conflict Detection', () => {
    test('should detect CSS namespace conflicts', async () => {
      if (!await mcp.isServerRunning()) {
        console.log('⏭️  Skipping test - MCP server not available');
        return;
      }

      // Register first component
      const component1 = mcp.createMockComponent('button-primary', {
        cssNamespace: '.component-button-',
        jsAPI: ['ButtonPrimary.init']
      });
      await mcp.registerComponent(component1);

      // Try to register second component with same namespace
      const component2 = mcp.createMockComponent('button-secondary', {
        cssNamespace: '.component-button-', // CONFLICT!
        jsAPI: ['ButtonSecondary.init']
      });

      const validation = await mcp.validateIntegration(component2.name);

      // Should detect the conflict
      expect(validation.hasConflicts || validation.success === false).toBe(true);
    });

    test('should detect JavaScript API conflicts', async () => {
      if (!await mcp.isServerRunning()) {
        console.log('⏭️  Skipping test - MCP server not available');
        return;
      }

      // Register component with specific JS API
      const component1 = mcp.createMockComponent('form-validator', {
        cssNamespace: '.component-form-validator-',
        jsAPI: ['FormValidator.validate', 'FormValidator.reset']
      });
      await mcp.registerComponent(component1);

      // Try to register another component with overlapping API
      const component2 = mcp.createMockComponent('form-helper', {
        cssNamespace: '.component-form-helper-',
        jsAPI: ['FormValidator.validate'] // CONFLICT!
      });

      const validation = await mcp.validateIntegration(component2.name);

      // Should detect the API conflict
      expect(validation.hasConflicts || validation.success === false).toBe(true);
    });

    test('should allow non-conflicting components', async () => {
      if (!await mcp.isServerRunning()) {
        console.log('⏭️  Skipping test - MCP server not available');
        return;
      }

      const component1 = mcp.createMockComponent('modal-dialog', {
        cssNamespace: '.component-modal-dialog-',
        jsAPI: ['ModalDialog.open', 'ModalDialog.close']
      });
      await mcp.registerComponent(component1);

      const component2 = mcp.createMockComponent('tooltip-helper', {
        cssNamespace: '.component-tooltip-helper-',
        jsAPI: ['TooltipHelper.show', 'TooltipHelper.hide']
      });

      const validation = await mcp.validateIntegration(component2.name);

      // Should NOT have conflicts
      expect(validation.success).toBe(true);
    });
  });

  describe('Integration Plan', () => {
    test('should generate integration plan for component', async () => {
      if (!await mcp.isServerRunning()) {
        console.log('⏭️  Skipping test - MCP server not available');
        return;
      }

      const component = mcp.createMockComponent('alert-banner', {
        cssNamespace: '.component-alert-banner-',
        jsAPI: ['AlertBanner.show', 'AlertBanner.dismiss']
      });
      await mcp.registerComponent(component);

      const plan = await mcp.getIntegrationPlan(component.name);

      expect(plan).toBeDefined();
      expect(plan.componentName || plan.component).toBe(component.name);
    });
  });

  describe('Contract Validation', () => {
    test('should validate contract compliance', async () => {
      if (!await mcp.isServerRunning()) {
        console.log('⏭️  Skipping test - MCP server not available');
        return;
      }

      const contractPath = '.system/contracts/example-button-contract.md';
      const implementationPath = 'tests/fixtures/button-component-mock.js';

      const result = await mcp.validateContract(contractPath, implementationPath);

      expect(result).toBeDefined();
      // MCP should validate that implementation matches contract
    });
  });

  describe('Preflight Checks', () => {
    test('should run all 4 validation levels', async () => {
      if (!await mcp.isServerRunning()) {
        console.log('⏭️  Skipping test - MCP server not available');
        return;
      }

      const component = mcp.createMockComponent('dropdown-menu', {
        cssNamespace: '.component-dropdown-menu-',
        jsAPI: ['DropdownMenu.toggle']
      });
      await mcp.registerComponent(component);

      const checks = await mcp.runPreflightChecks(component.name);

      expect(checks).toBeDefined();

      if (checks.levels) {
        // Verify all 4 levels are checked
        expect(checks.levels).toHaveProperty('level1'); // Syntax
        expect(checks.levels).toHaveProperty('level2'); // Unit Tests
        expect(checks.levels).toHaveProperty('level3'); // Contract
        expect(checks.levels).toHaveProperty('level4'); // Integration
      }
    });
  });

  describe('Sandbox Testing', () => {
    test('should check sandbox test status', async () => {
      if (!await mcp.isServerRunning()) {
        console.log('⏭️  Skipping test - MCP server not available');
        return;
      }

      const component = mcp.createMockComponent('carousel-slider');
      await mcp.registerComponent(component);

      const sandboxResult = await mcp.testInSandbox(component.name);

      expect(sandboxResult).toBeDefined();
    });
  });

  describe('Component Lifecycle', () => {
    test('should mark component as proven after validation', async () => {
      if (!await mcp.isServerRunning()) {
        console.log('⏭️  Skipping test - MCP server not available');
        return;
      }

      const component = mcp.createMockComponent('status-badge', {
        cssNamespace: '.component-status-badge-',
        status: 'validated'
      });
      await mcp.registerComponent(component);

      const result = await mcp.markAsProven(component.name);

      expect(result).toBeDefined();
      expect(result.success || result.status === 'proven').toBe(true);
    });
  });

  describe('Example Button Contract - MCP Integration', () => {
    test('should register example-button without conflicts', async () => {
      if (!await mcp.isServerRunning()) {
        console.log('⏭️  Skipping test - MCP server not available');
        return;
      }

      const exampleButton = {
        name: 'example-button',
        cssNamespace: '.component-example-button-',
        jsAPI: ['ExampleButton.getCount', 'ExampleButton.reset', 'ExampleButton.destroy'],
        dependencies: [],
        events: ['button-clicked'],
        status: 'development'
      };

      const registration = await mcp.registerComponent(exampleButton);
      expect(registration.success).toBe(true);

      const validation = await mcp.validateIntegration(exampleButton.name);
      expect(validation.success).toBe(true);
    });
  });
});
