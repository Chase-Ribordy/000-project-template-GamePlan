# Next Steps

## For Humans

### What's Done (This Session)

**Execution Pipeline Hardened:**
- Fixed Playwright MCP integration (correct function names)
- Made Third Pass fully autonomous (issues → stories → parallel fix agents)
- Updated all dev agents (first-pass, second-pass, third-pass)
- SM agent now generates parallel boundaries automatically
- README rewritten as operator guide

**Mobile Resume Workflow:**
- Added `/resume` command - pick up from any device
- Push to GitHub, open Claude Code on web, run `/resume`

### What's Next

1. **Test the system** - Run `/orc-exe` with a real project
2. **Minor cleanup** - Remove stale MCP reference in dev-second-pass.md (line 203)
3. **Test /refine** - Verify idea pipeline works end-to-end

### How to Continue (Mobile)

```
1. Push current changes to GitHub
2. Open Claude Code on web (phone)
3. Run: /resume
4. Follow the prompts
```

---

## For AI Continuation

### Current State
- **Phase**: System architecture complete
- **Status**: Ready for testing
- **Branch**: main (uncommitted changes)

### What Changed This Session

**Core Fixes:**
- `.system/agents/orc-exe.md` - Playwright MCP names fixed, polling loop added, Third Pass refactored to autonomous bulk-fix
- `.system/agents/dev-first-pass.md` - Playwright MCP names fixed
- `.system/agents/dev-second-pass.md` - Playwright MCP names fixed, autonomous validation added
- `.system/agents/dev-third-pass.md` - Playwright MCP names fixed, autonomous batch processing
- `.system/agents/sm.md` - Parallel boundaries generation, Task() spawning integration
- `.claude/commands/orc-exe.md` - Prerequisites check strengthened

**New Files:**
- `docs/sprint-artifacts/.gitkeep` - Directory created
- `docs/sprint-artifacts/sprint-status-template.yaml` - Sprint tracking template
- `.system/work-packages/.gitkeep` - Directory created
- `.system/contracts/story-completion-template.yaml` - Contract template
- `.claude/commands/resume.md` - Mobile resume command

**Updated:**
- `README.md` - Complete operator-focused guide
- `.system/agents/AGENT-SELECTION-GUIDE.md` - BMAD references removed
- `.system/agents/README.md` - BMAD references removed

### Known Issues

1. **dev-second-pass.md line 203** - References `mcp__component-registry__validate_integration` which doesn't exist. Should be removed.

2. **BMAD cleanup incomplete** - ~20 files in `.system/template/` and `.system/parallel-work/examples/` still have BMAD references (low priority).

### Immediate Next Actions

1. Fix stale MCP reference in dev-second-pass.md
2. Commit all changes: `git add -A && git commit -m "Harden execution pipeline, add /resume"`
3. Push to GitHub: `git push`
4. Test `/orc-exe` activation with existing PRD/architecture files

### Context Files to Read on Resume

Priority order:
1. `next-steps.md` (this file) - Current state
2. `.system/execution-status.yaml` - Phase tracking
3. `README.md` - Operator workflow overview
4. `.system/agents/orc-exe.md` - Orchestrator definition

### Commands to Run

```bash
# To continue development
/resume              # Shows current state, suggests next action

# To test execution pipeline
/orc-exe             # Requires docs/finalized-plan/prd.md + architecture.md

# To save and switch devices
/handoff             # Updates this file, commits, pushes
```

### Architecture Summary

```
IDEA PIPELINE (/refine)
├── Phase 1: Discovery questions
├── Phase 2: Initial planning → docs/initial-planning/
└── Phase 3: PRD + Architecture → docs/finalized-plan/

EXECUTION PIPELINE (/orc-exe)
├── Prerequisites: prd.md + architecture.md must exist
├── Story Generation: SM agent creates stories + parallel-boundaries
├── First Pass: Skeleton (autonomous, Playwright validates)
├── Second Pass: Polish (autonomous with live streaming)
└── Third Pass: Fix (issues → stories → parallel agents)

MOBILE WORKFLOW
├── /handoff → Saves state, pushes to GitHub
└── /resume → Reads state, continues from any device
```

### Warnings

- **Playwright MCP required** - Check `.mcp.json` includes playwright server
- **Prerequisites enforced** - /orc-exe will error if PRD/architecture missing
- **Don't restore BMAD** - System intentionally simplified
- **Contracts are internal** - Operator never interacts with `.system/contracts/`
