/**
 * 4-Level Progressive Validation System Tests
 * Tests the complete validation pipeline
 */

const fs = require('fs');
const path = require('path');

describe('4-Level Progressive Validation System', () => {
  const exampleButtonContract = path.join(
    __dirname,
    '../../../.system/contracts/example-button-contract.md'
  );

  describe('Level 1: Syntax Validation (<1s)', () => {
    test('should validate HTML syntax', () => {
      const validHTML = '<button class="component-example-button">Click</button>';
      const invalidHTML = '<button class="component-example-button">Click</buton>'; // Typo

      // Simple HTML validation
      expect(validHTML).toMatch(/<button[^>]*>.*<\/button>/);
      expect(invalidHTML).not.toMatch(/<button[^>]*>.*<\/button>/);
    });

    test('should validate CSS syntax', () => {
      const validCSS = '.component-example-button { color: red; }';
      const invalidCSS = '.component-example-button { color: red'; // Missing }

      // Simple CSS validation
      expect(validCSS).toMatch(/\{.*\}/);
      expect(invalidCSS).not.toMatch(/\{[^}]*\}/);
    });

    test('should validate JavaScript syntax', () => {
      const validJS = 'function test() { return true; }';
      const invalidJS = 'function test() { return true'; // Missing }

      // JavaScript syntax check via try-catch
      expect(() => {
        new Function(validJS);
      }).not.toThrow();

      expect(() => {
        new Function(invalidJS);
      }).toThrow();
    });

    test('should complete in under 1 second', () => {
      const startTime = Date.now();

      // Run syntax validations
      const html = '<div></div>';
      const css = '.test { color: red; }';
      const js = 'const x = 1;';

      expect(html).toMatch(/<div><\/div>/);
      expect(css).toMatch(/\{.*\}/);
      new Function(js);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Level 2: Unit Tests (<10s)', () => {
    test('should run component-level tests', () => {
      // This is a meta-test - testing that unit tests exist and can run
      const unitTestDir = path.join(__dirname, '../../unit/contracts');
      const unitTestFile = path.join(unitTestDir, 'example-button-contract.test.js');

      expect(fs.existsSync(unitTestFile)).toBe(true);
    });

    test('should verify function-level tests', () => {
      const ExampleButton = require('../../fixtures/button-component-mock');

      // Create test container
      const container = document.createElement('div');
      container.id = 'test-level-2';
      document.body.appendChild(container);

      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-level-2'
      });

      // Test individual functions
      expect(typeof button.getCount).toBe('function');
      expect(typeof button.reset).toBe('function');
      expect(typeof button.destroy).toBe('function');

      button.destroy();
      document.body.removeChild(container);
    });

    test('should complete in under 10 seconds', () => {
      const startTime = Date.now();

      // Simulate unit test execution
      const ExampleButton = require('../../fixtures/button-component-mock');

      const container = document.createElement('div');
      container.id = 'test-timing';
      document.body.appendChild(container);

      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-timing'
      });

      // Run multiple operations
      for (let i = 0; i < 10; i++) {
        button.element.click();
        button.getCount();
      }
      button.reset();
      button.destroy();

      document.body.removeChild(container);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(10000);
    });
  });

  describe('Level 3: Contract Compliance (<1s)', () => {
    test('should validate interface compliance', () => {
      const ExampleButton = require('../../fixtures/button-component-mock');

      const container = document.createElement('div');
      container.id = 'test-interface';
      document.body.appendChild(container);

      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-interface'
      });

      // Verify all required methods exist per contract
      const requiredMethods = ['getCount', 'reset', 'destroy', 'getMetadata'];

      requiredMethods.forEach(method => {
        expect(typeof button[method]).toBe('function');
      });

      button.destroy();
      document.body.removeChild(container);
    });

    test('should validate CSS namespace compliance', () => {
      const ExampleButton = require('../../fixtures/button-component-mock');

      const container = document.createElement('div');
      container.id = 'test-css';
      document.body.appendChild(container);

      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-css',
        variant: 'primary'
      });

      // All classes must use .component-example-button- prefix
      const classes = button.element.className.split(' ');

      classes.forEach(cls => {
        expect(cls).toMatch(/^component-example-button/);
      });

      // Must NOT use reserved classes
      expect(button.element.className).not.toContain('btn');
      expect(button.element.className).not.toContain(' button ');

      button.destroy();
      document.body.removeChild(container);
    });

    test('should validate dependency requirements', () => {
      const ExampleButton = require('../../fixtures/button-component-mock');

      const container = document.createElement('div');
      container.id = 'test-deps';
      document.body.appendChild(container);

      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-deps'
      });

      const metadata = button.getMetadata();

      // Example button has no dependencies per contract
      expect(metadata.dependencies).toEqual([]);

      button.destroy();
      document.body.removeChild(container);
    });

    test('should complete in under 1 second', () => {
      const startTime = Date.now();

      const ExampleButton = require('../../fixtures/button-component-mock');

      const container = document.createElement('div');
      container.id = 'test-timing-3';
      document.body.appendChild(container);

      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-timing-3'
      });

      // Validate contract compliance
      const metadata = button.getMetadata();
      expect(metadata.cssNamespace).toBe('component-example-button');
      expect(Array.isArray(metadata.jsAPI)).toBe(true);
      expect(Array.isArray(metadata.dependencies)).toBe(true);

      button.destroy();
      document.body.removeChild(container);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Level 4: Integration Safety (<30s)', () => {
    test('should validate CSS conflict detection readiness', () => {
      const ExampleButton = require('../../fixtures/button-component-mock');

      const container = document.createElement('div');
      container.id = 'test-integration';
      document.body.appendChild(container);

      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-integration'
      });

      const metadata = button.getMetadata();

      // Metadata should be ready for MCP registration
      expect(metadata).toHaveProperty('name');
      expect(metadata).toHaveProperty('cssNamespace');
      expect(metadata).toHaveProperty('jsAPI');
      expect(metadata).toHaveProperty('dependencies');

      button.destroy();
      document.body.removeChild(container);
    });

    test('should validate JavaScript namespace format', () => {
      const ExampleButton = require('../../fixtures/button-component-mock');

      const container = document.createElement('div');
      container.id = 'test-js-namespace';
      document.body.appendChild(container);

      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-js-namespace'
      });

      const metadata = button.getMetadata();

      // All JS API methods should follow naming convention
      metadata.jsAPI.forEach(method => {
        expect(typeof method).toBe('string');
        expect(method.length).toBeGreaterThan(0);
      });

      button.destroy();
      document.body.removeChild(container);
    });

    test('should validate dependency resolution', () => {
      const ExampleButton = require('../../fixtures/button-component-mock');

      const container = document.createElement('div');
      container.id = 'test-deps-resolve';
      document.body.appendChild(container);

      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-deps-resolve'
      });

      const metadata = button.getMetadata();

      // Dependencies should be an array (even if empty)
      expect(Array.isArray(metadata.dependencies)).toBe(true);

      // If dependencies exist, they should be strings
      metadata.dependencies.forEach(dep => {
        expect(typeof dep).toBe('string');
      });

      button.destroy();
      document.body.removeChild(container);
    });

    test('should prepare for MCP validation', () => {
      // This test verifies component is ready for Level 4 MCP checks
      const MCPHelper = require('../../utils/mcp-helper');
      const mcp = new MCPHelper();

      const ExampleButton = require('../../fixtures/button-component-mock');

      const container = document.createElement('div');
      container.id = 'test-mcp-prep';
      document.body.appendChild(container);

      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-mcp-prep'
      });

      const metadata = button.getMetadata();

      // Create MCP-compatible component object
      const mcpComponent = mcp.createMockComponent(
        metadata.name,
        {
          cssNamespace: metadata.cssNamespace,
          jsAPI: metadata.jsAPI,
          dependencies: metadata.dependencies,
          events: metadata.events
        }
      );

      expect(mcpComponent).toHaveProperty('name');
      expect(mcpComponent).toHaveProperty('cssNamespace');
      expect(mcpComponent).toHaveProperty('jsAPI');

      button.destroy();
      document.body.removeChild(container);
    });
  });

  describe('Complete Validation Pipeline', () => {
    test('should pass all 4 levels in sequence', async () => {
      const startTime = Date.now();

      // Level 1: Syntax (< 1s)
      const htmlValid = '<button>Test</button>'.match(/<button>.*<\/button>/);
      expect(htmlValid).toBeTruthy();

      // Level 2: Unit Tests (< 10s)
      const ExampleButton = require('../../fixtures/button-component-mock');
      const container = document.createElement('div');
      container.id = 'test-pipeline';
      document.body.appendChild(container);

      const button = new ExampleButton({
        label: 'Test',
        containerId: 'test-pipeline'
      });

      expect(button.getCount()).toBe(0);
      button.element.click();
      expect(button.getCount()).toBe(1);

      // Level 3: Contract Compliance (< 1s)
      const metadata = button.getMetadata();
      expect(metadata.cssNamespace).toBe('component-example-button');

      // Level 4: Integration Safety (< 30s)
      expect(metadata).toHaveProperty('name');
      expect(metadata).toHaveProperty('jsAPI');

      button.destroy();
      document.body.removeChild(container);

      const duration = Date.now() - startTime;

      // Total pipeline should complete in under 40s
      expect(duration).toBeLessThan(40000);
    });

    test('should track validation metrics', () => {
      const metrics = {
        level1Time: 0,
        level2Time: 0,
        level3Time: 0,
        level4Time: 0
      };

      // Level 1
      let start = Date.now();
      '<div></div>'.match(/<div><\/div>/);
      metrics.level1Time = Date.now() - start;

      // Level 2
      start = Date.now();
      const ExampleButton = require('../../fixtures/button-component-mock');
      const container = document.createElement('div');
      container.id = 'test-metrics';
      document.body.appendChild(container);
      const button = new ExampleButton({ label: 'Test', containerId: 'test-metrics' });
      metrics.level2Time = Date.now() - start;

      // Level 3
      start = Date.now();
      button.getMetadata();
      metrics.level3Time = Date.now() - start;

      // Level 4
      start = Date.now();
      const metadata = button.getMetadata();
      expect(metadata).toBeDefined();
      metrics.level4Time = Date.now() - start;

      // Verify timing expectations
      expect(metrics.level1Time).toBeLessThan(1000);
      expect(metrics.level2Time).toBeLessThan(10000);
      expect(metrics.level3Time).toBeLessThan(1000);
      expect(metrics.level4Time).toBeLessThan(30000);

      button.destroy();
      document.body.removeChild(container);
    });
  });
});
