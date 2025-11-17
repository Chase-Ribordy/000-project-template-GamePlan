# Component Integration Skill

**Autonomy Level:** Fully Autonomous

**Purpose:** Automatically integrate proven components into main project files with injection markers and MCP registration.

## Trigger Conditions

### Auto-Triggers
- **Event:** `component_proven`
- **Condition:** Component has been validated (all 4 levels) and proven in sandbox
- **Priority:** 4 (after sandbox testing)

### Manual Triggers
- "integrate {component_name}"
- "inject {component_name}"
- "add {component_name} to main files"

## Skill Workflow

When this skill is triggered (automatically after `component_proven` event):

### 1. Load Component from Proven Directory

```
Location: .system/proven/{component_name}/
Files:
  - {component_name}.html
  - {component_name}.css
  - {component_name}.js (if applicable)
  - contract.md
  - validation-report.md
```

### 2. Read Component Contract

Extract from contract:
- **Injection points:** Where in main files should this component be injected
- **Dependencies:** Other components or libraries required
- **CSS namespace:** Unique prefix to prevent conflicts
- **DOM requirements:** Container IDs, parent elements

### 3. Identify Target Files

Based on component type and injection points:

**Frontend components:**
- HTML injection → `index.html` or relevant template
- CSS injection → `styles/components.css` or create `styles/{component_name}.css`
- JS injection → `scripts/components.js` or create `scripts/{component_name}.js`

**Backend components:**
- Module injection → Appropriate directory in `src/`
- Import statements → Main application files

### 4. Create Injection Markers

Add clear markers in target files:

**HTML Example:**
```html
<!-- BEGIN COMPONENT: login-form (injected 2025-01-15) -->
<div class="login-form-container">
  [Component HTML here]
</div>
<!-- END COMPONENT: login-form -->
```

**CSS Example:**
```css
/* BEGIN COMPONENT: login-form (injected 2025-01-15) */
.login-form-container {
  [Component CSS here]
}
/* END COMPONENT: login-form */
```

**JS Example:**
```javascript
// BEGIN COMPONENT: login-form (injected 2025-01-15)
class LoginForm {
  [Component JS here]
}
// END COMPONENT: login-form
```

### 5. Check for Conflicts (via MCP)

Query MCP server:
- Check if CSS classes conflict with existing components
- Check if JS functions/classes conflict
- Check if HTML IDs conflict

**If conflicts detected:**
- Auto-rename with component namespace (e.g., `.btn` → `.login-form-btn`)
- Update contract to reflect changes
- Log conflict resolution in integration report

### 6. Inject Component Code

Based on injection strategy:

**Inline injection:**
- Insert component code directly into main files
- Use injection markers for traceability

**File reference injection:**
- Keep component in separate file (`components/{component_name}.css`)
- Add reference in main file (`<link rel="stylesheet" href="components/login-form.css">`)

**Modular injection (preferred for large components):**
- Component stays in `.system/proven/{component_name}/`
- Create symlink or import in main files
- Maintain single source of truth

### 7. Register with MCP Server

Update component registry:

```json
{
  "component_name": "login-form",
  "type": "UI component",
  "css_namespace": "login-form-",
  "injection_points": [
    "index.html:42",
    "styles/components.css:150"
  ],
  "dependencies": ["password-input", "submit-button"],
  "integrated_date": "2025-01-15T11:30:00Z",
  "proven_path": ".system/proven/login-form/",
  "contract": ".system/contracts/login-form-contract.md"
}
```

### 8. Create Integration Report

Generate: `.system/components/{component_name}/integration-report.md`

**Contents:**
- Integration date/time
- Files modified
- Injection points (file:line_number)
- Conflicts detected and resolved
- MCP registration status
- Rollback instructions (if needed)

### 9. Update Execution Status

Via `progress-reporter` skill (auto-triggered):

```yaml
stories:
  story-1-user-authentication:
    pass_status:
      second-pass:
        components:
          - name: "login-form"
            status: "integrated"  # ← Updated from "proven"
            integrated_date: "2025-01-15T11:30:00Z"
            integration_report: ".system/components/login-form/integration-report.md"
```

### 10. Emit Events

**Event:** `component_integrated`

