# Skill: Suggest Workflow Efficiency

**Skill Name:** `suggest-workflow-efficiency`

**Purpose:** General-purpose efficiency analyzer that detects various parallelization and automation opportunities

**Invoked By:** All agents (SM, PM, Dev, Architect, etc.)

**When to Invoke:**
- During workflow-status checks
- After completing major workflow milestones
- When operator asks "what should I do next?"
- Periodically during long-running workflows

---

## Detection Strategy

This skill orchestrates multiple specialized detection skills and provides unified recommendations.

### Step 1: Analyze Current Workflow Context

Determine current phase and state:

```javascript
context = {
  current_phase: detect_phase(),  // Analysis, Planning, Solutioning, Implementation
  last_completed_workflow: get_last_workflow(),
  artifacts_present: scan_artifacts(),
  stories_status: load_sprint_status(),
  operator_activity: get_recent_activity()
}
```

### Step 2: Invoke Specialized Detection Skills

Based on context, run relevant detection skills:

```javascript
opportunities = []

// Check for parallel epic breakdown
if (context.phase === "Planning" && exists("PRD.md")) {
  epic_opp = invoke_skill("detect-epic-parallelization")
  if (epic_opp.opportunity_detected) {
    opportunities.push(epic_opp)
  }
}

// Check for parallel story batch
if (exists("epics.md") && has_backlog_stories()) {
  batch_opp = invoke_skill("detect-story-batch-opportunity")
  if (batch_opp.opportunity_detected) {
    opportunities.push(batch_opp)
  }
}

// Check for parallel context assembly
if (has_drafted_stories()) {
  context_opp = invoke_skill("detect-story-context-opportunity")
  if (context_opp.opportunity_detected) {
    opportunities.push(context_opp)
  }
}

// Check for other efficiency opportunities
opportunities.push(...detect_custom_opportunities(context))
```

### Step 3: Prioritize Opportunities

Rank opportunities by impact:

```javascript
opportunities = opportunities.sort((a, b) => {
  // Prioritize by:
  // 1. Time savings (higher = better)
  // 2. Confidence level (higher = better)
  // 3. Workflow alignment (relevant to current phase = better)

  score_a = a.time_savings_minutes * a.confidence * a.relevance
  score_b = b.time_savings_minutes * b.confidence * b.relevance

  return score_b - score_a
})

top_opportunities = opportunities.slice(0, 3)  // Top 3
```

### Step 4: Generate Unified Recommendation

Present top opportunities to operator:

```markdown
🎯 Workflow Efficiency Suggestions

I've analyzed your current workflow and found {opportunities.length} efficiency opportunities:

{for each top_opportunity:}

## {opportunity.type}

{opportunity.operator_message}

---

{/for}

Which opportunity would you like to pursue? (1/{count}, or 'none')
```

---

## Custom Opportunity Detection

Beyond the 3 core parallelization skills, detect:

### 1. Documentation Reuse

```javascript
// Check if existing docs can be reused
if (exists("reference-docs/similar-project-prd.md")) {
  return {
    type: "documentation-reuse",
    message: "I found a similar project PRD in reference-docs. Would you like me to use it as a template? This could save ~30 minutes of PRD creation.",
    time_savings: 30,
    confidence: "medium"
  }
}
```

### 2. Workflow Skipping

```javascript
// Check if certain workflows can be skipped
if (context.project_type === "simple-crud" && !exists("domain-brief.md")) {
  return {
    type: "skip-domain-research",
    message: "This appears to be a straightforward CRUD application. Domain research may not be necessary. Skip to PRD? (saves ~20 minutes)",
    time_savings: 20,
    confidence: "medium"
  }
}
```

### 3. Automated Architecture

```javascript
// Check if architecture can be auto-generated
if (context.tech_stack_standard && !exists("architecture.md")) {
  return {
    type: "automated-architecture",
    message: "Detected standard tech stack (React + Express + PostgreSQL). I can generate a standard architecture document automatically. Review and customize? (saves ~10 minutes)",
    time_savings: 10,
    confidence: "high"
  }
}
```

