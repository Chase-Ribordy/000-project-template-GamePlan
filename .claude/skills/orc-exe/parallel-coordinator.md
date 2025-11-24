# Parallel Coordinator

**Isolation Level**: ORC-EXE only
**Invocation**: Direct (not event-driven)
**Purpose**: Advanced parallel session coordination with real-time conflict detection, dependency enforcement, and intelligent next-action recommendations

---

## Overview

The Parallel Coordinator skill provides advanced coordination capabilities for managing multiple terminal sessions executing parallel work. It enhances the base session tracking with active monitoring, intelligent conflict detection, dependency enforcement, and context-aware recommendations for optimal parallel execution flow.

This skill acts as the "traffic controller" for parallel development, continuously monitoring session YAML files, detecting file conflicts before they occur, enforcing dependency constraints, and suggesting optimal next actions as terminals complete work. It integrates deeply with the MCP contract validation system and existing parallel work infrastructure.

---

## Invocation Pattern

**Direct Call (status check):**
```
Check parallel session status and suggest next actions
```

**Monitoring Call:**
```
Monitor active sessions for conflicts and update recommendations
```

**Context-aware Call:**
```
Analyze session dependencies and identify safe parallel work
```

**Integration with Batch Orchestration:**
```
Coordinate sessions from batch analysis and enforce dependencies
```

---

## Capabilities

### 1. Active Session Monitoring

**Continuous tracking of parallel terminal sessions:**
- Monitor all `session-{timestamp}.yaml` and `story-{id}-sessions.yaml` files
- Track terminal activity, current files, and status changes
- Detect when terminals transition states (pending → in_progress → completed → blocked)
- Identify idle terminals ready for new work
- Aggregate progress across all active sessions

**Monitoring Data Structure:**
```yaml
monitoring_snapshot:
  timestamp: "2025-11-15T10:45:00Z"
  active_sessions: 3
  terminals_tracked: 4

terminals:
  terminal-1:
    session_id: "session-20251115-100000"
    story_id: "1-2-user-authentication"
    status: "in_progress"
    current_file: "src/services/auth.service.ts"
    last_activity: "2025-11-15T10:44:32Z"
    idle_time: "13s"
    progress: "65%"
    agent: "dev"

  terminal-2:
    session_id: "session-20251115-100000"
    story_id: "1-3-plant-data-model"
    status: "in_progress"
    current_file: "src/models/plant.model.ts"
    last_activity: "2025-11-15T10:45:00Z"
    idle_time: "0s"
    progress: "40%"
    agent: "dev"

  terminal-3:
    session_id: "session-20251115-100000"
    story_id: "1-1-dashboard"
    status: "completed"
    completed_at: "2025-11-15T10:30:00Z"
    agent: "dev"
    ready_for: "new_work"

  terminal-4:
    session_id: null
    status: "idle"
    ready_for: "new_work"
```

**Real-Time Status Updates:**
```
Session Monitor - 10:45:00
═══════════════════════════════════════════════════════════
Active Work:
  ✓ Terminal-1: 1-2-user-authentication (65% complete, backend auth)
  ✓ Terminal-2: 1-3-plant-data-model (40% complete, data schema)

Recently Completed:
  ✓ Terminal-3: 1-1-dashboard (completed 10:30:00)

Available:
  → Terminal-3: Ready for next story
  → Terminal-4: Idle, ready for assignment

Conflicts: None detected
Dependencies: All respected
Next Action: Assign story 1-4 to Terminal-3 (no dependencies)
```

### 2. File Conflict Detection

**Proactive detection of file overlap across terminals:**
- Track current_file for each terminal session
- Detect when multiple terminals edit the same file
- Identify shared files from story/epic context
- Predict potential merge conflicts
- Suggest coordination strategies or terminal priorities

