/**
 * Parallel Session Tracking Test
 *
 * Validates that orchestrator-exe properly tracks parallel work sessions
 * and maintains coordination state.
 *
 * Tests:
 * 1. Session file structure validation
 * 2. Dependency graph validation
 * 3. Coordination log structure validation
 * 4. Session state tracking completeness
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Test configuration
const EXAMPLES_DIR = path.join(__dirname, '../../.system/parallel-work/examples');

/**
 * Test Results Tracker
 */
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

/**
 * Test 1: Session example file validation
 */
function testSessionExampleStructure() {
  console.log('\n=== TEST 1: Session Example Structure ===\n');
  results.total++;

  const sessionFile = path.join(EXAMPLES_DIR, 'session-example.yaml');

  if (!fs.existsSync(sessionFile)) {
    results.failed++;
    console.log('✗ session-example.yaml NOT FOUND');
    results.details.push({ test: 'Session Example', status: 'FAIL', reason: 'File not found' });
    return;
  }

  try {
    const sessionData = yaml.load(fs.readFileSync(sessionFile, 'utf-8'));

    const requiredFields = [
      'session_id',
      'session_type',
      'mode',
      'phase',
      'terminals',
      'coordination',
      'metadata'
    ];

    const missingFields = requiredFields.filter(field => !sessionData[field]);

    if (missingFields.length === 0) {
      results.passed++;
      console.log('✓ session-example.yaml: Complete structure');
      console.log(`  - Session ID: ${sessionData.session_id}`);
      console.log(`  - Session Type: ${sessionData.session_type}`);
      console.log(`  - Terminals: ${sessionData.terminals?.length || 0}`);
      results.details.push({ test: 'Session Example', status: 'PASS' });
    } else {
      results.failed++;
      console.log(`✗ session-example.yaml: Missing fields - ${missingFields.join(', ')}`);
      results.details.push({
        test: 'Session Example',
        status: 'FAIL',
        reason: `Missing: ${missingFields.join(', ')}`
      });
    }
  } catch (e) {
    results.failed++;
    console.log(`✗ session-example.yaml: Parse error - ${e.message}`);
    results.details.push({ test: 'Session Example', status: 'FAIL', reason: e.message });
  }
}

/**
 * Test 2: Terminal tracking structure
 */
function testTerminalTracking() {
  console.log('\n=== TEST 2: Terminal Tracking Structure ===\n');
  results.total++;

  const sessionFile = path.join(EXAMPLES_DIR, 'session-example.yaml');

  if (!fs.existsSync(sessionFile)) {
    console.log('⚠️  session-example.yaml not found - skipping terminal tracking test');
    return;
  }

  try {
    const sessionData = yaml.load(fs.readFileSync(sessionFile, 'utf-8'));

    if (!sessionData.terminals || sessionData.terminals.length === 0) {
      results.failed++;
      console.log('✗ No terminals defined in session');
      results.details.push({ test: 'Terminal Tracking', status: 'FAIL', reason: 'No terminals' });
      return;
    }

    const requiredTerminalFields = [
      'terminal_id',
      'story_id',
      'assigned_agent',
      'status',
      'started_at',
      'current_task',
      'progress'
    ];

    let validTerminals = 0;
    sessionData.terminals.forEach((terminal, index) => {
      const missingFields = requiredTerminalFields.filter(field => !terminal[field]);

      if (missingFields.length === 0) {
        validTerminals++;
        console.log(`✓ Terminal ${terminal.terminal_id}: Complete tracking structure`);
      } else {
        console.log(`✗ Terminal ${terminal.terminal_id || index}: Missing - ${missingFields.join(', ')}`);
      }
    });

    if (validTerminals === sessionData.terminals.length) {
      results.passed++;
      console.log(`\n✓ All ${validTerminals} terminals have complete tracking`);
      results.details.push({ test: 'Terminal Tracking', status: 'PASS' });
    } else {
      results.failed++;
      console.log(`\n✗ Only ${validTerminals}/${sessionData.terminals.length} terminals valid`);
      results.details.push({
        test: 'Terminal Tracking',
        status: 'FAIL',
        reason: `${sessionData.terminals.length - validTerminals} terminals incomplete`
      });
    }
  } catch (e) {
    results.failed++;
    console.log(`✗ Error: ${e.message}`);
    results.details.push({ test: 'Terminal Tracking', status: 'FAIL', reason: e.message });
  }
}

/**
 * Test 3: Dependencies example validation
 */
