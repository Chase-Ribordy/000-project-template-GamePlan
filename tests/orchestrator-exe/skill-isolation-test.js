/**
 * Skill Isolation Validation Test
 *
 * Verifies that orchestrator-exe skills are properly isolated and can only be
 * invoked by the orchestrator-exe agent, not by BMAD agents or other contexts.
 *
 * This test ensures the top-down coordination model is maintained.
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const ORCHESTRATOR_SKILLS_DIR = path.join(__dirname, '../../.claude/skills/orchestrator-exe');
const REQUIRED_ISOLATION_MARKER = 'Isolation Level: Orchestrator-EXE only';
const REQUIRED_INVOCATION_PATTERN = 'Invocation Pattern: Direct';

/**
 * Test Results Tracker
 */
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
};

/**
 * Test 1: Verify all orchestrator skills have isolation markers
 */
function testIsolationMarkers() {
  console.log('\n=== TEST 1: Skill Isolation Markers ===\n');

  const skillFiles = fs.readdirSync(ORCHESTRATOR_SKILLS_DIR)
    .filter(file => file.endsWith('.md') && file !== 'README.md' && file !== 'README-UPDATED.md');

  skillFiles.forEach(skillFile => {
    results.total++;
    const skillPath = path.join(ORCHESTRATOR_SKILLS_DIR, skillFile);
    const content = fs.readFileSync(skillPath, 'utf-8');

    if (content.includes(REQUIRED_ISOLATION_MARKER)) {
      results.passed++;
      console.log(`✓ ${skillFile}: Isolation marker found`);
      results.details.push({ test: 'Isolation Marker', skill: skillFile, status: 'PASS' });
    } else {
      results.failed++;
      console.log(`✗ ${skillFile}: Missing isolation marker "${REQUIRED_ISOLATION_MARKER}"`);
      results.details.push({
        test: 'Isolation Marker',
        skill: skillFile,
        status: 'FAIL',
        reason: 'Missing isolation marker'
      });
    }
  });
}

/**
 * Test 2: Verify all orchestrator skills use direct invocation (not event-driven)
 */
function testInvocationPattern() {
  console.log('\n=== TEST 2: Direct Invocation Pattern ===\n');

  const skillFiles = fs.readdirSync(ORCHESTRATOR_SKILLS_DIR)
    .filter(file => file.endsWith('.md') && file !== 'README.md' && file !== 'README-UPDATED.md');

  skillFiles.forEach(skillFile => {
    results.total++;
    const skillPath = path.join(ORCHESTRATOR_SKILLS_DIR, skillFile);
    const content = fs.readFileSync(skillPath, 'utf-8');

    if (content.includes(REQUIRED_INVOCATION_PATTERN)) {
      results.passed++;
      console.log(`✓ ${skillFile}: Direct invocation pattern confirmed`);
      results.details.push({ test: 'Invocation Pattern', skill: skillFile, status: 'PASS' });
    } else {
      results.failed++;
      console.log(`✗ ${skillFile}: Missing or incorrect invocation pattern`);
      results.details.push({
        test: 'Invocation Pattern',
        skill: skillFile,
        status: 'FAIL',
        reason: 'Missing direct invocation pattern declaration'
      });
    }
  });
}

/**
 * Test 3: Verify skills do not emit BMAD events
 */
function testNoEventEmission() {
  console.log('\n=== TEST 3: No BMAD Event Emission ===\n');

  const skillFiles = fs.readdirSync(ORCHESTRATOR_SKILLS_DIR)
    .filter(file => file.endsWith('.md') && file !== 'README.md' && file !== 'README-UPDATED.md');

  const eventEmissionKeywords = [
    'emit event',
    'publish event',
    'broadcast event',
    'trigger event',
    'EventEmitter',
    'event.emit'
  ];

  skillFiles.forEach(skillFile => {
    results.total++;
    const skillPath = path.join(ORCHESTRATOR_SKILLS_DIR, skillFile);
    const content = fs.readFileSync(skillPath, 'utf-8');

    const foundEmissionKeywords = eventEmissionKeywords.filter(keyword =>
      content.toLowerCase().includes(keyword.toLowerCase())
    );

    if (foundEmissionKeywords.length === 0) {
      results.passed++;
      console.log(`✓ ${skillFile}: No event emission detected`);
      results.details.push({ test: 'No Event Emission', skill: skillFile, status: 'PASS' });
    } else {
      results.failed++;
      console.log(`✗ ${skillFile}: Possible event emission detected: ${foundEmissionKeywords.join(', ')}`);
      results.details.push({
        test: 'No Event Emission',
        skill: skillFile,
        status: 'FAIL',
        reason: `Found keywords: ${foundEmissionKeywords.join(', ')}`
      });
    }
  });
}

/**
 * Test 4: Verify skills have isolation rules documentation
 */