**Conflict Detection Algorithm:**
```yaml
conflict_detection:
  file_overlap:
    - terminal-1: "src/shared/types.ts" (editing)
    - terminal-2: "src/shared/types.ts" (editing)
    - conflict_type: "concurrent_edit"
    - risk_level: "high"
    - detected_at: "2025-11-15T10:45:00Z"
    - recommendation: "Coordinate changes or prioritize Terminal-1"

  predicted_conflicts:
    - file: "src/services/auth.service.ts"
      terminals: ["terminal-1", "terminal-2"]
      conflict_type: "future_overlap"
      risk_level: "medium"
      reason: "Terminal-2 story depends on auth service from Terminal-1"
      recommendation: "Wait for Terminal-1 completion before Terminal-2 edits"

  shared_dependencies:
    - file: "src/config/database.ts"
      accessed_by: ["terminal-1", "terminal-2", "terminal-3"]
      conflict_type: "shared_resource"
      risk_level: "low"
      recommendation: "Read-only access safe, write access requires coordination"
```

**Conflict Resolution Suggestions:**
```
⚠ Conflict Detected: src/shared/types.ts
═══════════════════════════════════════════════════════════
Terminal-1: Editing (user-authentication story)
Terminal-2: Editing (account-management story)

Risk: High (concurrent edits to same file)

Recommended Actions:
  1. Priority Approach: Pause Terminal-2, complete Terminal-1 first
  2. Coordination Approach: Split file sections (Terminal-1: auth types, Terminal-2: account types)
  3. Sequential Approach: Complete Terminal-1, then merge before Terminal-2 proceeds

Best Practice: Option 1 (Priority) - Terminal-1 has no dependencies, Terminal-2 can wait
```

### 3. Dependency Enforcement

**Strict enforcement of story and component dependencies:**
- Load dependency graph from `dependencies-template.yaml`
- Monitor inter-story dependencies (story B depends on story A)
- Prevent parallel execution of dependent stories
- Block terminal sessions that violate dependencies
- Update dependency status as stories complete

**Dependency Enforcement Rules:**
```yaml
dependency_rules:
  rule_1_story_dependencies:
    description: "Block story execution until all dependencies complete"
    enforcement: "strict"
    action: "Mark session as blocked, suggest alternatives"

  rule_2_component_dependencies:
    description: "Block component integration until dependencies available"
    enforcement: "strict"
    action: "Queue component for later integration"

  rule_3_intra_story_coordination:
    description: "Allow intra-story parallelism with merge point tracking"
    enforcement: "advisory"
    action: "Suggest coordination at merge points"

  rule_4_parallel_safe_stories:
    description: "Allow parallel execution of independent stories"
    enforcement: "enabled"
    action: "Assign to available terminals"
```

**Dependency Violation Detection:**
```
⚠ Dependency Violation Detected
═══════════════════════════════════════════════════════════
Story: 1-3-account-management (Terminal-2)
Status: Blocked

Violation:
  Depends on: 1-2-user-authentication
  Dependency Status: In Progress (Terminal-1)
  Required: Completed

Blocking Reason:
  1-3 requires auth service from 1-2
  1-2 is 65% complete (estimated 30 minutes remaining)

Recommended Actions:
  1. Pause Terminal-2 until Terminal-1 completes 1-2
  2. Reassign Terminal-2 to story 1-4 (no dependencies)
  3. Continue Terminal-2 with stub auth service (risky, requires rework)

Best Practice: Option 2 (Reassign) - Maximize parallel efficiency
```

**Dependency Graph Visualization:**
```
Dependency Graph - Current State
═══════════════════════════════════════════════════════════

1-1-dashboard [COMPLETED] (Terminal-3 ✓)
    ↓
1-2-user-authentication [IN PROGRESS 65%] (Terminal-1 ⚙)
    ↓
1-3-account-management [BLOCKED] (Terminal-2 ⛔)
    ↓
1-5-user-profile [PENDING] (No terminal)

1-4-plant-data-model [IN PROGRESS 40%] (Terminal-2 ⚙)
    ↓
1-6-plant-dashboard [PENDING] (No terminal)

Parallel-Safe Stories (No Dependencies):
  - 1-4-plant-data-model ✓ (In progress)
  - 1-7-reporting-module (Ready for assignment)

Next Assignment Recommendation:
  → Terminal-3: Assign 1-7-reporting-module (parallel-safe, no conflicts)
```

### 4. Intelligent Next-Action Recommendations

**Context-aware suggestions for optimal workflow progression:**
- Analyze completed terminals and suggest next story assignments
- Identify parallel-safe stories ready for execution
- Recommend dependency-aware sequencing
- Suggest file conflict resolution strategies
- Optimize terminal utilization

