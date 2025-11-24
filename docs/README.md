# Documentation

This folder contains planning and execution artifacts.

---

## Structure

```
docs/
├── initial-planning/     # Output from /refine Phase 2
│   ├── full-idea.md      # Complete project vision
│   ├── scope.md          # MVP scope & constraints
│   └── manual.md         # Non-automated tasks
│
├── finalized-plan/       # Output from /refine Phase 3
│   ├── prd.md            # Product Requirements Document
│   └── architecture.md   # Technical Architecture
│
├── epics/                # Epic definitions (from SM agent)
└── stories/              # User stories for execution
```

---

## Workflow

1. `/refine` creates `initial-planning/` and `finalized-plan/`
2. `/orc-exe` reads `finalized-plan/` to drive execution
3. SM agent creates `epics/` and `stories/` based on PRD and architecture

---

## Quick Reference

- [AGENTS.md](AGENTS.md) - Agent quick reference
- [COMMANDS.md](COMMANDS.md) - Command quick reference

---

## Key Principle

**PRD and Architecture are the foundation.** All other documents (epics, stories, sprint artifacts) derive from these two core documents created by `/refine`.
