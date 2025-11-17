# Progress Reporter Skill

**Autonomy Level:** Fully Autonomous

**Purpose:** Automatically update `.system/execution-status.yaml` and `.system/events/event-log.yaml` as components and stories progress through the three-pass workflow.

## Trigger Conditions

### Auto-Triggers (Priority: 10 - Always runs last)

This skill triggers on **every significant event** to maintain real-time status tracking:

| Event | Action |
|-------|--------|
| `component_extracted` | Initialize component entry |
| `contract_created` | Update component status → "contract_defined" |
| `validation_started` | Update component status → "validating" |
| `validation_completed` | Update component status → "validated" (if passed) |
| `sandbox_test_created` | Update component status → "sandbox-testing" |
| `component_proven` | Update component status → "proven" |
| `component_integrated` | Update component status → "integrated" |
| `pass_completed` | Update pass status → "completed", increment metrics |
| `story_completed` | Update story status → "completed", increment metrics |

### Manual Triggers

- "update status"
- "refresh execution status"
- "recalculate metrics"

## Skill Workflow

### 1. Listen for Events

Monitor event stream from trigger-matrix:

```yaml
# Event received
event: "component_proven"
payload:
  component_name: "login-form"
  proven_path: ".system/proven/login-form/"
  story: "story-1-user-authentication"
timestamp: "2025-01-15T11:30:00Z"
```

### 2. Load Execution Status

Read current state from `.system/execution-status.yaml`:

```yaml
stories:
  story-1-user-authentication:
    pass_status:
      second-pass:
        components:
          - name: "login-form"
            status: "validated"  # ← Current status
```

### 3. Update Component Status

Based on event type, update component status:

**Status Progression:**
```
draft
  → contract_defined
    → validating
      → validated
        → sandbox-testing
          → proven
            → integrated
```

**After `component_proven` event:**

```yaml
stories:
  story-1-user-authentication:
    pass_status:
      second-pass:
        components:
          - name: "login-form"
            status: "proven"  # ← Updated
            contract: ".system/contracts/login-form-contract.md"
            validation_report: ".system/components/login-form/validation-report.md"
            sandbox: ".system/sandbox/login-form-test.html"
            proven_path: ".system/proven/login-form/"  # ← Added
            proven_date: "2025-01-15T11:30:00Z"  # ← Added
```

### 4. Recalculate Metrics

Auto-calculate aggregate metrics across all stories:

#### Story-Level Metrics

```yaml
metrics:
  stories_total: 8
  stories_first_pass_complete: 3
  stories_second_pass_complete: 1
  stories_third_pass_complete: 0
  stories_fully_complete: 1
```

**Calculation logic:**
- Count stories where `pass_status.first-pass.status == "completed"`
- Count stories where `pass_status.second-pass.status == "completed"`
- Count stories where `pass_status.third-pass.status == "completed"`
- Count stories where all three passes == "completed"

#### Component-Level Metrics

```yaml
metrics:
  components_total: 12
  components_contract_defined: 12
  components_validated: 10
  components_proven: 8
  components_integrated: 5
```

**Calculation logic:**
- Iterate through all stories' `pass_status.second-pass.components[]`
- Count components by status

#### Quality Metrics

```yaml
metrics:
  validation_failures: 2
  sandbox_failures: 0
  integration_conflicts: 3
```

**Sources:**
- Count validation reports with `status: "failed"`
- Count sandbox tests that weren't approved
- Count integration conflicts logged in integration-report.md

#### Time Tracking

```yaml
metrics:
  total_time_minutes: 420  # 7 hours
  avg_component-integration_minutes: 35
  avg_story_first_pass_hours: 4
  avg_story_second_pass_hours: 2
  avg_story_third_pass_hours: 1.5
```

**Calculation logic:**
- Track timestamps for pass start/complete
- Calculate duration per pass
- Calculate averages across completed stories/components

### 5. Update Current State

Update current execution pointers:

```yaml
current_state:
  current_pass: "second-pass"  # Which pass we're in
  current_story: "story-1-user-authentication"  # Active story
  current_component: "login-form"  # Being processed (if applicable)

  next_action:
    type: "component-integration"
    command: "/integrate references/login-prototype.html"
    description: "Continue integrating components for second pass"
```

**Update triggers:**
- `current_component`: When validation/sandbox/integration starts
- `current_story`: When pass transitions or story completes
- `current_pass`: When pass transitions
- `next_action`: Based on current progress (calculated by pass-orchestration)

### 6. Log Event to Event Log

Append event to `.system/events/event-log.yaml`:

```yaml
- timestamp: "2025-01-15T11:30:00Z"
  event: "component_proven"
  payload:
    component_name: "login-form"
    proven_path: ".system/proven/login-form/"
    story: "story-1-user-authentication"
  emitted_by: "sandbox-testing_skill"
  triggered_skills:
    - "component-integration"
    - "progress-reporter"
  status: "success"
  duration_ms: 1250
  execution_status_updated: true
```

### 7. Update Recent Events

Maintain rolling list of last 10 events in execution-status.yaml:

```yaml
recent_events:
  - timestamp: "2025-01-15T11:30:00Z"
    event: "component_proven"
    component: "login-form"
    story: "story-1-user-authentication"

  - timestamp: "2025-01-15T11:28:00Z"
    event: "validation_completed"
    component: "login-form"
    status: "passed"
    story: "story-1-user-authentication"

  # ... (8 more recent events)
```

**Purpose:**
- Quick context for debugging
- Visible in execution-status without opening event-log
- Shows recent activity at a glance

### 8. Check for Milestones

Detect significant milestones and flag them:

#### Component Milestone: First Component Integrated

```yaml
# First component ever integrated in this project
milestones:
  - type: "first-component-integrated"
    component: "login-form"
    date: "2025-01-15T11:35:00Z"
    message: "🎯 First component successfully integrated!"
```

#### Pass Milestone: First Pass Complete

```yaml
milestones:
  - type: "first-pass-complete"
    story: "story-1-user-authentication"
    date: "2025-01-15T16:00:00Z"
    message: "✓ First story through first-pass!"
```

#### Story Milestone: First Story Complete

```yaml
milestones:
  - type: "first-story-complete"
    story: "story-1-user-authentication"
    date: "2025-01-15T18:00:00Z"
    message: "🚀 First story fully complete (all passes)!"
```

### 9. Optimize Performance

**Incremental updates** (not full recalculation):

```yaml
# Instead of recounting everything:
# Bad (slow):
metrics:
  components_proven: count_all_components_with_status("proven")

# Good (fast):
# When component_proven event received:
metrics:
  components_proven: previous_value + 1
  components_validated: previous_value - 1  # Moved from validated to proven
```

**Batch updates** for multiple events:

```yaml
# If 5 components proven simultaneously:
# Bad (5 file writes):
For each component:
  - Load execution-status.yaml
  - Update component
  - Write execution-status.yaml

# Good (1 file write):
- Load execution-status.yaml
- Update all 5 components
- Recalculate metrics once
- Write execution-status.yaml once
```

### 10. Validate Data Integrity

Before writing updates, validate:

**Schema validation:**
- All required fields present
- Timestamps in correct format
- Status values from allowed enum
- Metrics are non-negative integers

**Referential integrity:**
- Components reference valid stories
- Stories reference valid epics (if applicable)
- File paths exist for artifacts

**If validation fails:**
- Log error to event-log
- Attempt to auto-correct (e.g., fix timestamp format)
- If auto-correct fails, notify operator and skip update

## Update Patterns

### Pattern 1: Component Status Update

**Trigger:** Any component event

```yaml
# Before
components:
  - name: "login-form"
    status: "validated"

# After component_proven event
components:
  - name: "login-form"
    status: "proven"  # ← Status updated
    proven_path: ".system/proven/login-form/"  # ← Path added
    proven_date: "2025-01-15T11:30:00Z"  # ← Timestamp added
```

### Pattern 2: Pass Completion Update

**Trigger:** `pass_completed` event

