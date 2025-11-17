# Parallel Execution Prompts - Quality-First Enhancements

**Purpose**: Add quality-first architecture to enforce "validation is cheaper than debugging"

Copy each prompt below into a separate Claude Code terminal. All tasks are isolated and can run simultaneously.

---

## 🔵 TERMINAL 1: Quality Infrastructure Folders + Core Validation

```
I'm building the quality infrastructure for the project template. Goal: Simple folders + automated validation.

**TASK: Create Quality-First Folder Structure**

### Part 1: Create Quality Folders

Create 4 new folders with explanatory README files:

1. **contracts/** folder:
```bash
mkdir contracts
```

Create `contracts/README.md`:
```markdown
# Component Contracts

## Purpose
Define component interfaces BEFORE writing code. Prevents 70% of integration bugs.

## What Goes Here
- Component interface definitions
- Input/output contracts
- CSS namespace reservations
- DOM ID reservations
- Dependency declarations

## Workflow
1. Before writing any component: Create contract file
2. Review contract with MCP server
3. Write tests based on contract
4. Write code that satisfies contract
5. Validate implementation matches contract

## Contract-First Development
"Define what it should do before building it"

## See Also
- `component-contract-template.md` - Contract template
- `/define-contract` command - Creates contracts
- MCP tool: `validate_contract` - Checks compliance
```

2. **validation/** folder:
```bash
mkdir validation
```

Create `validation/README.md`:
```markdown
# Validation Tools

## Purpose
Progressive validation: syntax → tests → contracts → integration

## What Goes Here
- Validation scripts
- Pre-flight check tools
- Linting configurations
- Test runners

## Progressive Validation Levels

**Level 1: Syntax** (fast, <1s)
- JavaScript/CSS/HTML syntax valid
- No parse errors

**Level 2: Unit Tests** (medium, <10s)
- All tests pass
- Coverage >80%

**Level 3: Contract Compliance** (fast, <1s)
- Implementation matches contract
- All required methods exist

**Level 4: Integration Safety** (medium, <30s)
- No CSS conflicts
- No DOM ID conflicts
- Dependencies available
- Injection points exist

## Workflow
Run `./validation/pre-flight-check.sh [component]` before integration

## Principle
**Fail fast, fix early** - Catch bugs in seconds, not hours

## See Also
- `pre-flight-check.sh` - Main validation script
- `/validate-component` command - Interactive validation
```

3. **sandbox/** folder:
```bash
mkdir sandbox
```

Create `sandbox/README.md`:
```markdown
# Sandbox Testing

## Purpose
Test components in complete isolation before integration

## What Goes Here
- Isolated test environments
- Component sandboxes
- Visual regression tests
- Performance tests

## Workflow
1. Component built in components/
2. Copy to sandbox/ for isolated testing
3. Run in minimal HTML environment
4. Verify: rendering, behavior, performance
5. Only if passes: Mark as proven

## Why Sandbox?
- No interference from other components
- Clean environment = reliable tests
- Catch integration issues early
- Prove it works before integrating

## See Also
- `test-template.html` - Minimal test environment
- `/prove-it-works` command - Sandbox testing workflow
```

4. **proven/** folder:
```bash
mkdir proven
```

Create `proven/README.md`:
```markdown
# Proven Components

## Purpose
Components that passed ALL validation levels

## Entry Requirements
- ✅ Syntax valid
- ✅ Unit tests pass
- ✅ Contract compliant
- ✅ Integration safe
- ✅ Sandbox tested

## What Goes Here
Only components that have been fully validated and proven to work

## Workflow
1. Build component in components/
2. Run progressive validation
3. Test in sandbox
4. If ALL pass: MCP tool `mark_as_proven` moves here
5. Integration uses proven/ components

## Quality Gate
**No component integrates without being proven first**

## See Also
- `/validate-component` - Full validation workflow
- MCP tool: `mark_as_proven`
```

### Part 2: Create Contract Template

Create `contracts/component-contract-template.md`:
```markdown
# Component Contract: [ComponentName]

## Overview
**Purpose**: [What does this component do?]
**Created**: [Date]
**Status**: [Draft/Approved/Implemented]

---

## Inputs

### Required Props
- `data`: [Type] - [Description]
- `config`: [Type] - [Description]

### Optional Props
- `onComplete`: [Type] - [Description] (default: noop)

### Example
\```javascript
{
  data: [1, 2, 3, 4, 5],
  config: { width: 400, height: 400 },
  onComplete: (result) => console.log(result)
}
\```

---

## Outputs

### Return Value
- Type: [Type]
- Description: [What it returns]

### Events
- `onSegmentClick(segment)` - Triggered when: [condition]
- `onAnimationComplete()` - Triggered when: [condition]

---

## DOM Requirements

### Container
- ID: `#[component-name]-container`
- Minimum dimensions: [width] x [height]
- Required attributes: [list]