function testIsolationDocumentation() {
  console.log('\n=== TEST 4: Isolation Rules Documentation ===\n');

  const skillFiles = fs.readdirSync(ORCHESTRATOR_SKILLS_DIR)
    .filter(file => file.endsWith('.md') && file !== 'README.md' && file !== 'README-UPDATED.md');

  const requiredSections = [
    'Isolation Rules',
    'NOT event-driven',
    'orchestrator-exe only'
  ];

  skillFiles.forEach(skillFile => {
    results.total++;
    const skillPath = path.join(ORCHESTRATOR_SKILLS_DIR, skillFile);
    const content = fs.readFileSync(skillPath, 'utf-8');

    const foundSections = requiredSections.filter(section =>
      content.toLowerCase().includes(section.toLowerCase())
    );

    if (foundSections.length >= 2) {  // At least 2 of 3 required sections
      results.passed++;
      console.log(`✓ ${skillFile}: Isolation documentation complete (${foundSections.length}/3 sections)`);
      results.details.push({ test: 'Isolation Documentation', skill: skillFile, status: 'PASS' });
    } else {
      results.failed++;
      console.log(`✗ ${skillFile}: Incomplete isolation documentation (${foundSections.length}/3 sections)`);
      results.details.push({
        test: 'Isolation Documentation',
        skill: skillFile,
        status: 'FAIL',
        reason: `Only ${foundSections.length}/3 required sections found`
      });
    }
  });
}

/**
 * Test 5: Verify skills are not accessible from BMAD agent files
 */
function testBMADAgentIsolation() {
  console.log('\n=== TEST 5: BMAD Agent Isolation (No Cross-References) ===\n');

  const bmadAgentDir = path.join(__dirname, '../../.bmad/bmm/agents');

  if (!fs.existsSync(bmadAgentDir)) {
    console.log('⚠️  BMAD agents directory not found - skipping BMAD isolation test');
    return;
  }

  const bmadAgentFiles = fs.readdirSync(bmadAgentDir)
    .filter(file => file.endsWith('.md'));

  const orchestratorSkillNames = fs.readdirSync(ORCHESTRATOR_SKILLS_DIR)
    .filter(file => file.endsWith('.md') && file !== 'README.md' && file !== 'README-UPDATED.md')
    .map(file => file.replace('.md', ''));

  bmadAgentFiles.forEach(agentFile => {
    results.total++;
    const agentPath = path.join(bmadAgentDir, agentFile);
    const content = fs.readFileSync(agentPath, 'utf-8');

    const referencedSkills = orchestratorSkillNames.filter(skillName =>
      content.includes(skillName)
    );

    if (referencedSkills.length === 0) {
      results.passed++;
      console.log(`✓ ${agentFile}: No orchestrator skill references`);
      results.details.push({ test: 'BMAD Agent Isolation', agent: agentFile, status: 'PASS' });
    } else {
      results.failed++;
      console.log(`✗ ${agentFile}: References orchestrator skills: ${referencedSkills.join(', ')}`);
      results.details.push({
        test: 'BMAD Agent Isolation',
        agent: agentFile,
        status: 'FAIL',
        reason: `References: ${referencedSkills.join(', ')}`
      });
    }
  });
}

/**
 * Generate test report
 */
function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('SKILL ISOLATION VALIDATION REPORT');
  console.log('='.repeat(80));
  console.log(`\nTotal Tests: ${results.total}`);
  console.log(`Passed: ${results.passed} (${((results.passed/results.total)*100).toFixed(1)}%)`);
  console.log(`Failed: ${results.failed} (${((results.failed/results.total)*100).toFixed(1)}%)`);

  if (results.failed > 0) {
    console.log('\n❌ FAILURES DETECTED:\n');
    results.details.filter(d => d.status === 'FAIL').forEach(detail => {
      console.log(`  - ${detail.test}: ${detail.skill || detail.agent}`);
      if (detail.reason) {
        console.log(`    Reason: ${detail.reason}`);
      }
    });
  }

  console.log('\n' + '='.repeat(80));

  if (results.failed === 0) {
    console.log('✅ ALL ISOLATION TESTS PASSED - Skills are properly isolated');
    return 0;
  } else {
    console.log('❌ ISOLATION VALIDATION FAILED - Review failures above');
    return 1;
  }
}

/**
 * Run all tests
 */
function runAllTests() {
  console.log('Orchestrator-EXE Skill Isolation Validation');
  console.log('Testing directory:', ORCHESTRATOR_SKILLS_DIR);

  testIsolationMarkers();
  testInvocationPattern();
  testNoEventEmission();
  testIsolationDocumentation();
  testBMADAgentIsolation();

  const exitCode = generateReport();
  process.exit(exitCode);
}

// Execute tests
runAllTests();
