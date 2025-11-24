# Pass Manager Skill

**Isolation Level**: ORC-EXE only
**Invocation**: Direct (not event-driven)
**Purpose**: Manage three-pass development lifecycle with autonomous execution and milestone-based QA gates

## Overview

This skill orchestrates the three-pass development system:

| Pass | Goal | Autonomy | QA Gates |
|------|------|----------|----------|
| **1st Pass** | Functional skeleton (all stories built) | Parallel within chunks | Per-chunk milestones |
| **2nd Pass** | Component polish (autonomous building) | Highly autonomous with review queue | Per-component queue |
| **3rd Pass** | Debug and polish | Mixed (autonomous fixes + manual edge cases) | Final validation |

**Key Principle**: Between QA gates, execution is fully autonomous. Operator reviews at natural milestone checkpoints.

## Invocation Pattern

```
orc-exe → pass-manager.md → execution-status.yaml updates
```

## Three-Pass Definitions

### First Pass: Skeleton Build

**Goal**: Build ALL stories across ALL epics with functional backend and minimal/ugly frontend.

**Execution Model**:
```yaml
first_pass:
  strategy: "chunk-sequential-story-parallel"
  description: "Build chunks in dependency order, stories within chunks in parallel"

  execution_flow:
    1. Load parallel-boundaries.yaml
    2. Start with foundation chunk
    3. Within chunk: parallel terminals build stories
    4. Chunk complete → milestone QA gate
    5. Operator reviews and approves
    6. Next chunk begins
    7. Repeat until all chunks complete

  autonomy_level: "high"
  operator_involvement: "milestone_only"

  completion_criteria:
    - "All stories have working backend"
    - "All acceptance criteria testable"
    - "Unit tests pass"
    - "App is end-to-end functional (ugly but works)"
```

### Second Pass: Component Building

**Goal**: Polish components autonomously with review queue for operator feedback.

**Execution Model**:
```yaml
second_pass:
  strategy: "component-parallel-with-queue"
  description: "Build all components in parallel, add to review queue, operator reviews async"

  execution_flow:
    1. Load component list from parallel-boundaries.yaml
    2. Start N terminals for N components
    3. Each terminal: build component, validate against contract, add to queue
    4. Console notifies operator of queue additions
    5. Operator reviews queue at their pace (non-blocking)
    6. Failed components: operator provides reference file → autonomous retry
    7. Continue until all components in queue approved

  autonomy_level: "very_high"
  operator_involvement: "queue_review"

  completion_criteria:
    - "All components built and validated"
    - "All queue items approved"
    - "UI polished and design-compliant"
    - "MCP validation passes"
```

### Third Pass: Debug & Polish

**Goal**: Fix bugs, polish edge cases, prepare for production.

**Execution Model**:
```yaml
third_pass:
  strategy: "issue-driven"
  description: "Address issues from testing, polish remaining items"

  execution_flow:
    1. Operator identifies issues from testing
    2. Issues added to work queue
    3. Autonomous fixes routine issues
    4. Complex issues: operator guides or takes manual control
    5. Final validation sweep
    6. Production readiness check

  autonomy_level: "mixed"
  operator_involvement: "active_guidance"

  completion_criteria:
    - "All known bugs fixed"
    - "Performance acceptable"
    - "Accessibility validated"
    - "Cross-browser tested"
    - "Production ready"
```

## Capabilities

### 1. View Pass Status
Display current pass, progress, and next actions.

**Usage:**
```
*pass-status
```

**Output:**
```
=== PASS STATUS ===

Current Pass: SECOND PASS (Component Building)
Started: 2025-11-15T10:00:00Z
Progress: 8/15 components complete

First Pass: COMPLETE
  - 6 chunks completed
  - 18 stories built
  - Skeleton fully functional

Second Pass: IN PROGRESS
  - 8 components built and approved
  - 4 components in queue (pending review)
  - 2 components building (autonomous)
  - 1 component needs attention (carousel)

Third Pass: NOT STARTED

Next Actions:
  1. Review 4 pending components in queue (*queue)
  2. Provide reference for carousel (*intervene carousel [ref])
  3. Wait for autonomous to complete remaining 2 components
```

