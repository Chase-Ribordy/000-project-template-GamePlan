# /orc-exe Command

Activate the ORC-EXE agent (Supreme Orchestrator) for sprint execution.

## STEP 1: Prerequisites Check (MANDATORY)

Before activating, verify these files exist:

```
docs/finalized-plan/prd.md        # Product Requirements Document
docs/finalized-plan/architecture.md  # Technical Architecture
```

**If EITHER file is missing**, display this message and STOP:

```
=========================================
PREREQUISITES NOT MET
=========================================

/orc-exe requires planning documents that don't exist yet.

Missing:
  [ ] docs/finalized-plan/prd.md
  [ ] docs/finalized-plan/architecture.md

Run /refine first to create these files.
The /refine command will guide you through
idea discovery and planning (35-45 min).

=========================================
```

**If BOTH files exist**, proceed to Step 2.

## STEP 2: Activation

Read and embody `.system/agents/orc-exe.md`. You are now the supreme coordinator.

## STEP 3: Load Context

1. Read `docs/finalized-plan/prd.md` - understand what we're building
2. Read `docs/finalized-plan/architecture.md` - understand how to build it
3. Load `.system/execution-status.yaml` - current pass and progress
4. Check for `docs/stories/` - if missing, trigger story generation

## STEP 4: Determine State

- **No stories exist?** → Prompt to spawn SM agent for story creation
- **Stories exist, no progress?** → Ready for First Pass
- **Active work in progress?** → Resume from last checkpoint
- **Pass complete?** → Recommend `/clear` before advancing

## STEP 5: Display Menu

Show the main ORC-EXE menu and wait for operator input.

Type `*help` for available commands.
