# Component Validation Skill

**Autonomy Level:** Fully Autonomous

**Purpose:** Automatically run 4-level progressive validation on components after contract creation, ensuring quality and integration safety.

## Trigger Conditions

### Auto-Triggers
- **Event:** `contract_created`
  - **Condition:** None (always validate after contract creation)
  - **Priority:** 2 (after contract creation)
  - **Emitted by:** `contract-creation` skill

- **Event:** `component_modified`
  - **Condition:** `requires_revalidation == true`
  - **Priority:** 3
  - **Emitted by:** Manual edits or fixes

### Manual Triggers
- "validate {component_name}"
- "check {component_name}"
- "run validation on {component_name}"
- "Is {component} ready?"

## Skill Workflow

When this skill is triggered (automatically after `contract_created` event):

### 1. Load Component and Contract

Read files:
- `.system/components/{component_name}/` - Component files
- `.system/contracts/{component_name}-contract.md` - Contract specification

### 2. Run 4-Level Validation

#### Level 1: Syntax Check (fast, <1s)

**Purpose:** Ensure code is syntactically valid

**Checks:**
- **HTML validation:**
  - Well-formed markup
  - No unclosed tags
  - Valid attributes
  - Accessible markup (alt text, ARIA labels)

- **CSS validation:**
  - Valid selectors
  - No syntax errors
  - Proper property values
  - No vendor prefix errors

- **JavaScript validation (if applicable):**
  - No syntax errors
  - Proper function declarations
  - Valid ES6+ syntax
  - No undefined variables

**Output:**
```
Level 1: Syntax Check
├─ HTML: ✓ Valid (12 lines)
├─ CSS: ✓ Valid (45 lines, 8 selectors)
└─ JS: ✓ Valid (23 lines, 2 functions)
```

#### Level 2: Unit Tests (medium, <10s)

**Purpose:** Verify component logic works correctly

**Checks:**
- Run test suite at `.system/components/{component_name}/*.test.js`
- Check test coverage
- Verify all public methods tested
- Check edge cases covered

**Auto-generate tests if missing:**
- Basic render test
- Props validation test
- Event emission test
- Edge case tests

**Output:**
```
Level 2: Unit Tests
├─ Tests found: 5
├─ Tests passed: 5/5 ✓
├─ Coverage: 92%
└─ Edge cases: 3/3 covered ✓
```

#### Level 3: Contract Compliance (fast, <1s)

**Purpose:** Ensure component matches its contract specification

**Checks:**

**CSS Namespace Compliance:**
- All CSS classes use namespace prefix (`.{component_name}-`)
- No global class conflicts
- Animation names namespaced

**DOM Structure:**
- Container element matches contract requirement
- Required attributes present
- Accessibility attributes present

**Interface Compliance:**
- All required props supported
- All events emitted as specified
- Public methods match contract

**Dependencies:**
- All specified dependencies present
- Dependency versions compatible

**Output:**
```
Level 3: Contract Compliance
├─ CSS Namespace: ✓ All classes prefixed with "login-form-"
├─ DOM Structure: ✓ Matches contract requirements
├─ Interface: ✓ All props and events compliant
└─ Dependencies: ✓ All available
```

#### Level 4: Integration Safety (medium, <30s)

**Purpose:** Ensure safe integration with existing codebase

**Checks via MCP Server:**

**CSS Conflict Detection:**
- Query MCP component registry
- Check for class name collisions
- Check for ID collisions
- Identify potential style bleeding

**JS Conflict Detection:**
- Check for function name collisions
- Check for global variable conflicts
- Verify no circular dependencies

**Dependency Validation:**
- All dependencies registered in MCP
- Correct load order
- No version conflicts

**Output:**
```
Level 4: Integration Safety
├─ CSS Conflicts: ✓ No collisions detected
├─ JS Conflicts: ✓ No global conflicts
├─ HTML IDs: ✓ All IDs unique
└─ Dependencies: ✓ Load order valid
```

### 3. Generate Validation Report

Create `.system/components/{component_name}/validation-report.md`:

```markdown
# Validation Report: {component_name}

**Validation Date:** {timestamp}
**Overall Status:** PASSED ✓ (or FAILED ✗)

## Summary

- Level 1: Syntax Check → PASSED ✓
- Level 2: Unit Tests → PASSED ✓
- Level 3: Contract Compliance → PASSED ✓
- Level 4: Integration Safety → PASSED ✓

## Detailed Results

### Level 1: Syntax Check

**HTML:**
- Status: PASSED ✓
- Lines: 12
- Issues: None

**CSS:**
- Status: PASSED ✓
- Lines: 45
- Selectors: 8
- Issues: None

**JavaScript:**
- Status: PASSED ✓
- Lines: 23
- Functions: 2
- Issues: None

### Level 2: Unit Tests

**Test Suite:** .system/components/login-form/login-form.test.js

| Test | Status |
|------|--------|
| Renders correctly | ✓ PASS |
| Accepts valid email | ✓ PASS |
| Rejects invalid email | ✓ PASS |
| Emits submit event | ✓ PASS |
| Handles empty input | ✓ PASS |

**Coverage:** 92% (46/50 lines)

**Uncovered Lines:** 12, 34, 48, 49

### Level 3: Contract Compliance

**CSS Namespace:**
- Required prefix: `.login-form-`
- Classes found: 8
- Compliant: 8/8 ✓

**DOM Structure:**
- Container: `<div class="login-form-container">` ✓
- Required attributes: All present ✓

**Interface:**
- Required props: email, password ✓
- Events: onSubmit, onError ✓
- Methods: validate(), reset() ✓

**Dependencies:**
- password-strength-indicator ✓
- form-validation-utils ✓

### Level 4: Integration Safety

**MCP Registry Query Results:**

**CSS Conflicts:**
- Checked 8 classes against 145 existing classes
- Collisions: 0 ✓

**JS Conflicts:**
- Checked 2 functions against 78 existing functions
- Collisions: 0 ✓

**HTML ID Conflicts:**
- Checked 3 IDs against 42 existing IDs
- Collisions: 0 ✓

**Dependency Check:**
- All dependencies available ✓
- Load order: Valid ✓

## Recommendations

- Consider increasing test coverage to 95%+
- Add integration tests for form submission flow

## Next Steps

✓ Component ready for sandbox testing
Run: Automatically triggered by sandbox-testing skill

---

**Validation Version:** 1.0
**Validator:** component-validation skill
```

