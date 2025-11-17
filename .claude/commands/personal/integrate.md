# /integrate - Component Sharding & Injection Architecture

Shards large files into modular components and creates injection architecture for manageable, conflict-free development.

## Problem This Solves

**Context Window Blowout**: When files exceed 200 lines, Claude struggles with context.
**Integration Conflicts**: Manually merging components causes CSS conflicts and broken dependencies.
**Parallel Development**: Hard to work on different parts of a large file simultaneously.

## What This Does

1. **Analyzes** your large file to find logical boundaries
2. **Shards** into small components (max 200 lines each)
3. **Registers** each component with MCP server for conflict detection
4. **Creates** injection markers in the main file
5. **Validates** integration safety before assembly

## Usage

```bash
# Shard a large file
/integrate <file-path>

# Example
/integrate src/physiquecheck-report.html
```

## Workflow

### Phase 1: Analyze & Plan

1. Read the target file
2. Detect logical boundaries:
   - HTML: sections, headers, major divs
   - CSS: class namespaces, media queries
   - JS: functions, classes, modules
3. Calculate complexity and lines per section
4. Create shard manifest

### Phase 2: Component Extraction

For each identified section:
1. Extract to `.system/components/[name]/`
2. Create component files:
   - `[name].html` or `[name].js`
   - `[name].css` (if styles exist)
   - `[name].test.js` (placeholder)
3. Assign CSS namespace: `.component-[name]`
4. Track dependencies

### Phase 3: Register with MCP

For each component:
```javascript
// Call MCP tool
register_component({
  name: "header",
  cssNamespace: ".component-header",
  filepath: ".system/components/header/header.html",
  dependencies: []
})
```

### Phase 4: Create Injection Architecture

Reduce main file to injection markers:

```html
<!-- Original: 2000 lines -->
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
  <!-- INJECT:styles:CSS -->
</head>
<body>
  <!-- INJECT:header:HTML -->
  <!-- INJECT:main-content:HTML -->
  <!-- INJECT:footer:HTML -->

  <!-- INJECT:scripts:JS -->
</body>
</html>
<!-- Now: ~50 lines -->
```

### Phase 5: Validation

Before finalizing:
1. Check all components registered
2. Validate no CSS namespace conflicts
3. Verify dependency chains
4. Test assembly (optional)

### Phase 6: Backup & Finalize

1. Save original to `references/[name]-original.html`
2. Update main file with injection markers
3. Create integration manifest at `.system/components/manifest.json`

---

## Automated Sub-Workflows (Fully Autonomous Skills Chain)

This command triggers a **fully autonomous skills chain** for every component extracted. The operator runs ONE command and the entire workflow executes automatically.

### Complete Autonomous Chain

```
Operator runs: /integrate references/login-prototype.html

↓ Phase 2: Component Extraction

  3 components extracted → Emits event: component_extracted × 3

↓ Auto-triggers: contract-creation skill (Priority 1)

  3 contracts created → Emits event: contract_created × 3

↓ Auto-triggers: component-validation skill (Priority 2)

  3 validations run (4 levels each)
  - All pass → Emits event: validation_completed (status: passed) × 3
  - Any fail → Chain halts for that component, others continue

↓ Auto-triggers: sandbox-testing skill (Priority 3)

  3 sandbox tests created
  - Auto-runs visual tests
  - All pass → Auto-approves
  - Moves to .system/proven/ × 3
  → Emits event: component_proven × 3

↓ Auto-triggers: component-integration skill (Priority 4)

  3 components integrated into main files
  - Creates injection markers
  - Registers with MCP
  - Resolves any conflicts
  → Emits event: component_integrated × 3

↓ Auto-triggers: pass-orchestration skill (Priority 5)

  Checks if all story components integrated
  - If yes → Emits event: pass_completed (second-pass)
  - Suggests next action: /third-pass

↓ Auto-triggers: progress-reporter skill (Priority 10, parallel)

  Updates .system/execution-status.yaml after each event
  - Component statuses
  - Metrics
  - Current state
  - Recent events
```

