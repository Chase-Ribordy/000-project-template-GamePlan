#!/bin/bash

# Progressive Component Validation
# Usage: ./validation/pre-flight-check.sh <component-name>

COMPONENT=$1
COMPONENT_PATH="components/$COMPONENT"

if [ -z "$COMPONENT" ]; then
  echo "Usage: ./pre-flight-check.sh <component-name>"
  exit 1
fi

echo "🔍 Running Pre-Flight Validation for: $COMPONENT"
echo "======================================"

# Level 1: Syntax Validation (Fast)
echo ""
echo "Level 1: Syntax Validation..."

if [ -f "$COMPONENT_PATH/$COMPONENT.js" ]; then
  # Check JavaScript syntax
  node --check "$COMPONENT_PATH/$COMPONENT.js" 2>/dev/null
  if [ $? -eq 0 ]; then
    echo "  ✅ JavaScript syntax valid"
  else
    echo "  ❌ JavaScript syntax errors"
    exit 1
  fi
else
  echo "  ⚠️  No .js file found (OK if CSS/HTML only)"
fi

if [ -f "$COMPONENT_PATH/$COMPONENT.css" ]; then
  # Basic CSS validation (no parse errors)
  grep -E "(^[^{]*{[^}]*})" "$COMPONENT_PATH/$COMPONENT.css" > /dev/null
  if [ $? -eq 0 ]; then
    echo "  ✅ CSS syntax appears valid"
  else
    echo "  ❌ CSS syntax may have errors"
    exit 1
  fi
else
  echo "  ⚠️  No .css file found"
fi

# Level 2: Unit Tests (Medium)
echo ""
echo "Level 2: Unit Tests..."

if [ -f "$COMPONENT_PATH/$COMPONENT.test.js" ]; then
  # Check if test file has actual tests
  if grep -q "test\|describe\|it(" "$COMPONENT_PATH/$COMPONENT.test.js"; then
    echo "  ✅ Test file exists with test cases"

    # Run tests if npm available
    if command -v npm &> /dev/null; then
      npm test "$COMPONENT_PATH/$COMPONENT.test.js" --silent 2>&1 | grep -E "(passing|failing)"
      if [ ${PIPESTATUS[0]} -eq 0 ]; then
        echo "  ✅ All tests passing"
      else
        echo "  ❌ Tests failing"
        exit 1
      fi
    else
      echo "  ⚠️  npm not available, skipping test execution"
    fi
  else
    echo "  ❌ Test file exists but has no tests"
    exit 1
  fi
else
  echo "  ❌ No test file found - tests required"
  exit 1
fi

# Level 3: Contract Compliance (Fast)
echo ""
echo "Level 3: Contract Compliance..."

if [ -f "contracts/$COMPONENT-contract.md" ]; then
  echo "  ✅ Contract file exists"

  # Check if contract is approved (not draft)
  if grep -q "Status.*Approved\|Status.*Implemented" "contracts/$COMPONENT-contract.md"; then
    echo "  ✅ Contract approved"
  else
    echo "  ⚠️  Contract still in draft"
  fi
else
  echo "  ❌ No contract found - create with /define-contract"
  exit 1
fi

# Level 4: Integration Safety (Medium)
echo ""
echo "Level 4: Integration Safety..."

# Check CSS namespace
if [ -f "$COMPONENT_PATH/$COMPONENT.css" ]; then
  if grep -q "\.component-$COMPONENT" "$COMPONENT_PATH/$COMPONENT.css"; then
    echo "  ✅ CSS properly namespaced"
  else
    echo "  ⚠️  CSS may not be properly namespaced"
  fi
fi

# Check for metadata
if [ -f "$COMPONENT_PATH/metadata.json" ]; then
  echo "  ✅ Metadata file exists"
else
  echo "  ⚠️  No metadata.json (will be created on registration)"
fi

# Final Summary
echo ""
echo "======================================"
echo "✅ Pre-Flight Validation PASSED"
echo ""
echo "Component '$COMPONENT' is ready for:"
echo "  1. Sandbox testing (/prove-it-works)"
echo "  2. MCP registration (register_component)"
echo "  3. Integration (/integrate)"
echo ""
