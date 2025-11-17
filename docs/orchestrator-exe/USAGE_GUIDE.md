# Orchestrator-EXE Usage Guide

## Quick Start

**Invoking orchestrator-exe:**
```
/orchestrator-exe
```

This loads the orchestrator agent, which provides strategic coordination for sprint execution.

## What is Orchestrator-EXE?

**Orchestrator-EXE is the top-down coordinator for development execution.**

Think of it as a project manager that:
- Tracks sprint progress
- Recommends next actions
- Coordinates parallel work
- Manages execution mode (manual vs autonomous)
- Detects conflicts
- Provides decision support

**It sits ABOVE BMAD agents, coordinating them without being coordinated by them.**

## System Architecture

```
┌─────────────────────────────────────┐
│     Orchestrator-EXE (You)          │
│  Strategic coordination & decisions  │
└─────────────┬───────────────────────┘
              │ coordinates ↓
    ┌─────────┼─────────┬─────────┐
    ↓         ↓         ↓         ↓
  ┌───┐    ┌────┐   ┌────┐    ┌────┐
  │dev│    │ sm │   │ pm │    │tea │
  └───┘    └────┘   └────┘    └────┘
    ↓         ↓         ↓         ↓
   Autonomous execution (event-driven)
```

**Two execution layers:**
1. **Orchestrator-EXE:** Manual coordination (you decide what happens)
2. **BMAD agents:** Autonomous execution (events trigger automatic work)

## Handoff from BMAD Sprint Planning

**Typical workflow:**

### Step 1: Generate Sprint Status (BMAD)

```
/bmad:bmm:workflows:sprint-planning
```

This generates `docs/sprint-artifacts/sprint-status.yaml` with:
- All epics and stories
- Story status tracking
- Dependencies
- Ready-for-dev queue

**Output:**
```yaml
epics:
  - id: epic-1
    title: User Authentication
    stories:
      - id: 1-1
        title: Backend auth service
        status: TODO
      - id: 1-2
        title: Login UI
        status: TODO

  - id: epic-2
    title: Product Catalog
    stories:
      - id: 2-1
        title: Product API
        status: TODO
```

### Step 2: Launch Orchestrator-EXE

```
/orchestrator-exe
```

**The orchestrator loads:**
- Sprint status (from BMAD)
- Execution status (`.system/execution-status.yaml`)
- Parallel work tracking (`.system/parallel-work/`)

**You'll see:**
```
Orchestrator-EXE> Current phase: First Pass (Backend-First)
Orchestrator-EXE> Active sessions: 0
Orchestrator-EXE> Stories in sprint: 8
Orchestrator-EXE> Next recommended: Story 1-1 (Backend auth service)

Available commands:
  *status           - Show execution status
  *parallel-status  - Show parallel work across terminals
  *coordinate dev   - Delegate to dev agent
  *next-story       - Get next story recommendation
  *decide [action]  - Get manual vs autonomous recommendation
  *track-session    - Register this terminal session
  *manual-mode      - Switch to manual execution
  *auto-mode        - Switch to autonomous execution

Orchestrator-EXE>
```

### Step 3: Choose Execution Strategy