**Recommendation Engine:**
```yaml
recommendation_engine:
  context:
    active_terminals: 3
    idle_terminals: 1
    pending_stories: 4
    blocked_stories: 1
    completed_stories: 1

  analysis:
    terminal_1:
      current_work: "1-2-user-authentication (65% complete)"
      estimated_completion: "15 minutes"
      next_action: "Continue current work"

    terminal_2:
      current_work: "1-4-plant-data-model (40% complete)"
      estimated_completion: "30 minutes"
      next_action: "Continue current work"

    terminal_3:
      current_work: "None (completed 1-1-dashboard)"
      status: "idle"
      next_action: "Assign new story"
      recommended_stories:
        - story_id: "1-7-reporting-module"
          reason: "Parallel-safe, no dependencies, no conflicts"
          priority: "high"
        - story_id: "1-8-settings-page"
          reason: "Parallel-safe, low complexity"
          priority: "medium"

    terminal_4:
      current_work: "None"
      status: "idle"
      next_action: "Hold for dependency resolution or new sprint batch"

  recommendations:
    immediate_actions:
      - action: "Assign 1-7-reporting-module to Terminal-3"
        reason: "Maximize parallel efficiency"
        confidence: "high"

    future_actions:
      - action: "When Terminal-1 completes 1-2, unblock Terminal-2 for 1-3"
        reason: "Dependency will be satisfied"
        confidence: "high"
      - action: "When Terminal-2 completes 1-4, assign 1-6 to Terminal-4"
        reason: "Dependency chain progression"
        confidence: "medium"

  optimization_suggestions:
    - "Consider adding 5th terminal for 1-8-settings-page (parallel-safe)"
    - "Terminal-4 underutilized (41% idle time today)"
```

**Next-Action Output:**
```
Next Action Recommendations
═══════════════════════════════════════════════════════════
Generated: 2025-11-15T10:45:00

IMMEDIATE ACTIONS:

1. Terminal-3 (Idle, Ready)
   ✓ Assign: 1-7-reporting-module
   Reason: Parallel-safe, no dependencies, no file conflicts
   Priority: High
   Command: /dev-story 1-7-reporting-module

2. Terminal-4 (Idle)
   → Hold: Wait for dependency resolution
   Alternative: Assign 1-8-settings-page (low priority)

UPCOMING ACTIONS:

3. When Terminal-1 Completes (est. 15 min)
   → Story 1-2-user-authentication complete
   → Unblock: Story 1-3-account-management
   → Option: Reassign Terminal-1 to 1-3 OR assign to Terminal-4
   → Recommendation: Assign to Terminal-1 (context continuity)

4. When Terminal-2 Completes (est. 30 min)
   → Story 1-4-plant-data-model complete
   → Ready: Story 1-6-plant-dashboard
   → Assign: Terminal-2 (dependency satisfied)

OPTIMIZATION TIPS:

- Terminal utilization: 75% (3/4 active)
- Consider 5th terminal for additional parallel-safe stories
- Estimated sprint completion: 2.5 hours (with current pace)

Copy-Paste Command for Terminal-3:
─────────────────────────────────────────────────────────
/dev-story 1-7-reporting-module

First pass - core reporting logic only. No UI polish.
```

### 5. Session Lifecycle Management

**Complete session lifecycle tracking and management:**
- Create session tracking files for new parallel work
- Update session status as terminals progress
- Detect session completion and cleanup
- Archive completed sessions
- Generate session summary reports

**Session Lifecycle Stages:**
```yaml
lifecycle_stages:
  1_initialization:
    action: "Create session-{timestamp}.yaml"
    triggers: "Batch analysis complete, terminal assignment ready"
    writes: ".system/parallel-work/session-{timestamp}.yaml"

  2_active_monitoring:
    action: "Track terminal status, file edits, conflicts"
    triggers: "Session active, terminals in progress"
    updates: "session-{timestamp}.yaml (status, current_file, last_update)"

  3_conflict_detection:
    action: "Detect file overlaps, dependency violations"
    triggers: "Multiple terminals editing shared files"
    writes: "session-{timestamp}.yaml (coordination.conflicts)"

  4_completion_detection:
    action: "Identify when all terminals complete"
    triggers: "All terminal status = completed"
    updates: "session-{timestamp}.yaml (ready_to_merge: true)"

  5_merge_orchestration:
    action: "Suggest merge points, integration order"
    triggers: "ready_to_merge: true"
    writes: "session-sync-log.yaml (merge recommendations)"

  6_session_closure:
    action: "Archive session, generate summary report"
    triggers: "Operator confirms merge complete"
    writes: ".system/parallel-work/archive/session-{timestamp}.yaml"
```

