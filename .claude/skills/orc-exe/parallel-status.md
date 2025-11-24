# Parallel Status Display

**Isolation Level**: ORC-EXE only
**Invocation**: Direct (`*parallel-status`)
**Purpose**: Display comprehensive parallel work status across all active sessions

## Overview

This skill provides real-time visibility into parallel execution across multiple terminals. It displays active work, completed tasks, file conflicts, dependency blockers, and actionable next steps—all while maintaining awareness of the current execution pass (first-pass, second-pass, etc.).

**Key Features**:
- Auto-detects most recent session files (inter-story and intra-story modes)
- Displays pass awareness context with phase-appropriate guidance
- Shows file conflicts with risk levels and recommendations
- Identifies blocked stories due to dependencies
- Suggests next actions based on current state
- Clean, scannable terminal output

## Invocation Pattern

```
orc-exe → *parallel-status → formatted status output
```

## Isolation Rules

- **Read-only operations**: No file modifications
- **No event emission**: Direct synchronous output only
- **No agent coordination**: Does not invoke other agents
- **Session file access**: Reads from `.system/parallel-work/` and `.system/execution-status.yaml`

---

## Instructions

When the user invokes `*parallel-status`, execute the following steps:

### Step 1: Detect Active Session Files

Search for session files in `.system/parallel-work/` directory in this order of priority:

1. **Inter-story sessions**: `active-sessions.yaml` or `session-{timestamp}.yaml` (most recent by timestamp)
2. **Intra-story sessions**: `story-{story-id}-sessions.yaml` (most recently modified)
3. **If no sessions found**: Display "No active parallel sessions detected"

**Smart Detection Logic**:
- List all files matching the patterns above
- Select the most recently modified file
- Determine session mode from `parallel_mode` field (inter_story or intra_story)

### Step 2: Read Pass Context

Read `.system/execution-status.yaml` to get current pass information:

```yaml
current_pass: "first-pass"  # or "second-pass", "third-pass", etc.
```

**Pass Guidance Mapping**:
- `first-pass`: "Focus on core functionality, skip perfect refactoring"
- `second-pass`: "Add robustness, error handling, edge cases"
- `third-pass`: "Polish, optimize, final refinements"
- Default: "Execute with quality and attention to detail"

### Step 3: Read Dependencies (if applicable)

Read `.system/parallel-work/dependencies-template.yaml` or `dependencies.yaml` to identify:
- Blocked stories (status: "blocked")
- Blocking reasons
- Dependency chains

### Step 4: Parse Session Data

Extract from the session file:

**For all sessions**:
- `sessions` map (terminal-id → session details)
- Each session's: `story_id`, `status`, `current_file`, `agent`, `started`, `last_update`

**For intra-story mode**:
- `story_id` (single story being parallelized)
- `epic_id`
- `coordination.conflicts` (file conflicts)
- `coordination.merge_points` (coordination notes)

**For inter-story mode**:
- `dependencies` (story → depends_on mapping)

### Step 5: Categorize Terminals

Group terminals into categories:

1. **Active**: `status: "in_progress"` and has `current_file` or recent `last_update`
2. **Completed**: `status: "completed"`
3. **Blocked**: `status: "blocked"`
4. **Idle**: No story assignment or status is "pending"

### Step 6: Detect File Conflicts

Check `coordination.conflicts` (if present) or manually detect:
- Compare `current_file` across all active terminals
- If multiple terminals editing the same file → flag as conflict
- Assign risk level:
  - `high`: Core shared files (types, models, configs)
  - `medium`: Related feature files
  - `low`: Different directories or file types

### Step 7: Generate Next Action Suggestions

Based on current state, suggest next actions:

**If idle terminals exist**:
- "Assign parallel-safe stories to idle terminals" (list story IDs from dependencies)

**If stories recently completed**:
- "Check if blocked stories are now unblocked" (list newly ready stories)

**If conflicts detected**:
- "Coordinate file changes between terminals" (specify which terminals)

**If all active, no conflicts**:
- "Monitor progress, all terminals working smoothly"

### Step 8: Format and Display Output

Use the following format template:

```
⚡ ORCHESTRATOR-EXE PARALLEL STATUS
🎯 PASS AWARENESS: {current_pass} - {phase_guidance}
═══════════════════════════════════════════════════════════

📦 SESSION: {session_file_name}
   Mode: {parallel_mode} | Duration: {calculated_duration} | Terminals: {terminal_count}

ACTIVE WORK:
┌─────────────┬────────────────────────┬──────────────────────────┬──────────┐
│ Terminal    │ Story                  │ Current File             │ Status   │
├─────────────┼────────────────────────┼──────────────────────────┼──────────┤
│ Terminal-1  │ {story_id}             │ {current_file}           │ ⚙ Active │
│ Terminal-2  │ {story_id}             │ {current_file}           │ ⚙ Active │
└─────────────┴────────────────────────┴──────────────────────────┴──────────┘

COMPLETED:
  ✓ Terminal-3: {story_id} ({completion_time}, {duration})

IDLE TERMINALS:
  → Terminal-4: Ready for assignment
  → Terminal-5: Ready for assignment

FILE CONFLICTS: {count}
  ⚠️ {file_path}
     Terminals: {terminal_list}
     Risk: {risk_level}
     Recommendation: {recommendation}

DEPENDENCY STATUS:
  ⛔ Story {story_id} blocked
     Reason: {blocking_reason}
     Depends on: {dependency_list}

💡 NEXT ACTION SUGGESTIONS:
  1. {suggestion_1}
  2. {suggestion_2}
  3. {suggestion_3}
```

**Formatting Rules**:
- Use emoji indicators: ⚡ (status), 🎯 (pass), 📦 (session), ⚙ (active), ✓ (complete), → (idle), ⚠️ (warning), ⛔ (blocked), 💡 (suggestions)
- Use box-drawing characters for tables: ┌─┬┐├┼┤└─┴┘│
- Keep output concise and scannable
- Align columns in tables
- Display timestamps in relative format (e.g., "5m ago", "Started 10:30")
- Show duration as "Xm" or "Xh Ym"

### Step 9: Handle Edge Cases

**No active sessions**:
```
⚡ ORCHESTRATOR-EXE PARALLEL STATUS
═══════════════════════════════════════════════════════════

No active parallel sessions detected.

💡 To start parallel execution:
   - Use *coordinate to assign stories to terminals
   - Create session file in .system/parallel-work/
```

**Session file exists but all terminals idle**:
```
⚡ ORCHESTRATOR-EXE PARALLEL STATUS
═══════════════════════════════════════════════════════════

All terminals idle. Ready to begin parallel work.

💡 Available for assignment:
   - Terminal-1, Terminal-2, Terminal-3, Terminal-4
```

**No conflicts or blockers**:
- Display "None" for those sections
- Keep sections present but minimal

---

## Example Output

### Inter-Story Mode (Multiple Stories in Parallel)

```
⚡ ORCHESTRATOR-EXE PARALLEL STATUS
🎯 PASS AWARENESS: First Pass - Focus on core functionality, skip perfect refactoring
═══════════════════════════════════════════════════════════

📦 SESSION: session-20251115-100000
   Mode: Inter-Story (3 stories) | Duration: 45m | Terminals: 4

ACTIVE WORK:
┌─────────────┬────────────────────────┬──────────────────────────┬──────────┐
│ Terminal    │ Story                  │ Current File             │ Status   │
├─────────────┼────────────────────────┼──────────────────────────┼──────────┤
│ Terminal-1  │ 1-2-user-auth          │ auth.service.ts          │ ⚙ Active │
│ Terminal-2  │ 1-4-plant-data         │ plant.model.ts           │ ⚙ Active │
└─────────────┴────────────────────────┴──────────────────────────┴──────────┘

COMPLETED:
  ✓ Terminal-3: 1-1-dashboard (10:30, 30m duration)

IDLE TERMINALS:
  → Terminal-4: Ready for assignment

FILE CONFLICTS: None

DEPENDENCY STATUS:
  ⛔ Story 1-3-account-mgmt blocked
     Reason: Requires authentication service
     Depends on: 1-2-user-auth

💡 NEXT ACTION SUGGESTIONS:
  1. Assign story 1-7-reporting to Terminal-4 (parallel-safe, no dependencies)
  2. When Terminal-1 completes 1-2-user-auth, story 1-3-account-mgmt will be unblocked
  3. Monitor Terminal-2 progress on plant data model
```

