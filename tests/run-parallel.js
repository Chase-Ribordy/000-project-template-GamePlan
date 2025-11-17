#!/usr/bin/env node

/**
 * Parallel Test Runner
 * Orchestrates parallel execution of test suites
 */

const { spawn } = require('child_process');
const path = require('path');

class ParallelTestRunner {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  /**
   * Run a test suite in a separate process
   */
  runTestSuite(name, command, args = []) {
    return new Promise((resolve) => {
      console.log(`\n🚀 Starting: ${name}`);
      const startTime = Date.now();

      const proc = spawn(command, args, {
        stdio: 'inherit',
        shell: true
      });

      proc.on('close', (code) => {
        const duration = Date.now() - startTime;
        const result = {
          name,
          success: code === 0,
          duration,
          code
        };

        this.results.push(result);

        const status = code === 0 ? '✅' : '❌';
        console.log(`${status} ${name} completed in ${duration}ms`);

        resolve(result);
      });

      proc.on('error', (error) => {
        console.error(`❌ Error running ${name}:`, error);
        this.results.push({
          name,
          success: false,
          duration: Date.now() - startTime,
          error: error.message
        });
        resolve({ name, success: false, error });
      });
    });
  }

  /**
   * Run all test suites in parallel
   */
  async runAll() {
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║   Parallel Test Execution - .system Tests   ║');
    console.log('╚══════════════════════════════════════════════╝\n');

    const testSuites = [
      {
        name: 'Contract Compliance Tests',
        command: 'npm',
        args: ['run', 'test:contracts', '--', '--runInBand']
      },
      {
        name: 'MCP Integration Tests',
        command: 'npm',
        args: ['run', 'test:mcp', '--', '--runInBand']
      },
      {
        name: '4-Level Validation Tests',
        command: 'npm',
        args: ['run', 'test:validation', '--', '--runInBand']
      }
    ];

    // Run all test suites in parallel
    const promises = testSuites.map(suite =>
      this.runTestSuite(suite.name, suite.command, suite.args)
    );

    await Promise.all(promises);

    this.printSummary();
  }

  /**
   * Print execution summary
   */
  printSummary() {
    const totalDuration = Date.now() - this.startTime;
    const successCount = this.results.filter(r => r.success).length;
    const failCount = this.results.filter(r => !r.success).length;

    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║            Test Execution Summary            ║');
    console.log('╚══════════════════════════════════════════════╝\n');

    this.results.forEach(result => {
      const status = result.success ? '✅ PASS' : '❌ FAIL';
      const duration = `${result.duration}ms`;
      console.log(`  ${status} | ${result.name.padEnd(35)} | ${duration}`);
    });

    console.log('\n' + '─'.repeat(50));
    console.log(`  Total: ${this.results.length} suites`);
    console.log(`  Passed: ${successCount}`);
    console.log(`  Failed: ${failCount}`);
    console.log(`  Duration: ${totalDuration}ms`);
    console.log('─'.repeat(50) + '\n');

    if (failCount > 0) {
      console.log('❌ Some tests failed. See output above for details.\n');
      process.exit(1);
    } else {
      console.log('✅ All test suites passed!\n');
      process.exit(0);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const runner = new ParallelTestRunner();
  runner.runAll().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = ParallelTestRunner;