**Session Summary Report:**
```
Session Summary Report
═══════════════════════════════════════════════════════════
Session ID: session-20251115-100000
Created: 2025-11-15T10:00:00Z
Completed: 2025-11-15T11:30:00Z
Duration: 1.5 hours

Stories Completed: 3
  ✓ 1-1-dashboard (Terminal-3, 30 minutes)
  ✓ 1-2-user-authentication (Terminal-1, 45 minutes)
  ✓ 1-4-plant-data-model (Terminal-2, 60 minutes)

Terminals Used: 4 (3 active, 1 idle)
Terminal Utilization: 75%

Conflicts Detected: 2
  ⚠ src/shared/types.ts (Terminal-1, Terminal-2) - Resolved via priority
  ⚠ src/config/database.ts (Terminal-2, Terminal-3) - No action needed

Dependencies Enforced: 1
  ⛔ 1-3-account-management blocked until 1-2 complete

Recommendations Provided: 5
  ✓ 4 followed
  ⛔ 1 ignored (operator override)

Next Actions:
  → Story 1-3 ready for Terminal-1 (dependency satisfied)
  → Story 1-6 ready for Terminal-2 (dependency satisfied)
  → Terminal-3, Terminal-4 available for new batch

Session archived: .system/parallel-work/archive/session-20251115-100000.yaml
```

---

## Usage Examples

### Example 1: Real-Time Session Monitoring

**Operator Input:**
```
Monitor active parallel sessions and show status
```

**Skill Output:**
```
Parallel Session Monitor - 10:45:00
═══════════════════════════════════════════════════════════

Session: session-20251115-100000
Mode: Inter-Story (3 stories, 4 terminals)
Duration: 45 minutes

ACTIVE WORK:
┌─────────────┬────────────┬──────────────────────┬──────────┐
│ Terminal    │ Story      │ Current File         │ Progress │
├─────────────┼────────────┼──────────────────────┼──────────┤
│ Terminal-1  │ 1-2-auth   │ auth.service.ts      │ 65% ⚙   │
│ Terminal-2  │ 1-4-plant  │ plant.model.ts       │ 40% ⚙   │
└─────────────┴────────────┴──────────────────────┴──────────┘

COMPLETED:
  ✓ Terminal-3: 1-1-dashboard (10:30:00, 30 min duration)

IDLE:
  → Terminal-3: Ready for assignment
  → Terminal-4: Idle (never used)

CONFLICTS: None detected

DEPENDENCIES:
  ⛔ Story 1-3 blocked (waiting for 1-2 completion)

NEXT ACTIONS:
  1. Assign 1-7-reporting-module to Terminal-3 (parallel-safe)
  2. When Terminal-1 completes, assign 1-3 to Terminal-1

Estimated Completion: 30 minutes (based on current pace)

[Auto-refresh: Every 5 minutes]
```

### Example 2: Conflict Detection and Resolution

**Operator Input:**
```
Check for file conflicts across active terminals
```

