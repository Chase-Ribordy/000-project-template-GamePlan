/**
 * MCP Contract Integration Test
 *
 * Validates that orchestrator-exe's contract-orchestrator skill properly
 * integrates with MCP contract validation system.
 *
 * Tests:
 * 1. Markdown contract reading
 * 2. YAML contract generation
 * 3. Contract schema validation
 * 4. MCP compatibility verification
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Test configuration
const EXAMPLES_DIR = path.join(__dirname, '../../.system/parallel-work/examples');
const CONTRACTS_DIR = path.join(__dirname, '../../.bmad/bmm/contracts');

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
 * Test 1: Verify contract-orchestrator skill exists
 */
function testContractOrchestratorSkillExists() {
  console.log('\n=== TEST 1: Contract Orchestrator Skill Existence ===\n');
  results.total++;

  const skillPath = path.join(__dirname, '../../.claude/skills/orchestrator-exe/contract-orchestrator.md');

  if (fs.existsSync(skillPath)) {
    results.passed++;
    console.log('✓ contract-orchestrator.md skill file exists');
    results.details.push({ test: 'Skill Exists', status: 'PASS' });
  } else {
    results.failed++;
    console.log('✗ contract-orchestrator.md skill file NOT FOUND');
    results.details.push({
      test: 'Skill Exists',
      status: 'FAIL',
      reason: 'Skill file missing'
    });
  }
}

/**
 * Test 2: Verify YAML contracts in examples are valid YAML
 */
function testExampleYAMLContractsValid() {
  console.log('\n=== TEST 2: Example YAML Contracts Validation ===\n');

  const yamlContractsDoc = path.join(EXAMPLES_DIR, 'yaml-contracts-autonomous.md');

  if (!fs.existsSync(yamlContractsDoc)) {
    console.log('⚠️  yaml-contracts-autonomous.md not found - skipping YAML validation');
    return;
  }

  results.total++;
  const content = fs.readFileSync(yamlContractsDoc, 'utf-8');

  // Extract YAML blocks from markdown
  const yamlBlockRegex = /```yaml\n([\s\S]*?)\n```/g;
  let match;
  let yamlBlocksFound = 0;
  let validYamlBlocks = 0;

  while ((match = yamlBlockRegex.exec(content)) !== null) {
    yamlBlocksFound++;
    const yamlContent = match[1];

    try {
      yaml.load(yamlContent);
      validYamlBlocks++;
      console.log(`✓ YAML block ${yamlBlocksFound}: Valid YAML syntax`);
    } catch (e) {
      console.log(`✗ YAML block ${yamlBlocksFound}: Invalid YAML - ${e.message}`);
    }
  }

  if (yamlBlocksFound === validYamlBlocks && yamlBlocksFound > 0) {
    results.passed++;
    console.log(`\n✓ All ${yamlBlocksFound} YAML blocks are valid`);
    results.details.push({
      test: 'YAML Syntax Validation',
      status: 'PASS',
      details: `${validYamlBlocks}/${yamlBlocksFound} blocks valid`
    });
  } else if (yamlBlocksFound === 0) {
    results.warnings++;
    console.log('\n⚠️  No YAML blocks found in example document');
    results.details.push({
      test: 'YAML Syntax Validation',
      status: 'WARNING',
      reason: 'No YAML blocks found'
    });
  } else {
    results.failed++;
    console.log(`\n✗ ${yamlBlocksFound - validYamlBlocks}/${yamlBlocksFound} YAML blocks invalid`);
    results.details.push({
      test: 'YAML Syntax Validation',
      status: 'FAIL',
      reason: `${yamlBlocksFound - validYamlBlocks} invalid YAML blocks`
    });
  }
}

/**
 * Test 3: Verify contract schema completeness
 */
