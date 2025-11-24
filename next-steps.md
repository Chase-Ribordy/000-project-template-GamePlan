# Next Steps

## For Humans

### What's Done (This Session)

*[To be filled by /handoff command]*

### What's Next

1. Run `/refine` to plan your project
2. Run `/orc-exe` to build it
3. Use `/handoff` to save progress

### How to Continue

```
1. Push to GitHub: git push
2. Open Claude Code on any device
3. Run: /resume
4. Follow the prompts
```

---

## For AI Continuation

### Current State
- **Phase**: Template - Not started
- **Status**: Ready for /refine
- **Branch**: (to be set)

### What Changed This Session

*[Auto-populated by /handoff]*

### Known Issues

*None - fresh template*

### Immediate Next Actions

1. Run `/refine` to begin idea pipeline
2. Answer discovery questions
3. Review generated PRD + Architecture
4. Run `/orc-exe` to begin execution

### Context Files to Read on Resume

Priority order:
1. `next-steps.md` (this file) - Current state
2. `.system/execution-status.yaml` - Phase tracking
3. `README.md` - Operator workflow overview

### Commands to Run

```bash
# Start planning
/refine

# Start building (after planning complete)
/orc-exe
*start

# Save progress
/handoff

# Continue from another device
/resume
```

### Architecture Summary

```
IDEA PIPELINE (/refine)
├── Phase 1: Discovery questions
├── Phase 2: Initial planning → docs/initial-planning/
└── Phase 3: PRD + Architecture → docs/finalized-plan/

EXECUTION PIPELINE (/orc-exe)
├── Prerequisites: prd.md + architecture.md must exist
├── Story Generation: SM agent creates stories
├── First Pass: Skeleton (functional, ugly OK)
├── Second Pass: Polish (beautiful, validated)
└── Third Pass: Fix (bugs, edge cases)

SESSION CONTINUITY
├── /handoff → Saves state, pushes to GitHub
└── /resume → Reads state, continues from any device
```

### Warnings

- **Playwright MCP required** - Check `.mcp.json` is configured
- **Prerequisites enforced** - /orc-exe requires PRD + architecture
- **Contracts are internal** - Operator never edits `.system/contracts/`