**Skill Output:**
```
File Conflict Analysis - 10:45:00
═══════════════════════════════════════════════════════════

ACTIVE CONFLICTS:

⚠ CONFLICT 1: src/shared/types.ts
─────────────────────────────────────────────────────────
  Terminal-1: Editing (1-2-user-authentication)
    - Adding: AuthUser interface, LoginCredentials type
    - Lines: 45-67
    - Last edit: 10:44:32 (13 seconds ago)

  Terminal-2: Editing (1-4-plant-data-model)
    - Adding: Plant interface, PlantData type
    - Lines: 102-124
    - Last edit: 10:45:00 (now)

  Risk Level: MEDIUM
  Reason: Different line ranges, low merge conflict risk

  Recommended Resolution:
    ✓ Continue parallel work (low overlap risk)
    → Coordinate before commit (review merge together)
    → Alternative: Terminal-1 priority, Terminal-2 waits


PREDICTED CONFLICTS:

⚠ FUTURE CONFLICT: src/services/auth.service.ts
─────────────────────────────────────────────────────────
  Terminal-1: Currently editing (1-2-user-authentication)
  Terminal-2: Will need to edit (1-3-account-management depends on this)

  Risk Level: HIGH
  Reason: Terminal-2 story depends on Terminal-1 output

  Recommended Resolution:
    ⛔ Block Terminal-2 until Terminal-1 completes
    ✓ Dependency already enforced


SHARED RESOURCES:

ℹ SHARED: src/config/database.ts
─────────────────────────────────────────────────────────
  Accessed by: Terminal-1, Terminal-2
  Access type: Read-only (configuration import)

  Risk Level: LOW
  Reason: Read-only access, no write conflicts

  Recommended Action:
    ✓ No action needed (safe concurrent reads)


SUMMARY:
  Active Conflicts: 1 (medium risk, coordinated resolution)
  Predicted Conflicts: 1 (high risk, already blocked)
  Shared Resources: 1 (low risk, no action needed)

Overall Risk: MEDIUM - Continue with coordination at merge points
```

### Example 3: Dependency Enforcement

**Operator Input:**
```
Analyze dependencies and enforce parallel execution constraints
```

**Skill Output:**
```
Dependency Enforcement Report - 10:45:00
═══════════════════════════════════════════════════════════

DEPENDENCY GRAPH:

1-1-dashboard [COMPLETED ✓]
    ↓
1-2-user-authentication [IN PROGRESS 65%] ⚙
    ↓
1-3-account-management [BLOCKED ⛔]
    ↓
1-5-user-profile [PENDING]

1-4-plant-data-model [IN PROGRESS 40%] ⚙
    ↓
1-6-plant-dashboard [PENDING]

1-7-reporting-module [READY ✓] (no dependencies)
1-8-settings-page [READY ✓] (no dependencies)


DEPENDENCY ENFORCEMENT:

✓ ENFORCED: 1-3-account-management blocked
  Reason: Depends on 1-2-user-authentication (in progress)
  Action: Terminal-2 cannot start 1-3 until Terminal-1 completes 1-2
  Status: Correctly blocked

✓ ALLOWED: 1-4-plant-data-model in progress
  Reason: No dependencies (parallel-safe)
  Action: Terminal-2 executing (no conflicts with Terminal-1)
  Status: Correctly allowed

✓ READY: 1-7-reporting-module, 1-8-settings-page
  Reason: No dependencies (parallel-safe)
  Action: Can assign to idle terminals immediately
  Status: Available for assignment


DEPENDENCY VIOLATIONS: None detected


DEPENDENCY SATISFACTION TIMELINE:

Now (10:45:00):
  ✓ 1-1-dashboard satisfied (completed)
  ⚙ 1-2-user-authentication in progress (65% complete)

+15 minutes (11:00:00 estimated):
  ✓ 1-2-user-authentication satisfied (completion expected)
  → Unblock: 1-3-account-management (ready for execution)

+30 minutes (11:15:00 estimated):
  ✓ 1-4-plant-data-model satisfied (completion expected)
  → Unblock: 1-6-plant-dashboard (ready for execution)

+60 minutes (11:45:00 estimated):
  ✓ 1-3-account-management satisfied (if started at 11:00:00)
  → Unblock: 1-5-user-profile (ready for execution)


RECOMMENDATIONS:

1. Continue enforcing 1-3 block (dependency not satisfied)
2. Assign parallel-safe stories (1-7, 1-8) to idle terminals
3. Plan ahead: Terminal-1 continues to 1-3 after 1-2 completes
4. Optimize: 1-7 and 1-8 can run parallel with dependency chain
```

### Example 4: Next-Action Recommendations

**Operator Input:**
```
What should I do next? Suggest optimal actions for all terminals.
```

