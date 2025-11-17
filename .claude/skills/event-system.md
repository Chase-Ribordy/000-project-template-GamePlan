# Event-Driven Skills System

## Overview

The event-driven skills system enables **fully autonomous component workflow** by automatically coordinating validation, testing, and integration without operator intervention.

## Architecture

### Core Concept

```
Operator Action (e.g., /integrate)
    ↓
Emits Event (e.g., component_extracted)
    ↓
Skills Listen & Auto-Execute
    ↓
Emit New Events
    ↓
Chain Continues Autonomously
    ↓
Operator Receives Summary Notification
```

### Key Components

1. **Event Emitters**: Commands and skills that emit events
2. **Event Listeners**: Skills that listen for specific events
3. **Trigger Matrix**: Defines which events trigger which skills
4. **Event Log**: Runtime tracking of all events
5. **Progress Reporter**: Auto-updates execution-status.yaml

## Event Flow Example

### Scenario: Operator runs `/integrate references/login-prototype.html`

```mermaid
/integrate command
    │
    ├─ Shards prototype into 3 components
    │   └─ Emits: component_extracted × 3
    │
    ├─► contract-creation skill (auto-triggered)
    │   ├─ Creates login-form-contract.md
    │   ├─ Creates password-input-contract.md
    │   ├─ Creates submit-button-contract.md
    │   └─ Emits: contract_created × 3
    │
    ├─► component-validation skill (auto-triggered)
    │   ├─ Level 1: Syntax ✓
    │   ├─ Level 2: Unit tests ✓
    │   ├─ Level 3: Contract compliance ✓
    │   ├─ Level 4: Integration safety ✓
    │   └─ Emits: validation_completed × 3 (status: passed)
    │
    ├─► sandbox-testing skill (auto-triggered)
    │   ├─ Creates sandbox test files × 3
    │   ├─ Auto-runs visual tests
    │   ├─ Moves to .system/proven/ × 3
    │   └─ Emits: component_proven × 3
    │
    ├─► component-integration skill (auto-triggered)
    │   ├─ Injects components into main files
    │   ├─ Creates injection markers
    │   ├─ Registers with MCP
    │   └─ Emits: component_integrated × 3
    │
    └─► pass-orchestration skill (auto-triggered)
        ├─ Checks if all story components integrated
        ├─ Updates execution-status.yaml
        └─ Emits: pass_completed (if applicable)
```

### Operator Experience

**What operator types:**
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
✓ login-form: Validated and proven
✓ password-input: Validated and proven
✓ submit-button: Validated and proven

Integrating components... (autonomous)
✓ All 3 components integrated
✓ Injection markers created
✓ MCP registry updated

✓ Second pass: 3/5 components complete
Next: /integrate references/dashboard-prototype.html
```

**What happened behind the scenes:**
- 15+ autonomous operations
- 0 operator interventions
- Full contract → validate → prove → integrate chain
- Execution status auto-updated

## Event Types

### Primary Events

| Event | Emitted By | Payload | Triggers |
|-------|------------|---------|----------|
| `component_extracted` | /integrate | component_name, source_file, component_path | contract-creation |
| `contract_created` | contract-creation | component_name, contract_path | component-validation |
| `validation_completed` | component-validation | status, level, report_path | sandbox-testing (if passed) |
| `component_proven` | sandbox-testing | component_name, proven_path | component-integration |
| `component_integrated` | component-integration | injection_points | pass-orchestration |
| `pass_completed` | pass-orchestration | pass_name, story_id | (notification only) |

### Secondary Events

| Event | Emitted By | Purpose |
|-------|------------|---------|
| `validation_started` | component-validation | Progress tracking |
| `sandbox_test_created` | sandbox-testing | Progress tracking |
| `sandbox_approved` | sandbox-testing | Manual approval tracking |
| `component_modified` | (external) | Trigger revalidation |
| `story_completed` | pass-orchestration | Story fully done |

## Skill Autonomy Levels

### Fully Autonomous (Current Configuration)

All skills operate with **zero operator approval required**:

- **contract-creation**: Auto-generates contracts based on component analysis
- **component-validation**: Auto-runs all 4 validation levels
- **sandbox-testing**: Auto-creates tests, auto-approves if tests pass
- **component-integration**: Auto-injects into main files
- **pass-orchestration**: Auto-tracks and transitions passes
- **progress-reporter**: Auto-updates execution-status.yaml

### Operator's Role

1. **Initiate**: Run high-level commands (`/integrate`, `/first-pass`, etc.)
2. **Monitor**: Receive summary notifications of autonomous progress
3. **Intervene**: Only if errors occur or manual fixes needed
4. **Approve**: Only for major milestones (pass transitions, if configured)

## Event Log

### Location
`.system/events/event-log.yaml`

### Purpose
- Track all events in current session
- Debug event chains
- Audit autonomous operations
- Performance metrics

### Example Entry
```yaml
- timestamp: "2025-01-15T14:23:45Z"
  event: "component_proven"
  payload:
    component_name: "login-form"
    proven_path: ".system/proven/login-form/"
  emitted_by: "sandbox-testing-skill"
  triggered_skills:
    - "component-integration"
    - "progress-reporter"
  status: "success"
  duration_ms: 1250