function testContractSchemaCompleteness() {
  console.log('\n=== TEST 3: Contract Schema Completeness ===\n');

  const yamlContractsDoc = path.join(EXAMPLES_DIR, 'yaml-contracts-autonomous.md');

  if (!fs.existsSync(yamlContractsDoc)) {
    console.log('⚠️  yaml-contracts-autonomous.md not found - skipping schema validation');
    return;
  }

  results.total++;
  const content = fs.readFileSync(yamlContractsDoc, 'utf-8');

  // Required fields for a complete contract
  const requiredFields = [
    'contract_id',
    'contract_version',
    'integration_points',
    'error_handling',
    'testing_requirements',
    'acceptance_criteria',
    'mcp_validation'
  ];

  const yamlBlockRegex = /```yaml\n([\s\S]*?)\n```/g;
  let match;
  let contractsChecked = 0;
  let completeContracts = 0;

  while ((match = yamlBlockRegex.exec(content)) !== null) {
    const yamlContent = match[1];

    try {
      const contract = yaml.load(yamlContent);

      // Only check if it looks like a contract (has contract_id)
      if (contract && contract.contract_id) {
        contractsChecked++;
        const missingFields = requiredFields.filter(field => !contract[field]);

        if (missingFields.length === 0) {
          completeContracts++;
          console.log(`✓ Contract "${contract.contract_id}": Complete schema`);
        } else {
          console.log(`✗ Contract "${contract.contract_id}": Missing fields - ${missingFields.join(', ')}`);
        }
      }
    } catch (e) {
      // Skip invalid YAML (already caught in Test 2)
    }
  }

  if (contractsChecked === completeContracts && contractsChecked > 0) {
    results.passed++;
    console.log(`\n✓ All ${contractsChecked} contracts have complete schemas`);
    results.details.push({
      test: 'Contract Schema Completeness',
      status: 'PASS',
      details: `${completeContracts}/${contractsChecked} contracts complete`
    });
  } else if (contractsChecked === 0) {
    results.warnings++;
    console.log('\n⚠️  No contract YAML blocks found');
    results.details.push({
      test: 'Contract Schema Completeness',
      status: 'WARNING',
      reason: 'No contracts found'
    });
  } else {
    results.failed++;
    console.log(`\n✗ ${contractsChecked - completeContracts}/${contractsChecked} contracts incomplete`);
    results.details.push({
      test: 'Contract Schema Completeness',
      status: 'FAIL',
      reason: `${contractsChecked - completeContracts} contracts missing required fields`
    });
  }
}

/**
 * Test 4: Verify MCP validation metadata present
 */
function testMCPValidationMetadata() {
  console.log('\n=== TEST 4: MCP Validation Metadata ===\n');

  const yamlContractsDoc = path.join(EXAMPLES_DIR, 'yaml-contracts-autonomous.md');

  if (!fs.existsSync(yamlContractsDoc)) {
    console.log('⚠️  yaml-contracts-autonomous.md not found - skipping MCP validation test');
    return;
  }

  results.total++;
  const content = fs.readFileSync(yamlContractsDoc, 'utf-8');

  const mcpRequiredFields = [
    'validator',
    'validation_rules',
    'validation_result',
    'ready_for_autonomous_execution'
  ];

  const yamlBlockRegex = /```yaml\n([\s\S]*?)\n```/g;
  let match;
  let contractsWithMCP = 0;
  let contractsChecked = 0;

  while ((match = yamlBlockRegex.exec(content)) !== null) {
    const yamlContent = match[1];

    try {
      const contract = yaml.load(yamlContent);

      if (contract && contract.contract_id && contract.mcp_validation) {
        contractsChecked++;
        const missingMCPFields = mcpRequiredFields.filter(
          field => !contract.mcp_validation[field]
        );

        if (missingMCPFields.length === 0) {
          contractsWithMCP++;
          console.log(`✓ Contract "${contract.contract_id}": MCP validation metadata complete`);
        } else {
          console.log(`✗ Contract "${contract.contract_id}": Missing MCP fields - ${missingMCPFields.join(', ')}`);
        }
      }
    } catch (e) {
      // Skip invalid YAML
    }
  }

  if (contractsChecked === contractsWithMCP && contractsChecked > 0) {
    results.passed++;
    console.log(`\n✓ All ${contractsChecked} contracts have complete MCP validation metadata`);
    results.details.push({
      test: 'MCP Validation Metadata',
      status: 'PASS',
      details: `${contractsWithMCP}/${contractsChecked} contracts with MCP metadata`
    });
  } else if (contractsChecked === 0) {
    results.warnings++;
    console.log('\n⚠️  No contracts with MCP validation found');
    results.details.push({
      test: 'MCP Validation Metadata',
      status: 'WARNING',
      reason: 'No contracts with MCP validation'
    });
  } else {
    results.failed++;
    console.log(`\n✗ ${contractsChecked - contractsWithMCP}/${contractsChecked} contracts missing MCP metadata`);
    results.details.push({
      test: 'MCP Validation Metadata',
      status: 'FAIL',
      reason: `${contractsChecked - contractsWithMCP} contracts incomplete`
    });
  }
}

