# Checkpoint Strategy: Natural Review Points in Development

## Philosophy

**Checkpoints prevent compounding errors.**

Without checkpoints, mistakes made in early work cascade into later work. A flawed backend architecture leads to 10 broken UI components. A misunderstood requirement leads to an entire epic going the wrong direction.

Checkpoints are **natural review points** where you pause, validate, and ensure the foundation is solid before building on it.

## Checkpoint Types

This system uses **soft checkpoints** - advisory recommendations, not enforced gates.

The orchestrator will **suggest** checkpoints at natural transition points, but operators can:
- Skip checkpoints (if confident)
- Add extra checkpoints (if concerned)
- Customize checkpoint criteria (per project needs)

**Why soft?** Because every project is different. Rigid gates slow down experienced teams. Advisory guidance helps junior teams without blocking senior teams.

## Core Checkpoints

### 1. First Pass Complete Checkpoint

**Trigger:** All stories in the epic have completed first pass (backend functionality working)

**Purpose:** Validate end-to-end flow before adding UI complexity

**Why critical:**
- UI should enhance working functionality, not mask broken logic
- Easier to debug backend without UI interference
- Prevents "looks good but doesn't work" syndrome
- Foundation must be solid before facade

**What to check:**

**Manual Testing:**
- [ ] Can you complete the core user journey end-to-end?
- [ ] Do all API endpoints return expected data?
- [ ] Are database operations correct (CRUD)?
- [ ] Do authentication/authorization flows work?
- [ ] Are error cases handled gracefully?

**Code Review:**
- [ ] Is the architecture sound?
- [ ] Are patterns consistent across stories?
- [ ] Is the code maintainable?
- [ ] Are there obvious technical debt issues?
- [ ] Do tests actually validate behavior (not just pass)?

**Requirements Validation:**
- [ ] Does the implementation match the PRD?
- [ ] Are all acceptance criteria met?
- [ ] Are there missing requirements that emerged during implementation?
- [ ] Does the technical approach make sense given what you learned?

**Decision point:**
- **Pass → Advance to second pass:** Start UI integration
- **Fail → Stay in first pass:** Fix backend issues, don't paper over with UI

**Common mistakes if skipped:**
- Building beautiful UI on broken backend
- Debugging issues that span backend + frontend (harder)
- Discovering architecture flaws after UI is built (expensive to refactor)
- Shipping "looks good in demo, fails in production"

### 2. Epic Completion Checkpoint

**Trigger:** All stories in an epic are done (all three passes complete)

**Purpose:** Validate epic as a cohesive feature before starting next epic