**Payload:**
```yaml
component_name: "login-form"
injection_points:
  - "index.html:42"
  - "styles/components.css:150"
  - "scripts/components.js:89"
story: "story-1-user-authentication"
```

**Triggers:**
- `pass-orchestration` skill (checks if all story components are integrated)
- `progress-reporter` skill (updates metrics)

## Output Files

### Created/Modified
1. **Main project files** (with injection markers)
   - `index.html` (or relevant templates)
   - `styles/components.css` (or component-specific CSS file)
   - `scripts/components.js` (or component-specific JS file)

2. **Integration report**
   - `.system/components/{component_name}/integration-report.md`

3. **MCP registry**
   - `.system/mcp-servers/component-registry/components.json` (updated)

4. **Execution status**
   - `.system/execution-status.yaml` (updated via progress-reporter)

## Error Handling

### Conflict Resolution

**CSS Class Conflicts:**
```
Detected: Existing .btn class conflicts with login-form .btn

Auto-resolution:
- Rename login-form .btn → .login-form-btn
- Update component CSS
- Update component HTML
- Update contract
- Log in integration report
```

**JS Function Conflicts:**
```
Detected: Function submitForm() already exists

Auto-resolution:
- Namespace: submitForm() → LoginForm.submitForm()
- Update component JS
- Update contract
- Log in integration report
```

**HTML ID Conflicts:**
```
Detected: ID #submit-button already exists

Auto-resolution:
- Rename: #submit-button → #login-form-submit-button
- Update component HTML
- Update component JS references
- Update contract
- Log in integration report
```

### Injection Failures

**File not found:**
```
Target file index.html does not exist

Action:
- Create file from template (.system/boilerplate/index.html)
- Inject component
- Log in integration report
```

**Permission denied:**
```
Cannot write to index.html

Action:
- Halt integration
- Notify operator: "Permission denied for index.html"
- Suggest: "Check file permissions and re-run /integrate"
```

## Rollback Capability

Each integration includes rollback instructions in integration-report.md:

```markdown
## Rollback Instructions

To remove this component integration:

1. Remove from index.html:
   - Lines 42-58 (<!-- BEGIN COMPONENT: login-form --> to <!-- END COMPONENT -->)

2. Remove from styles/components.css:
   - Lines 150-203 (/* BEGIN COMPONENT: login-form */ to /* END COMPONENT */)

3. Remove from scripts/components.js:
   - Lines 89-124 (// BEGIN COMPONENT: login-form // to // END COMPONENT //)

4. Update MCP registry:
   - Remove "login-form" entry from .system/mcp-servers/component-registry/components.json

5. Update execution status:
   - Change component status from "integrated" back to "proven"
```

## Integration Strategies

### Strategy Selection (Auto-Determined)

**Small components (<100 lines total):**
- Strategy: Inline injection
- Rationale: Low maintenance overhead, fast loading

**Medium components (100-500 lines):**
- Strategy: File reference injection
- Rationale: Modularity without excessive file splitting

**Large components (>500 lines):**
- Strategy: Modular injection with imports
- Rationale: Maintainability, separate concerns

**Components with dependencies:**
- Strategy: Modular with dependency tracking
- Rationale: Ensure load order, prevent circular dependencies

## Testing After Integration

### Automatic Checks (Part of Integration)

1. **Syntax validation:** Ensure no syntax errors introduced
2. **Reference validation:** All component references resolve
3. **Dependency check:** All required components/libraries present
4. **CSS scope check:** No unintended style bleeding

### Suggested Manual Tests (Logged in Integration Report)

```markdown
## Recommended Tests After Integration

1. Visual test: Open index.html and verify login-form renders correctly
2. Functional test: Submit form and verify backend receives data
3. Responsive test: Check mobile, tablet, desktop layouts
4. Accessibility test: Tab navigation, screen reader compatibility
```

## Operator Visibility

### Autonomous Operation (No Approval Required)

**Operator sees:**
```
Integrating components... (autonomous)
✓ login-form: Integrated at 3 injection points
✓ password-input: Integrated at 2 injection points
✓ submit-button: Integrated at 1 injection point

All 3 components integrated.
MCP registry updated.

Integration reports:
- .system/components/login-form/integration-report.md
- .system/components/password-input/integration-report.md
- .system/components/submit-button/integration-report.md

Next: Open index.html to visually verify integration
```