**Skill Output:**
```
Next Action Recommendations - 10:45:00
═══════════════════════════════════════════════════════════

IMMEDIATE ACTIONS (Do Now):

1. Terminal-3 [IDLE - Ready for Work]
   ═══════════════════════════════════════════════════════
   Status: Completed 1-1-dashboard at 10:30:00 (15 minutes ago)

   Recommendation: ASSIGN 1-7-reporting-module

   Reasons:
     ✓ Parallel-safe (no dependencies)
     ✓ No file conflicts with active terminals
     ✓ Medium complexity (good fit for available terminal)
     ✓ Critical path (needed for sprint completion)

   Copy-Paste Command:
   ─────────────────────────────────────────────────────────
   /dev-story 1-7-reporting-module

   First pass - core reporting logic only. No UI polish.
   ─────────────────────────────────────────────────────────

   Priority: HIGH
   Confidence: 95%


2. Terminal-4 [IDLE - Never Used]
   ═══════════════════════════════════════════════════════
   Status: Idle since session start

   Recommendation: ASSIGN 1-8-settings-page OR HOLD

   Option A: Assign 1-8-settings-page
     ✓ Parallel-safe (no dependencies)
     ✓ Low complexity (quick completion)
     ✓ Maximize terminal utilization
     → Priority: MEDIUM

   Option B: Hold for dependency resolution
     ✓ Reserve for 1-3 when unblocked
     ✓ Lower context switching
     → Priority: LOW

   Best Choice: Option A (Maximize throughput)

   Copy-Paste Command (if Option A):
   ─────────────────────────────────────────────────────────
   /dev-story 1-8-settings-page

   First pass - basic settings UI. Skip advanced features.
   ─────────────────────────────────────────────────────────

   Priority: MEDIUM
   Confidence: 70%


CONTINUE CURRENT WORK:

3. Terminal-1 [IN PROGRESS]
   ═══════════════════════════════════════════════════════
   Story: 1-2-user-authentication (65% complete)
   Estimated Completion: 15 minutes

   Recommendation: CONTINUE

   Next Steps After Completion:
     1. Complete 1-2-user-authentication
     2. Run tests and verify acceptance criteria
     3. Mark story ready: /story-ready 1-2-user-authentication
     4. THEN assign 1-3-account-management (dependency satisfied)

   Priority: HIGH (critical path)


4. Terminal-2 [IN PROGRESS]
   ═══════════════════════════════════════════════════════
   Story: 1-4-plant-data-model (40% complete)
   Estimated Completion: 30 minutes

   Recommendation: CONTINUE

   Next Steps After Completion:
     1. Complete 1-4-plant-data-model
     2. Run tests and verify acceptance criteria
     3. Mark story ready: /story-ready 1-4-plant-data-model
     4. THEN assign 1-6-plant-dashboard (dependency satisfied)

   Priority: MEDIUM


UPCOMING ACTIONS (Plan Ahead):

5. When Terminal-1 Completes 1-2 (est. 11:00:00)
   ═══════════════════════════════════════════════════════
   Unblocked Story: 1-3-account-management

   Recommendation: ASSIGN to Terminal-1

   Reasons:
     ✓ Context continuity (related to 1-2 auth work)
     ✓ Dependency satisfied (1-2 complete)
     ✓ Terminal-1 already has auth domain knowledge

   Alternative: Assign to Terminal-4 (if idle)

   Priority: HIGH


6. When Terminal-2 Completes 1-4 (est. 11:15:00)
   ═══════════════════════════════════════════════════════
   Unblocked Story: 1-6-plant-dashboard

   Recommendation: ASSIGN to Terminal-2

   Reasons:
     ✓ Context continuity (builds on 1-4 plant data)
     ✓ Dependency satisfied (1-4 complete)
     ✓ Terminal-2 already has plant domain knowledge

   Priority: MEDIUM


SUMMARY:

Current Utilization: 50% (2/4 terminals active)
Recommended Utilization: 100% (4/4 terminals active)

Expected Outcome (if recommendations followed):
  - Terminal-1: 1-2 (continue) → 1-3 (next)
  - Terminal-2: 1-4 (continue) → 1-6 (next)
  - Terminal-3: 1-7 (assign now)
  - Terminal-4: 1-8 (assign now)

Estimated Sprint Completion: 1.5 hours (vs 2.5 hours current pace)
Efficiency Gain: 40% faster

Do you want me to generate copy-paste commands for all recommendations?
```

### Example 5: Session Lifecycle - Initialization to Closure

**Operator Input:**
```
Initialize session for 3-terminal parallel execution from batch analysis
```

**Skill Process:**
1. Create `session-20251115-103000.yaml`
2. Register terminals with story assignments
3. Initialize conflict detection
4. Load dependency graph

