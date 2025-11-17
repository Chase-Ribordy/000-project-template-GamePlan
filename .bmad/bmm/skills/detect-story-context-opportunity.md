# Skill: Detect Story Context Opportunity

**Skill Name:** `detect-story-context-opportunity`

**Purpose:** Identify when parallel story context assembly would be beneficial

**Invoked By:** SM agent

**When to Invoke:**
- After stories are created (status: drafted)
- Before marking stories ready-for-dev
- After completing story creation workflow
- During workflow-status check

---

## Detection Logic

### Step 1: Check Sprint Status

Load and analyze sprint-status.yaml:

```bash
Required:
✓ sprint-artifacts/sprint-status.yaml exists

Analyze:
- Count stories with status="drafted"
- Count stories with status="ready-for-dev" (already have context)
- Identify stories needing context
```

If sprint-status.yaml missing → **No opportunity** (no stories tracked)

### Step 2: Count Stories Needing Context

1. **Load sprint-status.yaml**

2. **Filter for drafted stories**:
   ```yaml
   # Example sprint-status
   epic-1: contexted
   1-1-user-auth: ready-for-dev        # Has context
   1-2-profile-mgmt: drafted           # Needs context ✓
   1-3-session-mgmt: drafted           # Needs context ✓
   2-1-content-create: drafted         # Needs context ✓
   2-2-content-list: backlog           # Not ready yet
   ```

3. **Verify story files exist**:
   For each drafted story, check:
   ```bash
   stories/{story-key}.md exists? ✓
   ```

4. **Check for existing contexts**:
   Skip stories that already have context:
   ```bash
   stories/{story-key}-context.md exists? Skip if yes
   ```

5. **Build work list**:
   ```javascript
   stories_needing_context = drafted_stories.filter(story =>
     story_file_exists(story) && !context_exists(story)
   )
   ```

### Step 3: Assess Opportunity

Determine if parallelization is worthwhile:

```javascript
story_count = stories_needing_context.length

if (story_count === 0) {
  return NO_OPPORTUNITY("All drafted stories already have context")
}

if (story_count === 1) {
  return NO_OPPORTUNITY("Only 1 story (run sequential context workflow)")
}

if (story_count === 2-5) {
  return MARGINAL_OPPORTUNITY(story_count, "Small batch, 5-10min savings")
}

if (story_count === 6-15) {
  return GOOD_OPPORTUNITY(story_count, "15-30min savings")
}

if (story_count >= 16) {
  return EXCELLENT_OPPORTUNITY(story_count, "30+ min savings")
}
```

### Step 4: Calculate Time Savings

```javascript
// Time estimates
sequential_time_per_story = 3  // minutes average
parallel_terminals = Math.min(7, Math.ceil(story_count / 5))  // Max 7 terminals
stories_per_terminal = Math.ceil(story_count / parallel_terminals)
parallel_time = stories_per_terminal * sequential_time_per_story

sequential_total = story_count * sequential_time_per_story
time_savings = sequential_total - parallel_time
savings_percent = (time_savings / sequential_total) * 100
```

---

## Recommendation Format

When opportunity is detected:

```markdown
🎯 Efficiency Opportunity Detected: Parallel Story Context Assembly

Current State:
- Stories drafted: {story_count}
- Stories with context: {context_count}
- Stories needing context: {needs_context_count}

Context Assembly:
Each story needs a comprehensive context XML containing:
├─ Documentation excerpts (PRD, architecture, epics)
├─ Existing code interfaces and patterns
├─ Dependencies and frameworks
├─ Testing standards and examples
└─ Architectural constraints

Time Estimate:
┌────────────────────────────────────────┐
│ Sequential: ~{sequential_total} minutes│
│ Parallel:   ~{parallel_time} minutes   │
│ Terminals:  {parallel_terminals}       │
│ Savings:    {time_savings}min ({savings_percent}%)  │
└────────────────────────────────────────┘

How it works:
1. Spawn {parallel_terminals} parallel terminals
2. Each terminal processes ~{stories_per_terminal} stories
3. All context XMLs generated simultaneously
4. Sprint status updated: drafted → ready-for-dev

What you need to do:
- Approve parallel execution (one-time confirmation)
- System runs autonomously (~{parallel_time} minutes)
- Review any flagged contexts if validation warnings occur

Recommendation:
Should I run `/parallel-story-context`? This will save ~{time_savings} minutes and make all {story_count} stories ready for development.

(y/n)
```

---

## Contextual Recommendations

### After Story Creation

When SM completes story-create workflow:

```
SM: Story 3-4-pdf-export.md created and marked as drafted.

{SM invokes detect-story-context-opportunity}
{Detects 12 drafted stories needing context}

SM: By the way, I notice you now have 12 drafted stories that need context assembly. If we process them one-by-one, that's about 36 minutes.

I can run parallel context assembly across 5 terminals and complete all 12 in about 9 minutes - saving 27 minutes.

Want me to run `/parallel-story-context` now?
```

### During Workflow Status

When operator checks status:

```
Operator: /workflow-status

SM: 📊 Workflow Status

Current Phase: Phase 4 - Implementation
Epics Complete: 4/4
Stories: 18 total
├─ Ready for dev: 6
├─ Drafted: 12  ← Needs attention
├─ In progress: 0
└─ Backlog: 0

{SM invokes detect-story-context-opportunity}

**Efficiency Suggestion:**
You have 12 drafted stories waiting for context assembly. Parallel execution would save ~27 minutes (75%).

Run `/parallel-story-context`? (y/n)
```

