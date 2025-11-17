# Skill: Detect Story Batch Opportunity

**Skill Name:** `detect-story-batch-opportunity`

**Purpose:** Identify when parallel batch story creation would be beneficial

**Invoked By:** SM agent, PM agent

**When to Invoke:**
- After epics are defined (epics.md exists)
- Before running sequential create-story workflow
- When multiple stories need to be created
- During workflow-status check

---

## Detection Logic

### Step 1: Check Prerequisites

Verify required artifacts:

```bash
Required:
✓ sprint-artifacts/epics.md exists (with story skeletons)
✓ sprint-artifacts/PRD.md exists
✓ sprint-artifacts/sprint-status.yaml exists

Recommended:
○ sprint-artifacts/architecture.md (improves story quality)
```

If epics.md missing → **No opportunity** (epics needed first)

### Step 2: Analyze Story Status

Load sprint-status.yaml and assess:

1. **Count backlog stories**:
   ```yaml
   # Example sprint-status
   epic-1: contexted
   1-1-user-auth: drafted           # Already created
   1-2-profile-mgmt: drafted        # Already created
   1-3-session-mgmt: backlog        # Needs creation ✓
   2-1-content-create: backlog      # Needs creation ✓
   2-2-content-list: backlog        # Needs creation ✓
   2-3-content-edit: backlog        # Needs creation ✓
   # ... more backlog stories
   ```

2. **Filter stories needing creation**:
   ```javascript
   backlog_stories = stories.filter(s => s.status === "backlog")
   ```

3. **Verify story skeletons exist in epics.md**:
   Each backlog story should have skeleton in epics:
   ```markdown
   ### Story 1.3: Session Management
   (Basic AC outline exists, needs expansion)
   ```

### Step 3: Assess Batch Potential

Determine if parallel batching is worthwhile:

```javascript
story_count = backlog_stories.length

if (story_count === 0) {
  return NO_OPPORTUNITY("No backlog stories to create")
}

if (story_count === 1) {
  return NO_OPPORTUNITY("Single story - use sequential create-story")
}

if (story_count === 2-5) {
  return MARGINAL_OPPORTUNITY(story_count, "Small batch, 4-6min savings")
}

if (story_count === 6-15) {
  return GOOD_OPPORTUNITY(story_count, "10-20min savings")
}

if (story_count >= 16) {
  return EXCELLENT_OPPORTUNITY(story_count, "20+ min savings")
}
```

### Step 4: Build Dependency Graph

Analyze story dependencies to determine batch structure:

1. **Parse epics.md for dependencies**:
   - Explicit: "depends on Story 1.2"
   - Implicit: Story N.2 depends on N.1 (within epic)
   - Foundation: Epic 1 stories are foundation for others

2. **Use dependency-graph.xml utility**:
   ```xml
   <call-template name="build-story-dependency-graph">
     <with-param name="epics_file" select="'epics.md'" />
     <with-param name="output_batches" select="$batches" />
   </call-template>
   ```

3. **Extract batch structure**:
   ```yaml
   batches:
     - batch_id: 0
       stories: [1-1-project-setup, 1-2-user-model]
       parallel_safe: true
     - batch_id: 1
       stories: [1-3-auth-endpoints, 1-4-session-mgmt, 2-1-content-model]
       parallel_safe: true
     - batch_id: 2
       stories: [2-2-content-create, 2-3-content-list, 3-1-metrics-track]
       parallel_safe: true
   ```

### Step 5: Calculate Time Savings

```javascript
// Time estimates
sequential_time_per_story = 2  // minutes average
sequential_total = story_count * sequential_time_per_story

// Parallel batch time
batch_count = batches.length
avg_batch_size = story_count / batch_count
avg_batch_time = avg_batch_size * sequential_time_per_story / avg_batch_size  // Parallel within batch
operator_review_time_per_batch = 3  // minutes to review each batch
parallel_total = batch_count * (avg_batch_time + operator_review_time_per_batch)

time_savings = sequential_total - parallel_total
savings_percent = (time_savings / sequential_total) * 100
```

---

## Recommendation Format

When opportunity is detected:

```markdown
🎯 Efficiency Opportunity Detected: Parallel Story Batch Creation

Current State:
- Epics defined: ✓ (epics.md)
- Stories in backlog: {story_count}
- Stories drafted: {drafted_count}

Batch Opportunity:
Create stories in dependency-aware batches with parallel execution within each batch.

Dependency Analysis:
{batch_count} batches identified:
├─ Batch 0: {batch_0_count} foundation stories (parallel)
├─ Batch 1: {batch_1_count} core stories (parallel)
├─ Batch 2: {batch_2_count} feature stories (parallel)
└─ Batch 3: {batch_3_count} advanced stories (parallel)

Time Estimate:
┌────────────────────────────────────────┐
│ Sequential: ~{sequential_total} minutes│
│ Batched:    ~{parallel_total} minutes  │
│ Batches:    {batch_count}              │
│ Savings:    {time_savings}min ({savings_percent}%)  │
└────────────────────────────────────────┘

How it works:
1. Process Batch 0 (foundation) - stories run in parallel
2. You review Batch 0 stories (inject vision if needed)
3. Process Batch 1 with learnings from Batch 0
4. You review Batch 1 stories
5. Continue for remaining batches

Each batch learns from previous batch, and you maintain vision control through review checkpoints.

What you need to do:
- Review epic vision before starting (ensure alignment)
- Review each batch of stories after creation
- Inject guidance/feedback for next batch if needed
- Approve progression to next batch

Recommendation:
Should I run `/parallel-story-batch`? This will save ~{time_savings} minutes while giving you strategic review points to maintain your vision.

(y/n)
```

---

## Contextual Recommendations

### After Epic Breakdown

When epics are complete:

```
✅ Epic breakdown complete!
Epics: 4
Total stories: 18
All stories currently in backlog status.

{SM invokes detect-story-batch-opportunity}
{Detects: 18 backlog stories, 4 batches}

SM: Now we need to create detailed stories from these skeletons.

I can do this sequentially (1 story at a time, ~36 minutes) or in parallel batches:
- 4 batches with parallel execution within each
- You review after each batch
- Total time: ~24 minutes (saves 12 minutes)

The batch approach also gives you review checkpoints to inject your vision as stories are being created.

Run `/parallel-story-batch`? (y/n)
```

### During Workflow Status

```
Operator: /workflow-status

SM: 📊 Workflow Status

Current Phase: Phase 4 - Implementation
Epics: 4/4 complete
Stories:
├─ Backlog: 18  ← Needs attention
├─ Drafted: 0
├─ Ready for dev: 0

{SM invokes detect-story-batch-opportunity}

**Efficiency Suggestion:**
You have 18 stories in backlog waiting to be created. Parallel batch execution would save ~12 minutes (33%) and give you review checkpoints.

Run `/parallel-story-batch`? (y/n)
```

### Partial Story Creation

When some stories drafted, some in backlog:

```
Operator: I want to create more stories

SM: You currently have:
- 6 stories drafted
- 12 stories in backlog

{SM invokes detect-story-batch-opportunity}
{Detects: 12 backlog stories}

SM: For the 12 remaining backlog stories, I can process them in parallel batches:
- 3 batches
- Parallel execution within each batch
- Time: ~18 minutes (vs 24 minutes sequential)

This approach also incorporates learnings from your 6 already-drafted stories into the batch processing.

Run `/parallel-story-batch`? (y/n)
```

---

## Skill Output Format

```yaml
opportunity_detected: true|false

# If true:
opportunity:
  type: parallel-story-batch
  story_count: 18
  backlog_stories: ["1-3-session-mgmt", "2-1-content-create", ...]
  batch_count: 4
  batches:
    - batch_id: 0
      story_count: 2
      stories: ["1-1-project-setup", "1-2-user-model"]
      estimated_time_minutes: 8
    - batch_id: 1
      story_count: 3
      stories: ["1-3-auth-endpoints", "1-4-session-mgmt", "2-1-content-model"]
      estimated_time_minutes: 9
    # ... more batches
  time_savings_minutes: 12
  time_savings_percent: 33
  confidence: high|medium|low
  recommendation: "/parallel-story-batch"
  operator_message: |
    {formatted recommendation}

# If false:
no_opportunity_reason: "{reason}"
backlog_count: 0
current_state: "{state}"
next_action: "{what to do}"
```

---

## Non-Opportunity Responses

### No Backlog Stories
```
No story batch opportunity detected.

Reason: No backlog stories found.

Current story status:
- Drafted: 18
- Ready for dev: 0
- In progress: 0

Next action: Generate story contexts with /parallel-story-context
```

### Single Backlog Story
```
No parallelization opportunity (only 1 backlog story).

For a single story, use:
/bmad:bmm:workflows:create-story

This will create the story in ~2 minutes.
```

