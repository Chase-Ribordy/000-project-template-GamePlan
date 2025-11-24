# Review Queue Skill

**Isolation Level**: ORC-EXE only
**Invocation**: Direct (not event-driven)
**Purpose**: Manage component review queue for non-blocking operator feedback during autonomous execution

## Overview

This skill manages a review queue that allows the orchestrator to continue building autonomously while operators review completed or failed components at their own pace. The queue provides a non-blocking feedback mechanism - components are added to the queue, but execution doesn't stop waiting for approval.

**Key Principle**: Operator checks things as they come, but doesn't block progress.

## Invocation Pattern

```
orc-exe → review-queue.md → .system/review-queue.yaml
```

## Queue File Location

`.system/review-queue.yaml`

## Queue Structure

```yaml
# Review Queue - Non-blocking operator feedback system
# Generated: 2025-11-15T10:00:00Z
#
# WORKFLOW:
# - Autonomous execution adds items to queue
# - Operator reviews at their pace (non-blocking)
# - Failed items may need reference file intervention
# - Approved items are archived

queue_meta:
  created: "2025-11-15T10:00:00Z"
  last_updated: "2025-11-15T12:30:00Z"
  total_processed: 15
  total_pending: 3

# Items awaiting operator review
pending_review:
  - id: "login-form-component"
    type: "component"
    status: "completed"
    added: "2025-11-15T12:30:00Z"
    chunk: "foundation"
    pass: "second"
    notes: "Ready for visual review"
    files_changed:
      - "src/components/LoginForm.tsx"
      - "src/components/LoginForm.css"
    validation_results:
      contract_valid: true
      tests_pass: true
      mcp_validated: true

  - id: "animation-carousel"
    type: "component"
    status: "needs_attention"
    added: "2025-11-15T11:45:00Z"
    chunk: "ui-integration"
    pass: "second"
    notes: "Animation timing validation failed"
    error: "CSS animation duration mismatch with contract"
    files_changed:
      - "src/components/Carousel.tsx"
    validation_results:
      contract_valid: false
      tests_pass: true
      mcp_validated: false
    reference_file: null  # Operator fills this when intervening

# Items currently being reviewed by operator
in_review: []

# Recently approved items (last 20)
approved:
  - id: "auth-service"
    type: "component"
    approved: "2025-11-15T11:00:00Z"
    approved_by: "operator"
    notes: "Looks good"

# Items that required operator intervention
interventions:
  - id: "fancy-animation"
    type: "component"
    intervention_date: "2025-11-15T10:30:00Z"
    reason: "Autonomous couldn't match design spec"
    reference_file: "docs/references/fancy-animation-spec.md"
    resolution: "Rebuilt with reference, now approved"
    resolved: true
```

## Capabilities

### 1. Add to Queue
Add completed or failed components to the review queue.

**Triggers:**
- Component build completes (autonomous adds to queue)
- Component validation fails (autonomous adds with `needs_attention`)
- Manual addition by orchestrator

**Usage:**
```
*queue-add [component-id] [status: completed|needs_attention] [notes]
```

**Example:**
```yaml
# Component completed successfully
- id: "user-profile"
  status: "completed"
  notes: "Profile page ready for visual review"

# Component failed validation
- id: "complex-chart"
  status: "needs_attention"
  error: "D3.js rendering doesn't match contract spec"
  notes: "May need reference file for chart styling"
```

### 2. View Queue
Display current queue status in console.

**Usage:**
```
*queue
```

**Output:**
```
=== REVIEW QUEUE STATUS ===

PENDING REVIEW (3 items):
  [completed] login-form-component (12:30) - Ready for visual review
  [needs_attention] animation-carousel (11:45) - Animation timing validation failed
  [completed] user-settings (12:15) - Settings panel ready

NEEDS ATTENTION (1 item):
  animation-carousel - Reference file needed

RECENTLY APPROVED (5 items):
  auth-service, data-table, nav-menu, footer, header

Next suggested action: Review animation-carousel (blocking autonomous retry)
```

### 3. Approve Item
Mark item as approved and archive.

**Usage:**
```
*approve [component-id] [notes]
```

**Effect:**
- Moves item from `pending_review` to `approved`
- Records approval timestamp
- Autonomous can continue to dependent work

