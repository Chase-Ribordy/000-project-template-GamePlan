#!/bin/bash

###############################################################################
# Parallel Test Execution Script
# Runs all contract tests in parallel terminals
###############################################################################

echo "╔══════════════════════════════════════════════╗"
echo "║   .system Infrastructure Test Suite         ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track PIDs for parallel execution
declare -a PIDS
declare -a NAMES
declare -a RESULTS

# Function to run test in background
run_test() {
  local name=$1
  local command=$2

  echo -e "${BLUE}🚀 Starting:${NC} $name"

  # Run test in background
  eval "$command" > "/tmp/test-${name}.log" 2>&1 &
  local pid=$!

  PIDS+=($pid)
  NAMES+=("$name")
}

# Function to wait for all tests
wait_for_tests() {
  local index=0

  for pid in "${PIDS[@]}"; do
    local name="${NAMES[$index]}"

    echo -e "${YELLOW}⏳ Waiting for:${NC} $name (PID: $pid)"

    if wait $pid; then
      echo -e "${GREEN}✅ PASS:${NC} $name"
      RESULTS[$index]=0
    else
      echo -e "${RED}❌ FAIL:${NC} $name"
      RESULTS[$index]=1

      # Print test output on failure
      echo -e "${RED}Output:${NC}"
      cat "/tmp/test-${name}.log"
    fi

    ((index++))
  done
}

# Function to print summary
print_summary() {
  local total=${#RESULTS[@]}
  local passed=0
  local failed=0

  for result in "${RESULTS[@]}"; do
    if [ $result -eq 0 ]; then
      ((passed++))
    else
      ((failed++))
    fi
  done

  echo ""
  echo "╔══════════════════════════════════════════════╗"
  echo "║            Test Execution Summary            ║"
  echo "╚══════════════════════════════════════════════╝"
  echo ""
  echo "  Total:  $total"
  echo "  Passed: $passed"
  echo "  Failed: $failed"
  echo ""

  if [ $failed -gt 0 ]; then
    echo -e "${RED}❌ Some tests failed.${NC}"
    exit 1
  else
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
  fi
}

# Main execution
main() {
  echo "Starting parallel test execution..."
  echo ""

  # Terminal 1: Contract Compliance Tests
  run_test "contract-tests" "npm run test:contracts"

  # Terminal 2: MCP Integration Tests
  run_test "mcp-tests" "npm run test:mcp"

  # Terminal 3: 4-Level Validation Tests
  run_test "validation-tests" "npm run test:validation"

  echo ""
  echo -e "${BLUE}Running ${#PIDS[@]} test suites in parallel...${NC}"
  echo ""

  # Wait for all tests to complete
  wait_for_tests

  # Print summary
  print_summary
}

# Run main function
main
