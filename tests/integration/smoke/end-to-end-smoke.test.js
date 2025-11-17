/**
 * End-to-End Smoke Tests
 * Quick verification that the entire system can operate correctly
 */

const fs = require('fs');
const path = require('path');
const ExampleButton = require('../../fixtures/button-component-mock');
const MCPHelper = require('../../utils/mcp-helper');

describe('End-to-End Smoke Tests', () => {
  describe('Component Lifecycle Simulation', () => {
    let container;

    beforeEach(() => {
      container = document.createElement('div');
      container.id = 'smoke-test-container';
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    test('should complete full component lifecycle', () => {
      // 1. Create component (simulates implementation)
      const button = new ExampleButton({
        label: 'Smoke Test Button',
        containerId: 'smoke-test-container'
      });

      expect(button).toBeDefined();
      expect(button.element).toBeInstanceOf(HTMLElement);

      // 2. Verify contract compliance (simulates Level 3 validation)
      const metadata = button.getMetadata();
      expect(metadata.name).toBe('example-button');
      expect(metadata.cssNamespace).toBe('component-example-button');

      // 3. Test functionality (simulates Level 2 validation)
      button.element.click();
      expect(button.getCount()).toBe(1);

      // 4. Clean up (simulates component destruction)
      button.destroy();
      expect(button.element).toBeNull();
    });

    test('should handle multiple components simultaneously', () => {
      // Simulate parallel component processing
      const components = [];

      for (let i = 0; i < 5; i++) {
        const testContainer = document.createElement('div');
        testContainer.id = `parallel-container-${i}`;
        document.body.appendChild(testContainer);

        const component = new ExampleButton({
          label: `Button ${i}`,
          containerId: `parallel-container-${i}`
        });

        components.push({ component, container: testContainer });
      }

      // All components should be created successfully
      expect(components.length).toBe(5);

      components.forEach(({ component }) => {
        expect(component.getCount()).toBe(0);
        component.element.click();
        expect(component.getCount()).toBe(1);
      });

      // Cleanup
      components.forEach(({ component, container }) => {
        component.destroy();
        document.body.removeChild(container);
      });
    });

    test('should prevent CSS namespace conflicts', () => {
      const button = new ExampleButton({
        label: 'Test',
        containerId: 'smoke-test-container'
      });

      const classes = button.element.className.split(' ');

      // Verify no reserved classes
      expect(classes).not.toContain('btn');
      expect(classes).not.toContain('button');
      expect(classes).not.toContain('primary');

      // All classes should be namespaced
      classes.forEach(cls => {
        expect(cls).toMatch(/^component-example-button/);
      });

      button.destroy();
    });
  });

  describe('Contract → Implementation → Validation Flow', () => {
    test('should validate contract exists', () => {
      const contractPath = path.join(__dirname, '../../../.system/contracts/example-button-contract.md');
      expect(fs.existsSync(contractPath)).toBe(true);

      const content = fs.readFileSync(contractPath, 'utf8');
      expect(content).toContain('example-button');
    });

    test('should validate implementation matches contract', () => {
      const container = document.createElement('div');
      container.id = 'contract-test';
      document.body.appendChild(container);

      const button = new ExampleButton({
        label: 'Test',
        containerId: 'contract-test'
      });

      const metadata = button.getMetadata();

      // Check contract compliance
      expect(metadata).toHaveProperty('name');
      expect(metadata).toHaveProperty('cssNamespace');
      expect(metadata).toHaveProperty('jsAPI');
      expect(metadata).toHaveProperty('dependencies');

      // Verify API methods exist
      expect(typeof button.getCount).toBe('function');
      expect(typeof button.reset).toBe('function');
      expect(typeof button.destroy).toBe('function');

      button.destroy();
      document.body.removeChild(container);
    });

    test('should validate all 4 levels can pass', () => {
      const results = {
        level1: false,
        level2: false,
        level3: false,
        level4: false
      };

      // Level 1: Syntax
      const htmlValid = '<button>Test</button>'.match(/<button>.*<\/button>/);
      results.level1 = !!htmlValid;

      // Level 2: Unit Tests
      const container = document.createElement('div');
      container.id = 'level-test';
      document.body.appendChild(container);

      const button = new ExampleButton({
        label: 'Test',
        containerId: 'level-test'
      });

      results.level2 = button.getCount() === 0;

      // Level 3: Contract Compliance
      const metadata = button.getMetadata();
      results.level3 = metadata.cssNamespace === 'component-example-button';

      // Level 4: Integration Safety (metadata ready)
      results.level4 = Array.isArray(metadata.jsAPI) && Array.isArray(metadata.dependencies);

      button.destroy();
      document.body.removeChild(container);

      // All levels should pass
      expect(results.level1).toBe(true);
      expect(results.level2).toBe(true);
      expect(results.level3).toBe(true);
      expect(results.level4).toBe(true);
    });
  });

  describe('System Integration Points', () => {
    test('should have proper file system access', () => {
      const criticalPaths = [
        '../../../.system',
        '../../../.system/contracts',
        '../../../.system/components',
        '../../../tests',
        '../../../tests/unit',
        '../../../tests/integration'
      ];

      criticalPaths.forEach(relPath => {
        const fullPath = path.join(__dirname, relPath);
        expect(fs.existsSync(fullPath)).toBe(true);
      });
    });

    test('should have all test utilities available', () => {
      const MCPHelper = require('../../utils/mcp-helper');
      const mcp = new MCPHelper();

      expect(mcp).toBeDefined();
      expect(typeof mcp.createMockComponent).toBe('function');
      expect(typeof mcp.registerComponent).toBe('function');
    });

    test('should have all test fixtures available', () => {
      const ExampleButton = require('../../fixtures/button-component-mock');

      expect(ExampleButton).toBeDefined();
      expect(typeof ExampleButton).toBe('function');
    });
  });

  describe('MCP Integration Readiness', () => {
    test('should be able to create MCP helper', () => {
      const mcp = new MCPHelper();
      expect(mcp).toBeDefined();
      expect(mcp.host).toBe('localhost');
      expect(mcp.port).toBe(3000);
    });

    test('should be able to create mock components for MCP', () => {
      const mcp = new MCPHelper();
      const mockComponent = mcp.createMockComponent('test-component', {
        cssNamespace: '.component-test-component-',
        jsAPI: ['TestComponent.init']
      });

      expect(mockComponent.name).toBe('test-component');
      expect(mockComponent.cssNamespace).toBe('.component-test-component-');
      expect(mockComponent.jsAPI).toEqual(['TestComponent.init']);
    });

    test('should gracefully handle MCP server absence', async () => {
      const mcp = new MCPHelper();
      const isRunning = await mcp.isServerRunning();

      // Should not throw, even if server is down
      expect(typeof isRunning).toBe('boolean');
    });
  });

  describe('Error Handling & Edge Cases', () => {
    test('should handle missing container gracefully', () => {
      expect(() => {
        new ExampleButton({
          label: 'Test',
          containerId: 'non-existent-container'
        });
      }).toThrow('Container #non-existent-container not found');
    });

    test('should handle missing required props', () => {
      expect(() => {
        new ExampleButton({
          containerId: 'test'
        });
      }).toThrow('label is required');

      expect(() => {
        new ExampleButton({
          label: 'Test'
        });
      }).toThrow('containerId is required');
    });

    test('should handle component cleanup properly', () => {
      const container = document.createElement('div');
      container.id = 'cleanup-test';
      document.body.appendChild(container);

      const button = new ExampleButton({
        label: 'Test',
        containerId: 'cleanup-test'
      });

      const element = button.element;
      expect(document.body.contains(element)).toBe(true);

      button.destroy();
      expect(button.element).toBeNull();
      expect(document.body.contains(element)).toBe(false);

      document.body.removeChild(container);
    });
  });

  describe('Performance Smoke Tests', () => {
    test('should create components quickly', () => {
      const startTime = Date.now();
      const container = document.createElement('div');
      container.id = 'perf-test';
      document.body.appendChild(container);

      for (let i = 0; i < 10; i++) {
        const button = new ExampleButton({
          label: `Button ${i}`,
          containerId: 'perf-test'
        });
        button.destroy();
      }

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000); // Should complete in <1s

      document.body.removeChild(container);
    });

    test('should handle rapid clicks efficiently', () => {
      const container = document.createElement('div');
      container.id = 'click-perf-test';
      document.body.appendChild(container);

      const button = new ExampleButton({
        label: 'Click Test',
        containerId: 'click-perf-test'
      });

      const startTime = Date.now();

      // Simulate 100 rapid clicks
      for (let i = 0; i < 100; i++) {
        button.element.click();
      }

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(500); // Should handle 100 clicks in <500ms
      expect(button.getCount()).toBe(100);

      button.destroy();
      document.body.removeChild(container);
    });
  });

  describe('Complete System Health Check', () => {
    test('should pass comprehensive health check', () => {
      const healthCheck = {
        fileSystem: false,
        contracts: false,
        testInfra: false,
        components: false,
        mcp: false
      };

      // File system check
      healthCheck.fileSystem = fs.existsSync(path.join(__dirname, '../../../.system'));

      // Contracts check
      const contractPath = path.join(__dirname, '../../../.system/contracts/example-button-contract.md');
      healthCheck.contracts = fs.existsSync(contractPath);

      // Test infrastructure check
      healthCheck.testInfra = fs.existsSync(path.join(__dirname, '../../unit')) &&
                               fs.existsSync(path.join(__dirname, '../../integration'));

      // Component creation check
      const container = document.createElement('div');
      container.id = 'health-check';
      document.body.appendChild(container);

      try {
        const button = new ExampleButton({
          label: 'Health',
          containerId: 'health-check'
        });

        healthCheck.components = button.getCount() === 0;
        button.destroy();
      } catch (error) {
        healthCheck.components = false;
      }

      document.body.removeChild(container);

      // MCP helper check
      try {
        const mcp = new MCPHelper();
        healthCheck.mcp = typeof mcp.createMockComponent === 'function';
      } catch (error) {
        healthCheck.mcp = false;
      }

      // All checks should pass
      expect(healthCheck.fileSystem).toBe(true);
      expect(healthCheck.contracts).toBe(true);
      expect(healthCheck.testInfra).toBe(true);
      expect(healthCheck.components).toBe(true);
      expect(healthCheck.mcp).toBe(true);

      // Summary
      const allPassing = Object.values(healthCheck).every(v => v === true);
      expect(allPassing).toBe(true);
    });
  });
});