```

## Failure Handling

### Validation Failure Example

**Event Chain:**
```
component_extracted
    ↓
contract_created
    ↓
validation_completed (status: FAILED, level: 3)
    ↓
❌ Chain halts (sandbox-testing NOT triggered)
    ↓
Operator notified: "submit-button failed validation (Level 3: Contract compliance)"
```

**Operator sees:**
```
✓ login-form: All 4 levels passed → Proven → Integrated
✓ password-input: All 4 levels passed → Proven → Integrated
✗ submit-button: Validation failed at Level 3 (Contract compliance)

2/3 components integrated.

Fix validation issues:
- .system/components/submit-button/validation-report.md

Then re-run: /integrate references/login-prototype.html
(Already-processed components will be skipped)
```

## Integration with Execution Status

The `progress-reporter` skill automatically updates `.system/execution-status.yaml` after each significant event:

### Status Updates

| Event | Status Update |
|-------|---------------|
| `contract_created` | Component status: "draft" → "contract_defined" |
| `validation_completed` (passed) | Component status: "contract_defined" → "validated" |
| `component_proven` | Component status: "validated" → "proven" |
| `component_integrated` | Component status: "proven" → "integrated" |
| `pass_completed` | Story pass status: "in_progress" → "completed" |

### Example Status Snippet
```yaml
stories:
  story-1-user-authentication:
    status: "second-pass-in-progress"
    pass_status:
      second-pass:
        status: "in-progress"
        components:
          - name: "login-form"
            status: "integrated"  # ← Auto-updated by progress-reporter
          - name: "password-input"
            status: "integrated"
          - name: "submit-button"
            status: "validated"  # ← Stopped at validation (failed sandbox)
```

## Command Integration

### How Commands Emit Events

Commands use a standard event emission pattern:

```markdown
# In /integrate command

After sharding each component:
  - Emit event: component_extracted
    - component_name: {name}
    - source_file: {prototype_path}
    - component_path: .system/components/{name}/
    - contract_exists: {boolean}
```

### How Skills Listen for Events

Skills declare their triggers in the trigger-matrix:

```yaml
# In trigger-matrix.yaml

skills:
  contract-creation:
    auto_triggers:
      - event: "component_extracted"
        conditions:
          - "contract_exists == false"
        priority: 1
        action: "create_contract"
```

When an event is emitted:
1. Event system checks trigger-matrix
2. Finds all skills listening for that event
3. Evaluates conditions
4. Executes skills in priority order
5. Skills emit their own events
6. Chain continues

## Parallel Processing

### Default Behavior
Components process **in parallel** (configurable in trigger-matrix):

```yaml
execution:
  parallel_component_processing: true
  max_parallel_components: 5
```

### Example: 3 Components

```
Time ──────────────────────────────────►