### 4. Intervene
Mark item as needing operator intervention with reference file.

**Usage:**
```
*intervene [component-id] [reference-file-path]
```

**Effect:**
- Creates intervention record
- Associates reference file with component
- Triggers autonomous retry with reference

**Reference File Flow:**
1. Operator sees `needs_attention` item
2. Operator creates reference file (any format they choose)
3. Operator runs `*intervene component-id path/to/reference.md`
4. Autonomous reads reference and retries component build
5. If successful, component goes back to `pending_review` as `completed`

### 5. Retry
Request autonomous retry of a failed component.

**Usage:**
```
*retry [component-id]
```

**Effect:**
- Queues component for autonomous rebuild
- Uses reference file if one was provided
- Results go back into queue

## Console Notifications

When items are added to queue, print notification:

```
[QUEUE] Component 'login-form' added (completed) - Ready for visual review
[QUEUE] Component 'carousel' added (needs_attention) - Animation validation failed
```

This allows operator to see progress while autonomous executes.

## Integration with Three-Pass System

### First Pass
- Minimal queue usage (skeleton building)
- Only critical failures go to queue

### Second Pass (Primary Usage)
- All components go to queue after completion
- Operator reviews visual/UX quality
- Failed validations need attention
- Reference files for complex animations/interactions

### Third Pass
- Bug fixes go to queue for verification
- Polish items for final approval

## Queue Policies

### Non-Blocking Principle
```yaml
queue_policy:
  blocking: false

  # Autonomous continues even with pending items
  continue_on_pending: true

  # Only blocks if explicitly requested
  block_on_needs_attention: false

  # Operator chooses when to review
  review_timing: "operator_discretion"
```

### Retention Policy
```yaml
retention:
  pending_review: "unlimited"  # Keep until reviewed
  approved: 20  # Keep last 20
  interventions: "all"  # Keep all for learning
```

## Usage Examples

### Example 1: Normal Component Completion
```
Autonomous: [Builds login-form component]
Autonomous: [Validates against contract - passes]
Autonomous: [Adds to queue]

Console Output:
[QUEUE] Component 'login-form' added (completed) - Ready for visual review

Autonomous: [Continues to next component - doesn't wait]
```

### Example 2: Failed Component
```
Autonomous: [Builds carousel component]
Autonomous: [Validates against contract - FAILS]
Autonomous: [Adds to queue with needs_attention]

Console Output:
[QUEUE] Component 'carousel' added (needs_attention) - Animation timing mismatch

Autonomous: [Continues to other components]

Later...
Operator: *queue
[Sees carousel needs attention]

Operator: [Creates docs/references/carousel-animation.md with timing specs]
Operator: *intervene carousel docs/references/carousel-animation.md

Autonomous: [Retries carousel with reference]
Autonomous: [Adds back to queue as completed]

Operator: *approve carousel "Looks good now"
```

### Example 3: Batch Review
```
Operator: *queue

=== REVIEW QUEUE STATUS ===
PENDING REVIEW (5 items):
  [completed] login-form (12:30)
  [completed] signup-form (12:35)
  [completed] password-reset (12:40)
  [needs_attention] carousel (11:45)
  [completed] user-profile (12:50)

Operator: *approve login-form "Good"
Operator: *approve signup-form "Good"
Operator: *approve password-reset "Good"
Operator: *approve user-profile "Good"

[4 items approved, carousel still needs attention]
```

## Isolation Rules

1. **Direct Invocation Only**: Only orc-exe can call this skill
2. **Contract-Based**: Uses contract files for coordination
3. **Synchronous Operation**: Queue operations complete immediately
4. **File Ownership**: Orchestrator-exe owns `.system/review-queue.yaml`

## Integration Points

**Reads**:
- `.system/review-queue.yaml` (queue state)
- `.system/contracts/*.yaml` (for validation results context)
- `docs/sprint-artifacts/parallel-boundaries.yaml` (chunk context)

**Writes**:
- `.system/review-queue.yaml` (queue updates)
- `.system/review-queue-history.yaml` (historical archive)

**Coordinates With**:
- `pass-manager.md` (pass context for queue items)
- `coordinate-agents.md` (retry requests)
- `parallel-status.md` (queue status in parallel view)