function testDependenciesStructure() {
  console.log('\n=== TEST 3: Dependencies Example Structure ===\n');
  results.total++;

  const depsFile = path.join(EXAMPLES_DIR, 'dependencies-example.yaml');

  if (!fs.existsSync(depsFile)) {
    results.failed++;
    console.log('✗ dependencies-example.yaml NOT FOUND');
    results.details.push({ test: 'Dependencies Example', status: 'FAIL', reason: 'File not found' });
    return;
  }

  try {
    const depsData = yaml.load(fs.readFileSync(depsFile, 'utf-8'));

    const requiredFields = [
      'epic_id',
      'total_stories',
      'stories',
      'dependency_graph',
      'strategies',
      'conflicts'
    ];

    const missingFields = requiredFields.filter(field => !depsData[field]);

    if (missingFields.length === 0) {
      results.passed++;
      console.log('✓ dependencies-example.yaml: Complete structure');
      console.log(`  - Epic: ${depsData.epic_id}`);
      console.log(`  - Stories: ${depsData.total_stories}`);
      console.log(`  - Strategies: ${depsData.strategies?.length || 0}`);
      results.details.push({ test: 'Dependencies Example', status: 'PASS' });
    } else {
      results.failed++;
      console.log(`✗ dependencies-example.yaml: Missing - ${missingFields.join(', ')}`);
      results.details.push({
        test: 'Dependencies Example',
        status: 'FAIL',
        reason: `Missing: ${missingFields.join(', ')}`
      });
    }
  } catch (e) {
    results.failed++;
    console.log(`✗ dependencies-example.yaml: Parse error - ${e.message}`);
    results.details.push({ test: 'Dependencies Example', status: 'FAIL', reason: e.message });
  }
}

/**
 * Test 4: Coordination log validation
 */
function testCoordinationLogStructure() {
  console.log('\n=== TEST 4: Coordination Log Structure ===\n');
  results.total++;

  const logFile = path.join(EXAMPLES_DIR, 'coordination-log-example.yaml');

  if (!fs.existsSync(logFile)) {
    results.failed++;
    console.log('✗ coordination-log-example.yaml NOT FOUND');
    results.details.push({ test: 'Coordination Log', status: 'FAIL', reason: 'File not found' });
    return;
  }

  try {
    const logData = yaml.load(fs.readFileSync(logFile, 'utf-8'));

    const requiredFields = [
      'session_id',
      'log_created',
      'events',
      'metrics',
      'patterns'
    ];

    const missingFields = requiredFields.filter(field => !logData[field]);

    if (missingFields.length === 0 && logData.events?.length > 0) {
      results.passed++;
      console.log('✓ coordination-log-example.yaml: Complete structure');
      console.log(`  - Session: ${logData.session_id}`);
      console.log(`  - Events: ${logData.events.length}`);
      console.log(`  - Duration: ${logData.session_duration}`);
      results.details.push({ test: 'Coordination Log', status: 'PASS' });
    } else if (missingFields.length > 0) {
      results.failed++;
      console.log(`✗ coordination-log-example.yaml: Missing - ${missingFields.join(', ')}`);
      results.details.push({
        test: 'Coordination Log',
        status: 'FAIL',
        reason: `Missing: ${missingFields.join(', ')}`
      });
    } else {
      results.failed++;
      console.log('✗ coordination-log-example.yaml: No events logged');
      results.details.push({ test: 'Coordination Log', status: 'FAIL', reason: 'No events' });
    }
  } catch (e) {
    results.failed++;
    console.log(`✗ coordination-log-example.yaml: Parse error - ${e.message}`);
    results.details.push({ test: 'Coordination Log', status: 'FAIL', reason: e.message });
  }
}

/**
 * Test 5: Coordination event types validation
 */
function testCoordinationEventTypes() {
  console.log('\n=== TEST 5: Coordination Event Types ===\n');
  results.total++;

  const logFile = path.join(EXAMPLES_DIR, 'coordination-log-example.yaml');

  if (!fs.existsSync(logFile)) {
    console.log('⚠️  coordination-log-example.yaml not found - skipping event types test');
    return;
  }

  try {
    const logData = yaml.load(fs.readFileSync(logFile, 'utf-8'));

    const expectedEventTypes = [
      'session_start',
      'agent_delegation',
      'conflict_detected',
      'coordination_decision',
      'milestone_reached',
      'story_completion',
      'session_complete'
    ];

    const foundEventTypes = new Set(
      logData.events?.map(event => event.type) || []
    );

    const missingEventTypes = expectedEventTypes.filter(
      type => !foundEventTypes.has(type)
    );

    if (missingEventTypes.length === 0) {
      results.passed++;
      console.log('✓ All expected coordination event types present');
      console.log(`  Found: ${Array.from(foundEventTypes).join(', ')}`);
      results.details.push({ test: 'Coordination Event Types', status: 'PASS' });
    } else if (missingEventTypes.length <= 2) {
      results.warnings++;
      console.log(`⚠️  Some event types missing: ${missingEventTypes.join(', ')}`);
      console.log('  (May be intentional depending on session type)');
      results.details.push({
        test: 'Coordination Event Types',
        status: 'WARNING',
        reason: `Missing: ${missingEventTypes.join(', ')}`
      });
    } else {
      results.failed++;
      console.log(`✗ Many event types missing: ${missingEventTypes.join(', ')}`);
      results.details.push({
        test: 'Coordination Event Types',
        status: 'FAIL',
        reason: `Missing: ${missingEventTypes.join(', ')}`
      });
    }
  } catch (e) {
    results.failed++;
    console.log(`✗ Error: ${e.message}`);
    results.details.push({ test: 'Coordination Event Types', status: 'FAIL', reason: e.message });
  }
}