**Skill Output:**
```
Session Initialized - session-20251115-103000
═══════════════════════════════════════════════════════════

Session Details:
  ID: session-20251115-103000
  Mode: Inter-Story
  Created: 2025-11-15T10:30:00Z
  Stories: 3 (1-2, 1-4, 1-7)
  Terminals: 3 (Terminal-1, Terminal-2, Terminal-3)

Terminal Assignments:
  Terminal-1: 1-2-user-authentication
  Terminal-2: 1-4-plant-data-model
  Terminal-3: 1-7-reporting-module

Dependencies Loaded:
  1-2 → 1-3 (enforced, 1-3 blocked)
  1-4 → 1-6 (enforced, 1-6 blocked)
  1-7: No dependencies (parallel-safe)

Conflict Detection: Active
  Monitoring: src/shared/, src/services/, src/models/
  Check Frequency: Every 5 minutes
  Alert Threshold: Medium risk

Session file created: .system/parallel-work/session-20251115-103000.yaml

Ready to start parallel execution.
```

**Operator: (45 minutes later)**
```
Check session status
```

**Skill Output:**
```
Session Status - session-20251115-103000
═══════════════════════════════════════════════════════════

Duration: 45 minutes
Progress: 65% complete

Terminal Status:
  ✓ Terminal-1: 1-2-user-authentication (65% complete, 15 min remaining)
  ✓ Terminal-2: 1-4-plant-data-model (40% complete, 30 min remaining)
  ✓ Terminal-3: 1-7-reporting-module (COMPLETED 10 min ago)

Conflicts: 1 detected, 1 resolved
  ⚠ src/shared/types.ts (T1 vs T2) - Coordinated, low risk

Dependencies: All enforced
  ⛔ 1-3 still blocked (waiting for 1-2)

Recommendations: Assign Terminal-3 to next story (1-8-settings-page)

Session continues...
```

**Operator: (90 minutes later)**
```
Complete session and generate summary
```

**Skill Output:**
```
Session Completed - session-20251115-103000
═══════════════════════════════════════════════════════════

Total Duration: 1.5 hours
Stories Completed: 4 (1-2, 1-4, 1-7, 1-8)

Performance Metrics:
  - Terminal Utilization: 83% average
  - Conflicts Detected: 2
  - Conflicts Resolved: 2
  - Dependencies Enforced: 2
  - Recommendations Followed: 3/4

Next Steps:
  → Story 1-3 ready (dependency 1-2 complete)
  → Story 1-6 ready (dependency 1-4 complete)
  → New session recommended for remaining 2 stories

Session archived: .system/parallel-work/archive/session-20251115-103000.yaml
Summary report: .system/parallel-work/archive/session-20251115-103000-summary.md

Session closed successfully.
```

---

## Integration Points

### Reads:
- `.system/parallel-work/session-{timestamp}.yaml` - Active session tracking files
- `.system/parallel-work/story-{id}-sessions.yaml` - Intra-story session files
- `.system/parallel-work/dependencies-template.yaml` - Story dependency graph
- `docs/sprint-artifacts/sprint-status.yaml` - Story statuses and metadata
- `.system/execution-status.yaml` - Current pass mode, component status
- `.system/contracts/*.md` - Component contracts (for conflict prediction)

### Writes:
- `.system/parallel-work/session-{timestamp}.yaml` - Session status updates
- `.system/parallel-work/coordination-log.yaml` - Conflict and recommendation log
- `.system/parallel-work/session-sync-log.yaml` - Synchronization history
- `.system/parallel-work/archive/session-{timestamp}.yaml` - Archived completed sessions
- `.system/parallel-work/archive/session-{timestamp}-summary.md` - Session summary reports

### Invokes:
- None (pure coordination skill, no agent invocation)
- Provides recommendations for operator to invoke agents (e.g., `/dev-story`)

### Coordinates With:
- `track-parallel-work.md` - Base session tracking (enhances with advanced features)
- `sprint-batch-analyzer.md` - Consumes batch analysis for session initialization
- `terminal-prompt-generator.md` - Provides context for prompt generation
- `coordinate-agents.md` - Agent assignments per terminal session
- `decision-support.md` - Conflict resolution recommendations

---

## Isolation Rules