See [Choosing Execution Strategy](#choosing-execution-strategy) below.

## Menu Commands Reference

### `*status`

**Shows current execution status**

```
Orchestrator-EXE> *status
```

**Output:**
```
Current Pass: First Pass (Backend-First)
Current Epic: Epic 1 - User Authentication
Current Story: 1-1 (Backend auth service)
Story Status: IN PROGRESS

Pass Progress:
  First pass: 2/8 stories (25%)
  Second pass: 0/8 stories (0%)
  Third pass: 0/8 stories (0%)

Recent Events:
  - 14:32: Story 1-1 started (dev agent)
  - 14:15: Sprint planning complete
  - 14:00: Session initialized

Next Action: Complete story 1-1, then mark done
```

### `*parallel-status`

**Displays comprehensive parallel execution status across all active sessions**

```
Orchestrator-EXE> *parallel-status
```

**Output:**
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

**When to use:**
- Working with multiple parallel terminals
- Need to see file conflicts and dependency blockers
- Want detailed status of each terminal's current work
- Looking for next action suggestions for idle terminals

**Difference from `*status`:**
- `*status`: High-level sprint and story progress (single view)
- `*parallel-status`: Detailed parallel work tracking across all terminals (multi-terminal coordination)

### `*coordinate [agent]`

**Delegates current story to a BMAD agent**

```
Orchestrator-EXE> *coordinate dev
```

**Effect:**
- Loads story context
- Invokes specified agent (dev, sm, pm, tea, etc.)
- Agent executes story (manual or autonomous depending on mode)
- Returns control to orchestrator when done

**Use cases:**
- `*coordinate dev` - Execute development story
- `*coordinate sm` - Mark story done, update status
- `*coordinate pm` - Validate story against requirements
- `*coordinate tea` - Generate tests for story

### `*next-story`

**Recommends next story based on sprint status and dependencies**

```
Orchestrator-EXE> *next-story
```

**Output:**
```
Recommended: Story 1-2 (Login UI)

Reasoning:
  - Story 1-1 complete (dependency satisfied)
  - Epic 1 in progress (continue epic before switching)
  - First pass complete for 1-1 (backend ready for UI)
  - No blockers

Alternative options:
  - Story 2-1 (Product API) - parallel epic, no dependencies
  - Story 1-3 (Password reset) - same epic, depends on 1-1
```

### `*track-session`

**Registers current terminal session for parallel work tracking**

```
Orchestrator-EXE> *track-session
```

**Prompts for:**
- Session name (e.g., "Terminal 1", "Auth work", "UI development")
- Current story (if any)
- Execution mode (manual/autonomous)

**Effect:**
- Creates session entry in `.system/parallel-work/sessions/`
- Enables conflict detection
- Allows coordination across terminals

**When to use:**
- Before starting parallel work
- When opening new terminal for development
- To enable multi-session tracking

### `*sync-sessions`

**Synchronizes state across all active terminal sessions**

```
Orchestrator-EXE> *sync-sessions
```

**Effect:**
- Reads all session files
- Detects conflicts (multiple sessions on same story)
- Updates execution status with latest state
- Reports session status

**Output:**
```
Active Sessions:
  - Terminal 1: Story 1-2 (IN PROGRESS, manual mode)
  - Terminal 2: Story 2-1 (IN PROGRESS, autonomous mode)
  - Terminal 3: Story 1-3 (BLOCKED, waiting on 1-2)

Conflicts: None
Recommendations:
  - Terminal 1: Continue story 1-2
  - Terminal 2: Autonomous batch running (do not interrupt)
  - Terminal 3: Blocked, work on different story or assist Terminal 1
```

### `*dependencies`

**View and manage story dependencies**

```
Orchestrator-EXE> *dependencies
```

**Output:**
```
Story Dependencies:

Story 1-2 (Login UI):
  Depends on: Story 1-1 (Backend auth service) [COMPLETE ✓]
  Status: Ready to start

Story 1-3 (Password reset):
  Depends on: Story 1-1 (Backend auth service) [COMPLETE ✓]
  Status: Ready to start

Story 2-2 (Product detail page):
  Depends on: Story 2-1 (Product API) [IN PROGRESS]
  Status: Blocked (waiting on 2-1)
```

### `*manual-mode` / `*auto-mode`

**Switch execution mode**

```
Orchestrator-EXE> *manual-mode
Execution mode: MANUAL (iterative, operator-controlled)

Orchestrator-EXE> *auto-mode
Execution mode: AUTONOMOUS (contract-based, event-driven)
```

**Effect:**
- Changes default execution strategy
- Affects how agents execute stories
- Can be overridden per-story with `*decide`

### `*decide [action]`

**Get manual vs autonomous recommendation for specific action**

```
Orchestrator-EXE> *decide "implement login form"
```

**Output:**
```
Decision: MANUAL recommended

Reasoning:
  - Action: "implement login form"
  - Risk score: 4 (moderate action + first pass)
  - Context: First story in epic (establishing pattern)
  - Recommendation: Manual mode for control and pattern establishment

Alternative: If you have a clear contract (exact fields, validation rules,
styling), autonomous mode could work. Use *auto-mode and run contract-based flow.
```

### `*advance-pass`

**Move to next development pass**

```
Orchestrator-EXE> *advance-pass
```

**Effect:**
- Validates current pass complete
- Updates execution status to next pass
- Changes default execution recommendations
- Triggers checkpoint (see CHECKPOINT_STRATEGY.md)

**Validation checks:**
- First → Second: All stories have working backend
- Second → Third: All stories have complete UI
- Third → Done: All stories production-ready

### `*phase-status`

**Shows detailed current phase context and guidance**

```
Orchestrator-EXE> *phase-status
```

**Output:**
```
Current Phase: First Pass (Backend-First)

Phase Guidance:
  - Focus: Get it working (backend functionality)
  - Approach: Manual, iterative development
  - Goal: End-to-end backend flow before UI
  - Checkpoint: First pass complete (all stories backend done)

Current Story Context:
  - Story 1-2: Login UI
  - Phase: First Pass
  - Recommended approach: Build minimal backend first, defer UI to second pass
  - Advisory: If tempted to build UI now, remember first pass is backend-only

Next Transition:
  - When: All Epic 1 stories have working backend
  - Action: *advance-pass to move to Second Pass
  - Checkpoint: Validate backend before building UI
```

## Choosing Execution Strategy

After sprint planning, you need to choose how to execute stories. Two main approaches:

### Strategy 1: Manual Batch Processing (Control-First)

**Best for:**
- Foundation work (first pass, establishing patterns)
- Creative work (UI design, architecture)
- High-risk work (production, security)
- Learning (junior operators)

**Workflow:**

1. **Invoke orchestrator-exe:**
   ```
   /orchestrator-exe
   ```

2. **Get next story:**
   ```
   Orchestrator-EXE> *next-story
   → Story 1-1: Backend auth service
   ```

3. **Coordinate with dev agent (manual mode):**
   ```
   Orchestrator-EXE> *coordinate dev
   ```

4. **Dev agent executes story with operator approval:**
   - Agent proposes implementation
   - You review and approve each step
   - Agent executes with your guidance
   - Iterative feedback loop

5. **Mark story done:**
   ```
   Orchestrator-EXE> *coordinate sm
   ```

6. **Repeat for next story**

**Characteristics:**
- High control (you approve everything)
- Slower throughput (approval overhead)
- Higher confidence (you see every decision)
- Better for novel work

### Strategy 2: Contract-Based Autonomous (Speed-First)

**Best for:**
- Repetitive work (CRUD, similar components)
- Clear patterns (established architecture)
- Volume work (many similar stories)
- Experienced operators (who write good contracts)

**Workflow:**

1. **Prepare contracts:**
   - Write markdown contracts in `.system/contracts/`
   - Define inputs, outputs, CSS rules, behavior
   - Be specific (contracts define "done")

2. **Invoke orchestrator-exe:**
   ```
   /orchestrator-exe
   ```

3. **Switch to autonomous mode:**
   ```
   Orchestrator-EXE> *auto-mode
   ```

4. **Generate batch prompts:**
   ```
   Orchestrator-EXE> *batch-prompts epic-1
   ```

5. **Open multiple terminals, paste prompts:**
   - Terminal 1: Story 1-2 prompt
   - Terminal 2: Story 1-3 prompt
   - Terminal 3: Story 1-4 prompt
   - Terminal 4: Story 1-5 prompt

6. **Autonomous execution runs:**
   - Extract component contracts
   - Validate (syntax, tests, contracts, MCP)
   - Prove in sandbox
   - Integrate into main files
   - Auto-updates status

7. **Review results:**
   ```
   Orchestrator-EXE> *status
   → 4 stories complete, 0 failures
   ```

8. **Manual checkpoint:**
   - Review generated components
   - Validate integration
   - Fix any issues

**Characteristics:**
- Low control (agent decides implementation)
- Faster throughput (batch processing)
- Lower confidence (need to review after)
- Better for repetitive work

### Strategy 3: Hybrid (Best of Both)

**Most common in practice:**

- **First pass:** Manual (establishing patterns)
- **Second pass:** Autonomous (repeating UI patterns)
- **Third pass:** Manual (debugging, polishing)

**Example epic execution:**

```
Epic 1: User Authentication

Story 1-1 (First pass - Backend auth):
  Mode: Manual
  Reason: Establishing authentication pattern
  Agent: dev (manual coordination)

Story 1-2 (Second pass - Login UI):
  Mode: Autonomous
  Reason: Backend works, UI follows contract
  Agent: contract-based autonomous flow

Story 1-3 (Second pass - Signup UI):
  Mode: Autonomous
  Reason: Repeating login pattern
  Agent: contract-based autonomous flow

Story 1-4 (Third pass - Auth debugging):
  Mode: Manual
  Reason: Fixing edge cases, needs iteration
  Agent: dev (manual coordination)
```

## Reading Status Output

### Execution Status File

**Location:** `.system/execution-status.yaml`

**Structure:**
```yaml
sprint:
  current_pass: first_pass
  pass_progress:
    first_pass:
      stories_complete: 2
      stories_total: 8
    second_pass:
      stories_complete: 0
      stories_total: 8

current_story:
  id: 1-2
  title: Login UI
  status: IN_PROGRESS
  component: login-form
  component_status: contract_defined

recent_events:
  - timestamp: 2025-11-15T14:32:00
    event: contract_created
    component: login-form
  - timestamp: 2025-11-15T14:30:00
    event: story_started
    story: 1-2

next_action: "Validate login-form component"
```

**Key fields:**
- `current_pass`: Which development pass you're in
- `current_story`: What story is active
- `component_status`: Where component is in autonomous flow
  - `draft` → `contract_defined` → `validated` → `proven` → `integrated`
- `recent_events`: Audit trail of what happened
- `next_action`: What to do next

### Sprint Status File

**Location:** `docs/sprint-artifacts/sprint-status.yaml`

**Structure:**
```yaml
sprint:
  name: Sprint 1
  start_date: 2025-11-01
  end_date: 2025-11-15

epics:
  - id: epic-1
    title: User Authentication
    status: IN_PROGRESS
    stories:
      - id: 1-1
        title: Backend auth service
        status: DONE
        passes_complete: [first]
      - id: 1-2
        title: Login UI
        status: IN_PROGRESS
        passes_complete: []
```

**Key fields:**
- `epic.status`: Epic progress (TODO, IN_PROGRESS, DONE)
- `story.status`: Story progress (TODO, IN_PROGRESS, IN_REVIEW, DONE)
- `passes_complete`: Which passes story has finished

### Combined Reading

**Use both files together:**

1. **Sprint status:** High-level (which stories, which epics)
2. **Execution status:** Tactical (current work, next action, component status)

**Example:**

*"What's the current state?"*

**Sprint status says:**
- Epic 1 in progress
- Story 1-2 in progress

**Execution status says:**
- First pass
- Story 1-2 active
- Component `login-form` at `validated` stage
- Next action: Run sandbox tests

**Combined meaning:**
"Story 1-2 (Login UI) is in first pass, autonomous validation complete, ready for sandbox testing. Once sandbox passes, component will auto-integrate."

## Terminal Copy-Paste Workflow

**For parallel execution across multiple terminals:**

### Step 1: Generate Batch Prompts

```
Orchestrator-EXE> *batch-prompts epic-1
```

**Output:**
```
Generated 5 copy-paste ready prompts for Epic 1:

TERMINAL 1 - Story 1-2 (Login UI):
──────────────────────────────────
/orchestrator-exe

*track-session
Session: Terminal 1
Story: 1-2
Mode: autonomous

*coordinate dev
Story: 1-2 (Login UI)
Contract: .system/contracts/login-form.md
Execute: autonomous


TERMINAL 2 - Story 1-3 (Signup UI):
──────────────────────────────────
/orchestrator-exe

*track-session
Session: Terminal 2
Story: 1-3
Mode: autonomous

*coordinate dev
Story: 1-3 (Signup UI)
Contract: .system/contracts/signup-form.md
Execute: autonomous


[... terminals 3, 4, 5 ...]
```

### Step 2: Open Terminals

Open 5 terminal windows (or tmux panes, or split views)

### Step 3: Paste Prompts

Copy-paste each prompt into corresponding terminal

### Step 4: Watch Execution

**Each terminal runs autonomously:**
- Extracts component from contract
- Validates (4 levels)
- Tests in sandbox
- Integrates into main files
- Updates status

**No operator approval needed** (autonomous mode)

### Step 5: Monitor Progress

**In orchestrator terminal:**
```
Orchestrator-EXE> *sync-sessions

Active Sessions:
  Terminal 1: Story 1-2 [VALIDATING] - login-form at validation stage
  Terminal 2: Story 1-3 [TESTING] - signup-form sandbox tests running
  Terminal 3: Story 1-4 [INTEGRATING] - password-reset ready to inject
  Terminal 4: Story 1-5 [COMPLETE] - social-oauth integrated
  Terminal 5: Story 1-6 [IN PROGRESS] - profile-editor extracting contract
```

### Step 6: Review Results

**After all terminals complete:**
```
Orchestrator-EXE> *status

Batch Complete:
  Total stories: 5
  Successful: 4
  Failed: 1 (Story 1-3 - validation failed)

Failures:
  - Story 1-3: Contract validation failed (missing required prop 'email')

Next actions:
  - Fix contract for Story 1-3
  - Rerun Story 1-3 in manual mode
  - Proceed to next batch
```

## Contract-Based Workflow

**For autonomous execution, contracts define "done":**

### Step 1: Write Contract

**Location:** `.system/contracts/login-form.md`

**Example:**
```markdown
# Login Form Component

## Purpose
User login form with email/password authentication

## Inputs
- email: string (email format validation)
- password: string (min 8 characters)

## Outputs
- onSubmit(email, password): Promise<void>
- onForgotPassword(): void

## Behavior
- Validate email format on blur
- Show password strength indicator
- Disable submit until valid
- Show loading state during authentication
- Show error message if auth fails

## CSS Rules
- Use theme.colors.primary for submit button
- Input fields: theme.spacing.md padding
- Error messages: theme.colors.error, theme.fontSize.sm
- Match login-page layout (centered, max-width 400px)

## Dependencies
- auth-service.js (for authentication API)
- theme.js (for styling constants)

## MCP Integration
- Emit: login_attempted (email)
- Emit: login_succeeded (user)
- Emit: login_failed (error)
```

### Step 2: Generate YAML Contract

```
Orchestrator-EXE> *contract-yaml login-form
```

**Generates:** `.system/contracts/yaml/login-form.yaml`

**Used by autonomous flow for validation**

### Step 3: Run Autonomous Flow

```
Orchestrator-EXE> *coordinate dev
Story: 1-2
Mode: autonomous
Contract: login-form
```

### Step 4: Autonomous Chain Executes

```
1. contract-creation skill
   - Reads login-form.md
   - Generates component code
   - Emits: contract_created event

2. component-validation skill (triggered by event)
   - Level 1: Syntax validation
   - Level 2: Test execution
   - Level 3: Contract compliance
   - Level 4: MCP integration check
   - Emits: validation_completed event

3. sandbox-testing skill (triggered by event)
   - Runs component in isolated sandbox
   - Executes tests
   - Auto-approves if tests pass
   - Emits: component_proven event

4. component-integration skill (triggered by event)
   - Injects component into main files
   - Updates imports
   - Runs integration tests
   - Emits: component_integrated event

5. progress-reporter skill (parallel)
   - Updates execution-status.yaml
   - Logs events to event-log.yaml
   - Updates sprint-status.yaml
```

### Step 5: Review Generated Code

**Check:** `.system/components/login-form/`

**Validate:**
- Does it match contract?
- Is code quality good?
- Are tests sufficient?
- Does integration make sense?

**If issues:**
```
Orchestrator-EXE> *coordinate dev
Story: 1-2
Mode: manual
Action: Fix login-form validation logic
```

## Troubleshooting

### Issue: Conflicts Between Terminals

**Symptom:**
```
Orchestrator-EXE> *sync-sessions
ERROR: Conflict detected
  - Terminal 1: Story 1-2 (IN PROGRESS)
  - Terminal 2: Story 1-2 (IN PROGRESS)
```

**Cause:** Multiple terminals working on same story

**Fix:**
```
1. Stop work in one terminal
2. Sync sessions: *sync-sessions
3. Assign different stories to each terminal
```

**Prevention:** Use `*track-session` to register terminals before starting

### Issue: Autonomous Flow Failures

**Symptom:**
```
Story 1-3: FAILED at validation stage
Reason: Contract validation failed (missing required prop)
```

**Cause:** Contract was incomplete or ambiguous

**Fix:**
```
1. Review contract: .system/contracts/signup-form.md
2. Add missing requirements
3. Rerun manually:
   Orchestrator-EXE> *coordinate dev
   Story: 1-3
   Mode: manual
4. Once working, update contract
5. Retry autonomous on similar stories
```

**Prevention:** Test first component manually before batch autonomous execution

### Issue: Unknown Next Action

**Symptom:**
```
Orchestrator-EXE> *status
Next action: Unknown
```

**Cause:** Execution state unclear (multiple paths possible)

**Fix:**
```
Orchestrator-EXE> *decide "what should I work on next?"

Recommendation: Review story dependencies
  - Story 1-3 blocked on Story 1-2
  - Story 2-1 ready (no dependencies)

Suggested next action: Complete Story 1-2 or start Story 2-1
```

### Issue: Session Out of Sync

**Symptom:** Different terminals show different status for same story

**Cause:** Session files not synchronized

**Fix:**
```
Orchestrator-EXE> *sync-sessions

This will:
- Read all session files
- Reconcile conflicts
- Update execution status
- Report canonical state
```

**Prevention:** Run `*sync-sessions` regularly during parallel work

## Best Practices

### 1. Always Track Sessions

**Before starting work in any terminal:**
```
*track-session
```

This enables:
- Conflict detection
- Progress tracking
- Parallel coordination

### 2. Sync Before Major Actions

**Before advancing pass, starting new epic, or reviewing:**
```
*sync-sessions
```

Ensures you have current state across all terminals

### 3. Use Decision Support

**When unsure about mode:**
```
*decide "implement user profile page"
```

Let the system recommend based on risk and context

### 4. Checkpoint at Natural Points

**After first pass, epic completion, milestones:**
```
*phase-status
```

Check if checkpoint recommended, review if so

### 5. Manual First, Autonomous After

**Pattern:**
1. Build first component manually (establish pattern)
2. Validate it works
3. Write contract based on what worked
4. Use autonomous for remaining similar components

This builds good contracts from proven implementations

### 6. Review Autonomous Batches

**After batch autonomous execution:**
1. Check execution status (any failures?)
2. Review generated code (quality good?)
3. Run manual tests (integration works?)
4. Fix issues before next batch

Don't compound errors across batches

## Summary

**Orchestrator-EXE provides:**
- Strategic coordination (what to work on)
- Decision support (how to work on it)
- Parallel work management (multiple terminals)
- Progress tracking (where are we?)
- Conflict detection (avoid errors)

**Key commands:**
- `/orchestrator-exe` - Launch orchestrator
- `*status` - Check current state
- `*parallel-status` - View parallel work across terminals
- `*coordinate [agent]` - Delegate to agent
- `*decide [action]` - Get mode recommendation
- `*track-session` - Register terminal
- `*sync-sessions` - Synchronize state

**Execution strategies:**
- Manual: Control-first (foundation, creative, high-risk)
- Autonomous: Speed-first (repetitive, clear patterns, volume)
- Hybrid: Manual first pass, autonomous second pass

**Integration:**
- Sprint planning (BMAD) → Orchestrator-EXE (execution)
- Sprint status (business view) + Execution status (technical view)
- Soft checkpoints at natural transitions

**Next steps:**
1. Read EXECUTION_PHILOSOPHY.md (understand manual vs autonomous)
2. Read CHECKPOINT_STRATEGY.md (understand review points)
3. Run `/orchestrator-exe` and try `*status`
4. Execute first story manually to learn workflow
5. Graduate to autonomous execution for repetitive work