**Why critical:**
- Epics should deliver standalone value
- Next epic may depend on this one working correctly
- Prevents partial features (90% complete but can't ship)
- Natural point for stakeholder validation

**What to check:**

**Feature Validation:**
- [ ] Can a user complete the entire epic journey?
- [ ] Does the epic deliver the promised value?
- [ ] Are there gaps or missing pieces?
- [ ] Does it integrate correctly with existing features?

**Production Readiness:**
- [ ] Would you ship this to production today?
- [ ] Are there known bugs or edge cases?
- [ ] Is error handling production-quality?
- [ ] Is logging/monitoring sufficient?
- [ ] Are security considerations addressed?

**Technical Quality:**
- [ ] Is test coverage adequate?
- [ ] Is performance acceptable?
- [ ] Is the code maintainable?
- [ ] Is documentation complete?

**Stakeholder Review:**
- [ ] Demo the epic to stakeholders
- [ ] Does it match expectations?
- [ ] Are there UX improvements needed?
- [ ] Is the scope correct (not too much, not too little)?

**Decision point:**
- **Pass → Next epic:** Start next major feature
- **Fail → Polish current epic:** Fix gaps before moving on

**Common mistakes if skipped:**
- Starting next epic with broken dependencies
- Accumulating technical debt across epics
- Losing track of half-finished features
- Missing stakeholder expectations until too late

### 3. Pass Transition Checkpoints

These checkpoints validate readiness to move from one pass to the next.

#### First Pass → Second Pass Transition

**Trigger:** Story completed first pass, considering second pass

**Purpose:** Ensure backend works before adding UI

**What to check:**
- [ ] Does the backend functionality work end-to-end?
- [ ] Are API contracts clear and stable?
- [ ] Are data models finalized?
- [ ] Can UI components be built on this foundation?

**Decision point:**
- **Ready:** Move to second pass, build UI
- **Not ready:** Iterate on backend, don't start UI yet

#### Second Pass → Third Pass Transition

**Trigger:** Story completed second pass, considering third pass

**Purpose:** Ensure feature is complete before final polish

**What to check:**
- [ ] Is all planned functionality implemented?
- [ ] Does the UI work correctly?
- [ ] Are there known bugs that need fixing?
- [ ] Is the feature "feature complete" (just needs polish)?

**Decision point:**
- **Ready:** Move to third pass, polish for production
- **Not ready:** Finish implementation, don't polish incomplete work

### 4. Sprint Milestone Checkpoints

**Trigger:** Strategic points in sprint execution (25%, 50%, 75% complete)

**Purpose:** Course-correct before too much work goes wrong direction

**What to check:**

**At 25% Sprint Complete:**
- [ ] Is velocity as expected?
- [ ] Are there blockers or dependencies?
- [ ] Do early stories validate the approach?
- [ ] Are estimates accurate?

**At 50% Sprint Complete:**
- [ ] Is the sprint on track?
- [ ] Do completed stories integrate well?
- [ ] Are there scope issues (too much/too little)?
- [ ] Should anything be de-prioritized?

**At 75% Sprint Complete:**
- [ ] Will the sprint finish on time?
- [ ] What's the contingency plan if not?
- [ ] Are there loose ends to tie up?
- [ ] Is documentation current?

**Decision point:**
- **On track:** Continue as planned
- **Off track:** Adjust scope, re-prioritize, add resources

## Why Checkpoints Prevent Compounding Errors

### Error Propagation Without Checkpoints

```
Flawed backend (Story 1)
  ↓
Workaround in Story 2 (to compensate for Story 1)
  ↓
UI built on workaround (Story 3)
  ↓
More workarounds in Story 4 (to integrate with Story 3)
  ↓
Epic complete but fragile, hard to maintain
```

**Cost:** 4 stories worth of technical debt, all tracing back to Story 1

### Error Prevention With Checkpoints

```
Flawed backend (Story 1)
  ↓
[CHECKPOINT: First Pass Review]
  ↓
Catch flaw, fix in Story 1
  ↓
Story 2 builds on solid foundation
  ↓
Story 3 UI works correctly
  ↓
Story 4 integrates cleanly
  ↓
Epic complete and solid
```

**Cost:** Fix in Story 1 only, rest of epic clean

### Real Example

**Without checkpoint:**
1. Build authentication backend with flawed session management
2. Build login UI that works around session bugs
3. Build protected routes with custom session checks
4. Build logout that doesn't fully clear sessions
5. Build password reset that conflicts with session logic
6. **Result:** 5 stories of technical debt, hard to refactor

**With checkpoint:**
1. Build authentication backend with flawed session management
2. **[Checkpoint]** Catch session bugs, fix architecture
3. Build login UI cleanly on solid sessions
4. Build protected routes using standard session checks
5. Build logout that works correctly
6. Build password reset integrated properly
7. **Result:** 1 story of technical debt (caught early), rest clean

**Savings:** 4 stories of rework avoided

## Checkpoint Detection Logic

The system automatically **suggests** checkpoints based on execution status:

### Auto-Detected Checkpoints

**Epic completion:**
```yaml
all_stories_in_epic:
  status: done
  passes_complete: [first, second, third]

→ Suggest: "Epic complete checkpoint - validate epic as cohesive feature"
```

**First pass complete:**
```yaml
all_stories_in_epic:
  first_pass: complete
  second_pass: not_started

→ Suggest: "First pass checkpoint - validate backend before UI"
```

**Pass transition:**
```yaml
story:
  current_pass: first
  status: complete

→ Suggest: "First→Second transition checkpoint - backend working?"
```

**Sprint milestones:**
```yaml
sprint_progress:
  stories_complete: 3
  stories_total: 12
  percentage: 25%

→ Suggest: "25% milestone checkpoint - validate approach"
```

### Manual Checkpoints

Operators can trigger checkpoints anytime:
- Before starting risky work
- After discovering issues
- When something feels wrong
- For stakeholder demos
- For learning reviews

**Command:** `*checkpoint [type]` in orchestrator-exe

## Ready-for-Next-Pass Checklists

### Ready for Second Pass?

**From First Pass → Second Pass**

- [ ] Backend functionality works end-to-end
- [ ] Manual testing confirms core behavior
- [ ] API contracts are clear and stable
- [ ] Data models are finalized (or versioned)
- [ ] Error handling is in place
- [ ] Tests pass and validate behavior
- [ ] No known blockers for UI development

**If all checked → Advance to second pass**

### Ready for Third Pass?

**From Second Pass → Third Pass**

- [ ] All planned features are implemented
- [ ] UI components work correctly
- [ ] Frontend-backend integration is complete
- [ ] User journey flows end-to-end
- [ ] No major bugs or missing functionality
- [ ] Feature is "feature complete"
- [ ] Ready for polish and hardening

**If all checked → Advance to third pass**

### Ready for Next Epic?

**From Epic Complete → Next Epic**

- [ ] All stories in epic are done (three passes)
- [ ] Epic delivers promised value
- [ ] Stakeholders have validated the feature
- [ ] No known production blockers
- [ ] Documentation is complete
- [ ] Technical debt is acceptable
- [ ] Would ship this to production

**If all checked → Start next epic**

## Checkpoint Best Practices

### 1. Don't Skip First Pass Checkpoint

**Most critical checkpoint in the system.**

Building UI on broken backend is the #1 cause of technical debt in autonomous execution.

**Signs you're tempted to skip:**
- "The backend mostly works, let's just add UI"
- "We can fix backend issues when they come up"
- "UI will make it easier to test"

**Resist the temptation.** Fix backend first.

### 2. Use Stakeholder Demos as Checkpoints

**Natural validation points.**

Demoing work to stakeholders:
- Validates requirements understanding
- Catches UX issues early
- Builds confidence in approach
- Creates natural checkpoint rhythm

**Suggested cadence:**
- First pass complete: Demo backend behavior (CLI, logs, API calls)
- Epic complete: Demo full feature (UI + backend)

### 3. Document Checkpoint Outcomes

**Track what you found.**

At each checkpoint, document:
- What was reviewed
- What issues were found
- What decisions were made
- What actions are needed

**Location:** `docs/sprint-artifacts/checkpoints/`

**Format:**
```markdown
## Checkpoint: Epic 1 First Pass Complete

**Date:** 2025-11-15
**Reviewer:** @operator

### What Worked
- Authentication flow solid
- Database schema clean
- API endpoints follow patterns

### Issues Found
- Session management race condition (Story 1)
- Missing error handling on logout (Story 3)
- Password reset token expiry too short (Story 4)

### Decisions
- Fix session race condition before second pass
- Add comprehensive error handling in first pass
- Extend token expiry to 24 hours (design change)

### Actions
- [ ] Refactor session management (Story 1)
- [ ] Add error handling middleware (Story 3)
- [ ] Update password reset logic (Story 4)
- [ ] Rerun checkpoint after fixes

**Status:** BLOCKED on actions above
```

### 4. Adjust Checkpoint Frequency by Risk

**Higher risk → More checkpoints**

**Low risk project:**
- First pass complete
- Epic complete
- Sprint milestones (optional)

**High risk project:**
- First pass complete
- Every story completion
- Epic complete
- Sprint milestones
- After major refactors
- Before production deploys

**Adjust based on:**
- Team experience
- Project complexity
- Stakeholder engagement
- Autonomous execution usage (more autonomous → more checkpoints)

### 5. Checkpoints Are Learning Opportunities

**Especially valuable for junior operators.**

Checkpoints force reflection:
- What patterns worked?
- What assumptions were wrong?
- What would you do differently?
- What did you learn?

**Capture learnings:** Add to `docs/learnings/` for future reference

## Checkpoint Anti-Patterns

### Anti-Pattern 1: Checkbox Compliance

**Bad:** Going through checkpoint motion without actually validating
- "Did we test? Yes. [Didn't actually test]"
- "Is it ready? Yes. [Didn't actually check]"

**Good:** Honest assessment with evidence
- "Tested user journey, found 3 bugs, documented in checkpoint notes"
- "Not ready - session management needs refactor"

### Anti-Pattern 2: Checkpoint Fatigue

**Bad:** So many checkpoints that team ignores them
- Checkpoint after every commit
- Checkpoint for trivial changes
- Checkpoint bureaucracy

**Good:** Checkpoints at natural transitions only
- Major milestones
- Pass transitions
- Epic completions

### Anti-Pattern 3: Blocking Without Action

**Bad:** Checkpoint identifies issues but doesn't create action plan
- "Found bugs, not ready"
- [Nothing happens, issues not tracked]

**Good:** Checkpoint identifies issues and triggers fixes
- "Found 3 bugs, created stories to fix, blocked until resolved"
- [Clear path forward]

### Anti-Pattern 4: Skipping Checkpoints "To Move Fast"

**Bad:** "We don't have time for checkpoints, we need to ship"
- Results in shipping broken code
- Creates technical debt
- Slows down future work

**Good:** "Checkpoints help us ship faster by catching issues early"
- Prevents compounding errors
- Reduces debugging time
- Increases confidence in shipping

## Integration with Autonomous Execution

**Checkpoints are MORE important when using autonomous mode.**

Why?
- Autonomous mode can generate a lot of code quickly
- Mistakes compound faster in autonomous execution
- Operator has less visibility into generated code
- Checkpoints create validation points for autonomous work

**Autonomous execution checkpoint strategy:**

1. **Manual checkpoint before autonomous batch**
   - Write clear contracts
   - Validate one component manually first
   - Set success criteria

2. **Automatic validation after each autonomous component**
   - 4 validation levels built into autonomous chain
   - Syntax, tests, contracts, MCP integration
   - Auto-approved if tests pass

3. **Manual checkpoint after autonomous batch**
   - Review all generated components
   - Validate integration
   - Check for unexpected implementations
   - Fix issues before moving to next batch

**Hybrid approach:** Autonomous speed + manual validation = Best of both worlds

## Summary

**Checkpoints are:**
- Natural review points in development
- Soft recommendations, not hard gates
- More important in autonomous execution
- Learning opportunities
- Compounding error prevention

**Key checkpoints:**
- First pass complete (before UI)
- Epic complete (before next epic)
- Pass transitions (before advancing)
- Sprint milestones (for course correction)

**Golden rule:** Never skip first pass checkpoint. Backend must work before UI.

**Frequency:** Adjust based on risk and team experience. More risk = more checkpoints.

**Documentation:** Record checkpoint outcomes for learning and tracking.