/**
 * Test 6: Isolation verification in coordination log
 */
function testIsolationVerification() {
  console.log('\n=== TEST 6: Isolation Verification in Log ===\n');
  results.total++;

  const logFile = path.join(EXAMPLES_DIR, 'coordination-log-example.yaml');

  if (!fs.existsSync(logFile)) {
    console.log('⚠️  coordination-log-example.yaml not found - skipping isolation test');
    return;
  }

  try {
    const logData = yaml.load(fs.readFileSync(logFile, 'utf-8'));

    if (logData.isolation_verification) {
      const isolation = logData.isolation_verification;
      const allChecksPass =
        isolation.bmad_event_emissions === 0 &&
        isolation.bmad_event_subscriptions === 0 &&
        isolation.direct_invocations_only === true &&
        isolation.top_down_coordination_maintained === true;

      if (allChecksPass) {
        results.passed++;
        console.log('✓ Isolation verification: All checks pass');
        console.log('  - No BMAD event emissions');
        console.log('  - No BMAD event subscriptions');
        console.log('  - Direct invocations only');
        console.log('  - Top-down coordination maintained');
        results.details.push({ test: 'Isolation Verification', status: 'PASS' });
      } else {
        results.failed++;
        console.log('✗ Isolation verification: Some checks failed');
        console.log(`  Event emissions: ${isolation.bmad_event_emissions}`);
        console.log(`  Event subscriptions: ${isolation.bmad_event_subscriptions}`);
        results.details.push({
          test: 'Isolation Verification',
          status: 'FAIL',
          reason: 'Isolation checks failed'
        });
      }
    } else {
      results.warnings++;
      console.log('⚠️  No isolation_verification section in log');
      results.details.push({
        test: 'Isolation Verification',
        status: 'WARNING',
        reason: 'No isolation verification section'
      });
    }
  } catch (e) {
    results.failed++;
    console.log(`✗ Error: ${e.message}`);
    results.details.push({ test: 'Isolation Verification', status: 'FAIL', reason: e.message });
  }
}

/**
 * Generate test report
 */
function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('PARALLEL SESSION TRACKING VALIDATION REPORT');
  console.log('='.repeat(80));
  console.log(`\nTotal Tests: ${results.total}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Warnings: ${results.warnings}`);

  if (results.failed > 0) {
    console.log('\n❌ FAILURES:\n');
    results.details.filter(d => d.status === 'FAIL').forEach(detail => {
      console.log(`  - ${detail.test}`);
      if (detail.reason) {
        console.log(`    Reason: ${detail.reason}`);
      }
    });
  }

  if (results.warnings > 0) {
    console.log('\n⚠️  WARNINGS:\n');
    results.details.filter(d => d.status === 'WARNING').forEach(detail => {
      console.log(`  - ${detail.test}`);
      if (detail.reason) {
        console.log(`    Reason: ${detail.reason}`);
      }
    });
  }

  console.log('\n' + '='.repeat(80));

  if (results.failed === 0 && results.passed > 0) {
    console.log('✅ PARALLEL SESSION TRACKING TESTS PASSED');
    return 0;
  } else if (results.failed === 0 && results.warnings > 0) {
    console.log('⚠️  PARALLEL SESSION TRACKING TESTS PASSED WITH WARNINGS');
    return 0;
  } else {
    console.log('❌ PARALLEL SESSION TRACKING VALIDATION FAILED');
    return 1;
  }
}

/**
 * Run all tests
 */
function runAllTests() {
  console.log('Orchestrator-EXE Parallel Session Tracking Validation');
  console.log('Testing directory:', EXAMPLES_DIR);

  testSessionExampleStructure();
  testTerminalTracking();
  testDependenciesStructure();
  testCoordinationLogStructure();
  testCoordinationEventTypes();
  testIsolationVerification();

  const exitCode = generateReport();
  process.exit(exitCode);
}

// Execute tests
runAllTests();