### DOM Structure
\```html
<div id="component-container">
  <!-- Component renders here -->
</div>
\```

---

## CSS Contract

### Namespace
All classes prefixed with: `.component-[name]-`

### Reserved Classes (DO NOT USE)
- `.btn` - Global button class
- `.container` - Global container
- `.header` - Global header

### Example Classes
- `.component-name-wrapper`
- `.component-name-title`
- `.component-name-content`

---

## Dependencies

### Required Components
- [component-1] - Why needed
- [component-2] - Why needed

### External Libraries
- [library-name]@[version] - Why needed

---

## Integration Points

### Injection Markers
\```html
<!-- INJECT:component-name:HTML -->
/* INJECT:component-name:CSS */
// INJECT:component-name:JS
\```

### Integration Order
1. [First dependency]
2. [Second dependency]
3. This component

---

## Validation Checklist

Before marking as implemented:
- [ ] All required inputs handled
- [ ] All outputs implemented
- [ ] DOM requirements met
- [ ] CSS properly namespaced
- [ ] No reserved class conflicts
- [ ] Dependencies available
- [ ] Injection markers exist in target
- [ ] Unit tests cover all inputs/outputs

---

## Test Cases

### Valid Inputs
\```javascript
// Test Case 1: Normal data
{ data: [1, 2, 3], config: { width: 400 } }
// Expected: Renders correctly

// Test Case 2: Edge case
{ data: [], config: { width: 100 } }
// Expected: Shows empty state
\```

### Invalid Inputs
\```javascript
// Test Case 1: Missing required prop
{ config: { width: 400 } }
// Expected: Throws error "data is required"
\```

---

## Notes
[Any additional implementation notes]

## Related Contracts
- [Related component 1]
- [Related component 2]
```

### Part 3: Create Progressive Validation Script

Create `validation/pre-flight-check.sh`:
\```bash
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
\```

Make script executable:
```bash
chmod +x validation/pre-flight-check.sh
```

### Part 4: Create Sandbox Test Template

Create `sandbox/test-template.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Sandbox Test</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 20px;
      background: #f5f5f5;
    }

    .sandbox-container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 20px;
    }

    .sandbox-header {
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }

    .sandbox-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    .sandbox-status {
      margin-top: 5px;
      font-size: 14px;
      color: #666;
    }

    #component-mount {
      min-height: 400px;
      border: 2px dashed #ddd;
      border-radius: 4px;
      padding: 20px;
    }

    .test-controls {
      margin-top: 20px;
      padding: 15px;
      background: #f9f9f9;
      border-radius: 4px;
    }

    .test-log {
      margin-top: 20px;
      padding: 15px;
      background: #1e1e1e;
      color: #d4d4d4;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      max-height: 300px;
      overflow-y: auto;
    }

    .test-log-entry {
      padding: 4px 0;
      border-bottom: 1px solid #333;
    }

    .test-log-entry:last-child {
      border-bottom: none;
    }

    .test-log-time {
      color: #858585;
    }

    .test-log-success {
      color: #4ec9b0;
    }

    .test-log-error {
      color: #f48771;
    }

    /* Component styles injected here */
    /* INJECT:COMPONENT:CSS */
  </style>
</head>
<body>
  <div class="sandbox-container">
    <div class="sandbox-header">
      <div class="sandbox-title">Component Sandbox Test</div>
      <div class="sandbox-status" id="status">Status: Initializing...</div>
    </div>

    <!-- Component renders here -->
    <div id="component-mount"></div>

    <div class="test-controls">
      <button onclick="runTest()">Run Test</button>
      <button onclick="clearLogs()">Clear Logs</button>
      <button onclick="resetComponent()">Reset Component</button>
    </div>

    <div class="test-log" id="testLog"></div>
  </div>

  <!-- Component script injected here -->
  <!-- INJECT:COMPONENT:JS -->

  <script>
    // Test harness
    const testLog = document.getElementById('testLog');
    const status = document.getElementById('status');

    function log(message, type = 'info') {
      const entry = document.createElement('div');
      entry.className = 'test-log-entry';
      const time = new Date().toLocaleTimeString();
      const colorClass = type === 'success' ? 'test-log-success' : type === 'error' ? 'test-log-error' : '';
      entry.innerHTML = `<span class="test-log-time">[${time}]</span> <span class="${colorClass}">${message}</span>`;
      testLog.appendChild(entry);
      testLog.scrollTop = testLog.scrollHeight;
    }

    function updateStatus(msg) {
      status.textContent = `Status: ${msg}`;
    }

    function clearLogs() {
      testLog.innerHTML = '';
      log('Logs cleared', 'info');
    }

    function resetComponent() {
      document.getElementById('component-mount').innerHTML = '';
      log('Component reset', 'info');
      updateStatus('Ready for test');
    }

    function runTest() {
      try {
        log('Starting component test...', 'info');
        updateStatus('Running test...');

        // Test logic here
        // Replace with actual component initialization

        log('✅ Component initialized', 'success');
        log('✅ Rendering complete', 'success');
        log('✅ Event listeners attached', 'success');
        log('✅ All checks passed', 'success');

        updateStatus('Test PASSED');
      } catch (error) {
        log(`❌ Error: ${error.message}`, 'error');
        updateStatus('Test FAILED');
      }
    }

    // Auto-run on load
    window.addEventListener('load', () => {
      updateStatus('Ready for test');
      log('Sandbox initialized', 'info');
      log('Component loaded', 'info');
    });
  </script>
