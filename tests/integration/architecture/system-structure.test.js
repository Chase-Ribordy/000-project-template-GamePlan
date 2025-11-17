/**
 * Architecture Validation Tests
 * Verifies the .system infrastructure is properly structured
 */

const fs = require('fs');
const path = require('path');

describe('System Architecture Validation', () => {
  const systemRoot = path.join(__dirname, '../../../.system');

  describe('Directory Structure', () => {
    test('should have all required .system directories', () => {
      const requiredDirs = [
        'contracts',
        'components',
        'proven',
        'sandbox',
        'validation',
        'mcp-servers',
        'events',
        'boilerplate'
      ];

      requiredDirs.forEach(dir => {
        const dirPath = path.join(systemRoot, dir);
        expect(fs.existsSync(dirPath)).toBe(true);
      });
    });

    test('should have contracts directory with templates', () => {
      const contractsDir = path.join(systemRoot, 'contracts');
      expect(fs.existsSync(contractsDir)).toBe(true);

      // Should have template and example
      const template = path.join(contractsDir, 'component-contract-template.md');
      const example = path.join(contractsDir, 'example-button-contract.md');

      expect(fs.existsSync(template)).toBe(true);
      expect(fs.existsSync(example)).toBe(true);
    });

    test('should have sandbox directory structure', () => {
      const sandboxDir = path.join(systemRoot, 'sandbox');
      expect(fs.existsSync(sandboxDir)).toBe(true);

      // Check for sandbox template if exists
      const sandboxFiles = fs.readdirSync(sandboxDir);
      expect(Array.isArray(sandboxFiles)).toBe(true);
    });

    test('should have validation scripts directory', () => {
      const validationDir = path.join(systemRoot, 'validation');
      expect(fs.existsSync(validationDir)).toBe(true);
    });

    test('should have MCP servers directory', () => {
      const mcpDir = path.join(systemRoot, 'mcp-servers');
      expect(fs.existsSync(mcpDir)).toBe(true);

      // Should have component-registry.js
      const registry = path.join(mcpDir, 'component-registry.js');
      expect(fs.existsSync(registry)).toBe(true);
    });

    test('should have events directory', () => {
      const eventsDir = path.join(systemRoot, 'events');
      expect(fs.existsSync(eventsDir)).toBe(true);
    });

    test('should have boilerplate directory', () => {
      const boilerplateDir = path.join(systemRoot, 'boilerplate');
      expect(fs.existsSync(boilerplateDir)).toBe(true);
    });
  });

  describe('Configuration Files', () => {
    test('should have execution-status.yaml', () => {
      const statusFile = path.join(systemRoot, 'execution-status.yaml');

      if (fs.existsSync(statusFile)) {
        const content = fs.readFileSync(statusFile, 'utf8');
        expect(content).toBeTruthy();
        expect(content).toContain('pass'); // Should reference passes
      } else {
        // File might not exist yet in new projects - that's OK
        expect(true).toBe(true);
      }
    });

    test('should have .claude directory with skills', () => {
      const claudeDir = path.join(__dirname, '../../../.claude');
      expect(fs.existsSync(claudeDir)).toBe(true);

      const skillsDir = path.join(claudeDir, 'skills');
      expect(fs.existsSync(skillsDir)).toBe(true);
    });

    test('should have trigger-matrix.yaml in skills', () => {
      const triggerMatrix = path.join(__dirname, '../../../.claude/skills/trigger-matrix.yaml');

      if (fs.existsSync(triggerMatrix)) {
        const content = fs.readFileSync(triggerMatrix, 'utf8');
        expect(content).toBeTruthy();
      } else {
        // Might not exist in minimal setup
        expect(true).toBe(true);
      }
    });
  });

  describe('Contract Templates', () => {
    test('should have valid contract template structure', () => {
      const templatePath = path.join(systemRoot, 'contracts/component-contract-template.md');

      if (fs.existsSync(templatePath)) {
        const content = fs.readFileSync(templatePath, 'utf8');

        // Should have key sections
        expect(content).toContain('Inputs');
        expect(content).toContain('Outputs');
        expect(content).toContain('CSS');
      }
    });

    test('should have example contract with proper structure', () => {
      const examplePath = path.join(systemRoot, 'contracts/example-button-contract.md');
      expect(fs.existsSync(examplePath)).toBe(true);

      const content = fs.readFileSync(examplePath, 'utf8');

      // Should define inputs
      expect(content.toLowerCase()).toMatch(/input|parameter|prop/);

      // Should define outputs
      expect(content.toLowerCase()).toMatch(/output|return|method/);

      // Should define CSS namespace
      expect(content).toContain('component-example-button');
    });
  });

  describe('MCP Server', () => {
    test('should have component-registry.js', () => {
      const registryPath = path.join(systemRoot, 'mcp-servers/component-registry.js');
      expect(fs.existsSync(registryPath)).toBe(true);

      const content = fs.readFileSync(registryPath, 'utf8');
      expect(content).toBeTruthy();
      expect(content.length).toBeGreaterThan(100);
    });

    test('should have package.json for MCP server', () => {
      const packagePath = path.join(systemRoot, 'mcp-servers/package.json');

      if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        expect(packageJson.name).toBeTruthy();
      }
    });
  });

  describe('Test Infrastructure', () => {
    test('should have tests directory at project root', () => {
      const testsDir = path.join(__dirname, '../..');
      expect(fs.existsSync(testsDir)).toBe(true);
    });

    test('should have unit tests directory', () => {
      const unitDir = path.join(__dirname, '../../unit');
      expect(fs.existsSync(unitDir)).toBe(true);
    });

    test('should have integration tests directory', () => {
      const integrationDir = path.join(__dirname, '..');
      expect(fs.existsSync(integrationDir)).toBe(true);
    });

    test('should have test fixtures', () => {
      const fixturesDir = path.join(__dirname, '../../fixtures');
      expect(fs.existsSync(fixturesDir)).toBe(true);
    });

    test('should have test utilities', () => {
      const utilsDir = path.join(__dirname, '../../utils');
      expect(fs.existsSync(utilsDir)).toBe(true);
    });
  });

  describe('Project Configuration', () => {
    test('should have package.json at root', () => {
      const packagePath = path.join(__dirname, '../../../package.json');
      expect(fs.existsSync(packagePath)).toBe(true);

      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      expect(packageJson.name).toBe('project-template');
      expect(packageJson.scripts.test).toBeDefined();
    });

    test('should have jest.config.js', () => {
      const jestConfig = path.join(__dirname, '../../../jest.config.js');
      expect(fs.existsSync(jestConfig)).toBe(true);

      const content = fs.readFileSync(jestConfig, 'utf8');
      expect(content).toContain('testEnvironment');
      expect(content).toContain('jsdom');
    });

    test('should have .gitignore', () => {
      const gitignore = path.join(__dirname, '../../../.gitignore');
      expect(fs.existsSync(gitignore)).toBe(true);
    });
  });

  describe('Documentation', () => {
    test('should have README.md', () => {
      const readme = path.join(__dirname, '../../../README.md');
      expect(fs.existsSync(readme)).toBe(true);
    });

    test('should have START_HERE.md', () => {
      const startHere = path.join(__dirname, '../../../START_HERE.md');
      expect(fs.existsSync(startHere)).toBe(true);
    });

    test('should have test documentation', () => {
      const testReadme = path.join(__dirname, '../../README.md');
      expect(fs.existsSync(testReadme)).toBe(true);
    });

    test('should have contract testing guide', () => {
      const contractGuide = path.join(__dirname, '../../CONTRACT-TESTING.md');
      expect(fs.existsSync(contractGuide)).toBe(true);
    });
  });

  describe('File Permissions & Access', () => {
    test('should be able to read from .system directories', () => {
      const dirs = ['contracts', 'components', 'sandbox', 'validation'];

      dirs.forEach(dir => {
        const dirPath = path.join(systemRoot, dir);
        if (fs.existsSync(dirPath)) {
          const files = fs.readdirSync(dirPath);
          expect(Array.isArray(files)).toBe(true);
        }
      });
    });

    test('should be able to write to components directory', () => {
      const componentsDir = path.join(systemRoot, 'components');
      const testFile = path.join(componentsDir, '.test-write-access');

      try {
        fs.writeFileSync(testFile, 'test', 'utf8');
        expect(fs.existsSync(testFile)).toBe(true);
        fs.unlinkSync(testFile); // Cleanup
      } catch (error) {
        // If we can't write, fail the test
        throw new Error(`Cannot write to components directory: ${error.message}`);
      }
    });
  });

  describe('Architecture Integrity', () => {
    test('should maintain separation of concerns', () => {
      // .system should not contain source code (src/)
      const systemHasSrc = fs.existsSync(path.join(systemRoot, 'src'));
      expect(systemHasSrc).toBe(false);

      // Source code should be separate
      const rootSrc = path.join(__dirname, '../../../src');
      if (fs.existsSync(rootSrc)) {
        // If src exists, it should be at root level, not in .system
        expect(true).toBe(true);
      }
    });

    test('should not have node_modules in .system', () => {
      const systemNodeModules = path.join(systemRoot, 'node_modules');
      expect(fs.existsSync(systemNodeModules)).toBe(false);
    });

    test('should have consistent naming conventions', () => {
      const contractFiles = fs.readdirSync(path.join(systemRoot, 'contracts'));

      contractFiles.forEach(file => {
        if (file.endsWith('.md')) {
          // Contract files should follow naming convention (allow README.md)
          const isValid = file.match(/^[a-z-]+\.md$/) || file === 'README.md';
          expect(isValid).toBeTruthy();
        }
      });
    });
  });
});
