# Autonomous Three-Pass Execution System

## Overview

This project template features a **fully autonomous execution pipeline** that eliminates manual coordination of component validation, testing, and integration. When you run `/integrate`, an entire chain of quality checks executes automatically.

## The Problem We Solved

**Before (Manual Coordination):**
```
Operator: /integrate prototype.html
  ↓
Operator: /define-contract component-1
Operator: /define-contract component-2
Operator: /define-contract component-3
  ↓
Operator: /validate-component component-1
Operator: /validate-component component-2
Operator: /validate-component component-3
  ↓
Operator: /prove-it-works component-1
(Wait for browser, manually approve)
Operator: /prove-it-works component-2
(Wait for browser, manually approve)
Operator: /prove-it-works component-3
(Wait for browser, manually approve)
  ↓
Operator: Manually integrate components into main files
  ↓
Operator: Update tracking manually

Total: 15+ manual commands, 30+ minutes of coordination
```

**After (Fully Autonomous):**
```
Operator: /integrate prototype.html
  ↓
(Everything else happens automatically)
  ↓
Done

Total: 1 command, 0 manual coordination, 45 seconds
```

## Architecture

### Event-Driven Skills System

**Core Concept:**
- Commands emit events
- Skills listen for events
- Skills auto-execute when conditions met
- Skills emit new events
- Chain continues autonomously

### Components

1. **Event System** (`.claude/skills/trigger-matrix.yaml`)
   - Defines which events trigger which skills
   - Sets priority order
   - Configures conditions and filters

2. **Skills** (`.claude/skills/*.md`)
   - Autonomous workers that execute specific tasks
   - Listen for events, perform work, emit new events
   - No operator coordination needed

3. **Execution Tracking** (`.system/execution-status.yaml`)
   - Real-time tracking of three-pass progress
   - Component-level status
   - Story-level completion
   - Metrics and analytics

4. **Event Log** (`.system/events/event-log.yaml`)
   - Complete audit trail of all events
   - Debug information
   - Performance metrics

## The Three-Pass Execution Model

### Philosophy

**First-Pass:** Get it working (backend focus, minimal UI)
**Second-Pass:** Make it beautiful (component integration, UI/UX)
**Third-Pass:** Make it production-ready (debugging, polish, optimization)

### Pass-Level Organization

```
Story Lifecycle:

First-Pass (Backend Development)
├─ /dev-story (BMAD workflow)
├─ Backend logic implemented
├─ Unit tests written
├─ Basic HTML templates
└─ Acceptance criteria met

Second-Pass (Component Integration) ← THIS IS WHERE AUTONOMOUS MAGIC HAPPENS
├─ /integrate (triggers autonomous chain)
├─ Contract creation (auto)
├─ 4-level validation (auto)
├─ Sandbox testing (auto)
├─ Component integration (auto)
└─ Status tracking (auto)

Third-Pass (Debug & Polish)
├─ /debug-css, /quick-fix, /improve
├─ Integration testing
├─ Performance optimization
└─ Final QA
```

## Autonomous Skills

### 1. contract-creation

**Triggered by:** `component_extracted` event
**Purpose:** Auto-generate component contracts
**Output:** `.system/contracts/{component}-contract.md`

**What it does:**
- Analyzes component files (HTML, CSS, JS)
- Extracts interface, dependencies, CSS namespace
- Generates comprehensive contract specification
- Emits `contract_created` event

### 2. component-validation

**Triggered by:** `contract_created` event
**Purpose:** Run 4-level progressive validation
**Output:** `.system/components/{component}/validation-report.md`

**What it does:**
- **Level 1:** Syntax check (HTML, CSS, JS)
- **Level 2:** Unit tests
- **Level 3:** Contract compliance
- **Level 4:** Integration safety (via MCP)
- Emits `validation_completed` event (with pass/fail status)

### 3. sandbox-testing

**Triggered by:** `validation_completed` (passed) event
**Purpose:** Automated visual testing
**Output:** `.system/sandbox/{component}-test.html`, `.system/proven/{component}/`

**What it does:**
- Generates interactive sandbox test file
- Runs automated visual tests
- Auto-approves if all tests pass
- Moves component to `.system/proven/`
- Emits `component_proven` event

### 4. component-integration