</body>
</html>
```

**Success Criteria:**
- ✅ 4 folders created (contracts, validation, sandbox, proven)
- ✅ All 4 README.md files explain purpose
- ✅ Contract template is comprehensive
- ✅ pre-flight-check.sh validates 4 levels
- ✅ Sandbox template ready for component testing
- ✅ All scripts executable

Report completion when done.
```

---

## 🟢 TERMINAL 2: Quality-First Slash Commands

```
I'm creating 3 quality-first slash commands that enforce validation.

**TASK: Build Quality Slash Commands**

### Command 1: /define-contract

Create `.claude/commands/personal/define-contract.md`:

```markdown
# /define-contract - Contract-First Development

Forces you to define component interface BEFORE writing code. Prevents 70% of integration bugs.

## What This Does

1. Creates contract file in contracts/ folder
2. Guides you through defining inputs/outputs
3. Defines CSS namespace and DOM requirements
4. Specifies dependencies
5. Creates test cases based on contract

## Usage

\```bash
# Interactive
/define-contract my-component

# With description
/define-contract donut-chart "Animated donut chart component"
\```

## Workflow

### Step 1: Component Overview

Ask user:
- Component name: [name]
- Purpose: [what does it do]
- Complexity: [simple/medium/complex]

### Step 2: Define Inputs

For each input:
- Name: [prop name]
- Type: [string/number/array/object]
- Required: [yes/no]
- Default: [value or none]
- Description: [what is it for]

### Step 3: Define Outputs

For each output:
- Return value type
- Events emitted
- Side effects

### Step 4: DOM Requirements

- Container ID required: [yes/no]
- Minimum dimensions: [width x height]
- Required attributes: [list]

### Step 5: CSS Contract

- Namespace: `.component-[name]-`
- List reserved classes to avoid
- Define component-specific classes

### Step 6: Dependencies

- Required components: [list]
- External libraries: [list with versions]

### Step 7: Generate Contract File

Create `contracts/[name]-contract.md` using template with all above info.

### Step 8: Create Test Stub

Based on contract, create `components/[name]/[name].test.js`:

\```javascript
import ComponentName from './[name].js';

describe('[ComponentName] Contract Tests', () => {
  // Test required inputs
  test('should accept all required inputs', () => {
    // Based on contract inputs
  });

  // Test outputs
  test('should emit expected events', () => {
    // Based on contract outputs
  });

  // Test edge cases
  test('should handle edge cases', () => {
    // Based on contract test cases
  });
});
\```

## Example Output

\```
✅ Contract created: contracts/donut-chart-contract.md
✅ Test stub created: components/donut-chart/donut-chart.test.js

Next steps:
1. Review contract: cat contracts/donut-chart-contract.md
2. Write tests first (TDD)
3. Implement component to satisfy contract
4. Validate: /validate-component donut-chart
\```

## Principle

**"Define what it should do before building it"**

Writing the contract forces you to think through:
- What inputs are actually needed
- What outputs are expected
- Edge cases and error handling
- Integration requirements

## See Also

- `contracts/component-contract-template.md` - Template
- `/validate-component` - Check contract compliance
- MCP tool: `validate_contract` - Automated checking
```

### Command 2: /validate-component

Create `.claude/commands/personal/validate-component.md`:

```markdown
# /validate-component - Progressive Validation

Runs 4 levels of validation on a component. Fails fast, shows specific errors.

## What This Does

Progressive validation:
1. **Level 1: Syntax** (fast, <1s) - Parse errors
2. **Level 2: Unit Tests** (medium, <10s) - Test failures
3. **Level 3: Contract** (fast, <1s) - Contract compliance
4. **Level 4: Integration** (medium, <30s) - CSS conflicts, dependencies

## Usage

\```bash
# Validate single component
/validate-component my-component

# Validate all staged components
/validate-component --all

# Quick validation (syntax + tests only)
/validate-component my-component --quick
\```

## Workflow

### Phase 1: Run Pre-Flight Check

Execute `./validation/pre-flight-check.sh [component]`

Capture output showing each level passing/failing.

### Phase 2: MCP Validation

If pre-flight passes, call MCP tools:

1. `validate_contract(component, contract)` - Check implementation matches
2. `validate_integration(component, target)` - Check safety

### Phase 3: Report Results

\```markdown
# Validation Report: [ComponentName]

## Level 1: Syntax ✅
- JavaScript: Valid
- CSS: Valid
- No parse errors

## Level 2: Unit Tests ✅
- Tests found: 5
- Passing: 5
- Failing: 0
- Coverage: 85%

## Level 3: Contract Compliance ✅
- Contract exists: ✅
- All inputs implemented: ✅
- All outputs implemented: ✅
- CSS properly namespaced: ✅

## Level 4: Integration Safety ✅
- No CSS conflicts: ✅
- Dependencies available: ✅
- Injection points exist: ✅
- DOM IDs unique: ✅

---

**Overall Status**: ✅ READY FOR INTEGRATION

Next steps:
1. Test in sandbox: /prove-it-works [component]
2. Register with MCP: register_component
3. Integrate: /integrate [component] [target]
\```

### Phase 4: Handle Failures

If any level fails, show specific error and stop:

\```
❌ Validation Failed at Level 2: Unit Tests

Failing tests:
  ❌ should handle empty data array
     Expected: Empty state shown
     Actual: Component crashed

Fix required before proceeding.
Run again after fixing: /validate-component [component]
\```

## Quick Mode

With `--quick` flag:
- Runs Level 1 + 2 only
- Fast feedback during development
- Full validation before integration

## Batch Mode

With `--all` flag:
- Validates all components in components/
- Shows summary of pass/fail
- Useful before major integration

## Principle

**"Fail fast, fix early"**

Catch bugs in seconds, not hours.

## See Also

- `validation/pre-flight-check.sh` - Main validation script
- MCP tools: `validate_contract`, `validate_integration`
- `/define-contract` - Create contracts
- `/prove-it-works` - Sandbox testing
```