### Operator Experience

**What operator does:**
```bash
/integrate references/login-prototype.html
```

**What operator sees:**
```
Sharding prototype...
✓ Extracted 3 components: login-form, password-input, submit-button

Creating contracts... (autonomous)
✓ 3 contracts created

Validating components... (autonomous)
✓ login-form: All 4 levels passed
✓ password-input: All 4 levels passed
✓ submit-button: All 4 levels passed

Proving in sandbox... (autonomous)
✓ login-form: Automated tests passed, proven
✓ password-input: Automated tests passed, proven
✓ submit-button: Automated tests passed, proven

Integrating components... (autonomous)
✓ All 3 components integrated
✓ Injection markers created
✓ MCP registry updated

✓ Second pass: 3/5 components complete
Next: /integrate references/dashboard-prototype.html

Total time: 45 seconds
Operator interventions: 0
```

**What happened automatically (invisible to operator):**
- 3 contracts created
- 12 validation levels checked (4 per component)
- 3 sandbox test files generated
- 3 automated visual tests run
- 3 components moved to proven/
- 3 components integrated into main files
- MCP registry updated
- execution-status.yaml updated 15+ times
- Event log recorded all events

### Event Emission Points

**After Phase 2: Component Extraction**

```yaml
# For each component extracted:
event: component_extracted
payload:
  component_name: "login-form"
  source_file: "references/login-prototype.html"
  component_path: ".system/components/login-form/"
  contract_exists: false
  story: "story-1-user-authentication"  # Detected from context
  timestamp: "2025-01-15T10:30:00Z"
```

**Triggers:**
- `contract-creation` skill (auto)
- `progress-reporter` skill (auto)

**After All Components Processed**

```yaml
# Summary event after all components finish their chains:
event: integration_batch_complete
payload:
  source_file: "references/login-prototype.html"
  components_extracted: 3
  components_proven: 3
  components_integrated: 3
  failures: 0
  total_duration_seconds: 45
  story: "story-1-user-authentication"
```

**Triggers:**
- `pass-orchestration` skill (checks if story second-pass complete)

### Parallel Processing

Components process **in parallel** (configurable):

```
Time: 0s ──────────────────────── 45s ────────►

Component 1: [Extract][Contract][Valid][Sandbox][Integrate] ✓
Component 2: [Extract][Contract][Valid][Sandbox][Integrate] ✓
Component 3: [Extract][Contract][Valid][Sandbox][Integrate] ✓

All 3 components processed simultaneously.
Total time: 45 seconds (vs 135 seconds if sequential)
```

### Failure Handling

**Scenario: One component fails validation**

```
Operator runs: /integrate references/login-prototype.html

Sharding prototype...
✓ Extracted 3 components

Creating contracts... (autonomous)
✓ 3 contracts created

Validating components... (autonomous)
✓ login-form: All 4 levels passed
✓ password-input: All 4 levels passed
✗ submit-button: Validation failed at Level 3 (Contract compliance)

Details:
- Issue: CSS classes missing namespace prefix
- Found: .btn, .icon
- Required: .submit-button-btn, .submit-button-icon
- Report: .system/components/submit-button/validation-report.md

Proving in sandbox... (autonomous)
✓ login-form: Automated tests passed, proven
✓ password-input: Automated tests passed, proven
(submit-button skipped - validation failed)

Integrating components... (autonomous)
✓ login-form: Integrated
✓ password-input: Integrated
(submit-button skipped - validation failed)

Results:
✓ 2/3 components successfully integrated
✗ 1 component needs attention

Action required:
1. Fix submit-button CSS namespace issues
2. Re-run: /integrate references/login-prototype.html
   (Already-integrated components will be skipped)

Second pass: 2/5 components complete
```

### Re-run Intelligence

**Smart re-execution after fixes:**