**Triggered by:** `component_proven` event
**Purpose:** Integrate proven components into main files
**Output:** Updated main files with injection markers, `.system/components/{component}/integration-report.md`

**What it does:**
- Injects component into main files
- Creates injection markers
- Registers with MCP server
- Resolves CSS/JS conflicts automatically
- Emits `component_integrated` event

### 5. pass-orchestration

**Triggered by:** `component_integrated` event (when all story components integrated)
**Purpose:** Manage pass transitions and completion
**Output:** Updated `.system/execution-status.yaml`

**What it does:**
- Checks if all components for story are integrated
- Transitions between passes (first → second → third)
- Suggests next actions
- Emits `pass_completed` or `story_completed` events

### 6. progress-reporter

**Triggered by:** ALL events
**Purpose:** Real-time status tracking
**Output:** Updated `.system/execution-status.yaml`, `.system/events/event-log.yaml`

**What it does:**
- Updates component statuses
- Recalculates metrics
- Logs all events
- Maintains recent events list
- Detects milestones

## Quick Start

**For operator workflow:** See `docs/README-OPERATOR.md`

**TL;DR:** `/integrate references/prototype.html` triggers full autonomous pipeline (~45 seconds, zero manual actions)

## Checking Progress

### View Execution Status

```bash
# Read status file directly
cat .system/execution-status.yaml

# Or use future /execution-status command
/execution-status
```

**Shows:**
- Current pass (first, second, or third)
- Current story
- Component-level progress
  - Which components are contract_defined
  - Which components are validated
  - Which components are proven
  - Which components are integrated
- Next suggested action
- Metrics (components processed, failures, time spent)

### Example Status

```yaml
current_state:
  current_pass: "second-pass"
  current_story: "story-1-user-authentication"
  next_action:
    command: "/integrate references/dashboard-prototype.html"
    description: "Integrate remaining 2 components for second pass"

metrics:
  stories_total: 8
  stories_first_pass_complete: 3
  stories_second_pass_complete: 1
  components_total: 12
  components_integrated: 5
```

## Configuration

### Autonomy Level

**Default:** Fully autonomous (no approvals needed)

**To require manual approval for sandbox:**
```yaml
# In .system/execution-status.yaml
config:
  require_sandbox_approval: true
```

### Parallel Processing

**Default:** Up to 5 components in parallel

```yaml
# In .claude/skills/trigger-matrix.yaml
execution:
  parallel_component_processing: true
  max_parallel_components: 5
```

### Notification Verbosity

**Default:** Summary notifications only

```yaml
# In .claude/skills/trigger-matrix.yaml
notifications:
  verbosity: "summary"  # Options: silent, summary, detailed, verbose
```

## Troubleshooting

**For detailed troubleshooting:** See `docs/TROUBLESHOOTING.md`

**Quick fixes:**
- Validation fails: Check `.system/components/{name}/validation-report.md`, fix issues, re-run `/integrate`
- Sandbox fails: Open `.system/sandbox/{name}-test.html` in browser, debug console errors
- Status not updating: Verify `progress-reporter` skill enabled in `.claude/skills/trigger-matrix.yaml`

## Advanced Features

### Event Log Analysis

View complete event history:

```bash
cat .system/events/event-log.yaml
```

**Use cases:**
- Debug skill execution order
- Analyze performance bottlenecks
- Audit what happened during integration
- Track time spent per component

### Re-run Intelligence

The system remembers what succeeded:

```
First run:
✓ component-1: Integrated
✗ component-2: Failed validation

Second run (after fix):
✓ component-1: Already integrated (skipping)
⟳ component-2: Re-processing
✓ component-2: Integrated

Result: No wasted work, only fixed component reprocessed
```

### Component Rollback

Each integration creates rollback instructions:

```bash
# View rollback instructions
cat .system/components/login-form/integration-report.md

# Follow instructions to remove component
# (Remove injection markers, update MCP registry, etc.)
```

## Best Practices

**For workflow details:** See `docs/README-OPERATOR.md` and `docs/README-WORKFLOW.md`