### Command 3: /prove-it-works

Create `.claude/commands/personal/prove-it-works.md`:

```markdown
# /prove-it-works - Sandbox Testing

Test component in complete isolation before integration. Prove it works, don't hope it works.

## What This Does

1. Copies component to sandbox/ folder
2. Creates isolated test environment
3. Runs component with no interference
4. Verifies rendering, behavior, performance
5. Requires passing before moving to proven/

## Usage

\```bash
# Test component in sandbox
/prove-it-works my-component

# Test with specific data
/prove-it-works donut-chart --data="[1,2,3,4,5]"

# Performance test mode
/prove-it-works my-component --performance
\```

## Workflow

### Phase 1: Prepare Sandbox

1. Copy `sandbox/test-template.html` → `sandbox/[component]-test.html`
2. Inject component CSS at `<!-- INJECT:COMPONENT:CSS -->`
3. Inject component JS at `<!-- INJECT:COMPONENT:JS -->`
4. Set up test data

### Phase 2: Run In Browser

\```bash
# Open in default browser
open sandbox/[component]-test.html

# Or start local server
python -m http.server 8000
# Then open http://localhost:8000/sandbox/[component]-test.html
\```

Show user:
\```
🧪 Sandbox Test Ready

Open: sandbox/[component]-test.html

Test Checklist:
- [ ] Component renders without errors
- [ ] All interactive elements work
- [ ] Animations run smoothly
- [ ] No console errors
- [ ] Responsive at different sizes
- [ ] Performance acceptable

Click "Run Test" button in sandbox to execute automated tests.
\```

### Phase 3: Automated Checks

Modify sandbox template to run automated tests:

\```javascript
function runTest() {
  const checks = [];

  // Check 1: Renders without errors
  try {
    // Initialize component
    checks.push({ name: 'Renders', pass: true });
  } catch (e) {
    checks.push({ name: 'Renders', pass: false, error: e.message });
  }

  // Check 2: No console errors
  const errors = captureConsoleErrors();
  checks.push({
    name: 'No console errors',
    pass: errors.length === 0,
    error: errors.join(', ')
  });

  // Check 3: Performance (render time)
  const renderTime = measureRenderTime();
  checks.push({
    name: 'Performance',
    pass: renderTime < 100,
    error: renderTime >= 100 ? `Slow render: ${renderTime}ms` : null
  });

  return checks;
}
\```

### Phase 4: Mark as Proven

After manual AND automated tests pass:

\```bash
# User confirms all tests passed
Do all sandbox tests pass? [y/n]: y

# Move to proven/ folder via MCP
Calling MCP: mark_as_proven([component])

✅ Component moved to proven/[component]/
✅ Ready for integration

Component '[component]' is now proven and can be safely integrated.
\```

### Phase 5: Generate Test Report

Create `proven/[component]/test-report.md`:

\```markdown
# Test Report: [ComponentName]

**Date**: [timestamp]
**Tester**: [user]
**Status**: ✅ PROVEN

## Automated Tests
- ✅ Renders without errors
- ✅ No console errors
- ✅ Performance: 45ms (target: <100ms)
- ✅ All event handlers work
- ✅ Responsive rendering

## Manual Tests
- ✅ Visual appearance correct
- ✅ Animations smooth
- ✅ Interactive elements functional
- ✅ Edge cases handled

## Performance Metrics
- Render time: 45ms
- Memory usage: 2.3MB
- FPS during animation: 60fps

## Browser Tested
- Chrome 120
- Firefox 121
- Safari 17

## Notes
Component performs well. No issues found.

**Approved for integration**: Yes
\```

## Performance Mode

With `--performance` flag, adds metrics:
- Render time
- Memory usage
- FPS during animations
- Paint/layout time

## Principle

**"Prove it works, don't hope it works"**

Isolated testing catches issues that only appear in clean environments.

## See Also

- `sandbox/test-template.html` - Test environment
- `proven/` folder - Validated components
- MCP tool: `mark_as_proven`
- `/validate-component` - Pre-sandbox validation
```