### All Stories Drafted
```
No story creation opportunity detected.

Reason: All 18 stories already drafted! 🎉

Next action: Generate contexts or begin development.
```

---

## Edge Cases

### Circular Dependencies Detected

```
⚠ Cannot recommend parallel batch creation

Reason: Circular dependency detected in story graph

Story 2.3 depends on 3.1
Story 3.1 depends on 3.4
Story 3.4 depends on 2.3

This must be resolved before story creation (parallel or sequential).

Action Required:
Review epics.md and remove circular dependencies.

Would you like me to help identify and resolve the cycle? (y/n)
```

### Very Complex Dependency Graph

```
🎯 Complex Dependency Graph Detected

Story analysis:
- 25 backlog stories
- 8 batches required (complex dependencies)
- Some batches have only 1 story (sequential bottlenecks)

Recommendation: Simplify dependencies before batch processing

Options:
1. Run `/parallel-story-batch` with current dependencies (saves 10min)
2. Review dependencies and simplify first (could enable more parallelism)
3. Use sequential create-story (slower but simpler)

The dependency graph suggests some stories may have unnecessary dependencies. Simplifying could enable better parallelization.

Choice (1/2/3):
```

### Architecture Not Defined

```
🎯 Opportunity Detected (with recommendation)

18 backlog stories ready for parallel batch creation.

However: Architecture not yet defined

Creating stories without architecture means:
- Less detailed dev notes
- Generic tech stack guidance
- May need story revision after architecture

Recommendation:
1. Run /bmad:bmm:workflows:architecture first (~15min)
2. Then run /parallel-story-batch with architectural context

This ensures stories have specific technical guidance from the start.

Proceed with story batch now, or define architecture first? (1=now, 2=architecture first)
```

### Previous Batch Learnings Available

When some stories already created:

```
🎯 Enhanced Batch Opportunity

Current state:
- 6 stories drafted (from previous sessions)
- 12 stories in backlog

Advantage: I can extract learnings from your 6 drafted stories and apply them to the 12 new stories in parallel batches.

Learnings available:
- Code patterns established
- Tech stack decisions made
- Dev conventions defined

This means the 12 new stories will have higher quality and consistency with existing stories.

Run `/parallel-story-batch` with previous learnings? (y/n)
```

---

## Integration Points

### Post-Epic-Breakdown Hook

```xml
<post-workflow-hook workflow="create-epics-and-stories">
  <invoke-skill skill="detect-story-batch-opportunity" />
  <if-opportunity-detected threshold="6">
    <!-- If 6+ stories, suggest parallel batch -->
    <suggest-parallel-batch />
  </if-opportunity-detected>
</post-workflow-hook>
```

### Post-Architecture Hook

```xml
<post-workflow-hook workflow="architecture">
  <invoke-skill skill="detect-story-batch-opportunity" />
  <if-opportunity-detected>
    <!-- After architecture, always check for batch opportunity -->
    <suggest-parallel-batch note="Architecture now available for story context" />
  </if-opportunity-detected>
</post-workflow-hook>
```

---

## Learning and Tracking

```yaml
# .system/parallel-patterns/batch-detection-log.yaml

- timestamp: "2025-01-16T12:00:00Z"
  skill: detect-story-batch-opportunity
  opportunity_detected: true
  story_count: 18
  batch_count: 4
  estimated_savings: 12min
  operator_response: approved
  actual_execution_time: 29m 15s
  actual_savings: 6m 45s
  accuracy: 56%  # Note: Lower than estimate
  outcome: success
  notes: |
    Operator took longer reviewing batches than estimated (3min vs 1min average).
    Adjust review time estimate to 3min per batch for future.
```

Use data to:
- Improve batch size recommendations
- Refine review time estimates
- Identify dependency patterns
- Optimize batch count

---

## Success Criteria

- ✅ Accurately detects batch opportunities (90%+ precision)
- ✅ Dependency analysis correct (no circular deps missed)
- ✅ Time estimates reasonable (within 30% of actual)
- ✅ Batch count optimized (balance parallelism vs overhead)
- ✅ 70%+ operator approval rate
- ✅ Recommendations clear and actionable

---

## Related Skills

- `detect-epic-parallelization` - Parallel epic breakdown detection
- `detect-story-context-opportunity` - Parallel context assembly detection
- `suggest-workflow-efficiency` - General efficiency suggestions
