---
description: 'Complete planning session - brainstorm → PRD → architecture → stories'
---

# Full Planning Session

A guided journey from raw idea to development-ready stories. Uses multiple BMAD agents in sequence.

**Best for**: Starting a new project from scratch
**Time**: 30-60 minutes (can pause/resume)

---

## Session Overview

```
Phase 1: Ideation      → Brainstorm & refine idea (5-10 min)
Phase 2: Requirements  → Create PRD with PM agent (15-20 min)
Phase 3: Design        → Architecture with Architect agent (10-15 min)
Phase 4: Planning      → Create epics & stories (10-15 min)
```

---

## Phase 1: Ideation (No Agent)

### Step 1: Capture Raw Idea

Ask:
```
Let's plan your project from scratch.

First, what's the idea? Give me the rough version:
```

Wait for response.

### Step 2: Refine with Quick Questions

Ask (one at a time):
1. "Who's this for?"
2. "What problem does it solve?"
3. "What's the ONE core thing it does?"

### Step 3: Confirm Understanding

Present:
```
Here's what I'm hearing:

**Project**: [Name if mentioned, or "[TBD]"]
**For**: [Target user]
**Problem**: [Pain point]
**Solution**: [Core feature/approach]

Sound right? (yes/adjust/start over)
```

---

## Phase 2: Product Requirements (PM Agent)

Once idea is confirmed:

```
Great! Now let's turn this into a proper PRD.
I'm bringing in the Product Manager perspective...
```

<agent-activation>
1. LOAD @.bmad/bmm/agents/pm.md
2. Execute streamlined PRD workflow
3. Focus on:
   - Problem statement
   - Core features (MVP)
   - Success metrics
   - Constraints
4. Skip optional sections for speed
5. Save to docs/prd.md
</agent-activation>

After PRD is saved:
```
PRD saved. Ready for architecture?
- Yes → Continue to Phase 3
- Review → Let me show you the key sections
- Pause → I'll save our progress, continue later with /proprietary:full-plan
```

---

## Phase 3: Architecture (Architect Agent)

```
Switching to Architect perspective for technical design...
```

<agent-activation>
1. LOAD @.bmad/bmm/agents/architect.md
2. Reference the PRD created in Phase 2
3. Focus on:
   - Tech stack recommendation
   - High-level system design
   - Key technical decisions
   - Data model overview
4. Keep it practical for project size
5. Save to docs/architecture.md
</agent-activation>

After architecture is saved:
```
Architecture saved. Ready to create stories?
- Yes → Continue to Phase 4
- Review → Let me walk you through the design
- Pause → Progress saved, continue later
```

---

## Phase 4: Stories (SM/PM Collaboration)

```
Now let's break this into actionable stories...
```

<workflow-execution>
1. LOAD @.bmad/core/tasks/workflow.xml
2. Process @.bmad/bmm/workflows/3-epic-workflows/create-epics-and-stories/workflow.yaml
3. Create:
   - Epic breakdown (3-5 epics for MVP)
   - User stories for first epic
   - Acceptance criteria for each story
4. Save to docs/epics/ folder
</workflow-execution>

---

## Session Complete

```
🎉 Planning Complete!

Created:
- docs/prd.md
- docs/architecture.md
- docs/epics/[epic-files]

You're ready to start development.

Next steps:
- /bmad:bmm:workflows:dev-story → Start implementing first story
- /bmad:bmm:workflows:sprint-planning → Set up sprint tracking

Want me to start on the first story now? (yes/no)
```

---

## Resume Support

If user pauses at any point, save progress note:

Create/update `.claude/session-state.md`:
```markdown
# Planning Session State

Project: [name]
Current Phase: [1-4]
Completed:
- [ ] Phase 1: Ideation
- [ ] Phase 2: PRD
- [ ] Phase 3: Architecture
- [ ] Phase 4: Stories

Last Updated: [timestamp]
Notes: [any context]
```

When resuming, read this file and continue from where they left off.

---

**NOW: Start with Phase 1, Step 1 - ask for their raw idea.**
