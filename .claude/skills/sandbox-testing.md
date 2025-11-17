# Sandbox Testing Skill

**Autonomy Level:** Fully Autonomous

**Purpose:** Automatically create isolated test environment to visually verify components work correctly, then auto-approve and move to proven/ if tests pass.

## Trigger Conditions

### Auto-Triggers
- **Event:** `validation_completed`
  - **Condition:** `status == 'passed'` AND `validation_level == 4`
  - **Priority:** 3 (after validation passes all 4 levels)
  - **Emitted by:** `component-validation` skill

### Manual Triggers
- "prove {component_name}"
- "test {component_name} in sandbox"
- "sandbox {component_name}"
- "Show me {component}"

## Skill Workflow

When this skill is triggered (automatically after successful 4-level validation):

### 1. Load Component Files

Read from `.system/components/{component_name}/`:
- `{component_name}.html` - Component markup
- `{component_name}.css` - Component styles
- `{component_name}.js` - Component logic (if applicable)

Read contract:
- `.system/contracts/{component_name}-contract.md` - Usage examples, requirements

### 2. Generate Sandbox Test File

Create `.system/sandbox/{component_name}-test.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sandbox Test: {component_name}</title>

    <!-- Component CSS -->
    <style>
        /* Sandbox container styles */
        .sandbox-container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 2rem;
            font-family: system-ui, -apple-system, sans-serif;
        }

        .sandbox-header {
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 1rem;
            margin-bottom: 2rem;
        }

        .sandbox-checklist {
            background: #f5f5f5;
            padding: 1rem;
            margin: 2rem 0;
            border-radius: 4px;
        }

        .sandbox-checklist h3 {
            margin-top: 0;
        }

        .test-section {
            margin: 2rem 0;
            padding: 2rem;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
        }

        .test-result {
            display: inline-block;
            padding: 0.5rem 1rem;
            margin: 0.5rem;
            border-radius: 4px;
            cursor: pointer;
        }

        .test-result.pass {
            background: #4caf50;
            color: white;
        }

        .test-result.fail {
            background: #f44336;
            color: white;
        }

        /* Component CSS (injected) */
        {component_css_content}
    </style>
</head>
<body>
    <div class="sandbox-container">
        <header class="sandbox-header">
            <h1>Sandbox Test: {component_name}</h1>
            <p><strong>Status:</strong> <span id="sandbox-status">Testing...</span></p>
            <p><strong>Auto-Validation:</strong> <span id="auto-validation">Running...</span></p>
        </header>

        <div class="sandbox-checklist">
            <h3>Visual Verification Checklist</h3>
            <ul id="checklist">
                <li>✓ Component renders</li>
                <li>✓ Styles apply correctly</li>
                <li>✓ Interactive elements respond</li>
                <li>✓ Responsive at all breakpoints</li>
                <li>✓ No console errors</li>
            </ul>
        </div>

        <div class="test-section">
            <h2>Component in Isolation</h2>
            <!-- Component HTML (injected) -->
            {component_html_content}
        </div>

        <div class="test-section">
            <h2>Interactive Tests</h2>
            <div id="interactive-tests">
                <!-- Generated based on component type -->
                {interactive_test_controls}
            </div>
        </div>

        <div class="test-section">
            <h2>Responsive Preview</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                <div style="border: 1px solid #ccc;">
                    <p><strong>Mobile (375px)</strong></p>
                    <iframe srcdoc="{component_html}" width="375" height="667" style="border: none;"></iframe>
                </div>
                <div style="border: 1px solid #ccc;">
                    <p><strong>Tablet (768px)</strong></p>
                    <iframe srcdoc="{component_html}" width="768" height="1024" style="border: none;"></iframe>
                </div>
                <div style="border: 1px solid #ccc;">
                    <p><strong>Desktop (1920px)</strong></p>
                    <iframe srcdoc="{component_html}" width="1200" height="800" style="border: none;"></iframe>
                </div>
            </div>
        </div>

        <div class="test-section">
            <h2>Auto-Validation Results</h2>
            <div id="auto-validation-results">
                <!-- Populated by automated tests -->
            </div>
        </div>
    </div>

    <!-- Component JS (injected) -->
    <script>
        {component_js_content}
    </script>

    <!-- Automated sandbox tests -->
    <script>
        // Auto-validation tests
        const autoValidation = {
            renderTest: () => {
                const component = document.querySelector('.{component_name}-container');
                return component !== null && component.offsetHeight > 0;
            },

            stylesTest: () => {
                const component = document.querySelector('.{component_name}-container');
                const styles = window.getComputedStyle(component);
                return styles && styles.display !== 'none';
            },

            consoleErrorTest: () => {
                let errorCount = 0;
                const originalError = console.error;
                console.error = function(...args) {
                    errorCount++;
                    originalError.apply(console, args);
                };

                setTimeout(() => {
                    console.error = originalError;
                }, 1000);

                return errorCount === 0;
            },

            interactivityTest: () => {
                // Component-specific interactivity tests
                {generated_interactivity_tests}
            }
        };

        // Run automated tests
        function runAutoValidation() {
            const results = {
                render: autoValidation.renderTest(),
                styles: autoValidation.stylesTest(),
                console: autoValidation.consoleErrorTest(),
                interactivity: autoValidation.interactivityTest()
            };

            const resultsDiv = document.getElementById('auto-validation-results');
            resultsDiv.innerHTML = `
                <p class="test-result ${results.render ? 'pass' : 'fail'}">
                    Render Test: ${results.render ? 'PASS ✓' : 'FAIL ✗'}
                </p>
                <p class="test-result ${results.styles ? 'pass' : 'fail'}">
                    Styles Test: ${results.styles ? 'PASS ✓' : 'FAIL ✗'}
                </p>
                <p class="test-result ${results.console ? 'pass' : 'fail'}">
                    Console Test: ${results.console ? 'PASS ✓' : 'FAIL ✗'}
                </p>
                <p class="test-result ${results.interactivity ? 'pass' : 'fail'}">
                    Interactivity Test: ${results.interactivity ? 'PASS ✓' : 'FAIL ✗'}
                </p>
            `;

            const allPass = Object.values(results).every(r => r === true);
            const statusSpan = document.getElementById('sandbox-status');
            const validationSpan = document.getElementById('auto-validation');

            if (allPass) {
                statusSpan.textContent = 'All tests passed ✓';
                statusSpan.style.color = '#4caf50';
                validationSpan.textContent = 'PASSED ✓';
                validationSpan.style.color = '#4caf50';

                // Auto-approve after successful tests
                setTimeout(() => {
                    approveComponent();
                }, 2000);
            } else {
                statusSpan.textContent = 'Some tests failed ✗';
                statusSpan.style.color = '#f44336';
                validationSpan.textContent = 'FAILED ✗';
                validationSpan.style.color = '#f44336';
            }
        }

        function approveComponent() {
            // Notify Claude Code that component is approved
            console.log('SANDBOX_APPROVED: {component_name}');
        }

        // Run tests on page load
        window.addEventListener('load', () => {
            setTimeout(runAutoValidation, 500);
        });
    </script>
</body>
</html>
```

