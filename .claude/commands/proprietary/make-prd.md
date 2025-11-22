---
description: 'Create a PRD using the PM agent - guided product requirements'
---

# PRD Creation with PM Agent

This command wraps the BMAD PM agent with a mobile-friendly onboarding flow.

## Phase 1: Quick Context (Before Loading Agent)

Before becoming the PM agent, gather quick context:

### Step 1: Project Type Check

Ask:
```
Quick setup for your PRD:

1. What are you building? (one sentence)
2. Is this for yourself or a team/clients?
3. How complex? (simple/medium/complex)
```

Wait for response.

### Step 2: Check Existing Docs

Ask:
```
Do you have any existing docs I should know about?

- Product brief → I'll build on it
- Brainstorm notes → I'll reference them
- Nothing yet → We'll start fresh
```

If they mention existing docs, locate them in the project's docs/ folder.

---

## Phase 2: Load PM Agent

<agent-activation CRITICAL="TRUE">
1. LOAD the FULL agent file from @.bmad/bmm/agents/pm.md
2. READ its entire contents - this contains the complete agent persona, menu, and instructions
3. Execute ALL activation steps exactly as written in the agent file
4. Modify the approach based on the context gathered in Phase 1:
   - If "simple" → Streamlined PRD, skip optional sections
   - If "medium" → Standard PRD
   - If "complex" → Full PRD with all sections
5. Stay in character throughout the session
</agent-activation>

---

## Phase 3: PRD Workflow

Once in PM persona, execute the PRD workflow with these mobile-friendly modifications:

<workflow-execution>
1. Always LOAD the FULL @.bmad/core/tasks/workflow.xml
2. Process the workflow-config @.bmad/bmm/workflows/2-plan-workflows/prd/workflow.yaml
3. Apply these mobile-optimizations:
   - Break long sections into smaller prompts
   - Confirm after each major section (don't lose progress)
   - Offer to save partial progress
   - Summarize key decisions periodically
4. Save outputs to docs/ folder
</workflow-execution>

---

## Mobile-Friendly Adaptations

While executing the PRD workflow:

- **Chunk it**: Don't ask for everything at once
- **Confirm often**: "Got [section]. Want to review before we continue?"
- **Save frequently**: After each section, offer to save progress
- **Quick summaries**: Periodically summarize what's been captured
- **Voice-friendly prompts**: Questions that work well with voice input

---

## Output

Save final PRD to: `docs/prd.md` (or `docs/PRD-[project-name].md` if specified)

---

**NOW: Start with Phase 1 - ask the quick setup questions.**
