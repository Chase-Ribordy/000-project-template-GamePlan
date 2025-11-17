/**
 * MCP Helper Utility
 * Provides helper functions for testing MCP server integration
 */

const http = require('http');

class MCPHelper {
  constructor(host = 'localhost', port = 3000) {
    this.host = host;
    this.port = port;
    this.baseUrl = `http://${host}:${port}`;
  }

  /**
   * Make a request to the MCP server
   */
  async request(tool, params = {}) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ tool, params });

      const options = {
        hostname: this.host,
        port: this.port,
        path: '/mcp',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      };

      const req = http.request(options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            resolve(response);
          } catch (error) {
            reject(new Error(`Failed to parse MCP response: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`MCP request failed: ${error.message}`));
      });

      req.write(data);
      req.end();
    });
  }

  /**
   * Register a component with MCP
   */
  async registerComponent(component) {
    return this.request('register_component', component);
  }

  /**
   * Validate integration for a component
   */
  async validateIntegration(componentName) {
    return this.request('validate_integration', { componentName });
  }

  /**
   * Get integration plan
   */
  async getIntegrationPlan(componentName) {
    return this.request('get_integration_plan', { componentName });
  }

  /**
   * List all components
   */
  async listComponents() {
    return this.request('list_components', {});
  }

  /**
   * Validate contract
   */
  async validateContract(contractPath, implementationPath) {
    return this.request('validate_contract', {
      contractPath,
      implementationPath
    });
  }

  /**
   * Run preflight checks
   */
  async runPreflightChecks(componentName) {
    return this.request('run_preflight_checks', { componentName });
  }

  /**
   * Test in sandbox
   */
  async testInSandbox(componentName) {
    return this.request('test_in_sandbox', { componentName });
  }

  /**
   * Mark component as proven
   */
  async markAsProven(componentName) {
    return this.request('mark_as_proven', { componentName });
  }

  /**
   * Check if MCP server is running
   */
  async isServerRunning() {
    try {
      await this.listComponents();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for MCP server to be ready
   */
  async waitForServer(timeout = 5000, interval = 100) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (await this.isServerRunning()) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error(`MCP server did not start within ${timeout}ms`);
  }

  /**
   * Create mock component for testing
   */
  createMockComponent(name, options = {}) {
    return {
      name,
      cssNamespace: options.cssNamespace || `.component-${name}-`,
      jsAPI: options.jsAPI || [`${name}.init`, `${name}.destroy`],
      dependencies: options.dependencies || [],
      events: options.events || [],
      status: options.status || 'development'
    };
  }

  /**
   * Simulate conflict scenario
   */
  async simulateConflict(component1, component2) {
    await this.registerComponent(component1);
    const result = await this.validateIntegration(component2.name);
    return result;
  }
}

module.exports = MCPHelper;