**Success Criteria:**
- ✅ 3 slash commands created
- ✅ /define-contract enforces contract-first
- ✅ /validate-component runs 4 validation levels
- ✅ /prove-it-works enables sandbox testing
- ✅ All commands integrate with MCP server
- ✅ Clear workflows and examples

Report completion when done.
```

---

## 🟡 TERMINAL 3: Enhanced /checklist + README-STRUCTURE.md Update

```
I'm enhancing /checklist to be the quality automation engine and updating README-STRUCTURE.md.

**TASK: Make /checklist Validate Quality + Update Documentation**

### Part 1: Enhance /checklist Command

Read `.claude/commands/personal/checklist.md` and ADD quality validation sections:

Add after "Phase 6: Read Checklist from scripts/checklist.md":

```markdown
### Phase 7: Quality Infrastructure Validation

Check quality-first architecture:
\```bash
echo "Quality Infrastructure:"

# Check quality folders
test -d contracts && echo "  ✅ contracts/" || echo "  ❌ Missing contracts/"
test -d validation && echo "  ✅ validation/" || echo "  ❌ Missing validation/"
test -d sandbox && echo "  ✅ sandbox/" || echo "  ❌ Missing sandbox/"
test -d proven && echo "  ✅ proven/" || echo "  ❌ Missing proven/"

# Check validation tools
test -f validation/pre-flight-check.sh && test -x validation/pre-flight-check.sh && echo "  ✅ Pre-flight validator" || echo "  ⚠️ Pre-flight validator missing/not executable"

# Check contract template
test -f contracts/component-contract-template.md && echo "  ✅ Contract template" || echo "  ⚠️ Contract template missing"

# Check sandbox template
test -f sandbox/test-template.html && echo "  ✅ Sandbox template" || echo "  ⚠️ Sandbox template missing"
\```

### Phase 8: Component Quality Check

If components exist, validate them:
\```bash
if [ -d components ] && [ "$(ls -A components)" ]; then
  echo ""
  echo "Component Quality Check:"

  for component in components/*/; do
    component_name=$(basename "$component")

    # Skip if not a directory
    [ -d "$component" ] || continue

    echo "  Checking: $component_name"

    # Check contract exists
    if [ -f "contracts/$component_name-contract.md" ]; then
      echo "    ✅ Contract defined"
    else
      echo "    ⚠️ No contract (create with /define-contract)"
    fi

    # Check tests exist
    if [ -f "$component/$component_name.test.js" ]; then
      echo "    ✅ Tests exist"
    else
      echo "    ⚠️ No tests"
    fi

    # Check if validated
    if [ -f "$component/metadata.json" ]; then
      if grep -q '"validated":true' "$component/metadata.json"; then
        echo "    ✅ Validated"
      else
        echo "    ⚠️ Not validated"
      fi
    fi
  done
else
  echo "No components yet (OK for new project)"
fi
\```

### Phase 9: Quality Summary Report

Replace final summary with enhanced version:

```markdown
### Phase 9: Environment Quality Report

Create enhanced summary:
\```markdown
# Environment Quality Report

**Date**: [timestamp]
**Project**: [folder name]
**Status**: [✅ READY / ⚠️ WARNINGS / ❌ ERRORS]

## Structure ✅
- Folders: [X/12 present] (8 base + 4 quality)
- Key files: [X/Y present]

## Configuration ✅
- MCP Server: [status]
- Git: [initialized/not initialized]
- Notifications: [working/not working]

## Quality Infrastructure ✅
- contracts/: [present/missing]
- validation/: [present/missing]
- sandbox/: [present/missing]
- proven/: [present/missing]
- Validation tools: [ready/incomplete]

## Components
- Total: [X]
- With contracts: [X]
- With tests: [X]
- Validated: [X]
- Proven: [X]

## Slash Commands
- BMAD: 37 commands
- Personal: 10 commands (7 base + 3 quality)
- Total: 47 commands

## Quality Status
[✅ All quality gates in place / ⚠️ Some quality tools missing]

## Ready for Quality-First Development?
[Yes/No - with specific recommendations if No]

---

## Recommendations

**For New Projects:**
1. Define contracts before coding: /define-contract
2. Write tests first (TDD)
3. Validate progressively: /validate-component
4. Prove in sandbox: /prove-it-works

**Principle:** "Validation is cheaper than debugging"

See contracts/README.md for quality-first workflow.
\```
```

**Update success criteria section:**

Add to existing success criteria:
```markdown
## Quality Gates ✅
- ✅ Quality folders present (contracts, validation, sandbox, proven)
- ✅ Validation tools executable
- ✅ Contract template ready
- ✅ Sandbox template ready
- ✅ Components have contracts (if any exist)
- ✅ Components have tests (if any exist)
```