### 4. Emit Events

**Event:** `validation_completed`

**Payload:**
```yaml
component_name: "{component_name}"
validation_level: 4
status: "passed"  # or "failed"
report_path: ".system/components/{component_name}/validation-report.md"
story: "{story_id}"
failures: []  # or list of failure details
```

**Triggers:**
- `sandbox-testing` skill (if validation passed)
- `progress-reporter` skill (updates execution status)
- Operator notification (if validation failed)

### 5. Update Execution Status

Via `progress-reporter` skill:

```yaml
stories:
  {story_id}:
    pass_status:
      second-pass:
        components:
          - name: "{component_name}"
            status: "validated"  # ← Updated from "contract_defined"
            validation_report: ".system/components/{component_name}/validation-report.md"
```

## Output Files

### Created
- `.system/components/{component_name}/validation-report.md` - Detailed validation results

### Modified
- `.system/execution-status.yaml` - Component status updated (via progress-reporter)

## Operator Visibility

### Autonomous Operation (Validation Passes)

**Operator sees:**
```
Creating contracts... (autonomous)
✓ 3 contracts created

Validating components... (autonomous)
✓ login-form: All 4 levels passed
✓ password-input: All 4 levels passed
✓ submit-button: All 4 levels passed

Validation reports: .system/components/*/validation-report.md
```

### When Validation Fails

**Operator sees:**
```
Validating components... (autonomous)
✓ login-form: All 4 levels passed
✓ password-input: All 4 levels passed
✗ submit-button: Validation failed at Level 3 (Contract compliance)

Details:
- Issue: CSS classes missing namespace prefix
- Found: .btn, .icon
- Required: .submit-button-btn, .submit-button-icon

Report: .system/components/submit-button/validation-report.md

Action required:
1. Fix CSS namespace issues
2. Re-run: /integrate references/login-prototype.html

Chain halted for submit-button. Other components continue processing.
```

## Error Handling

### Syntax Errors

```
Level 1: Syntax Check → FAILED ✗

Errors:
- HTML: Line 12 - Unclosed <div> tag
- CSS: Line 34 - Invalid property "colour" (did you mean "color"?)
- JS: Line 18 - Unexpected token ';'

Cannot proceed to Level 2 until syntax errors fixed.
```

### Test Failures

```
Level 2: Unit Tests → FAILED ✗

Failed tests:
- "Handles empty input" - Expected error message, got undefined
- "Validates email format" - Email regex not working for special characters

Coverage: 78% (below 85% threshold)

Cannot proceed to Level 3 until tests pass.
```

### Contract Violations

```
Level 3: Contract Compliance → FAILED ✗

Violations:
1. CSS Namespace: 2 classes without prefix
   - .btn (should be .login-form-btn)
   - .icon (should be .login-form-icon)

2. Missing required prop: "placeholder"
   - Contract specifies: placeholder: string (required)
   - Component: No placeholder prop found

Cannot proceed to Level 4 until contract compliant.
```

### Integration Conflicts

```
Level 4: Integration Safety → FAILED ✗

Conflicts detected:
1. CSS Class Collision: ".btn"
   - Your component: .btn
   - Existing component: "navbar" also uses .btn
   - Resolution: Use namespace .login-form-btn

2. JS Function Collision: "validateEmail()"
   - Your component: validateEmail()
   - Existing: global utility function with same name
   - Resolution: Namespace as LoginForm.validateEmail()

Cannot integrate until conflicts resolved.
```

## Progressive Halting

Validation stops at first failure:

```
Level 1: Syntax → PASS ✓
Level 2: Unit Tests → PASS ✓
Level 3: Contract → FAIL ✗

(Level 4 not run - fix Level 3 first)
```

**Rationale:** No point checking integration safety if contract isn't compliant.

## Revalidation

When component is fixed and `/integrate` re-run:

```
Detected: submit-button previously failed validation

Re-running validation... (autonomous)
✓ submit-button: All 4 levels passed

Continuing to sandbox testing...
```

## Configuration

Settings in `.claude/skills/trigger-matrix.yaml`:

```yaml
skills:
  component-validation:
    autonomy_level: "fully_autonomous"
    auto_triggers:
      - event: "contract_created"
        conditions: []
        priority: 2
      - event: "component_modified"
        conditions:
          - "requires_revalidation == true"
        priority: 3

    validation_thresholds:
      min_test_coverage: 85
      max_css_conflicts: 0
      max_js_conflicts: 0
```

## Related Files

- **Trigger Matrix:** `.claude/skills/trigger-matrix.yaml`
- **Event System:** `.claude/skills/event-system.md`
- **Contract:** `.system/contracts/{component_name}-contract.md`
- **Validation Report:** `.system/components/{component_name}/validation-report.md`
- **Execution Status:** `.system/execution-status.yaml`

## Old Command Replaced

This skill replaces: `/validate-component` (manual command)

**Key improvement:** Now runs automatically after contract creation, ensures consistent quality for every component.