```yaml
# Before
pass_status:
  second-pass:
    status: "in-progress"
    started_date: "2025-01-15T10:00:00Z"
    components: [...]

# After pass_completed event
pass_status:
  second-pass:
    status: "completed"  # ← Status updated
    started_date: "2025-01-15T10:00:00Z"
    completed_date: "2025-01-15T17:30:00Z"  # ← Timestamp added
    duration_hours: 7.5  # ← Duration calculated
    components: [...]

  third-pass:
    status: "in-progress"  # ← Next pass started
    started_date: "2025-01-15T17:31:00Z"  # ← Timestamp added
```

### Pattern 3: Metrics Update

**Trigger:** Any status change

```yaml
# Increment appropriate counters
metrics:
  components_proven: 5  # ← Incremented
  components_validated: 4  # ← Decremented (moved to proven)
```

### Pattern 4: Current State Update

**Trigger:** Pass transition, story start/complete

```yaml
# After story completion
current_state:
  current_pass: "first-pass"  # ← Reset to first pass
  current_story: "story-2-user-profile"  # ← Move to next story
  current_component: null
  next_action:
    type: "start-story"
    command: "/dev-story story-2-user-profile"
    description: "Start backend development for next story"
```

## Event Log Management

### Location
`.system/events/event-log.yaml`

### Structure

```yaml
# Event Log - Complete history of all events
session_start: "2025-01-15T09:00:00Z"
project: "project-template"

events:
  - id: "evt-001"
    timestamp: "2025-01-15T11:30:00Z"
    event: "component_proven"
    payload:
      component_name: "login-form"
      proven_path: ".system/proven/login-form/"
      story: "story-1-user-authentication"
    emitted_by: "sandbox-testing_skill"
    triggered_skills:
      - "component-integration"
      - "progress-reporter"
    status: "success"
    duration_ms: 1250
    execution_status_updated: true

  - id: "evt-002"
    timestamp: "2025-01-15T11:35:00Z"
    event: "component_integrated"
    # ... (more events)

# Total events logged
total_events: 2
```

### Log Rotation

**Retention policy:**
- Keep events for 30 days (configurable)
- Archive older events to `.system/events/archive/event-log-{date}.yaml`
- Compress archives after 90 days

**Auto-cleanup:**
```yaml
# Run daily at midnight
cleanup:
  archive_after_days: 30
  compress_after_days: 90
  delete_after_days: 365
```

## Performance Optimizations

### Caching

```yaml
# Cache frequently accessed data
cache:
  execution_status:
    last_loaded: "2025-01-15T11:30:00Z"
    content: {...}  # In-memory copy
  metrics:
    last_calculated: "2025-01-15T11:30:00Z"
    values: {...}
```

**Cache invalidation:**
- On any status update
- After 5 minutes (stale data)

### Debouncing

**Problem:** 5 components proven simultaneously → 5 updates in rapid succession

**Solution:** Debounce updates with 2-second window

```yaml
# Events arrive:
11:30:00 - component_proven (login-form)
11:30:01 - component_proven (password-input)
11:30:01 - component_proven (submit-button)

# Instead of 3 file writes:
# Wait 2 seconds, batch all updates, write once at 11:30:03
```

### Differential Updates

**Only write changed fields:**

```yaml
# Instead of writing entire 500-line YAML file:
# Bad (slow):
Write entire execution-status.yaml (500 lines)

# Good (fast):
Update only changed section:
- Line 156: status: "proven"
- Line 157: proven_date: "2025-01-15T11:30:00Z"
- Line 450: components_proven: 6
```

## Integration with Other Skills

### Relationship to pass-orchestration

**Division of responsibilities:**

| Skill | Responsibility |
|-------|----------------|
| **progress-reporter** | Update raw data (statuses, timestamps, metrics) |
| **pass-orchestration** | Interpret data, make decisions, suggest next actions |

**Example:**

```yaml
# progress-reporter updates:
stories:
  story-1:
    pass_status:
      second-pass:
        components:
          - {status: "integrated"}
          - {status: "integrated"}
          - {status: "integrated"}
        # All 3 components integrated

# pass-orchestration reads and decides:
current_state:
  next_action:
    type: "transition-to-third-pass"
    command: "/third-pass story-1"
    # Because all components integrated
```

