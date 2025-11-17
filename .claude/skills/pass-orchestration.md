# Pass Orchestration Skill

**Autonomy Level:** Fully Autonomous

**Purpose:** Automatically manage pass transitions, track completion, and guide operator to next steps in the three-pass execution workflow.

## Trigger Conditions

### Auto-Triggers
- **Event:** `component_integrated`
  - **Condition:** All components for current story are integrated
  - **Priority:** 5 (after component integration)

- **Event:** `story_completed`
  - **Condition:** All three passes complete for a story
  - **Priority:** 5

### Manual Triggers
- "check pass status"
- "am I ready for next pass"
- "what's next"
- "check story progress"

## Skill Workflow

### 1. Load Current Execution State

Read from `.system/execution-status.yaml`:

```yaml
current_state:
  current_pass: "second-pass"
  current_story: "story-1-user-authentication"
  current_component: null
```

### 2. Determine Pass Status

Based on pass definitions and completion criteria:

#### First-Pass Completion Check

**Criteria:**
- ✓ All story acceptance criteria met
- ✓ Backend logic functional
- ✓ Unit tests pass
- ✓ Basic HTML structure exists
- ✓ Data flows correctly

**How to verify:**
- Check if story file marks acceptance criteria as complete
- Run unit tests (if configured)
- Verify basic HTML templates exist
- Check backend endpoints respond

#### Second-Pass Completion Check

**Criteria:**
- ✓ All components validated (4 levels)
- ✓ All components proven in sandbox
- ✓ No CSS conflicts
- ✓ Injection markers working
- ✓ Responsive design implemented

**How to verify:**
- Check execution-status.yaml for component statuses
- All components must have status: "integrated"
- No validation failures logged
- No unresolved conflicts in integration reports

#### Third-Pass Completion Check

**Criteria:**
- ✓ All tests pass (unit + integration)
- ✓ CSS debugged and verified
- ✓ Accessibility checks complete
- ✓ Performance optimized
- ✓ No console errors
- ✓ Cross-browser tested

**How to verify:**
- Run full test suite
- Check for CSS issues (via /debug-css if available)
- Run accessibility audit
- Check performance metrics
- Manual verification checklist

### 3. Calculate Progress Metrics

#### Story-Level Metrics

```yaml
story-1-user-authentication:
  progress:
    first-pass: 100%
    second-pass: 67%  # 2/3 components integrated
    third-pass: 0%
  overall_completion: 55%  # Weighted average
```

#### Pass-Level Metrics

```yaml
second-pass:
  total_components: 5
  components_integrated: 3
  components_proven: 1
  components_validated: 1
  components_pending: 0
  completion: 60%
```

### 4. Determine Next Action

Based on current state and completion criteria:

#### Scenario 1: First-Pass Incomplete

```yaml
next_action:
  type: "continue-first-pass"
  command: "/dev-story story-1-user-authentication"
  description: "Continue backend development for current story"
  blockers:
    - "Acceptance criterion #3 not met: User can reset password"
```

#### Scenario 2: First-Pass Complete, Ready for Second-Pass

```yaml
next_action:
  type: "transition-to-second-pass"
  command: "/integrate references/login-prototype.html"
  description: "Start component integration for beautiful UI"
  pass_transition:
    from: "first-pass"
    to: "second-pass"
  preparation_needed:
    - "Ensure prototypes exist in references/ folder"
```

**Auto-transition:**
- Update current_pass: "second-pass"
- Update story status: "second-pass-in-progress"
- Emit event: `pass_completed` (first-pass)

#### Scenario 3: Second-Pass In Progress

```yaml
next_action:
  type: "continue-second-pass"
  command: "/integrate references/dashboard-prototype.html"
  description: "Integrate remaining 2 components for this story"
  progress:
    components_integrated: 3
    components_remaining: 2
```

#### Scenario 4: Second-Pass Complete, Ready for Third-Pass

```yaml
next_action:
  type: "transition-to-third-pass"
  command: "/third-pass story-1-user-authentication"
  description: "Debug, polish, and prepare for production"
  pass_transition:
    from: "second-pass"
    to: "third-pass"
  preparation_needed:
    - "Review all components are visually correct"
    - "Run manual smoke tests"
```

**Auto-transition:**
- Update current_pass: "third-pass"
- Update story status: "third-pass-in-progress"
- Emit event: `pass_completed` (second-pass)

#### Scenario 5: Third-Pass Complete, Story Done

```yaml
next_action:
  type: "complete-story"
  command: "/story-done story-1-user-authentication"
  description: "Mark story as complete and move to next"
  pass_transition:
    from: "third-pass"
    to: "story-complete"
  next_story:
    id: "story-2-user-profile"
    title: "User Profile Management"
    suggested_command: "/dev-story story-2-user-profile"
```

**Auto-transition:**
- Update story status: "completed"
- Update current_story: "story-2-user-profile" (if exists)
- Reset current_pass: "first-pass"
- Emit event: `story_completed`

