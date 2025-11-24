# Project Template

AI-assisted development workflow powered by **ORC-EXE**, the supreme orchestrator.

---

## TL;DR

```bash
# Start a new project
/refine                  # Answer questions, creates PRD + Architecture (35-45 min)

# Execute the project
/orc-exe                 # Builds your project in three passes

# Save progress anytime
/handoff                 # Creates next-steps.md + pushes to GitHub
/push-to-github          # Quick checkpoint save
```

---

## Complete Workflow

```
                         YOUR ROLE                        SYSTEM OUTPUT
                         ─────────                        ─────────────
Step 1: /refine
  │ Answer 8-12 discovery questions     →    docs/initial-planning/
  │ Review initial planning docs              - full-idea.md
  │ Confirm for finalization                  - scope.md
  │                                           - manual.md
  │                                      →    docs/finalized-plan/
  │                                           - prd.md
  │                                           - architecture.md
  ▼
Step 2: /orc-exe
  │
  ├─► FIRST PASS: Skeleton Build
  │   Your role: Answer questions only
  │   Testing: Playwright runs autonomously
  │   Output: Functional but ugly app
  │   End: Approve milestone → /clear
  │
  ├─► SECOND PASS: Component Polish
  │   Your role: Review queue, approve components
  │   Testing: Check browser after each integration
  │   Output: Polished components
  │   End: All components approved → /clear
  │
  └─► THIRD PASS: Debug & Finish
      Your role: List bugs, final review
      Testing: Final validation sweep
      Output: Production-ready application
      End: Project complete
```

---

## Commands Reference

### Planning Pipeline

| Command | When to Use | Time |
|---------|-------------|------|
| `/refine` | Start a new project idea | 35-45 min |

### Execution Pipeline

| Command | When to Use |
|---------|-------------|
| `/orc-exe` | After /refine completes, to build the project |
| `*start` | Begin or resume autonomous execution |
| `*status` | Check current execution state |
| `*pass` | See current pass details |
| `*advance` | Move to next pass (after QA gate) |
| `*queue` | View component review queue (2nd pass) |
| `*approve` | Approve a milestone or component |
| `*bugs` | Submit bug list for batch processing (3rd pass) |
| `*checkpoint` | Save state, recommends /clear |
| `*help` | Show all orc-exe commands |

### Checkpoints & Handoff

| Command | What It Does |
|---------|--------------|
| `/handoff` | Creates `next-steps.md` with full context + pushes to GitHub |
| `/push-to-github` | Quick commit + push without documentation |

---

## When to /clear

Context window management is critical for performance. Run `/clear` at these checkpoints:

1. **After each chunk** in First Pass (orc-exe will recommend)
2. **After significant component batch** in Second Pass
3. **Before starting Third Pass**
4. **Whenever orc-exe recommends** via `*checkpoint`

The system saves state to YAML files, so context is preserved across `/clear`.

---

## Project Structure

```
project/
├── docs/
│   ├── initial-planning/         # From /refine (vision, scope)
│   │   ├── full-idea.md
│   │   ├── scope.md
│   │   └── manual.md
│   │
│   ├── finalized-plan/           # From /refine (PRD, architecture)
│   │   ├── prd.md                # ← Drives execution
│   │   └── architecture.md       # ← Drives execution
│   │
│   ├── epics/                    # Created by SM agent
│   └── stories/                  # User stories for execution
│
├── .system/                      # Orchestrator internals (ignore)
│   ├── agents/                   # Agent definitions
│   ├── contracts/                # Sub-agent coordination
│   ├── parallel-boundaries.yaml  # Independent work chunks
│   └── review-queue.yaml         # Component approval queue
│
├── .claude/
│   └── commands/                 # Slash commands
│
├── src/                          # Your application code
├── css/
├── js/
└── next-steps.md                 # Handoff documentation
```

### What You Work With
- `docs/` - Review and approve planning documents
- `src/`, `css/`, `js/` - Generated code (review as needed)
- `next-steps.md` - Session handoff context

### What the System Manages
- `.system/` - Internal orchestration (contracts, queues, state)
- `.claude/` - Command and skill definitions

---

## Three-Pass System

### First Pass: Skeleton Build
**Goal**: Get the entire app working end-to-end, even if ugly.

- Backend is fully functional
- Frontend is minimal (default styles OK)
- All data flows work
- Tests pass

**Your Role**: Answer questions when asked. Approve milestones.

### Second Pass: Component Polish
**Goal**: Replace ugly components with polished, production-quality versions.

- Components built against contracts
- CSS properly namespaced
- Responsive and accessible
- Visually polished

**Your Role**: Review the queue. Approve components. Provide reference files if needed.

### Third Pass: Debug & Finish
**Goal**: Fix everything that isn't perfect.

- Bug fixes from your list
- Performance optimization
- Final polish
- Production readiness

**Your Role**: Test the app. List issues. Final approval.

---

## Typical Session Examples

### New Project
```
1. /refine              # Start planning (35-45 min)
2. Answer questions     # Clarify your idea
3. /orc-exe             # Begin execution
4. *start               # Start first pass
5. ... work happens ...
6. /handoff             # End session with documentation
```

### Resuming Work
```
1. Check next-steps.md  # Understand current state
2. /orc-exe             # Re-activate orchestrator
3. *status              # See where we left off
4. *start               # Continue execution
```

### Quick Save
```
1. /push-to-github      # Commit and push current state
```

---

## Key Principles

1. **ORC-EXE is your interface** - Talk to the orchestrator, not individual agents
2. **Three passes, not one** - Skeleton first, polish second, bugs third
3. **End-to-end testing** - Test milestones, not individual pieces
4. **/clear at checkpoints** - Preserve context window performance
5. **Focus on your idea** - The system handles process coordination

---

## Getting Started

### Prerequisites
- Claude Code CLI installed
- Git repository initialized
- Node.js (if your project uses it)

### First Time Setup
```bash
# Clone the template
git clone <repository-url> my-project
cd my-project

# Start your project
/refine
```

Then follow the prompts. The system will guide you through everything.