### ORC-EXE Only
- This skill runs exclusively in the ORC-EXE isolation layer
- Does NOT emit events to BMAD event system
- Does NOT invoke BMAD agents (provides recommendations only)
- Synchronous operation with real-time monitoring

### Top-Down Flow Only
- Orchestrator → Parallel Coordinator (allowed)
- Parallel Coordinator → Orchestrator (return values, recommendations)
- Parallel Coordinator → BMAD agents (NOT allowed, operator invokes)
- Parallel Coordinator → Session files (read/write allowed)

### No Side Effects on Code
- Read-only operations on code files (conflict detection only)
- Write operations limited to session tracking files
- No execution-status modifications (read-only for context)
- No story file modifications (read-only for dependency analysis)

### Integration with Parallel Work Infrastructure
- Enhances existing `track-parallel-work.md` with advanced features
- Compatible with session templates (session-template.yaml)
- Respects dependency rules (dependencies-template.yaml)
- Does NOT replace base tracking (complementary functionality)

---

## Monitoring and Alerting

### Real-Time Monitoring Triggers

**Alert Conditions:**
```yaml
alerts:
  file_conflict_detected:
    trigger: "Multiple terminals editing same file"
    severity: "medium"
    action: "Display conflict resolution recommendations"

  dependency_violation:
    trigger: "Terminal starts dependent story before dependency complete"
    severity: "high"
    action: "Block session, suggest alternatives"

  terminal_idle_too_long:
    trigger: "Terminal idle > 10 minutes with pending work"
    severity: "low"
    action: "Suggest story assignment"

  session_stalled:
    trigger: "No terminal progress for > 15 minutes"
    severity: "medium"
    action: "Request operator intervention"

  merge_conflict_predicted:
    trigger: "Overlapping file changes in different terminals"
    severity: "high"
    action: "Recommend coordination before merge"
```

### Monitoring Frequency

**Auto-Refresh Intervals:**
- Session status: Every 5 minutes (or on-demand)
- File conflict detection: Every 5 minutes
- Dependency checks: On story completion events
- Next-action recommendations: On terminal status changes

---

## Advanced Usage

### Custom Conflict Resolution Strategies
```
Set conflict resolution priority: Terminal-1 > Terminal-2 > Terminal-3
```

### Predictive Conflict Detection
```
Analyze upcoming work and predict conflicts before they occur
```

### Session Performance Optimization
```
Analyze session metrics and suggest terminal reallocation
```

### Multi-Session Coordination
```
Track multiple parallel sessions across different sprints
```

### Dependency Graph Visualization
```
Generate visual dependency graph with terminal assignments
```

---

## Best Practices

### For Operators:
1. **Monitor Regularly**: Check session status every 15-30 minutes
2. **Follow Recommendations**: Coordinator suggestions optimize parallel efficiency
3. **Coordinate Conflicts**: Address file conflicts immediately when detected
4. **Respect Dependencies**: Never override dependency blocks without coordination
5. **Archive Sessions**: Close and archive completed sessions for clean state

### For Coordination:
1. **Proactive Conflict Detection**: Monitor files before conflicts occur
2. **Clear Recommendations**: Provide actionable, prioritized suggestions
3. **Dependency Enforcement**: Strictly enforce dependency rules
4. **Context Awareness**: Consider story complexity, terminal history, file overlap
5. **Performance Tracking**: Measure and report session efficiency metrics

### For Integration:
1. **Chain with Batch Analyzer**: Initialize sessions from batch analysis output
2. **Update Synchronization Files**: Keep session YAML files current
3. **Leverage Terminal Prompts**: Coordinate with terminal-prompt-generator
4. **Track History**: Maintain session logs for retrospectives
5. **Optimize Utilization**: Maximize terminal usage while respecting dependencies

---

## Notes

- Parallel Coordinator enhances (not replaces) track-parallel-work.md
- Real-time monitoring requires active session YAML files
- File conflict detection is advisory (operator makes final decisions)
- Dependency enforcement is strict (hard blocks on violations)
- Next-action recommendations optimize for parallel efficiency
- Session lifecycle supports both intra-story and inter-story modes
- Integration with MCP for component-level conflict detection
- Output optimized for copy-paste execution (like terminal-prompt-generator)
- Supports audit trail via session logs and archives
- Designed for THREE-PASS system with pass-aware recommendations
