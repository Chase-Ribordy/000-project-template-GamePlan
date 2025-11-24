# Handoff Command

Create handoff documentation for session end or context switching.

## Instructions

When this command is invoked:

### 1. Gather Current State

Read and analyze:
- `.system/execution-status.yaml` - Current phase and progress
- `docs/sprint-artifacts/sprint-status.yaml` - Story statuses
- `docs/sprint-artifacts/parallel-boundaries.yaml` - Chunk/milestone progress
- `.system/review-queue.yaml` - Pending component reviews (if exists)
- Any uncommitted changes via `git status`

### 2. Create next-steps.md

Write to `next-steps.md` in the project root with TWO sections:

```markdown
# Next Steps

## For Humans

[Plain language summary - what a non-technical person can understand]

### What's Done
- [List completed work in simple terms]
- [Focus on features/functionality, not technical details]

### What's Next
- [Clear, actionable next steps]
- [Priority order if multiple items]

### Notes
- [Any blockers, decisions needed, or context]

---

## For AI Continuation

[Technical details for the next AI session to pick up seamlessly]

### Current State
- **Phase**: [Planning / Sprint Setup / 1st Pass / 2nd Pass / 3rd Pass]
- **Active Stories**: [List with status]
- **Parallel Boundaries**: [Current chunk, milestone status]
- **Blocking Issues**: [Any blockers]

### Immediate Next Actions
1. [Specific technical action]
2. [Specific technical action]
3. [Specific technical action]

### Context Files to Read
- [Paths to relevant files the next session should load]

### Warnings/Gotchas
- [Technical debt, known issues, tricky areas]

### Commands to Run
- [Suggested commands to continue work]
```

### 3. Commit and Push

```bash
git add -A
git commit -m "Handoff: [brief summary of current state]"
git push
```

### 4. Confirm to Operator

Display:
- Summary of what was documented
- GitHub push confirmation
- How to resume: "Run `/orc-exe` to continue"

## Output

Creates:
- `next-steps.md` at project root
- Git commit with handoff state
- Push to remote repository

## Usage

```
/handoff
```

Best used at:
- End of work session
- Before switching to different work
- When handing off to another person or AI session