### 2. Advance Pass
Move to next pass (with validation).

**Usage:**
```
*advance-pass
```

**Validation Before Advance:**
- First → Second: All chunks complete, all milestones approved
- Second → Third: All components approved in queue
- Third → Done: All completion criteria met

**Output:**
```
=== PASS TRANSITION ===

Validating First Pass completion...
  [OK] All 6 chunks complete
  [OK] All 18 stories have working backend
  [OK] All milestone QA gates approved
  [OK] App is end-to-end functional

Ready to advance to Second Pass?
  - Autonomous component building will begin
  - Components will be added to review queue
  - You can review at your own pace

Type 'yes' to confirm, 'no' to stay in current pass.
```

### 3. Force Pass (Emergency)
Force advance without validation (use with caution).

**Usage:**
```
*force-pass [target-pass]
```

**Warning Output:**
```
WARNING: Forcing pass advance bypasses validation.
Current pass completion criteria NOT met:
  [FAIL] 2 chunks incomplete
  [FAIL] 3 stories missing tests

Are you sure? This may cause issues in later passes.
Type 'force' to confirm.
```

### 4. Pass Rollback
Return to previous pass (rare, for major issues).

**Usage:**
```
*rollback-pass
```

### 5. Milestone Check
Check if current milestone is ready for QA approval.

**Usage:**
```
*milestone-check
```

**Output:**
```
=== MILESTONE CHECK: foundation-complete ===

Chunk: foundation
Components: [data-layer, auth-module, shared-config]

Validation Results:
  [OK] data-layer: complete, tests pass
  [OK] auth-module: complete, tests pass
  [OK] shared-config: complete, tests pass

QA Focus Areas:
  - Database schema correct
  - Auth flow works end-to-end
  - Config loads properly

Acceptance Criteria:
  [OK] Can create user account
  [OK] Can login and get session
  [OK] Unit tests pass

Milestone Status: READY FOR APPROVAL
Run *approve-milestone to proceed to next chunk.
```

### 6. Approve Milestone
Approve current milestone and proceed.

**Usage:**
```
*approve-milestone [notes]
```

**Effect:**
- Records milestone approval
- Unblocks next chunk for execution
- Updates execution-status.yaml

## Execution Status Updates

The pass-manager updates `.system/execution-status.yaml`:

```yaml
# Updated by pass-manager skill
current_state:
  current_pass: "second_pass"
  pass_started: "2025-11-15T10:00:00Z"
  current_chunk: null  # N/A in second pass
  current_milestone: null

# Pass progress tracking
pass_progress:
  first_pass:
    status: "complete"
    started: "2025-11-14T08:00:00Z"
    completed: "2025-11-15T09:30:00Z"
    chunks_complete: 6
    chunks_total: 6
    stories_complete: 18
    stories_total: 18
    milestones_approved:
      - foundation-complete
      - core-features-complete
      - ui-integration-complete

  second_pass:
    status: "in_progress"
    started: "2025-11-15T10:00:00Z"
    completed: null
    components_complete: 8
    components_total: 15
    components_in_queue: 4
    components_needs_attention: 1

  third_pass:
    status: "not_started"
    started: null
    completed: null
    issues_fixed: 0
    issues_total: 0
```

## Autonomous Execution Control

### First Pass Autonomous Mode
```yaml
first_pass_autonomous:
  enabled: true
  scope: "within_chunk"

  automatic_actions:
    - "Start next story in chunk when terminal free"
    - "Run tests after story completion"
    - "Add to milestone check list"

  requires_approval:
    - "Milestone completion (chunk boundary)"
    - "Story with failing tests"
    - "Unexpected errors"
```

