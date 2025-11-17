#!/bin/bash

# Orchestrator-EXE Integration Validation Test Runner
# Runs all validation tests and generates comprehensive report

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RESULTS_FILE="$SCRIPT_DIR/validation-results.txt"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "═══════════════════════════════════════════════════════════════════════════"
echo "ORCHESTRATOR-EXE INTEGRATION VALIDATION TEST SUITE"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo "Running all validation tests..."
echo ""

# Initialize results file
echo "Orchestrator-EXE Validation Results" > "$RESULTS_FILE"
echo "Generated: $(date)" >> "$RESULTS_FILE"
echo "════════════════════════════════════════════════════════════════" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test 1: Skill Isolation
echo "───────────────────────────────────────────────────────────────────────────"
echo "TEST 1: Skill Isolation Validation"
echo "───────────────────────────────────────────────────────────────────────────"

if node "$SCRIPT_DIR/skill-isolation-test.js" >> "$RESULTS_FILE" 2>&1; then
  echo -e "${GREEN}✓ Skill isolation tests PASSED${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
  echo "PASSED: Skill Isolation" >> "$RESULTS_FILE"
else
  echo -e "${RED}✗ Skill isolation tests FAILED${NC}"
  FAILED_TESTS=$((FAILED_TESTS + 1))
  echo "FAILED: Skill Isolation" >> "$RESULTS_FILE"
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo "" >> "$RESULTS_FILE"

# Test 2: MCP Contract Integration
echo ""
echo "───────────────────────────────────────────────────────────────────────────"
echo "TEST 2: MCP Contract Integration Validation"
echo "───────────────────────────────────────────────────────────────────────────"

if node "$SCRIPT_DIR/mcp-integration-test.js" >> "$RESULTS_FILE" 2>&1; then
  echo -e "${GREEN}✓ MCP contract integration tests PASSED${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
  echo "PASSED: MCP Contract Integration" >> "$RESULTS_FILE"
else
  echo -e "${RED}✗ MCP contract integration tests FAILED${NC}"
  FAILED_TESTS=$((FAILED_TESTS + 1))
  echo "FAILED: MCP Contract Integration" >> "$RESULTS_FILE"
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo "" >> "$RESULTS_FILE"

# Test 3: Parallel Session Tracking
echo ""
echo "───────────────────────────────────────────────────────────────────────────"
echo "TEST 3: Parallel Session Tracking Validation"
echo "───────────────────────────────────────────────────────────────────────────"

if node "$SCRIPT_DIR/parallel-session-tracking-test.js" >> "$RESULTS_FILE" 2>&1; then
  echo -e "${GREEN}✓ Parallel session tracking tests PASSED${NC}"
  PASSED_TESTS=$((PASSED_TESTS + 1))
  echo "PASSED: Parallel Session Tracking" >> "$RESULTS_FILE"
else
  echo -e "${RED}✗ Parallel session tracking tests FAILED${NC}"
  FAILED_TESTS=$((FAILED_TESTS + 1))
  echo "FAILED: Parallel Session Tracking" >> "$RESULTS_FILE"
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo "" >> "$RESULTS_FILE"

# Generate final report
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo "VALIDATION SUMMARY"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo "Total test suites: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
echo ""

echo "════════════════════════════════════════════════════════════════" >> "$RESULTS_FILE"
echo "VALIDATION SUMMARY" >> "$RESULTS_FILE"
echo "════════════════════════════════════════════════════════════════" >> "$RESULTS_FILE"
echo "Total test suites: $TOTAL_TESTS" >> "$RESULTS_FILE"
echo "Passed: $PASSED_TESTS" >> "$RESULTS_FILE"
echo "Failed: $FAILED_TESTS" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

if [ $FAILED_TESTS -eq 0 ]; then
  echo -e "${GREEN}✅ ALL VALIDATION TESTS PASSED${NC}"
  echo "✅ ALL VALIDATION TESTS PASSED" >> "$RESULTS_FILE"
  echo ""
  echo "Orchestrator-EXE is properly configured and ready for use."
  echo ""
  echo "Validation report saved to: $RESULTS_FILE"
  exit 0
else
  echo -e "${RED}❌ SOME VALIDATION TESTS FAILED${NC}"
  echo "❌ SOME VALIDATION TESTS FAILED" >> "$RESULTS_FILE"
  echo ""
  echo "Review failures in: $RESULTS_FILE"
  echo ""
  exit 1
fi
