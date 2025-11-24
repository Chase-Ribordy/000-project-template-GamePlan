# Commands Quick Reference

Quick reference for all available commands in the project.

## Main Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/refine` | Idea discovery and planning pipeline | Start of new project |
| `/orc-exe` | Load the Execution Orchestrator | After /refine, to build project |
| `/handoff` | Session handoff with documentation | End of session |
| `/push-to-github` | Quick checkpoint save | Mid-session saves |

---

## /refine

**File:** `.claude/commands/refine.md`

**Purpose:** Transform a raw idea into execution-ready documentation through structured discovery.

### When to Use
- Starting a new project
- Before running /orc-exe for the first time

### What It Does
1. **Phase 1: Discovery** (15-20 min)
   - Asks 8-12 structured questions about your project
   - Clarifies problem, target user, core features, constraints

2. **Phase 2: Initial Planning**
   - Creates `docs/initial-planning/`:
     - `full-idea.md` - Complete project vision
     - `scope.md` - MVP scope vs backlog
     - `manual.md` - Non-automated tasks

3. **Phase 3: Finalized Planning**
   - Spawns PM and Architect agents
   - Creates `docs/finalized-plan/`:
     - `prd.md` - Product Requirements Document
     - `architecture.md` - Technical Architecture

### Example
```
/refine

# Follow the prompts:
# Q1: What problem are you solving?
# Q2: Who is the target user?
# ...
# Result: PRD and Architecture ready for /orc-exe
```

---

## /orc-exe

**File:** `.claude/commands/orc-exe.md`

**Purpose:** Load and activate the Execution Orchestrator agent (ORC-EXE) for sprint execution coordination.

### When to Use
- Start of any development session
- After `/clear` to resume work
- When you need to coordinate multiple tasks

### What It Does
1. Loads the ORC-EXE agent persona
2. Loads execution context (sprint status, pass info)
3. Displays an interactive menu with available commands
4. Waits for operator input

### ORC-EXE Commands (after activation)

**Execution:**
- `*start` - Start/resume autonomous execution
- `*status` - Show detailed execution status
- `*pause` - Pause all sub-agent spawning
- `*resume` - Resume paused execution

**Pass Management:**
- `*pass` - Show current pass details
- `*advance` - Advance to next pass (with validation)
- `*checkpoint` - Trigger checkpoint (/clear recommended)

**Monitoring:**
- `*contracts` - View active contracts
- `*queue` - View component review queue (2nd pass)
- `*questions` - View packaged operator questions
- `*progress` - Show sprint progress dashboard

**Operator Actions:**
- `*answer` - Answer packaged questions
- `*approve` - Approve milestone/component
- `*intervene` - Provide reference file for failed component
- `*bugs` - Submit bug list for batch processing (3rd pass)

**System:**
- `*boundaries` - View/edit parallel boundaries
- `*config` - View execution configuration
- `*clear` - Recommend /clear checkpoint
- `*help` - Show menu
- `*exit` - Exit orchestrator

### Example
```
/orc-exe

# After activation, you'll see:
# =========================================
# ORC-EXE: Supreme Orchestrator
# =========================================
#
# Current State: First Pass
# Stories Ready: 5
# ...
#
# Enter command: *start
```

---

## /handoff

**File:** `.claude/commands/handoff.md`

**Purpose:** Create comprehensive handoff documentation for session end or context switching.

### When to Use
- End of work session
- Before switching to different work
- When handing off to another person or AI session

### What It Does
1. Gathers current state from execution files
2. Creates `next-steps.md` with two sections:
   - **For Humans** - Plain language summary
   - **For AI Continuation** - Technical details for next session
3. Commits all changes
4. Pushes to GitHub

### Output Files
- `next-steps.md` - Handoff documentation at project root
- Git commit with handoff state

### Example Output
```markdown
# Next Steps

## For Humans

### What's Done
- User authentication flow complete
- Recipe CRUD operations working

### What's Next
- Build recipe card component
- Add search functionality

---

## For AI Continuation

### Current State
- **Phase**: First Pass
- **Active Stories**: Story 1-3 (in progress)
- **Parallel Boundaries**: Chunk 1 complete

### Immediate Next Actions
1. Complete Story 1-3 acceptance criteria
2. Run tests for authentication module
...
```

---

## /push-to-github

**File:** `.claude/commands/push-to-github.md`

**Purpose:** Quick checkpoint save without full handoff documentation.

### When to Use
- Quick checkpoint during work
- Before risky changes
- Periodic saves during long sessions
- After completing a story or milestone

### What It Does
1. Checks current git state
2. Generates descriptive commit message based on changes
3. Commits and pushes

### Commit Message Types
- `feat` - New feature or functionality
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - CSS/styling changes
- `refactor` - Code restructuring
- `chore` - Maintenance, config changes
- `wip` - Work in progress checkpoint

### Example
```
/push-to-github

# Output:
# Files changed: 5
# Commit: feat: add user authentication flow
# Pushed to origin/main
# Reminder: Use /handoff for full documentation at session end
```

---

## Comparison: /handoff vs /push-to-github

| Aspect | /push-to-github | /handoff |
|--------|-----------------|----------|
| Speed | Fast | Thorough |
| Documentation | None | Full next-steps.md |
| Use Case | Mid-session checkpoint | End of session |
| AI Context | Not preserved | Preserved for continuation |

---

## Typical Workflow

```
New Project:
  /refine                  # Create PRD + Architecture (35-45 min)
  /orc-exe                 # Start execution

Session Start:
  /orc-exe                 # Load orchestrator

During Work:
  /push-to-github          # Quick saves as needed

Session End:
  /handoff                 # Full documentation + push
```

---

## Additional Notes

### After /clear
When you run `/clear` to reset context, always start with:
```
/orc-exe
```
The orchestrator will read contracts and status files to restore state.

### Command Files Location
All command definitions are in `.claude/commands/`:
- `orc-exe.md`
- `handoff.md`
- `push-to-github.md`