### When Conflicts Occur

**Operator sees:**
```
Integrating components... (autonomous)
✓ login-form: Integrated (2 conflicts auto-resolved)
✓ password-input: Integrated
⚠ submit-button: Integration paused - unresolvable conflict

Conflict details:
- submit-button uses ID #submit-btn
- Existing component "contact-form" also uses ID #submit-btn
- Auto-rename failed: Both components in same DOM scope

Action required:
1. Review: .system/components/submit-button/integration-report.md
2. Choose: Rename submit-button ID or contact-form ID
3. Re-run: /integrate references/login-prototype.html
```

## Integration with Pass Orchestration

After all components for a story are integrated:

**Event Chain:**
```
component_integrated (last component)
    ↓
pass-orchestration checks: all_story_components_integrated == true
    ↓
Emits: pass_completed (second-pass)
    ↓
Operator notified: "Second pass complete for story-1-user-authentication"
    ↓
Suggested next action: "/third-pass" or start next story
```

## Configuration

Settings in `.system/execution-status.yaml`:

```yaml
config:
  integration_strategy: "auto"  # Options: auto, inline, file-reference, modular
  auto_resolve_conflicts: true
  create_integration_reports: true
  register_with_mcp: true
  parallel_integration: true
  max_parallel_integrations: 3
```

## Related Files

- **Trigger Matrix:** `.claude/skills/trigger-matrix.yaml`
- **Event System:** `.claude/skills/event-system.md`
- **Execution Status:** `.system/execution-status.yaml`
- **Component Registry:** `.system/mcp-servers/component-registry/components.json`
- **Integration Reports:** `.system/components/{component_name}/integration-report.md`

## Example Integration Report

```markdown
# Integration Report: login-form

**Integration Date:** 2025-01-15T11:30:00Z
**Component:** login-form
**Story:** story-1-user-authentication
**Pass:** second-pass

## Files Modified

1. **index.html** (Lines 42-58)
   - Injection point: After header, before main content
   - Injection marker: `<!-- BEGIN COMPONENT: login-form -->`

2. **styles/components.css** (Lines 150-203)
   - Namespace: `.login-form-`
   - Conflicts resolved: 2

3. **scripts/components.js** (Lines 89-124)
   - Class: `LoginForm`
   - Dependencies: `PasswordInput`, `SubmitButton`

## Conflicts Resolved

### CSS Conflict #1
- **Detected:** `.btn` class already exists in base styles
- **Resolution:** Renamed to `.login-form-btn` with namespace
- **Files updated:** `login-form.css`, `login-form.html`

### CSS Conflict #2
- **Detected:** `.input-group` class overlaps with Bootstrap
- **Resolution:** Renamed to `.login-form-input-group`
- **Files updated:** `login-form.css`, `login-form.html`

## MCP Registration

```json
{
  "component_name": "login-form",
  "type": "UI component",
  "css_namespace": "login-form-",
  "injection_points": ["index.html:42", "styles/components.css:150", "scripts/components.js:89"],
  "dependencies": ["password-input", "submit-button"],
  "integrated_date": "2025-01-15T11:30:00Z"
}
```

## Validation Results

- ✓ Syntax validation passed
- ✓ Reference validation passed
- ✓ Dependency check passed
- ✓ CSS scope check passed

## Recommended Tests

1. Open `index.html` in browser
2. Verify form renders correctly
3. Test form submission
4. Check responsive layouts
5. Test accessibility (tab navigation)

## Rollback Instructions

[See above for rollback details]

## Notes

- Component integrates cleanly with existing auth backend
- Consider adding loading state UI in future iteration
- Password strength indicator works well
```

## Summary

The component-integration skill provides:

- **Fully autonomous integration** of proven components
- **Conflict detection and resolution** via MCP
- **Clear injection markers** for traceability
- **Comprehensive integration reports** for audit trail
- **Automatic status tracking** via progress-reporter
- **Rollback capability** for safe experimentation

This skill completes the autonomous chain: extract → contract → validate → prove → **integrate**.