#### Scenario 6: Blocked State

```yaml
next_action:
  type: "blocked"
  command: null
  description: "Cannot proceed due to validation failures"
  blockers:
    - "Component 'submit-button' failed validation (Level 3)"
    - "Component 'password-input' has CSS conflicts"
  suggested_fixes:
    - "Review: .system/components/submit-button/validation-report.md"
    - "Fix contract compliance issues"
    - "Re-run: /integrate references/login-prototype.html"
```

### 5. Update Execution Status

Auto-update `.system/execution-status.yaml`:

#### Pass Completion

```yaml
stories:
  story-1-user-authentication:
    pass_status:
      first-pass:
        status: "completed"  # ← Updated
        completed_date: "2025-01-15T16:00:00Z"  # ← Added

      second-pass:
        status: "in-progress"  # ← Updated from "pending"
        started_date: "2025-01-15T16:01:00Z"  # ← Added
```

#### Metrics Update

```yaml
metrics:
  stories_first_pass_complete: 1  # ← Incremented
  stories_second_pass_complete: 0
  stories_fully_complete: 0
```

### 6. Emit Events

#### Pass Completed Event

```yaml
event: "pass_completed"
payload:
  story_id: "story-1-user-authentication"
  pass_name: "first-pass"
  completion_date: "2025-01-15T16:00:00Z"
  next_pass: "second-pass"
```

**Triggers:**
- `progress-reporter` skill (updates metrics)
- Operator notification

#### Story Completed Event

```yaml
event: "story_completed"
payload:
  story_id: "story-1-user-authentication"
  completion_date: "2025-01-15T18:00:00Z"
  epic_id: "epic-1-user-management"
  next_story: "story-2-user-profile"
```

**Triggers:**
- `progress-reporter` skill (updates metrics)
- Epic completion check (if all stories in epic done)
- Operator notification with celebration

### 7. Generate Progress Report

Create summary for operator:

```markdown
# Pass Orchestration Report

**Story:** story-1-user-authentication
**Current Pass:** second-pass (67% complete)
**Overall Story Progress:** 55%

## Pass Status

- ✓ First-Pass: Complete (2025-01-15 16:00)
- ⏳ Second-Pass: In Progress (3/5 components integrated)
- ⏱ Third-Pass: Pending

## Second-Pass Details

**Completed:**
- ✓ login-form (validated → proven → integrated)
- ✓ password-input (validated → proven → integrated)
- ✓ submit-button (validated → proven → integrated)

**In Progress:**
- ⏳ password-strength-indicator (validated, awaiting sandbox)

**Pending:**
- ⏱ remember-me-checkbox (not started)

## Next Action

**Command:** `/integrate references/login-extras.html`

**Description:** Integrate remaining 2 components to complete second pass

**After Second-Pass:**
- Run `/third-pass story-1-user-authentication` for debugging and polish

## Metrics

- Story progress: 55%
- Components: 3/5 integrated
- Validation failures: 0
- Time spent: 7 hours
```

## Operator Visibility

### Autonomous Notification (No Action Required)

**After component integration completes:**

```
✓ All components integrated for story-1-user-authentication

Second pass complete! (2025-01-15 17:30)

Progress:
- ✓ First-Pass: Complete
- ✓ Second-Pass: Complete (5/5 components integrated)
- ⏱ Third-Pass: Ready to start

Next action:
/third-pass story-1-user-authentication

Or continue to next story:
/dev-story story-2-user-profile
```

### Manual Trigger (Operator Asks "What's Next?")

**Operator types:** `what's next` or `check pass status`

**Operator sees:**

```
# Story: story-1-user-authentication
## Current Status: Second-Pass In Progress (60%)

**Completed:**
- ✓ First-Pass (backend working, basic UI)
- ⏳ Second-Pass (3/5 components integrated)

**Next Steps:**
1. /integrate references/login-extras.html (2 components remaining)
2. Once complete → /third-pass for debugging and polish

**Details:**
- Time in second-pass: 1.5 hours
- Estimated time remaining: 45 minutes
- No blockers
```

### Blocked State Notification

```
⚠ Story progress blocked

**Story:** story-1-user-authentication
**Pass:** second-pass
**Blocker:** 1 component failed validation

**Details:**
- Component: submit-button
- Issue: Level 3 validation failed (contract compliance)
- Report: .system/components/submit-button/validation-report.md

**To resolve:**
1. Review validation report
2. Fix contract issues
3. Re-run: /integrate references/login-prototype.html

Cannot proceed to third-pass until all components validated.
```

## Pass Transition Logic

### Decision Tree