### 4. Batch Operations

```javascript
// Check if multiple sequential operations can be batched
if (drafted_stories.length >= 5 && !any_have_context()) {
  return {
    type: "batch-operation",
    message: "You have {count} stories ready. Instead of processing one-by-one, run batch context generation? (saves ~{time} minutes)",
    time_savings: calculate_batch_savings(drafted_stories.length),
    confidence: "high"
  }
}
```

### 5. Parallel Code Review

```javascript
// Check if multiple stories are ready for review
if (stories_in_review.length >= 3) {
  return {
    type: "parallel-code-review",
    message: "{count} stories ready for code review. Process reviews in parallel? (saves ~{time} minutes)",
    time_savings: estimate_review_savings(stories_in_review.length),
    confidence: "medium"
  }
}
```

### 6. Workflow Consolidation

```javascript
// Check if multiple small workflows can be combined
if (can_consolidate_workflows(context)) {
  return {
    type: "workflow-consolidation",
    message: "You need to run epic-context, story-context, and story-ready. I can combine these into a single flow. Run consolidated workflow? (saves ~5 minutes overhead)",
    time_savings: 5,
    confidence: "high"
  }
}
```

---

## Context-Specific Recommendations

### After PRD Completion

```markdown
🎯 Next Steps After PRD

PRD complete! Here are efficient next steps:

1. **Parallel Epic Breakdown** (Recommended)
   - Break down epics into stories (parallel execution)
   - Time: ~10 minutes (vs 25 minutes sequential)
   - Saves: 15 minutes
   - Run: /parallel-epic-breakdown

2. **Architecture Definition**
   - Define technical architecture
   - Time: ~15 minutes
   - Provides better context for story creation
   - Run: /bmad:bmm:workflows:architecture

3. **UX Design** (If applicable)
   - Create visual designs and interactions
   - Time: ~20 minutes
   - Run: /bmad:bmm:workflows:create-ux-design

Recommendation: Run Architecture first, then Parallel Epic Breakdown. This ensures stories have full technical context.

Proceed with this plan? (y/n/customize)
```

### After Epic Breakdown

```markdown
🎯 Next Steps After Epic Breakdown

Epics complete with {story_count} stories defined!

**Immediate Opportunities:**

1. **Parallel Story Context Assembly** (Highest ROI)
   - Generate contexts for all {story_count} stories
   - Time: ~22 minutes (vs 150 minutes sequential)
   - Saves: 128 minutes (85%)
   - Run: /parallel-story-context

2. **Story Review**
   - Manually review story quality
   - Inject vision and refinements
   - Time: ~30 minutes
   - Better quality before context generation

**Recommended Flow:**
1. Quick scan of stories (~5min)
2. Run parallel context assembly (~22min)
3. Begin development

This gets you to development-ready state in ~27 minutes instead of 180+ minutes.

Proceed with parallel context assembly? (y/n)
```

### During Implementation

```markdown
🎯 Implementation Phase Efficiency

Current progress:
- Stories complete: {completed}/{total}
- Stories in progress: {in_progress}
- Stories ready: {ready}

**Opportunities:**

1. **Parallel Development** (If stories independent)
   - {independent_story_count} stories have no dependencies
   - These could be developed in parallel terminals
   - Estimated time savings: ~{time} hours
   - Note: Requires coordination (experimental feature)

2. **Automated Testing**
   - {stories_without_tests} stories missing tests
   - Batch generate tests from acceptance criteria?
   - Time: ~5 minutes (vs 50 minutes manual)

3. **Code Review Batch**
   - {review_ready_count} stories ready for review
   - Run parallel code reviews?
   - Time: ~10 minutes (vs 30 minutes sequential)

Which opportunity interests you? (1/2/3/none)
```

---

## Learning Mode

Track operator responses to improve recommendations:

```yaml
# .system/parallel-patterns/efficiency-suggestions-log.yaml

- timestamp: "2025-01-16T10:00:00Z"
  context:
    phase: Planning
    last_workflow: PRD
    artifacts: ["PRD.md"]

  suggestions:
    - type: parallel-epic-breakdown
      time_savings: 15min
      confidence: high
      presented: true
      operator_response: approved
      actual_savings: 13min

    - type: architecture-first
      time_savings: 0min  # Not a time saver, quality improvement
      confidence: medium
      presented: true
      operator_response: approved

  outcome: both_suggestions_followed
  operator_satisfaction: positive
  learning: "Operator prefers quality over pure speed - present architecture even when not time-saving"
```

Use data to:
- Learn operator preferences (speed vs quality)
- Improve suggestion timing
- Refine confidence estimates
- Personalize recommendations

---

## Skill Output Format

```yaml
suggestions:
  - type: "{opportunity-type}"
    title: "{short title}"
    description: "{detailed description}"
    time_savings_minutes: {number}
    confidence: high|medium|low
    priority: 1-10
    command: "{slash command to run}"
    message: |
      {operator-facing message}

  - type: "{another-opportunity}"
    ...

top_suggestion:
  type: "{highest priority}"
  message: "{recommendation}"
  command: "{command}"

operator_message: |
  {unified message presenting all suggestions}
```

---

## Integration Points

### Workflow Status Command

```markdown
Operator: /workflow-status

Agent: 📊 Workflow Status

Current Phase: {phase}
Progress: {progress}

{invoke suggest-workflow-efficiency}

**Efficiency Suggestions:**
{display top 2-3 suggestions}
```

### After Major Milestones

```xml
<post-workflow-hook workflow="*">
  <invoke-skill skill="suggest-workflow-efficiency" />
  <if-high-priority-suggestions>
    <present-to-operator />
  </if-high-priority-suggestions>
</post-workflow-hook>
```

### Proactive Suggestions

```javascript
// Every 15 minutes of operator inactivity
if (time_since_last_interaction > 15_minutes) {
  suggestions = invoke_skill("suggest-workflow-efficiency")
  if (suggestions.high_priority) {
    prompt_operator("I noticed some efficiency opportunities while you were away...")
  }
}
```

---

## Edge Cases

### Competing Opportunities

When multiple opportunities conflict:

```markdown
⚠ Competing Opportunities Detected

Both of these are beneficial, but order matters:

Option A: Run parallel epic breakdown now
- Faster story creation
- But stories won't have architectural context

Option B: Run architecture first, then epic breakdown
- Slower overall (+ 15min)
- But stories will have better technical detail

Recommendation: Option B (architecture first)
Reasoning: Time lost now is saved later in fewer story revisions.

Your preference? (A/B)
```

### Low Confidence Opportunities

```markdown
🔍 Possible Efficiency Opportunity (Low Confidence)

I noticed {pattern}, which might indicate {opportunity}.

However, I'm only {confidence}% confident this applies to your project.

If it does apply, estimated savings: ~{time} minutes.

Want more details before deciding? (y/n)
```

### Operator Repeatedly Declines

```markdown
Note: You've declined parallel execution 3 times.

Preference recorded: Sequential workflows preferred.

I'll stop suggesting parallel execution unless:
- Time savings >30 minutes
- You explicitly ask for efficiency suggestions

Update this preference? (y/n)
```

---

## Success Criteria

- ✅ Detects 90%+ of efficiency opportunities
- ✅ Recommendations are actionable and clear
- ✅ Time estimates accurate within 25%
- ✅ Learns from operator preferences
- ✅ Prioritizes correctly (high-value suggestions first)
- ✅ No suggestion fatigue (quality over quantity)
- ✅ Integrates smoothly into workflow

---

## Related Skills

- `detect-epic-parallelization` - Specialized epic detection
- `detect-story-context-opportunity` - Specialized context detection
- `detect-story-batch-opportunity` - Specialized batch detection