Component 1: [Extract]─[Contract]─[Validate]─[Sandbox]─[Integrate] ✓
Component 2: [Extract]─[Contract]─[Validate]─[Sandbox]─[Integrate] ✓
Component 3: [Extract]─[Contract]─[Validate]──✗ FAILED

All 3 components start processing simultaneously.
Components 1 & 2 complete fully.
Component 3 halts at validation.
```

## Notification Settings

### Verbosity Levels

Configured in trigger-matrix.yaml:

- **silent**: No notifications (except errors)
- **summary**: High-level milestones only (default)
- **detailed**: Each skill execution
- **verbose**: Every event emitted

### Default Configuration (Summary)

Operator sees notifications for:
- ✓ Component proven
- ✗ Validation failed
- ✓ Pass completed
- ✓ Story completed

Operator does NOT see notifications for:
- Contract created (too granular)
- Validation started (too granular)
- Individual validation levels (too granular)

## Benefits

### For Operators
- **Simplicity**: Run one command, system handles the rest
- **Confidence**: Know that validation happened automatically
- **Visibility**: See summary of what happened
- **Control**: Intervene only when needed

### For Development Quality
- **Consistency**: Every component goes through same validation
- **No shortcuts**: Can't skip validation to save time
- **Traceability**: Event log shows full audit trail
- **Reproducibility**: Same inputs → same event chain → same results

### For Workflow Efficiency
- **Parallelization**: Multiple components process simultaneously
- **Zero coordination overhead**: No manual "now validate, now test, now integrate"
- **Fast iteration**: Fix → re-run → auto-processes only what changed
- **Scalability**: Works for 3 components or 30 components

## Future Enhancements

### Build Intelligence Integration

Event log can feed `.system/build-intelligence/`:
- Track which validation levels fail most often
- Identify components that frequently need rework
- Predict integration issues before they occur
- Suggest optimizations based on patterns

### Conditional Autonomy

Future configuration option:
```yaml
skills:
  sandbox-testing:
    autonomy_level: "conditional"
    require_approval_if:
      - "component_complexity > 500_lines"
      - "css_namespace_conflicts > 0"
```

### Learning from Failures

```yaml
failure_patterns:
  - pattern: "CSS namespace conflicts in modals"
    auto_fix: "Add .modal- prefix to all selectors"
    confidence: 0.85
```

## Related Files

- **Trigger Matrix**: `.claude/skills/trigger-matrix.yaml`
- **Event Log**: `.system/events/event-log.yaml`
- **Execution Status**: `.system/execution-status.yaml`
- **Individual Skills**: `.claude/skills/{skill_name}.md`
- **Commands**: `.claude/commands/personal/integrate.md`

## Usage Examples

### Example 1: Single Component

```bash
/integrate references/donut-chart.html
```

**Autonomous chain:**
1. Extract donut-chart component
2. Create contract
3. Validate (4 levels)
4. Prove in sandbox
5. Integrate into main files
6. Update execution status

**Result:** Component fully integrated, zero manual steps

### Example 2: Multi-Component Prototype

```bash
/integrate references/dashboard-prototype.html
```

**Autonomous chain (parallel):**
- 5 components extracted
- 5 contracts created simultaneously
- 5 validations run simultaneously
- 4 pass validation → proven → integrated
- 1 fails validation → operator notified → chain halts for that component

**Result:** 4/5 components integrated, 1 needs fixes, full visibility

### Example 3: Re-run After Fix

```bash
# Fix the failed component manually
# Then re-run the same command

/integrate references/dashboard-prototype.html
```

**Smart behavior:**
- Detects 4 components already integrated (skips)
- Processes only the fixed component
- Runs full validation chain
- Integrates if validation passes

**Result:** Efficient re-processing, no duplicate work

## Conclusion

The event-driven skills system transforms the component workflow from:

**Manual (Old):**
```
/integrate → /define-contract → /validate-component → /prove-it-works → manual integration
(5+ commands, high coordination overhead)
```

**Autonomous (New):**
```
/integrate → ✓ Done
(1 command, zero coordination, full validation guaranteed)
```

This is the foundation for the three-pass execution pipeline, where operators focus on high-level pass progression while the system handles all component-level orchestration autonomously.