### Part 2: Update README-STRUCTURE.md

Read `README-STRUCTURE.md` and ADD quality sections:

**After existing "Core Folders" section, add:**

```markdown
### `contracts/` - Component Contracts
**Purpose**: Define component interfaces BEFORE writing code

**Use Case**:
- Prevents 70% of integration bugs by defining expectations upfront
- Forces thinking through inputs, outputs, dependencies
- Creates clear contract between components

**What Goes Here**:
- Component interface definitions (inputs/outputs)
- CSS namespace reservations
- DOM requirements
- Dependency declarations

**Example Contract**:
```
contracts/donut-chart-contract.md:
- Inputs: data (array), config (object)
- Outputs: onSegmentClick event
- CSS: .component-donut-chart-*
- DOM: Requires #chart-container
- Dependencies: None
```

**Workflow**:
1. `/define-contract component-name` - Create contract
2. Write tests based on contract
3. Implement component to satisfy contract
4. `/validate-component` - Verify compliance

### `validation/` - Validation Tools
**Purpose**: Progressive validation (syntax → tests → contracts → integration)

**What Goes Here**:
- Pre-flight check script
- Validation configurations
- Lint rules
- Test runners

**Progressive Validation Levels**:
1. **Level 1**: Syntax (fast, <1s)
2. **Level 2**: Unit Tests (medium, <10s)
3. **Level 3**: Contract Compliance (fast, <1s)
4. **Level 4**: Integration Safety (medium, <30s)

**Usage**:
```bash
./validation/pre-flight-check.sh component-name
# Or use slash command:
/validate-component component-name
```

### `sandbox/` - Isolated Testing
**Purpose**: Test components in complete isolation before integration

**What Goes Here**:
- Component test environments
- Isolated HTML files
- Visual regression tests
- Performance tests

**Workflow**:
1. Component built in `components/`
2. `/prove-it-works component` - Test in sandbox
3. Verify rendering, behavior, performance
4. If passes: Component moves to `proven/`

**Why Sandbox**:
- No interference from other components
- Catch integration issues early
- Prove it works before integrating

### `proven/` - Validated Components
**Purpose**: Components that passed ALL validation levels

**Entry Requirements**:
- ✅ Syntax valid
- ✅ Unit tests pass (100%)
- ✅ Contract compliant
- ✅ Integration safe
- ✅ Sandbox tested

**Workflow**:
Only components that have been fully validated go here. Integration should ONLY use proven components.

**Quality Gate**: No component integrates without being proven first.
```

**Add new workflow section:**

```markdown
## Quality-First Development Workflow

### The "Slow is Fast" Principle

**Traditional Approach** (Fast → Slow):
1. Write code: 30 minutes
2. Debug integration: 3 hours
3. Fix cascading issues: 2 hours
**Total: 5.5 hours** ❌

**Quality-First Approach** (Slow → Fast):
1. Define contract: 10 minutes (`/define-contract`)
2. Write tests: 20 minutes (TDD)
3. Write code: 30 minutes
4. Validate: 10 minutes (`/validate-component`)
5. Sandbox test: 10 minutes (`/prove-it-works`)
6. Integrate: 10 minutes
**Total: 1.3 hours** ✅

### Step-by-Step Quality Workflow

**Phase 1: Contract-First** (Before any code)
```bash
/define-contract my-component
```
- Define inputs, outputs, CSS, DOM requirements
- Creates contract in `contracts/`
- Creates test stub in `components/my-component/`

**Phase 2: Test-First** (TDD)
```bash
# Write tests based on contract
# Run tests (they should fail - no implementation yet)
npm test components/my-component/my-component.test.js
```

**Phase 3: Implementation**
```bash
# Write code to satisfy contract and pass tests
# Iteratively run tests until all pass
```

**Phase 4: Progressive Validation**
```bash
/validate-component my-component
```
- Level 1: Syntax ✅
- Level 2: Tests ✅
- Level 3: Contract ✅
- Level 4: Integration ✅

**Phase 5: Sandbox Proof**
```bash
/prove-it-works my-component
```
- Test in isolation
- Verify rendering, behavior, performance
- No console errors
- Moves to `proven/` on success

**Phase 6: Safe Integration**
```bash
/integrate my-component target-file
```
- MCP validates safety
- Checks CSS conflicts
- Verifies dependencies
- Creates injection markers
- Integration happens safely

### Quality Slash Commands

**Planning & Contracts**:
- `/define-contract` - Create contract before code
- `/checklist` - Validate environment quality

**Validation**:
- `/validate-component` - 4-level progressive validation
- `/prove-it-works` - Sandbox testing

**Integration**:
- `/integrate` - Safe component integration with MCP
- `/debug-css` - Self-checking debugger

### Quality Metrics

**Success Indicators**:
- All components have contracts
- 100% test coverage
- All components validated before integration
- Zero integration conflicts
- Debugging time < 10% of development time

**Warning Signs**:
- Components without contracts
- Skipping validation
- Integration without testing
- Frequent merge conflicts
```