### Relationship to other skills

**All skills depend on progress-reporter:**

| Skill | Dependency |
|-------|------------|
| contract-creation | Updates component status → "contract_defined" |
| component-validation | Updates component status → "validated" |
| sandbox-testing | Updates component status → "proven" |
| component-integration | Updates component status → "integrated" |
| pass-orchestration | Reads status to make decisions |

**Flow:**
```
Any skill completes work
  ↓
Emits event
  ↓
progress-reporter auto-triggers
  ↓
Updates execution-status.yaml
  ↓
Other skills read updated status
```

## Operator Visibility

### Silent Operation (Default)

Progress reporter runs **silently** in background. Operator only sees results:

```
# Operator runs: /integrate references/login.html

# Operator sees:
✓ 3 components integrated

# What happened behind the scenes:
# progress-reporter updated execution-status.yaml 15+ times
# (operator doesn't see these updates - they're automatic)
```

### Explicit Status Check

**Operator can manually check at any time:**

```bash
# Read execution-status.yaml directly
cat .system/execution-status.yaml

# Or use /execution-status command (when implemented)
/execution-status

# See current state:
# - Current pass: second-pass
# - Current story: story-1
# - Components: 3/5 integrated
# - Next action: /integrate references/dashboard.html
```

## Error Handling

### File Lock Conflicts

```
Error: execution-status.yaml locked by another process

Action:
- Retry 3 times with exponential backoff (100ms, 200ms, 400ms)
- If still locked, queue update for next opportunity
- Log warning to event-log
```

### Data Corruption

```
Error: execution-status.yaml corrupted (invalid YAML syntax)

Action:
- Restore from backup (.system/execution-status.yaml.backup)
- Re-apply recent events from event-log
- Recalculate all metrics
- Notify operator of corruption and recovery
```

### Missing Story

```
Warning: Component "login-form" references non-existent story "story-1"

Action:
- Log warning
- Skip component update (don't create orphaned components)
- Suggest: "Verify story exists or fix component story reference"
```

## Configuration

Settings in `.system/execution-status.yaml`:

```yaml
config:
  auto_update: true  # Allow progress-reporter to auto-update
  update_debounce_seconds: 2  # Batch rapid updates
  event_log_enabled: true
  event_log_retention_days: 30
  cache_enabled: true
  cache_ttl_seconds: 300
  backup_before_update: true
  backup_retention_count: 10
```

## Backup Strategy

### Auto-Backup Before Updates

```yaml
# Before writing execution-status.yaml:
1. Copy current file to .system/execution-status.yaml.backup
2. Rotate backups (keep last 10)
3. Write updates to main file
```

### Backup Files

```
.system/
  execution-status.yaml (current)
  execution-status.yaml.backup (last version)
  backups/
    execution-status-2025-01-15-11-30-00.yaml
    execution-status-2025-01-15-10-00-00.yaml
    ... (10 backups total)
```

### Recovery Commands

```bash
# Restore from most recent backup
cp .system/execution-status.yaml.backup .system/execution-status.yaml

# Restore from specific backup
cp .system/backups/execution-status-2025-01-15-10-00-00.yaml .system/execution-status.yaml
```

## Related Files

- **Trigger Matrix:** `.claude/skills/trigger-matrix.yaml`
- **Event System:** `.claude/skills/event-system.md`
- **Execution Status:** `.system/execution-status.yaml` (updates this)
- **Event Log:** `.system/events/event-log.yaml` (updates this)
- **Backups:** `.system/backups/execution-status-*.yaml`

## Summary

The progress-reporter skill provides:

- **Real-time status tracking** of all components and stories
- **Automatic metric calculation** for progress visibility
- **Event logging** for complete audit trail
- **Silent operation** (no operator interruption)
- **Data integrity** with validation and backups
- **Performance optimization** via caching and batching

This skill is the **central nervous system** of the three-pass execution pipeline, keeping all status information accurate and up-to-date as work progresses autonomously.
