# Track Parallel Work Skill

**Isolation Level**: Orchestrator-EXE only
**Invocation**: Direct (not event-driven)
**Purpose**: Monitor and synchronize parallel work across terminals and stories

## Overview

This skill enables the Orchestrator-EXE to manage parallel development work at two levels:
1. **Intra-Story Parallelism**: Multiple terminals working on different aspects of one story
2. **Inter-Story Parallelism**: Multiple terminals working on different stories simultaneously

## Invocation Pattern

```
orchestrator-exe → track-parallel-work.md → session tracking files
```

## Capabilities

### 1. Session Registration
Register new terminal sessions for parallel work tracking:

```yaml
session_types:
  intra_story:
    description: "Multiple terminals on one story"
    example: "Terminal 1: backend, Terminal 2: frontend, Terminal 3: tests"
    tracking_file: "story-{story-id}-sessions.yaml"

  inter_story:
    description: "Multiple terminals on different stories"
    example: "Terminal 1: story 1-2, Terminal 2: story 1-3"
    tracking_file: "active-sessions.yaml"
```

### 2. Session Synchronization
- **Status Sync**: Aggregate status across all terminals
- **Conflict Detection**: Identify concurrent edits to same files
- **Dependency Checks**: Ensure story dependencies are respected
- **Progress Rollup**: Combine progress from multiple terminals

### 3. Work Coordination
- **Task Assignment**: Track which terminal is working on which aspect
- **Completion Detection**: Recognize when all parallel work is complete
- **Merge Points**: Identify when parallel work streams should integrate

## Session Tracking Structure

### Intra-Story Session (story-1-2-sessions.yaml)
```yaml
story_id: "1-2-user-authentication"
parallel_mode: "intra_story"
created: "2025-11-15T10:00:00Z"

sessions:
  terminal-1:
    focus: "backend"
    tasks:
      - "Implement authentication service"
      - "Create JWT token generation"
    status: "in_progress"
    current_file: "src/services/auth.service.ts"
    last_update: "2025-11-15T10:30:00Z"

  terminal-2:
    focus: "frontend"
    tasks:
      - "Build login form component"
      - "Add form validation"
    status: "in_progress"
    current_file: "src/components/LoginForm.tsx"
    last_update: "2025-11-15T10:35:00Z"

  terminal-3:
    focus: "tests"
    tasks:
      - "Write unit tests for auth service"
      - "Add integration tests for login flow"
    status: "pending"
    blocked_by: ["terminal-1"]
    last_update: "2025-11-15T10:00:00Z"

coordination:
  merge_points:
    - "Backend auth service complete → Frontend can integrate"
    - "Frontend login complete → Tests can run e2e"
  conflicts: []
  ready_to_merge: false
```

### Inter-Story Session (active-sessions.yaml)
```yaml
parallel_mode: "inter_story"
created: "2025-11-15T09:00:00Z"

sessions:
  terminal-1:
    story_id: "1-2-user-authentication"
    phase: "first-pass"
    status: "in_progress"
    agent: "dev"
    started: "2025-11-15T10:00:00Z"
    last_update: "2025-11-15T10:35:00Z"

  terminal-2:
    story_id: "1-3-account-management"
    phase: "first-pass"
    status: "in_progress"
    agent: "dev"
    started: "2025-11-15T09:30:00Z"
    last_update: "2025-11-15T10:40:00Z"

  terminal-3:
    story_id: "1-1-plant-data-model"
    phase: "second-pass"
    status: "completed"
    agent: "dev"
    started: "2025-11-15T08:00:00Z"
    completed: "2025-11-15T09:15:00Z"

dependencies:
  "1-3-account-management":
    depends_on: ["1-2-user-authentication"]
    status: "blocked"
    reason: "Needs auth service from story 1-2"

  "1-2-user-authentication":
    depends_on: []
    status: "ready"
```

## Usage Examples

### Example 1: Register Intra-Story Session
```
Operator: *track-session
Orchestrator-EXE: What type of parallel work?
  1. Intra-story (multiple terminals on one story)
  2. Inter-story (multiple stories in parallel)

Operator: 1

Orchestrator-EXE: [Invokes track-parallel-work.md]
- Story ID? 1-2-user-authentication
- Terminal focus? backend
- Tasks? [Implement auth service, Create JWT tokens]

Skill creates: .system/parallel-work/story-1-2-sessions.yaml
Result: Terminal-1 registered for backend work on story 1-2
```

### Example 2: Sync Sessions
```
Operator: *sync-sessions

Orchestrator-EXE: [Invokes track-parallel-work.md]

Skill Process:
1. Read all session files from .system/parallel-work/
2. Check for conflicts (same file in multiple terminals)
3. Update dependency statuses
4. Identify merge points
5. Display unified status

Result:
Terminal-1: Story 1-2 backend (in progress)
Terminal-2: Story 1-2 frontend (in progress)
Terminal-3: Story 1-3 (blocked - waiting for story 1-2 auth service)

Conflicts: None
Ready to merge: Terminal-1 backend → Terminal-2 frontend integration
```

## Parallel Work Detection

### Conflict Detection
```yaml
conflict_checks:
  - type: "file_overlap"
    check: "Multiple sessions editing same file"
    action: "Alert operator, suggest coordination"

  - type: "dependency_violation"
    check: "Story B started before dependency Story A complete"
    action: "Mark blocked, recommend sequence"

  - type: "merge_conflict"
    check: "Parallel changes to overlapping code"
    action: "Suggest manual merge or terminal prioritization"
```

### Dependency Management
```yaml
dependency_rules:
  - rule: "Check story dependencies from dependencies-template.yaml"
  - rule: "Block inter-story sessions if dependencies not met"
  - rule: "Allow intra-story parallelism regardless of dependencies"
  - rule: "Update dependency status on session completion"
```

## Isolation Rules

1. **Direct Invocation Only**: Only orchestrator-exe can call this skill
2. **No Event Emission**: Does not emit events to BMAD event system
3. **Synchronous Operation**: Returns session status immediately
4. **Session Ownership**: Orchestrator-exe owns all session lifecycle

## Integration Points

**Reads**:
- `.system/parallel-work/*.yaml` (all session files)
- `docs/sprint-artifacts/sprint-status.yaml` (story statuses)
- `.system/parallel-work/dependencies-template.yaml` (story dependencies)

**Writes**:
- `.system/parallel-work/story-{id}-sessions.yaml` (intra-story tracking)
- `.system/parallel-work/active-sessions.yaml` (inter-story tracking)
- `.system/parallel-work/session-sync-log.yaml` (synchronization history)

**Coordinates With**:
- `coordinate-agents.md` (agent assignments per session)
- `decision-support.md` (conflict resolution recommendations)