### Intra-Story Mode (One Story Split Across Terminals)

```
⚡ ORCHESTRATOR-EXE PARALLEL STATUS
🎯 PASS AWARENESS: Second Pass - Add robustness, error handling, edge cases
═══════════════════════════════════════════════════════════

📦 SESSION: story-1-2-user-authentication-sessions
   Mode: Intra-Story (1-2-user-auth) | Duration: 25m | Terminals: 3

ACTIVE WORK:
┌─────────────┬────────────────────────┬──────────────────────────┬──────────┐
│ Terminal    │ Focus                  │ Current File             │ Status   │
├─────────────┼────────────────────────┼──────────────────────────┼──────────┤
│ Terminal-1  │ backend                │ auth.service.ts          │ ⚙ Active │
│ Terminal-2  │ frontend               │ LoginForm.tsx            │ ⚙ Active │
│ Terminal-3  │ tests                  │ auth.service.spec.ts     │ ⚙ Active │
└─────────────┴────────────────────────┴──────────────────────────┴──────────┘

COMPLETED: None

IDLE TERMINALS: None

FILE CONFLICTS: 1
  ⚠️ src/shared/types.ts
     Terminals: Terminal-1, Terminal-2
     Risk: High
     Recommendation: Terminal-1 has priority, Terminal-2 should pull changes before continuing

DEPENDENCY STATUS: N/A (Intra-story coordination)

MERGE POINTS:
  → Backend service complete → Frontend can integrate
  → All three focuses must complete before story is done

💡 NEXT ACTION SUGGESTIONS:
  1. Resolve type definition conflict between backend and frontend terminals
  2. Terminal-1 should commit shared types first
  3. Terminal-2 should pull latest types before proceeding with UI integration
```

---

## Implementation Notes

**File Reading**:
- Use Read tool to access YAML files
- Parse YAML manually or use structured extraction
- Handle missing files gracefully (no sessions = no output)

**Time Calculations**:
- Parse ISO timestamps: `2025-11-15T10:00:00Z`
- Calculate duration: `last_update - started` or `now - started`
- Format as relative time for display

**Terminal Counting**:
- Count entries in `sessions` map
- Categorize by status field
- Display active/completed/idle counts

**Story ID Formatting**:
- Display as-is from session file (e.g., `1-2-user-authentication`)
- Truncate to fit table if needed (e.g., `1-2-user-auth`)

**Conflict Detection Algorithm**:
```
conflicts = []
for each terminal_a in active_terminals:
  for each terminal_b in active_terminals where b != a:
    if terminal_a.current_file == terminal_b.current_file:
      conflicts.append({
        file: current_file,
        terminals: [terminal_a, terminal_b],
        risk: assess_risk(current_file)
      })
```

**Risk Assessment**:
- `high`: Files in `src/shared/`, `src/types/`, `src/config/`
- `medium`: Files in same feature directory
- `low`: Files in different directories

---

## Scope Clarification

This skill focuses on **parallel execution coordination**:

| Aspect | Description |
|--------|-------------|
| **Scope** | Parallel execution tracking across Task() agents |
| **Purpose** | "What's happening in parallel right now?" |
| **Data Source** | `.system/parallel-work/*.yaml`, `.system/contracts/*.yaml` |
| **User** | ORC-EXE only |
| **Invocation** | `*parallel-status` |
| **Output** | Agent status, conflicts, suggestions |

This skill focuses purely on orchestrator-level parallel execution coordination via Task() spawned agents.

---

## Testing Scenarios

1. **No sessions**: Should display "No active parallel sessions detected"
2. **All idle**: Should show available terminals
3. **Active work**: Should display table with current files and status
4. **Conflicts detected**: Should flag files and provide recommendations
5. **Blocked dependencies**: Should list blocked stories with reasons
6. **Mixed states**: Some active, some idle, some completed

---

## Final Checklist

Before completing implementation, verify:

- ✓ Skill file created at `.claude/skills/orc-exe/parallel-status.md`
- ✓ Isolation level declared (ORC-EXE only)
- ✓ Read-only operations (no writes)
- ✓ Auto-detection of session files
- ✓ Pass awareness with guidance
- ✓ Formatted output with tables and indicators
- ✓ Next action suggestions (plain text)
- ✓ Separation from BMAD status maintained