```
component_integrated event received
    ↓
Load story from execution-status.yaml
    ↓
Check: Are all story components integrated?
    │
    ├─ No → Do nothing (wait for more components)
    │
    └─ Yes → Check current pass
              │
              ├─ first-pass → Transition to second-pass
              │   └─ Suggest: /integrate [prototype]
              │
              ├─ second-pass → Transition to third-pass
              │   └─ Suggest: /third-pass [story]
              │
              └─ third-pass → Mark story complete
                  └─ Suggest: /story-done [story] or /dev-story [next-story]
```

## Integration with BMAD Workflow

### Sprint Status Integration

If BMAD's `sprint-status.yaml` exists:

```yaml
# Update both files on story completion
# .system/execution-status.yaml
stories:
  story-1-user-authentication:
    status: "completed"

# docs/sprint-status.yaml (BMAD)
stories:
  story-1-user-authentication:
    status: "DONE"  # ← Sync with BMAD
```

**Auto-sync actions:**
- When pass-orchestration marks story complete
- Update BMAD sprint-status.yaml
- Update BMAD workflow-status.yaml (if in implementation phase)
- Maintain consistency across tracking systems

## Configuration

Settings in `.system/execution-status.yaml`:

```yaml
config:
  auto_transition_passes: true  # Auto-transition when criteria met
  require_pass_approval: false  # Fully autonomous
  sync_with_bmad: true  # Keep BMAD status in sync
  celebrate_story_completion: true  # Show celebration message
  suggest_next_story: true  # Auto-suggest next story after completion
```

## Celebration Messages

### Story Completion

```
🎉 Story Complete: story-1-user-authentication

All three passes finished:
- ✓ First-Pass: Backend working
- ✓ Second-Pass: Beautiful UI
- ✓ Third-Pass: Production ready

Time: 8.5 hours
Components: 5 integrated
Quality: All validation passed

Next story: story-2-user-profile
Run: /dev-story story-2-user-profile
```

### Epic Completion

```
🚀 Epic Complete: epic-1-user-management

All stories finished:
- ✓ story-1-user-authentication
- ✓ story-2-user-profile
- ✓ story-3-password-reset

Total time: 24 hours
Total components: 15 integrated
Quality: 100% validation pass rate

Next epic: epic-2-dashboard
Run: /dev-story story-4-dashboard-layout
```

## Error Handling

### Missing Story File

```
Error: Cannot find story file

Expected: docs/stories/story-1-user-authentication.md
Action: Verify story exists or run /create-story
```

### Incomplete Acceptance Criteria

```
Warning: First-pass marked complete but acceptance criteria not met

Missing:
- Acceptance Criterion #2: User receives email confirmation
- Acceptance Criterion #4: Session persists across browser restarts

Suggestion: Mark criteria as complete in story file or implement missing features
```

### Component Validation Failures

```
Cannot transition to third-pass: 2 components failed validation

Details:
- submit-button: Level 3 failed (contract compliance)
- password-input: Level 4 failed (CSS conflicts)

Action required:
1. Fix validation issues
2. Re-run /integrate to revalidate
3. Pass orchestration will auto-retry transition
```

## Related Files

- **Trigger Matrix:** `.claude/skills/trigger-matrix.yaml`
- **Event System:** `.claude/skills/event-system.md`
- **Execution Status:** `.system/execution-status.yaml`
- **Story Files:** `docs/stories/*.md`
- **BMAD Status:** `docs/bmm-workflow-status.yaml`, `docs/sprint-status.yaml`

## Example Execution Flow

### Full Story Workflow

```
Operator runs: /dev-story story-1-user-authentication

↓

First-Pass Development (BMAD /dev-story workflow)
- Backend code written
- Unit tests created
- Basic HTML templates

↓

pass-orchestration detects: First-pass complete
- Auto-updates status
- Emits: pass_completed (first-pass)
- Suggests: /integrate references/login-prototype.html

↓

Operator runs: /integrate references/login-prototype.html

↓

Second-Pass Integration (Autonomous chain)
- 5 components extracted
- Contracts created (auto)
- Validated (auto)
- Proven (auto)
- Integrated (auto)

↓

pass-orchestration detects: All components integrated
- Auto-updates status
- Emits: pass_completed (second-pass)
- Suggests: /third-pass story-1-user-authentication

↓

Operator runs: /third-pass story-1-user-authentication

↓

Third-Pass Polish
- Integration tests run
- CSS debugging (if needed)
- Accessibility checks
- Performance optimization

↓

Operator runs: /story-done story-1-user-authentication

↓

pass-orchestration detects: Story complete
- Auto-updates status
- Emits: story_completed
- Suggests: /dev-story story-2-user-profile
- 🎉 Celebration message
```

## Summary

The pass-orchestration skill provides:

- **Automatic pass transition** when completion criteria met
- **Intelligent next-action suggestions** based on current state
- **Progress tracking** at story and component levels
- **Blocker detection** to prevent premature transitions
- **BMAD integration** for unified status tracking
- **Celebration milestones** to acknowledge progress

This skill completes the autonomous three-pass system by managing the high-level workflow while other skills handle component-level operations.
