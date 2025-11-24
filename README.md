# Project Template - Operator Guide

AI-assisted development: **idea → execution** in two commands.

## Prerequisites
- Claude Code CLI
- Playwright MCP server (for testing)

---

## Workflow Overview

```
/refine (35-45 min)          /orc-exe (hours)
        │                           │
        ▼                           ▼
   Answer Questions            Three-Pass Build
        │                           │
        ▼                           ▼
   prd.md + architecture.md    Working Application
```

---

## Step 1: Idea Pipeline (`/refine`)

**What you do**: Answer 8-12 discovery questions about your idea.

**What it creates**:
- `docs/initial-planning/` - Vision, scope, manual
- `docs/finalized-plan/prd.md` - Product requirements
- `docs/finalized-plan/architecture.md` - Technical design

When both `prd.md` and `architecture.md` exist, you're ready for execution.

---

## Step 2: Execution Pipeline (`/orc-exe`)

**Prerequisites**: `prd.md` and `architecture.md` must exist.

### Three Passes

| Pass | Goal | Your Role |
|------|------|-----------|
| **First** | Skeleton build (working but ugly) | Answer questions only |
| **Second** | Component polish | Review queue, approve components |
| **Third** | Debug & finish | List bugs, final review |

### When to `/clear`

Run `/clear` at these checkpoints to maintain performance:
- After each chunk in First Pass (orc-exe will recommend)
- Between passes
- Whenever `*checkpoint` is called

State is saved to YAML files - context survives `/clear`.

---

## Commands Reference

### Core Commands

| Command | Purpose |
|---------|---------|
| `/refine` | Start idea pipeline (35-45 min) |
| `/orc-exe` | Start execution pipeline |
| `/handoff` | Create next-steps.md + push to GitHub |
| `/push-to-github` | Quick checkpoint save |

### During Execution (`/orc-exe`)

| Command | Purpose |
|---------|---------|
| `*start` | Begin/resume autonomous execution |
| `*status` | Check current state |
| `*pass` | See current pass details |
| `*approve` | Approve milestone or component |
| `*checkpoint` | Save state, recommends /clear |
| `*help` | Show all commands |

---

## Operator Tips

1. **Trust autonomous execution** - The system handles coordination
2. **Only intervene when asked** - Answer questions, don't micromanage
3. **Use `/clear` between passes** - Keeps context window healthy
4. **Check browser at pass boundaries** - Validate before advancing
5. **`/handoff` before closing** - Preserves session context

---

## Quick Start

```bash
# New project
/refine                  # Answer questions → creates planning docs

# Build it
/orc-exe                 # Three-pass autonomous build
*start                   # Begin execution

# Save progress
/handoff                 # Full documentation + push
```