/**
 * Test 5: Verify autonomous execution plan present
 */
function testAutonomousExecutionPlan() {
  console.log('\n=== TEST 5: Autonomous Execution Plan ===\n');

  const yamlContractsDoc = path.join(EXAMPLES_DIR, 'yaml-contracts-autonomous.md');

  if (!fs.existsSync(yamlContractsDoc)) {
    console.log('⚠️  yaml-contracts-autonomous.md not found - skipping execution plan test');
    return;
  }

  results.total++;
  const content = fs.readFileSync(yamlContractsDoc, 'utf-8');

  const yamlBlockRegex = /```yaml\n([\s\S]*?)\n```/g;
  let match;
  let contractsWithPlan = 0;
  let contractsChecked = 0;

  while ((match = yamlBlockRegex.exec(content)) !== null) {
    const yamlContent = match[1];

    try {
      const contract = yaml.load(yamlContent);

      if (contract && contract.contract_id) {
        contractsChecked++;

        if (contract.autonomous_execution || contract.autonomous_execution_plan) {
          contractsWithPlan++;
          console.log(`✓ Contract "${contract.contract_id}": Autonomous execution plan present`);
        } else {
          console.log(`⚠️  Contract "${contract.contract_id}": No autonomous execution plan`);
        }
      }
    } catch (e) {
      // Skip invalid YAML
    }
  }

  if (contractsChecked === contractsWithPlan && contractsChecked > 0) {
    results.passed++;
    console.log(`\n✓ All ${contractsChecked} contracts have autonomous execution plans`);
    results.details.push({
      test: 'Autonomous Execution Plan',
      status: 'PASS',
      details: `${contractsWithPlan}/${contractsChecked} contracts with plans`
    });
  } else if (contractsChecked === 0) {
    results.warnings++;
    console.log('\n⚠️  No contracts found');
    results.details.push({
      test: 'Autonomous Execution Plan',
      status: 'WARNING',
      reason: 'No contracts found'
    });
  } else {
    results.warnings++;  // Warning, not failure (execution plan is optional for manual mode)
    console.log(`\n⚠️  ${contractsChecked - contractsWithPlan}/${contractsChecked} contracts without execution plans`);
    results.details.push({
      test: 'Autonomous Execution Plan',
      status: 'WARNING',
      reason: `${contractsChecked - contractsWithPlan} contracts without plans (may be intentional for manual mode)`
    });
  }
}

/**
 * Generate test report
 */
function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('MCP CONTRACT INTEGRATION VALIDATION REPORT');
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
    console.log('✅ MCP CONTRACT INTEGRATION TESTS PASSED');
    console.log('   Contract orchestration is properly configured for MCP validation');
    return 0;
  } else if (results.failed === 0 && results.warnings > 0) {
    console.log('⚠️  MCP CONTRACT INTEGRATION TESTS PASSED WITH WARNINGS');
    console.log('   Review warnings above - may be acceptable');
    return 0;
  } else {
    console.log('❌ MCP CONTRACT INTEGRATION VALIDATION FAILED');
    return 1;
  }
}

/**
 * Run all tests
 */
function runAllTests() {
  console.log('Orchestrator-EXE MCP Contract Integration Validation');
  console.log('Testing directory:', EXAMPLES_DIR);

  testContractOrchestratorSkillExists();
  testExampleYAMLContractsValid();
  testContractSchemaCompleteness();
  testMCPValidationMetadata();
  testAutonomousExecutionPlan();

  const exitCode = generateReport();
  process.exit(exitCode);
}

// Execute tests
runAllTests();