### Second Pass Autonomous Mode
```yaml
second_pass_autonomous:
  enabled: true
  scope: "all_components"

  automatic_actions:
    - "Build component from contract"
    - "Validate against MCP"
    - "Add to review queue"
    - "Retry with reference file if provided"

  requires_approval: []  # Fully autonomous, queue is non-blocking

  notifications:
    - "Component added to queue"
    - "Component needs attention"
    - "All components complete"
```

### Third Pass Autonomous Mode
```yaml
third_pass_autonomous:
  enabled: true
  scope: "routine_fixes"

  automatic_actions:
    - "Apply automated fixes for known patterns"
    - "Run validation suite"
    - "Update issue status"

  requires_approval:
    - "Complex bug fixes"
    - "Architectural changes"
    - "Performance optimizations"
```

## Integration with Parallel Boundaries

Pass-manager reads `parallel-boundaries.yaml` for:
- Chunk definitions (first pass execution order)
- Component list (second pass building targets)
- Milestones (first pass QA gates)
- Dependencies (execution ordering)

```yaml
boundaries_integration:
  first_pass:
    uses: ["chunks", "milestones", "dependencies"]
    execution: "Chunk-by-chunk with milestone gates"

  second_pass:
    uses: ["components"]
    execution: "All components in parallel with review queue"

  third_pass:
    uses: []  # Issue-driven, not boundary-driven
    execution: "Fix issues as identified"
```

## Usage Examples

### Example 1: Starting First Pass
```
Operator: /orc-exe
Orchestrator: Loading execution context...

Operator: *pass-status
Output:
  Current Pass: FIRST PASS (Skeleton Build)
  Progress: 0/6 chunks complete
  Next: Start foundation chunk

Operator: *start-execution
Orchestrator: Starting first pass execution...
  - Loading parallel-boundaries.yaml
  - Chunk 'foundation' starting
  - Spawning 3 terminals for foundation components
  [Autonomous execution begins]
```

### Example 2: Milestone Approval
```
[After foundation chunk completes]

Console: [MILESTONE] foundation-complete ready for review

Operator: *milestone-check
[Shows validation results]

Operator: *approve-milestone "Auth works, DB schema good"
Orchestrator: Milestone approved. Starting 'core-features' chunk...
```

### Example 3: Transitioning to Second Pass
```
[After all chunks complete]

Operator: *pass-status
Output:
  Current Pass: FIRST PASS
  Status: ALL CHUNKS COMPLETE
  Ready for: Second Pass transition

Operator: *advance-pass
Orchestrator: Validating first pass completion...
  [All validations pass]
  Advancing to Second Pass (Component Building)...
  - Loading component list (15 components)
  - Starting autonomous parallel build
  - Review queue active
  [Autonomous execution begins]
```

### Example 4: Second Pass Queue Review
```
[During second pass]

Console:
  [QUEUE] login-form added (completed)
  [QUEUE] signup-form added (completed)
  [QUEUE] carousel added (needs_attention)

Operator: *queue
[Shows 2 completed, 1 needs attention]

Operator: *approve login-form "Good"
Operator: *approve signup-form "Good"
Operator: *intervene carousel docs/refs/carousel.md
[Autonomous retries carousel with reference]
```

## Isolation Rules

1. **Direct Invocation Only**: Only orc-exe can call this skill
2. **Contract-Based**: Uses contract files for coordination
3. **Synchronous Operation**: Pass operations complete immediately
4. **File Ownership**: Updates execution-status.yaml

## Integration Points

**Reads**:
- `.system/execution-status.yaml` (current state)
- `docs/sprint-artifacts/parallel-boundaries.yaml` (boundaries)
- `docs/sprint-artifacts/sprint-status.yaml` (story statuses)
- `.system/review-queue.yaml` (queue state for second pass)

**Writes**:
- `.system/execution-status.yaml` (pass progress)
- `.system/pass-history.yaml` (transition history)

**Coordinates With**:
- `review-queue.md` (second pass queue management)
- `coordinate-agents.md` (terminal spawning)
- `parallel-coordinator.md` (parallel execution)
- `parallel-status.md` (status display)