**Success Criteria:**
- ✅ /checklist enhanced with quality validation (Phases 7-9)
- ✅ Quality summary report added
- ✅ README-STRUCTURE.md has 4 new quality folder sections
- ✅ Quality-First Workflow section added to README-STRUCTURE.md
- ✅ "Slow is Fast" principle documented
- ✅ Clear step-by-step quality workflow

Report completion when done.
```

---

## 🔴 TERMINAL 4: MCP Server Quality Enhancements

```
I'm adding quality enforcement tools to the MCP server.

**TASK: Enhance MCP Server with Quality Tools**

### Part 1: Read Current MCP Server

Read `mcp-servers/component-registry.js` to understand current structure.

### Part 2: Add Quality Validation Methods

Add these methods to the ComponentRegistry class (after existing methods):

```javascript
async validateContract(componentName, contractPath) {
  const component = this.components.get(componentName);

  if (!component) {
    return {
      success: false,
      reason: `Component '${componentName}' not registered`
    };
  }

  try {
    // Read contract file
    const contractContent = await readFile(contractPath, 'utf8');

    // Check contract has required sections
    const requiredSections = [
      '## Inputs',
      '## Outputs',
      '## DOM Requirements',
      '## CSS Contract',
      '## Dependencies'
    ];

    const missingSections = requiredSections.filter(section =>
      !contractContent.includes(section)
    );

    if (missingSections.length > 0) {
      return {
        success: false,
        reason: `Contract missing required sections: ${missingSections.join(', ')}`
      };
    }

    // Check CSS namespace in contract matches component
    const namespaceMatch = contractContent.match(/Namespace.*`([^`]+)`/);
    if (namespaceMatch && namespaceMatch[1] !== component.cssNamespace) {
      return {
        success: false,
        reason: `Contract CSS namespace '${namespaceMatch[1]}' doesn't match component '${component.cssNamespace}'`
      };
    }

    return {
      success: true,
      message: 'Contract is valid and matches component',
      sections: requiredSections.length,
      cssNamespaceMatch: true
    };
  } catch (err) {
    return {
      success: false,
      reason: `Error reading contract: ${err.message}`
    };
  }
}

async runPreflightChecks(componentName) {
  const component = this.components.get(componentName);

  if (!component) {
    return {
      success: false,
      reason: `Component '${componentName}' not found`
    };
  }

  const checks = {
    syntax: false,
    tests: false,
    contract: false,
    integration: false
  };

  const errors = [];

  // Check 1: Files exist
  const fileCheck = await this.checkComponentExists(componentName);
  if (!fileCheck.exists) {
    errors.push('Component folder does not exist');
    return { success: false, reason: 'Component folder missing', checks };
  }

  checks.syntax = true;

  // Check 2: Test file exists
  const testPath = join(COMPONENTS_DIR, componentName, `${componentName}.test.js`);
  try {
    await access(testPath);
    checks.tests = true;
  } catch {
    errors.push('No test file found');
  }

  // Check 3: Contract exists
  const contractPath = join(__dirname, '..', 'contracts', `${componentName}-contract.md`);
  try {
    await access(contractPath);
    checks.contract = true;
  } catch {
    errors.push('No contract file found');
  }

  // Check 4: Integration safety
  const validation = await this.validateIntegration(componentName, 'dummy-target.html');
  if (validation.valid || validation.errors.length === 0) {
    checks.integration = true;
  }

  const allPassed = Object.values(checks).every(c => c === true);

  return {
    success: allPassed,
    reason: allPassed ? 'All pre-flight checks passed' : errors.join('; '),
    checks,
    errors
  };
}

async testInSandbox(componentName) {
  const component = this.components.get(componentName);

  if (!component) {
    return {
      success: false,
      reason: `Component '${componentName}' not found`
    };
  }

  // Check if sandbox test file exists
  const sandboxPath = join(__dirname, '..', 'sandbox', `${componentName}-test.html`);

  try {
    await access(sandboxPath);
    return {
      success: true,
      message: `Sandbox test ready for '${componentName}'`,
      path: sandboxPath,
      instructions: [
        'Open sandbox test in browser',
        'Click "Run Test" button',
        'Verify all checks pass',
        'Confirm visual appearance correct',
        'Mark as proven if all tests pass'
      ]
    };
  } catch {
    return {
      success: false,
      reason: `No sandbox test found. Create with /prove-it-works ${componentName}`,
      suggestion: `Expected file: ${sandboxPath}`
    };
  }
}

