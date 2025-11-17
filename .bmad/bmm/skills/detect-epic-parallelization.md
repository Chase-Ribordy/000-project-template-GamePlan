# Skill: Detect Epic Parallelization Opportunity

**Skill Name:** `detect-epic-parallelization`

**Purpose:** Analyze current workflow state and detect when parallel epic breakdown would be beneficial

**Invoked By:** PM agent, SM agent

**When to Invoke:**
- After PRD is complete
- When epic structure is proposed
- Before running sequential `create-epics-and-stories` workflow
- During workflow-status check

---

## Detection Logic

### Step 1: Check Prerequisites

Verify required artifacts exist:

```bash
Required:
✓ sprint-artifacts/PRD.md exists
✓ Epic structure is defined (either in epics.md outline or epic proposals)

Optional (enhances context):
○ sprint-artifacts/architecture.md
○ sprint-artifacts/domain-brief.md
```

If PRD missing → **No opportunity** (PRD required first)

### Step 2: Analyze Epic Structure

Determine if parallelization is beneficial:

1. **Count epics** in proposed structure:
   - If 1 epic → **No opportunity** (not worth parallelization overhead)
   - If 2 epics → **Marginal opportunity** (3min savings)
   - If 3-5 epics → **Good opportunity** (10-20min savings)
   - If 6+ epics → **Excellent opportunity** (25+ min savings)

2. **Check epic status**:
   - If epics already have stories → **No opportunity** (already done)
   - If epics only have goals/FRs → **Opportunity detected**

3. **Estimate time savings**:
   ```javascript
   epic_count = count_epics()
   sequential_time = epic_count * 5  // 5min per epic average
   parallel_time = 6 + Math.ceil((epic_count - 1) / 3) * 6  // Epic 1 + batches of 3
   time_savings = sequential_time - parallel_time
   savings_percent = (time_savings / sequential_time) * 100
   ```

### Step 3: Check Current Context

Ensure timing is appropriate:

- **During PRD workflow** → Recommend for later (after PRD complete)
- **After PRD, before epic breakdown** → **Prime opportunity**
- **During epic breakdown** → Too late (already in progress)
- **After epic breakdown** → No opportunity (done)

---

## Recommendation Format

When opportunity is detected, generate recommendation:

```markdown
🎯 Efficiency Opportunity Detected: Parallel Epic Breakdown

Current State:
- PRD: Complete ✓
- Epics: {epic_count} epics defined (goals + FRs)
- Stories: Not yet created

Opportunity:
Break down epics into stories using parallel execution instead of sequential.

Time Estimate:
┌────────────────────────────────────────┐
│ Sequential: ~{sequential_time} minutes │
│ Parallel:   ~{parallel_time} minutes   │
│ Savings:    {time_savings}min ({savings_percent}%)  │
└────────────────────────────────────────┘

How it works:
1. Epic 1 (foundation) processes first (establishes project structure)
2. Epics 2-{epic_count} process in parallel across multiple terminals
3. All epic sections merge into unified epics.md
4. You review final epics before proceeding

What you need to do:
- Review epic goals and vision (ensure alignment before breakdown)
- Approve parallel execution when prompted
- Review final epics.md after completion

Recommendation:
Should I run `/parallel-epic-breakdown`? This will save ~{time_savings} minutes and give you strategic review checkpoints while automating the detailed story creation.

(y/n)
```

---

## Non-Opportunity Response

If no opportunity detected, provide brief explanation:

```markdown
No epic parallelization opportunity detected.

Reason: {specific_reason}

Current workflow state: {current_state}
Next recommended action: {next_action}
```

**Example reasons:**
- "Only 1 epic defined (parallelization overhead not worth it)"
- "Epics already have stories created"
- "PRD not yet complete (needed for epic breakdown)"
- "Epic breakdown currently in progress"

---

## Integration Points

### In Workflow-Status

When SM agent runs `/bmad:bmm:workflows:workflow-status`:

```markdown
📊 Workflow Status Report

Current Phase: Phase 2 - Planning
Last Completed: PRD
Next Recommended: Epic Breakdown

**Efficiency Suggestion:**
{invoke detect-epic-parallelization skill}
{if opportunity: show recommendation}
{if no opportunity: show next step}
```

### In PM Agent Conversation

When PM agent discusses epic breakdown:

```
PM: I've reviewed your PRD and proposed an epic structure with 4 epics...

{PM internally invokes detect-epic-parallelization}
{Detects opportunity: 4 epics, ~15min savings}

PM: I notice we have 4 epics to break down into stories. This would normally take about 20 minutes sequentially, but I can orchestrate parallel execution that would complete in about 10 minutes - saving us 10 minutes.

The process would:
- Break down Epic 1 (foundation) first
- Then break down Epics 2-4 in parallel
- Merge everything into epics.md
- Give you checkpoints to review and inject your vision

Want me to run `/parallel-epic-breakdown`?
```

### Proactive Detection

After certain workflow milestones, auto-check:

**Trigger: PRD workflow completes**
```xml
<post-workflow-hook workflow="prd">
  <invoke-skill skill="detect-epic-parallelization" />
  <if-opportunity-detected>
    <prompt-agent>Suggest parallel epic breakdown to operator</prompt-agent>
  </if-opportunity-detected>
</post-workflow-hook>
```

---

## Skill Output Format

The skill returns structured data:

```yaml
opportunity_detected: true|false

# If true:
opportunity:
  type: parallel-epic-breakdown
  epic_count: 4
  time_savings_minutes: 10
  time_savings_percent: 50
  confidence: high|medium|low
  recommendation: "/parallel-epic-breakdown"
  operator_message: |
    {formatted recommendation message}

# If false:
no_opportunity_reason: "{reason}"
current_state: "{workflow state}"
next_action: "{recommended next step}"
```

Agent uses this data to:
- Decide whether to surface recommendation
- Format operator message
- Track opportunity detection (for learning)

---

## Learning and Improvement

Each time this skill is invoked, log:

```yaml
# .system/parallel-patterns/detection-log.yaml

- timestamp: "2025-01-16T10:30:00Z"
  skill: detect-epic-parallelization
  opportunity_detected: true
  epic_count: 4
  operator_response: approved
  actual_time_savings: 12m 15s  # Actual vs estimated
  outcome: success
```

This data helps:
- Refine time estimates
- Improve detection heuristics
- Track operator approval rates
- Optimize recommendation messaging

---

## Edge Cases

### Epic Structure Still Being Defined
```
Opportunity: Partial

You're still defining epic structure. Once you finalize the epic goals and FR coverage, I can recommend parallel breakdown.

For now, continue refining epics. I'll check again when ready.
```

### Architecture Not Yet Defined
```
Opportunity: Detected (but recommend waiting)

I can run parallel epic breakdown now, but stories will have better quality if we define the architecture first. Architecture provides:
- Tech stack decisions
- Code patterns to follow
- Dev standards for stories

Recommendation:
1. Run /bmad:bmm:workflows:architecture first (~15min)
2. Then run /parallel-epic-breakdown with architectural context

Proceed with epic breakdown now, or define architecture first?
```

### Operator Previously Declined
```
Note: You previously declined parallel epic breakdown.

Context has changed:
- {what changed since last decline}

Would you like to reconsider, or prefer to continue sequential workflow?
```

---

## Success Criteria

This skill is successful when:
- ✅ Accurately detects parallelization opportunities (95%+ precision)
- ✅ Time estimates within 20% of actual execution time
- ✅ Recommendations are actionable and clear
- ✅ Operator approves 70%+ of recommendations
- ✅ No false positives (recommending when not beneficial)
- ✅ Proper timing (not too early, not too late)

---

## Related Skills

- `detect-story-context-opportunity` - Detects parallel context assembly opportunities
- `detect-story-batch-opportunity` - Detects parallel story creation opportunities
- `suggest-workflow-efficiency` - General efficiency suggestion engine
