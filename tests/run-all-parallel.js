#!/usr/bin/env node

/**
 * Master Parallel Test Orchestrator
 * Runs ALL test suites across multiple "terminals" simultaneously
 */

const { spawn } = require('child_process');
const path = require('path');

class MasterTestOrchestrator {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
    this.colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      green: '\x1b[32m',
      red: '\x1b[31m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      cyan: '\x1b[36m',
      magenta: '\x1b[35m'
    };
  }

  /**
   * Print colored output
   */
  color(text, color) {
    return `${this.colors[color]}${text}${this.colors.reset}`;
  }

  /**
   * Run a test suite in a separate process
   */
  runTestSuite(name, command, args = [], terminalColor = 'blue') {
    return new Promise((resolve) => {
      const prefix = this.color(`[${name}]`, terminalColor);
      console.log(`\n${this.color('🚀 Starting:', 'bright')} ${prefix} ${name}`);
      const startTime = Date.now();

      const proc = spawn(command, args, {
        stdio: 'pipe',
        shell: true
      });

      let output = '';

      proc.stdout.on('data', (data) => {
        output += data.toString();
      });

      proc.stderr.on('data', (data) => {
        output += data.toString();
      });

      proc.on('close', (code) => {
        const duration = Date.now() - startTime;
        const result = {
          name,
          success: code === 0,
          duration,
          code,
          output,
          terminalColor
        };

        this.results.push(result);

        const status = code === 0
          ? this.color('✅ PASS', 'green')
          : this.color('❌ FAIL', 'red');

        const durationStr = this.color(`${duration}ms`, 'cyan');
        console.log(`${status} ${prefix} ${name} ${durationStr}`);

        resolve(result);
      });

      proc.on('error', (error) => {
        console.error(`${this.color('❌ Error', 'red')} running ${prefix}:`, error.message);
        this.results.push({
          name,
          success: false,
          duration: Date.now() - startTime,
          error: error.message,
          terminalColor
        });
        resolve({ name, success: false, error });
      });
    });
  }

  /**
   * Run all test suites in parallel (6 terminals)
   */
  async runAll() {
    console.log(this.color('╔════════════════════════════════════════════════════════╗', 'bright'));
    console.log(this.color('║  Master Parallel Test Orchestrator - 6 Terminals      ║', 'bright'));
    console.log(this.color('╚════════════════════════════════════════════════════════╝', 'bright'));
    console.log('');

    const testSuites = [
      {
        name: 'Terminal 1: Contract Compliance',
        command: 'npm',
        args: ['run', 'test:contracts', '--', '--runInBand'],
        color: 'blue'
      },
      {
        name: 'Terminal 2: MCP Integration',
        command: 'npm',
        args: ['run', 'test:mcp', '--', '--runInBand'],
        color: 'green'
      },
      {
        name: 'Terminal 3: 4-Level Validation',
        command: 'npm',
        args: ['run', 'test:validation', '--', '--runInBand'],
        color: 'yellow'
      },
      {
        name: 'Terminal 4: Architecture Validation',
        command: 'npm',
        args: ['run', 'test:architecture', '--', '--runInBand'],
        color: 'magenta'
      },
      {
        name: 'Terminal 5: Skills & Workflows',
        command: 'npm',
        args: ['run', 'test:skills', '--', '--runInBand'],
        color: 'cyan'
      },
      {
        name: 'Terminal 6: Smoke Tests',
        command: 'npm',
        args: ['run', 'test:smoke', '--', '--runInBand'],
        color: 'blue'
      }
    ];

    console.log(this.color(`Launching ${testSuites.length} test terminals in parallel...`, 'bright'));
    console.log(this.color('Each terminal runs independently and reports back when done.\n', 'bright'));

    // Run all test suites in parallel
    const promises = testSuites.map(suite =>
      this.runTestSuite(suite.name, suite.command, suite.args, suite.color)
    );

    await Promise.all(promises);

    this.printSummary();
    this.printDetailedResults();
  }

  /**
   * Print execution summary
   */
  printSummary() {
    const totalDuration = Date.now() - this.startTime;
    const successCount = this.results.filter(r => r.success).length;
    const failCount = this.results.filter(r => !r.success).length;

    console.log('\n' + this.color('╔════════════════════════════════════════════════════════╗', 'bright'));
    console.log(this.color('║            Test Execution Summary                      ║', 'bright'));
    console.log(this.color('╚════════════════════════════════════════════════════════╝', 'bright'));
    console.log('');

    this.results
      .sort((a, b) => a.duration - b.duration) // Sort by duration
      .forEach(result => {
        const status = result.success
          ? this.color('✅ PASS', 'green')
          : this.color('❌ FAIL', 'red');

        const duration = this.color(`${result.duration}ms`, 'cyan');
        const name = this.color(result.name.padEnd(40), result.terminalColor);

        console.log(`  ${status} │ ${name} │ ${duration}`);
      });

    console.log('\n' + this.color('─'.repeat(60), 'bright'));
    console.log(`  ${this.color('Total Terminals:', 'bright')} ${this.results.length}`);
    console.log(`  ${this.color('Passed:', 'green')} ${successCount}`);
    console.log(`  ${this.color('Failed:', 'red')} ${failCount}`);
    console.log(`  ${this.color('Total Duration:', 'cyan')} ${totalDuration}ms`);
    console.log(`  ${this.color('Speedup:', 'magenta')} ~${Math.round(this.results.reduce((sum, r) => sum + r.duration, 0) / totalDuration)}x faster than sequential`);
    console.log(this.color('─'.repeat(60), 'bright') + '\n');

    if (failCount > 0) {
      console.log(this.color('❌ Some tests failed. See details below.\n', 'red'));
    } else {
      console.log(this.color('✅ All test terminals passed successfully!\n', 'green'));
    }
  }

  /**
   * Print detailed results for failed tests
   */
  printDetailedResults() {
    const failed = this.results.filter(r => !r.success);

    if (failed.length > 0) {
      console.log(this.color('╔════════════════════════════════════════════════════════╗', 'red'));
      console.log(this.color('║            Failed Test Details                         ║', 'red'));
      console.log(this.color('╚════════════════════════════════════════════════════════╝', 'red'));
      console.log('');

      failed.forEach(result => {
        console.log(this.color(`\n━━━ ${result.name} ━━━`, 'red'));
        console.log(this.color('Error:', 'red'));

        if (result.error) {
          console.log(result.error);
        }

        if (result.output) {
          // Show last 50 lines of output
          const lines = result.output.split('\n');
          const lastLines = lines.slice(-50).join('\n');
          console.log(lastLines);
        }

        console.log('');
      });
    }

    // Print test counts from each terminal
    console.log(this.color('╔════════════════════════════════════════════════════════╗', 'bright'));
    console.log(this.color('║            Test Counts by Terminal                     ║', 'bright'));
    console.log(this.color('╚════════════════════════════════════════════════════════╝', 'bright'));
    console.log('');

    this.results.forEach(result => {
      if (result.output) {
        const testMatch = result.output.match(/Tests:.*?(\d+) passed/);
        if (testMatch) {
          const testCount = testMatch[1];
          const name = this.color(result.name, result.terminalColor);
          console.log(`  ${name}: ${this.color(testCount + ' tests passed', 'green')}`);
        }
      }
    });

    console.log('');

    // Exit with appropriate code
    if (failed.length > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }

  /**
   * Print real-time progress
   */
  printProgress() {
    const completed = this.results.length;
    const total = 6;
    const percent = Math.round((completed / total) * 100);

    process.stdout.write(`\r${this.color('Progress:', 'bright')} ${completed}/${total} terminals (${percent}%)`);
  }
}

// Run if executed directly
if (require.main === module) {
  const orchestrator = new MasterTestOrchestrator();
  orchestrator.runAll().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = MasterTestOrchestrator;