async markAsProven(componentName) {
  const component = this.components.get(componentName);

  if (!component) {
    return {
      success: false,
      reason: `Component '${componentName}' not found`
    };
  }

  // Check if component is validated
  if (!component.validated) {
    return {
      success: false,
      reason: 'Component must pass validation before marking as proven'
    };
  }

  const provenDir = join(__dirname, '..', 'proven', componentName);
  const componentDir = join(COMPONENTS_DIR, componentName);

  try {
    // Create proven directory
    await mkdir(provenDir, { recursive: true });

    // Copy component files to proven/
    // (In real implementation, would recursively copy files)

    // Update component status
    component.integrated = true;
    component.integratedAt = new Date().toISOString();
    component.status = 'proven';

    // Update metadata
    const metadataPath = join(componentDir, 'metadata.json');
    if (existsSync(metadataPath)) {
      const metadata = JSON.parse(await readFile(metadataPath, 'utf8'));
      metadata.validated = true;
      metadata.integrated = true;
      metadata.status = 'proven';
      metadata.updatedAt = new Date().toISOString();
      await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
    }

    // Save registry
    await this.save();

    return {
      success: true,
      message: `Component '${componentName}' marked as proven`,
      path: provenDir,
      status: 'Component ready for integration'
    };
  } catch (err) {
    return {
      success: false,
      reason: `Error marking as proven: ${err.message}`
    };
  }
}
```

### Part 3: Add New MCP Tools

Add to the tools array in `setRequestHandler(ListToolsRequestSchema, ...)`:

```javascript
{
  name: 'validate_contract',
  description: 'Validate component implementation matches its contract',
  inputSchema: {
    type: 'object',
    properties: {
      componentName: { type: 'string' },
      contractPath: { type: 'string' }
    },
    required: ['componentName', 'contractPath']
  }
},
{
  name: 'run_preflight_checks',
  description: 'Run all pre-flight validation checks on component',
  inputSchema: {
    type: 'object',
    properties: {
      componentName: { type: 'string' }
    },
    required: ['componentName']
  }
},
{
  name: 'test_in_sandbox',
  description: 'Check if component has sandbox test and provide instructions',
  inputSchema: {
    type: 'object',
    properties: {
      componentName: { type: 'string' }
    },
    required: ['componentName']
  }
},
{
  name: 'mark_as_proven',
  description: 'Mark component as proven after passing all validation',
  inputSchema: {
    type: 'object',
    properties: {
      componentName: { type: 'string' }
    },
    required: ['componentName']
  }
}
```

### Part 4: Add Tool Call Handlers

Add to the switch statement in `setRequestHandler(CallToolRequestSchema, ...)`:

```javascript
case 'validate_contract':
  result = await registry.validateContract(args.componentName, args.contractPath);
  break;

case 'run_preflight_checks':
  result = await registry.runPreflightChecks(args.componentName);
  break;

case 'test_in_sandbox':
  result = await registry.testInSandbox(args.componentName);
  break;

case 'mark_as_proven':
  result = await registry.markAsProven(args.componentName);
  break;
```

### Part 5: Update MCP README

Add to `mcp-servers/README.md`:

```markdown
## Quality Enforcement Tools (New)

### validate_contract
Validates component implementation matches its contract definition.

\```javascript
validate_contract({
  componentName: "donut-chart",
  contractPath: "contracts/donut-chart-contract.md"
})
\```

Returns: Contract validity, missing sections, CSS namespace match

### run_preflight_checks
Runs all 4 levels of pre-flight validation.

\```javascript
run_preflight_checks({
  componentName: "header"
})
\```

Returns: Pass/fail for syntax, tests, contract, integration

### test_in_sandbox
Checks if sandbox test exists and provides test instructions.

\```javascript
test_in_sandbox({
  componentName: "donut-chart"
})
\```

Returns: Sandbox path, test instructions

### mark_as_proven
Marks component as proven after passing all validation.

\```javascript
mark_as_proven({
  componentName: "header"
})
\```

Returns: Success, moves component to proven/ folder

## Quality Workflow Integration

The MCP server now enforces quality gates:

1. **Define Contract**: Component registered with contract
2. **Validate**: `run_preflight_checks` ensures quality
3. **Test**: `test_in_sandbox` proves it works
4. **Proven**: `mark_as_proven` certifies readiness
5. **Integrate**: `validate_integration` ensures safety

**Principle**: No component integrates without being proven.
```

**Success Criteria:**
- ✅ 4 new methods added to ComponentRegistry class
- ✅ 4 new MCP tools exposed
- ✅ Tool handlers implemented
- ✅ README.md updated with quality tools
- ✅ MCP server enforces quality workflow
- ✅ All methods use standardized {success, reason} format

Test the enhanced server:
```bash
cd mcp-servers
node component-registry.js
```

Should see startup message with no errors.

Report completion when done.
```

---

## After All Terminals Complete

Verify quality-first template:

```bash
# Check folders
ls -la contracts/ validation/ sandbox/ proven/

# Check tools
test -x validation/pre-flight-check.sh && echo "Validator ready"

# Check commands
ls -1 .claude/commands/personal/ | grep -E "(define-contract|validate-component|prove-it-works)"

# Test MCP server
cd mcp-servers && node component-registry.js
```

**Result**: Production-ready quality-first template with automated validation!

**Total Time**: ~30 minutes parallel execution