### Batch Completion

After parallel story batch completes:

```
✅ Parallel Story Batch 2 Complete!
Stories Created: 8
Status: backlog → drafted

{SM invokes detect-story-context-opportunity}
{Detects: Batch 2 stories (8) + previous drafted stories (4) = 12 total}

SM: Great! Batch 2 is done. I also notice you have 12 total drafted stories (including 4 from earlier).

Before you review these stories individually, want me to generate all contexts in parallel? Takes ~9 minutes instead of 36 minutes sequential.

Run `/parallel-story-context`? (y/n)
```

---

## Skill Output Format

```yaml
opportunity_detected: true|false

# If true:
opportunity:
  type: parallel-story-context
  story_count: 12
  stories_needing_context: ["1-2-profile-mgmt", "1-3-session-mgmt", ...]
  time_savings_minutes: 27
  time_savings_percent: 75
  parallel_terminals: 5
  estimated_parallel_time: 9
  confidence: high|medium|low
  recommendation: "/parallel-story-context"
  operator_message: |
    {formatted recommendation}

# If false:
no_opportunity_reason: "{reason}"
story_count: 0
current_state: "{state description}"
next_action: "{what to do instead}"
```

---

## Non-Opportunity Responses

### No Drafted Stories
```
No context assembly opportunity detected.

Reason: No drafted stories found.

Current story status:
- Ready for dev: 6
- In progress: 2
- Backlog: 10

Next action: Create more stories or begin development on ready stories.
```

### All Stories Have Context
```
No context assembly opportunity detected.

Reason: All 18 drafted stories already have context.

All stories are ready-for-dev! 🎉

Next action: Begin development with /bmad:bmm:workflows:dev-story
```

### Only One Story
```
No parallelization opportunity (only 1 story).

For a single story, use:
/bmad:bmm:workflows:story-context

This will generate context in ~3 minutes without parallelization overhead.
```

---

## Edge Cases

### Mixed Story States

When some stories have context, some don't:

```
🎯 Partial Context Assembly Opportunity

Story Status:
- 6 stories: ready-for-dev (have context) ✓
- 8 stories: drafted (need context) ← Opportunity
- 4 stories: backlog (not yet drafted)

I can run parallel context for the 8 drafted stories.
Estimated time: ~7 minutes (vs 24 minutes sequential)

Run `/parallel-story-context`? (y/n)
```

### Very Large Batch (50+ stories)

```
🎯 Large Batch Context Assembly

Detected: 50 drafted stories needing context

This is a large batch! Recommendations:
1. Run all 50 in parallel (~22 minutes, 7 terminals)
2. Process in waves:
   - Wave 1: Epic 1 stories (12 stories, ~10min)
   - Wave 2: Remaining epics (38 stories, ~16min)

Large batches are safe and efficient, but processing in waves gives you incremental progress visibility.

Preference: (1=all at once, 2=waves)
```

### Context Exists But Story Re-drafted

When story was modified after context created:

```
⚠ Context Synchronization Opportunity

Detected: 3 stories have outdated contexts
- 2-3-content-edit-context.md (older than story file)
- 3-1-metrics-track-context.md (older than story file)
- 4-2-json-export-context.md (older than story file)

These stories were modified after context generation.

Regenerate contexts in parallel? (~3 minutes)

(y/n)
```

---

## Integration with Story Workflows

### Post-Create-Story Hook

After story creation:

```xml
<post-workflow-hook workflow="create-story">
  <invoke-skill skill="detect-story-context-opportunity" />
  <if-opportunity-detected threshold="5">
    <!-- If 5+ stories need context, suggest parallel -->
    <suggest-parallel-context />
  </if-opportunity-detected>
</post-workflow-hook>
```

### Post-Batch Hook

After batch story creation completes:

```xml
<post-workflow-hook workflow="parallel-story-batch">
  <invoke-skill skill="detect-story-context-opportunity" />
  <if-opportunity-detected>
    <!-- After batch, always suggest parallel context -->
    <suggest-parallel-context auto-prompt="true" />
  </if-opportunity-detected>
</post-workflow-hook>
```

---

## Learning and Tracking

Log each detection for improvement:

```yaml
# .system/parallel-patterns/context-detection-log.yaml

- timestamp: "2025-01-16T11:00:00Z"
  skill: detect-story-context-opportunity
  opportunity_detected: true
  story_count: 12
  estimated_savings: 27min
  operator_response: approved
  actual_execution_time: 9m 15s
  actual_savings: 26m 45s
  accuracy: 98.5%  # Estimate vs actual
  outcome: success
```

Use this data to:
- Improve time estimates
- Identify when operators approve vs decline
- Refine recommendation messaging
- Optimize terminal count calculations

---

## Success Criteria

- ✅ Detects 95%+ of context assembly opportunities
- ✅ Time estimates accurate within 15%
- ✅ Recommendations are clear and actionable
- ✅ 80%+ operator approval rate
- ✅ No false positives (recommending when not beneficial)
- ✅ Surfaces opportunities at right workflow moments

---

## Related Skills

- `detect-epic-parallelization` - Parallel epic breakdown detection
- `detect-story-batch-opportunity` - Parallel story creation detection
- `suggest-workflow-efficiency` - General efficiency suggestions