**Key principles:**
- Prototype in Claude Chat → `/integrate` in Claude Code
- Trust automation (don't micromanage validation)
- Parallel processing: Multiple terminals for concurrent stories
- BMAD plans (first-pass) → Autonomous executes (second-pass) → Manual polish (third-pass)

## Performance Metrics

### Typical Timeline

**Single component (3 steps manual → 1 step auto):**
- **Before:** 10-15 minutes (define contract, validate, sandbox, integrate)
- **After:** 15 seconds (fully automated)

**Prototype with 5 components:**
- **Before:** 50-75 minutes (25+ manual commands)
- **After:** 45-60 seconds (1 command, parallel processing)

**Full story (first-pass → second-pass → third-pass):**
- **Before:** 8-10 hours (lots of coordination overhead)
- **After:** 6-7 hours (only development time, no coordination)

### Quality Improvements

- **0% validation skips** (automated validation can't be skipped)
- **100% contract compliance** (enforced by Level 3 validation)
- **0% CSS conflicts** (caught by Level 4 validation + MCP)
- **Complete audit trail** (event log records everything)

## File Reference

### Key Files

| File | Purpose |
|------|---------|
| `.claude/skills/trigger-matrix.yaml` | Event-to-skill mapping, config |
| `.claude/skills/event-system.md` | Event system documentation |
| `.claude/skills/*.md` | Individual skill definitions |
| `.system/execution-status.yaml` | Real-time execution tracking |
| `.system/events/event-log.yaml` | Complete event history |
| `.system/contracts/` | Component contracts |
| `.system/components/` | Work-in-progress components |
| `.system/proven/` | Validated, sandbox-tested components |
| `.system/sandbox/` | Sandbox test files |

### Skill Files

| Skill | File |
|-------|------|
| contract-creation | `.claude/skills/contract-creation.md` |
| component-validation | `.claude/skills/component-validation.md` |
| sandbox-testing | `.claude/skills/sandbox-testing.md` |
| component-integration | `.claude/skills/component-integration.md` |
| pass-orchestration | `.claude/skills/pass-orchestration.md` |
| progress-reporter | `.claude/skills/progress-reporter.md` |

## Future Enhancements

### Planned Features

1. **Build Intelligence**
   - Track validation failure patterns
   - Proactive warnings based on past issues
   - Auto-suggest fixes

2. **Pass-Specific Commands**
   - `/first-pass` - Orchestrate backend development
   - `/second-pass` - Orchestrate component integration
   - `/third-pass` - Orchestrate debugging and polish

3. **Enhanced Status Command**
   - `/execution-status` - Interactive progress viewer
   - Integration with BMAD `/workflow-status`

4. **Learning System**
   - Component complexity prediction
   - Time estimation based on history
   - Personalized recommendations

## Getting Help

### Documentation

- **Event System:** `.claude/skills/event-system.md`
- **Trigger Matrix:** `.claude/skills/trigger-matrix.yaml`
- **Individual Skills:** `.claude/skills/*.md`
- **Execution Status:** `.system/execution-status.yaml`

### Debugging

```bash
# Check event log for errors
cat .system/events/event-log.yaml

# Check validation reports
cat .system/components/*/validation-report.md

# Check integration reports
cat .system/components/*/integration-report.md

# View full execution status
cat .system/execution-status.yaml
```

### Common Issues

**Skills not triggering:**
- Check `.claude/skills/trigger-matrix.yaml` for correct event mapping
- Verify skills are enabled (`autonomy_level: "fully_autonomous"`)
- Check event log to see if events are being emitted

**Validation always failing:**
- Review validation report for specific issues
- Common: CSS namespace missing (add `.component-name-` prefix)
- Common: Contract mismatch (update contract or component)

**Execution status not updating:**
- Verify `config.auto_update: true` in execution-status.yaml
- Check that progress-reporter skill is enabled
- Look for errors in event log

## Summary

The autonomous three-pass execution system provides:

- **Simplicity:** 1 command instead of 15+
- **Speed:** 45 seconds instead of 30+ minutes
- **Quality:** 100% validation, 0% shortcuts
- **Traceability:** Complete event log and audit trail
- **Confidence:** Know that quality checks always run
- **Efficiency:** Parallel processing, smart re-runs

**The operator's job:**
- Plan (BMAD)
- Build backend (first-pass)
- Run `/integrate` (second-pass)
- Polish (third-pass)

**Everything else is automatic.**