### 3. Run Automated Visual Tests

**Fully autonomous testing:**

**Automated checks:**
- Component renders (DOM element exists and visible)
- Styles apply correctly (computed styles present)
- No console errors during render
- Interactive elements respond to events
- Responsive at all breakpoints

**Auto-approval criteria:**
- All automated tests pass
- No errors logged
- Component renders correctly

### 4. Move to Proven (Auto-Approval)

If automated tests pass:

**Copy to proven directory:**
```
.system/components/{component_name}/
  → .system/proven/{component_name}/
```

**Files copied:**
- `{component_name}.html`
- `{component_name}.css`
- `{component_name}.js`
- Contract (copy from `.system/contracts/`)
- Validation report (copy from `.system/components/`)

**Preserve sandbox test:**
- Keep `.system/sandbox/{component_name}-test.html` for reference

### 5. Emit Events

**Event:** `component_proven`

**Payload:**
```yaml
component_name: "{component_name}"
proven_path: ".system/proven/{component_name}/"
sandbox_path: ".system/sandbox/{component_name}-test.html"
story: "{story_id}"
auto_approved: true
test_results:
  render: true
  styles: true
  console: true
  interactivity: true
```

**Triggers:**
- `component-integration` skill (automatically integrates proven component)
- `progress-reporter` skill (updates execution status)

### 6. Update Execution Status

Via `progress-reporter` skill:

```yaml
stories:
  {story_id}:
    pass_status:
      second-pass:
        components:
          - name: "{component_name}"
            status: "proven"  # ← Updated from "validated"
            proven_path: ".system/proven/{component_name}/"
            sandbox: ".system/sandbox/{component_name}-test.html"
```

## Output Files

### Created
- `.system/sandbox/{component_name}-test.html` - Interactive test environment
- `.system/proven/{component_name}/` - Proven component directory with all files

### Modified
- `.system/execution-status.yaml` - Component status updated (via progress-reporter)

## Operator Visibility

### Autonomous Operation (Tests Pass)

**Operator sees:**
```
Validating components... (autonomous)
✓ All 4 levels passed

Proving in sandbox... (autonomous)
✓ login-form: Automated tests passed, proven
✓ password-input: Automated tests passed, proven
✓ submit-button: Automated tests passed, proven

Proven components: .system/proven/
Sandbox tests: .system/sandbox/ (available for manual review)

Integrating components... (autonomous)
...
```

### When Tests Fail

**Operator sees:**
```
Proving in sandbox... (autonomous)
✓ login-form: Automated tests passed, proven
✓ password-input: Automated tests passed, proven
✗ submit-button: Sandbox tests failed

Test failures:
- Render Test: PASS ✓
- Styles Test: PASS ✓
- Console Test: FAIL ✗ (1 error logged)
- Interactivity Test: FAIL ✗ (click handler not responding)

Sandbox test: .system/sandbox/submit-button-test.html

Action required:
1. Open sandbox test in browser to debug
2. Fix component issues
3. Re-run: /integrate references/login-prototype.html

Chain halted for submit-button. Other components continue processing.
```

### Manual Review Option

**Operator can optionally review sandbox:**

```bash
# Open sandbox test manually
open .system/sandbox/login-form-test.html

# See interactive component with all tests visible
# All tests auto-run on page load
# Results displayed clearly
```

## Error Handling

### Render Failure

```
Sandbox Test: Render Test → FAILED ✗

Issue: Component container not found in DOM

Expected: .login-form-container
Found: null

Action: Check component HTML structure
```

### Console Errors

```
Sandbox Test: Console Test → FAILED ✗

Errors logged:
- TypeError: Cannot read property 'value' of null at line 12

Action: Fix JavaScript errors before integration
```

### Interactivity Failure

```
Sandbox Test: Interactivity Test → FAILED ✗

Issue: Submit button not responding to clicks

Expected: onClick event handler to trigger
Found: No response

Action: Verify event handlers are properly attached
```

## Manual Approval Override

**If operator wants manual control:**

```yaml
# In .system/execution-status.yaml config:
config:
  require_sandbox_approval: true  # Override auto-approval
```

**Then operator must explicitly approve:**
```bash
# After reviewing sandbox test:
"Component looks good, approve it"

# Or via future /approve command:
/approve login-form
```

## Configuration

Settings in `.claude/skills/trigger-matrix.yaml`:

```yaml
skills:
  sandbox-testing:
    autonomy_level: "fully_autonomous"
    auto_triggers:
      - event: "validation_completed"
        conditions:
          - "status == 'passed'"
          - "validation_level == 4"
        priority: 3

    approval_required: false  # Fully autonomous

    auto_approval_criteria:
      - "render_test_passes"
      - "styles_test_passes"
      - "console_test_passes"
      - "interactivity_test_passes"
```

## Sandbox Test Features

### Responsive Preview

Auto-generates iframes showing component at:
- Mobile (375px × 667px)
- Tablet (768px × 1024px)
- Desktop (1920px × 1080px)

### Interactive Controls

Based on component type:

**Form components:**
- Test inputs with various values
- Trigger validation
- Test submit handlers

**UI components:**
- Test click handlers
- Test hover states
- Test animations

**Data components:**
- Test with sample data
- Test empty state
- Test loading state

## Related Files

- **Trigger Matrix:** `.claude/skills/trigger-matrix.yaml`
- **Event System:** `.claude/skills/event-system.md`
- **Sandbox Test:** `.system/sandbox/{component_name}-test.html`
- **Proven Components:** `.system/proven/{component_name}/`
- **Execution Status:** `.system/execution-status.yaml`

## Old Command Replaced

This skill replaces: `/prove-it-works` (manual command with manual approval)

**Key improvements:**
- Now runs automatically after validation passes
- Automated visual testing (no manual approval needed)
- Auto-approves if tests pass
- Preserves sandbox tests for optional manual review
