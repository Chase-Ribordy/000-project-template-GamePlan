# /refine - Idea Pipeline Command

Transform a raw idea into execution-ready documentation through structured discovery.

## Activation

You are now facilitating the Idea Pipeline. This is a **pre-requisite** step before `/orc-exe` can begin execution.

---

## Pipeline Overview

```
/refine (you are here)
    |
    v
Phase 1: Discovery (8-12 questions)
    |
    v
Phase 2: Initial Planning Docs
    Output: docs/initial-planning/
      - full-idea.md
      - scope.md
      - manual.md
    |
    v
Phase 3: Finalized Planning Docs
    Output: docs/finalized-plan/
      - prd.md
      - architecture.md
    |
    v
Ready for: /orc-exe
```

---

## Execution Protocol

### Step 1: Welcome & Context

Display:
```
=========================================
IDEA PIPELINE - /refine
=========================================

This command transforms your raw idea into
execution-ready documentation in 3 phases.

Time estimate: 35-45 minutes total
- Phase 1: Discovery (~15-20 min)
- Phase 2: Initial Docs (~10 min)
- Phase 3: Finalized Docs (~10 min)

At the end, you'll have:
- docs/initial-planning/ (vision & scope)
- docs/finalized-plan/ (PRD & architecture)

These are prerequisites for /orc-exe execution.

=========================================
Ready to begin? (yes/no)
```

### Step 2: Discovery Questions (Phase 1)

Ask questions **one at a time** to gather complete context. Adapt questions based on answers.

**Core Questions (Required):**

1. **The Problem**
   > What problem are you solving? Who has this problem and how do they currently deal with it?

2. **Target User**
   > Who is the primary user? Describe them - their role, technical level, and what they care about.

3. **Core Value**
   > What's the ONE thing this must do well? If it does nothing else, what makes it worth building?

4. **Key Features**
   > What are the 3-5 features that make up the MVP? (Just names/concepts, we'll detail later)

5. **User Flow**
   > Walk me through what a user does from start to finish. What's the happy path?

6. **Constraints**
   > What are the technical, time, or resource constraints? Any must-use technologies?

7. **Success Metrics**
   > How do you know if this works? What does success look like in 30 days? 90 days?

8. **Dependencies**
   > What external services, APIs, or data sources does this need? Any authentication requirements?

**Adaptive Questions (Ask if relevant):**

9. **Data Model** (if data-heavy)
   > What are the main entities/objects and how do they relate?

10. **Existing Code** (if brownfield)
    > What existing code or patterns must be preserved?

11. **Integration Points** (if connecting to other systems)
    > What does this need to integrate with? How?

12. **Visual Design** (if UI-heavy)
    > Any specific visual requirements, branding, or UI patterns?

**After each answer:** Acknowledge, then ask a clarifying follow-up if needed before moving to next question.

### Step 3: Generate Initial Planning Docs (Phase 2)

Create the initial planning folder and files:

```
docs/initial-planning/
├── full-idea.md    # Complete project vision
├── scope.md        # MVP vs backlog, constraints
└── manual.md       # Non-automated work
```

#### full-idea.md Template
```markdown
# [Project Name] - Full Idea Document

## Problem Statement
[The problem being solved and who has it]

## Target User
[Detailed user persona]

## Core Value Proposition
[The ONE thing this must do well]

## User Journey
[Step-by-step user flow from first touch to value delivery]

## Key Features (MVP)
### Feature 1: [Name]
- Description: [What it does]
- User need: [Why they need it]

### Feature 2: [Name]
[...]

## Success Criteria
- 30-day: [Measurable goal]
- 90-day: [Measurable goal]

## Technical Context
- Platform: [Web/Mobile/API/etc]
- Dependencies: [List]
- Constraints: [List]
```

#### scope.md Template
```markdown
# [Project Name] - Scope Document

## MVP Scope (In)
- [ ] [Feature/capability 1]
- [ ] [Feature/capability 2]
- [ ] [Feature/capability 3]

## Backlog (Out of MVP)
- [ ] [Future feature 1]
- [ ] [Future feature 2]

## Constraints
- Time: [deadline or timeframe]
- Technical: [must-use tech, limitations]
- Resources: [availability, budget]

## Assumptions
- [Assumption 1]
- [Assumption 2]

## Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk 1] | [High/Med/Low] | [Mitigation] |
```

#### manual.md Template
```markdown
# [Project Name] - Manual Tasks

Tasks that require human action (not automatable by AI agents).

## Prerequisites (Before Development)
- [ ] [API key acquisition]
- [ ] [Account setup]
- [ ] [Data collection]

## During Development
- [ ] [Manual testing step]
- [ ] [Third-party configuration]

## Post-Development
- [ ] [Deployment configuration]
- [ ] [User setup/onboarding]

## Notes
[Any context about why these are manual]
```

**After creating files:** Display summary and ask operator to review before Phase 3.

### Step 4: Generate Finalized Planning Docs (Phase 3)

Spawn PM and Architect agents to create execution-ready docs:

```
docs/finalized-plan/
├── prd.md          # Product Requirements Document
└── architecture.md # Technical Architecture
```

#### Spawn PM Agent
```javascript
Task({
  description: "PM: Generate PRD from initial planning",
  subagent_type: "general-purpose",
  prompt: `
You are the PM agent. Read and embody .system/agents/pm.md.

INPUT:
- docs/initial-planning/full-idea.md
- docs/initial-planning/scope.md
- docs/initial-planning/manual.md

OUTPUT:
- docs/finalized-plan/prd.md

Create a comprehensive PRD with:
- Functional requirements with acceptance criteria
- Non-functional requirements
- User stories per feature
- Epic breakdown
- Success metrics

When complete, confirm the PRD is ready for architecture.
`
})
```

#### Spawn Architect Agent
```javascript
Task({
  description: "Architect: Generate architecture from PRD",
  subagent_type: "general-purpose",
  prompt: `
You are the Architect agent. Read and embody .system/agents/architect.md.

INPUT:
- docs/initial-planning/full-idea.md
- docs/finalized-plan/prd.md

OUTPUT:
- docs/finalized-plan/architecture.md

Create a comprehensive architecture document with:
- System overview and components
- Technology stack decisions
- Data models
- API specifications
- Component breakdown for parallel development
- Dependency graph

When complete, confirm architecture is ready for execution.
`
})
```

### Step 5: Completion

Display:
```
=========================================
IDEA PIPELINE COMPLETE
=========================================

Created:
  docs/initial-planning/
    - full-idea.md
    - scope.md
    - manual.md

  docs/finalized-plan/
    - prd.md
    - architecture.md

=========================================
NEXT STEPS:
=========================================

Option 1: Continue to execution
  Run: /orc-exe
  The orchestrator will guide you through the three-pass build.

Option 2: Handoff for later
  Run: /handoff
  Creates next-steps.md and pushes to GitHub.

Option 3: Quick save
  Run: /push-to-github
  Commits current state without documentation.

=========================================
```

---

## Error Handling

### Missing Input
If operator can't answer a question:
- Offer to skip with a placeholder
- Mark as "TBD" in output docs
- Flag for review in manual.md

### Existing Docs
If docs/initial-planning/ or docs/finalized-plan/ already exist:
- Ask: "Planning docs exist. Overwrite or refine?"
- Overwrite: Replace all
- Refine: Read existing, ask targeted questions, update

---

## Context Preservation

If context window is getting full during long discovery:
- Complete Phase 1 (discovery answers in memory)
- Generate Phase 2 docs immediately
- Recommend `/clear` before Phase 3 if needed
- Phase 3 agents will read the Phase 2 docs (no context loss)
