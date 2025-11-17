# BMAD + Autonomous Execution Integration

Quick reference for how BMAD Method workflows integrate with autonomous execution.

**For detailed workflow:** See `docs/README-OPERATOR.md`
**For command reference:** See root `README.md`

---

## The Integration Model

**BMAD (Planning)** → Define WHAT to build
**Autonomous (Execution)** → Implement HOW to build

**You decide** → **Autonomous executes** → **You review**

---

## Workflow Stages

| Stage | BMAD Commands | Autonomous Commands | Output |
|-------|---------------|---------------------|--------|
| **1. Planning** | `/pm`, `/prd`, `/architect` | - | `docs/` |
| **2. Stories** | `/create-epics-and-stories`, `/tech-spec` | - | `docs/stories/`, `docs/epics/` |
| **3. Backend** | `/dev-story` | Auto-validates components | Backend + APIs |
| **4. UI Prototype** | Claude Chat | - | `references/*.html` |
| **5. Integration** | - | `/integrate` | `.system/components/`, production files |
| **6. Debug** | - | `/debug-css`, `/quick-fix`, `/improve` | Fixed components |
| **7. Quality** | `/code-review` | Auto-validation | Reviewed code |
| **8. Sprint** | `/sprint-planning`, `/story-done` | Tracks via `execution-status.yaml` | Sprint status |

---

## Two Tracking Systems

### BMAD Story Files (`docs/stories/*.md`)
- **Purpose:** Business progress (acceptance criteria, features)
- **Updated by:** Manual or BMAD workflows
- **Use for:** Sprint planning, stakeholder communication

### Execution Status (`.system/execution-status.yaml`)
- **Purpose:** Technical progress (validation, integration status)
- **Updated by:** `progress-reporter` skill (automatic)
- **Use for:** Debugging blockers, quality gate verification

**Workflow:** Check `execution-status.yaml` for technical blockers → Fix issues → Mark BMAD story complete

---

## Quick Command Decision Guide

**Starting project?** → `/pm` → `/prd` → `/architect` → `/create-epics-and-stories` (Claude Chat)

**Backend feature?** → `/dev-story [story]` (Claude Code)

**UI feature?** → Build in Claude Chat → Save to `references/` → `/integrate references/file.html` (Claude Code)

**CSS bug?** → `/debug-css [component]` (Claude Code)

**Quick bug fix?** → `/quick-fix [issue]` (Claude Code)

**Refactor?** → `/improve [feature]` (Claude Code)

**Session start/end?** → `/checklist` (start), `/next-steps` (end)

---

## Mental Model

### You Own (Strategic)
- Define requirements (BMAD)
- Design architecture (BMAD)
- Create prototypes (Claude Chat)
- Make decisions
- Review & approve

### Autonomous Owns (Tactical)
- Extract components from prototypes
- Generate contracts
- Validate (4 levels: syntax, tests, contracts, integration)
- Test in sandbox
- Integrate into production
- Track progress

**The boundary:** You decide WHAT → Autonomous executes HOW

---

## Integration Points

1. **BMAD creates stories** → Autonomous tracks via `execution-status.yaml`
2. **Backend development** → Autonomous validates components automatically
3. **UI prototypes** → `/integrate` triggers autonomous pipeline
4. **Quality gates** → Autonomous blocks integration if validation fails
5. **Sprint tracking** → BMAD story files + execution status work together

---

## Key Files

- **Operator workflow guide:** `docs/README-OPERATOR.md` - Complete 3-phase workflow
- **Command reference:** Root `README.md` - All commands with scenarios
- **Autonomous deep dive:** `.system/README-AUTONOMOUS.md` - Technical details
- **Architecture:** `.system/README.md` - Skills ↔ MCP ↔ Contracts

---

**TL;DR:** BMAD plans, Autonomous executes. You focus on WHAT to build, autonomous handles HOW to build it with quality enforcement.