```
Operator fixes submit-button CSS issues
Operator runs: /integrate references/login-prototype.html

Sharding prototype...
✓ Extracted 3 components

Detecting previous state...
✓ login-form: Already integrated (skipping)
✓ password-input: Already integrated (skipping)
⟳ submit-button: Previously failed, re-processing

Validating components... (autonomous)
✓ submit-button: All 4 levels passed

Proving in sandbox... (autonomous)
✓ submit-button: Automated tests passed, proven

Integrating components... (autonomous)
✓ submit-button: Integrated

✓ All 3 components now integrated

Second pass complete! (3/3 components)
Next: /third-pass story-1-user-authentication
```

### Skills Triggered (In Order)

| Priority | Skill | Trigger Event | Action |
|----------|-------|---------------|--------|
| 1 | `contract-creation` | `component_extracted` | Create contracts |
| 2 | `component-validation` | `contract_created` | Validate 4 levels |
| 3 | `sandbox-testing` | `validation_completed` (passed) | Sandbox test + auto-approve |
| 4 | `component-integration` | `component_proven` | Integrate into main files |
| 5 | `pass-orchestration` | `component_integrated` (all) | Check pass completion |
| 10 | `progress-reporter` | All events | Update execution-status.yaml |

### Configuration

**Autonomy level:** Fully autonomous (no operator approval needed)

**Settings in** `.claude/skills/trigger-matrix.yaml`:

```yaml
execution:
  parallel_component_processing: true
  max_parallel_components: 5
  retry_on_failure: true
  max_retries: 2

notifications:
  verbosity: "summary"  # summary, detailed, or verbose
```

**Settings in** `.system/execution-status.yaml`:

```yaml
config:
  auto_update: true
  require_sandbox_approval: false  # Fully autonomous
```

### Event Log

All events logged to `.system/events/event-log.yaml`:

```yaml
events:
  - timestamp: "2025-01-15T10:30:15Z"
    event: "component_extracted"
    component: "login-form"
    source: "/integrate"

  - timestamp: "2025-01-15T10:30:16Z"
    event: "contract_created"
    component: "login-form"
    emitted_by: "contract-creation_skill"
    triggered: ["component-validation", "progress-reporter"]

  # ... (full event chain logged)
```

**Note:** These skills run automatically. Operators don't need to invoke them manually. The entire chain is orchestrated by the event system defined in `.claude/skills/trigger-matrix.yaml`.

## Example: PhysiqueCheck Report

**Input:**
```
src/physiquecheck-report.html (2000 lines)
```

**Output:**
```
src/physiquecheck-report.html (50 lines with markers)

components/
├── report-header/
│   └── header.html (150 lines)
├── bio-mechanics/
│   └── bio.html (180 lines)
├── donut-animation/
│   ├── donut.js (120 lines)
│   └── donut.css (100 lines)
├── strength-charts/
│   └── charts.html (200 lines)
└── footer/
    └── footer.html (80 lines)

references/
└── physiquecheck-report-original.html (backup)
```

## Integration with MCP Server

Integration validation happens automatically via the `mcp-setup` skill:

1. Component registered → MCP tracks it
2. Before injection → MCP validates safety
3. CSS conflicts → MCP warns and suggests namespace
4. Missing dependencies → MCP identifies gaps

**Note:** The `mcp-setup` skill auto-configures MCP if not detected during `/checklist`.

## Rollback

If something goes wrong:
1. Original file is in `references/`
2. Simply copy it back to restore

## Best Practices

- **Shard files >200 lines** - Keeps context manageable
- **Use semantic names** - "header", "nav", not "component1"
- **CSS namespacing** - Prevents style conflicts
- **Test components** - Build unit tests in isolation
- **Document dependencies** - Track what components need

## See Also

- `.claude/skills/` - Autonomous skills that support this workflow
- `docs/integration-workflow.md` - Detailed guide
- `README-STRUCTURE.md` - References vs Components explanation
- `/checklist` - Verify environment setup (calls `mcp-setup` skill if needed)
