# Parallel Story Batch Creation Command

**Command:** `/parallel-story-batch`

**Purpose:** Create detailed stories in parallel batches based on dependency levels

**When to Use:**
- After epics are defined (epics.md exists)
- When stories need to be created from epic definitions
- Alternative to sequential create-story workflow
- Recommended by agents via `detect-story-batch-opportunity` skill

**Time Savings:**
- Sequential: 18 stories × 2min = 36 minutes
- Batched Parallel: 4 batches × avg 6min = 24 minutes
- **Savings: 12 minutes (33%)**

---

## Prerequisites

Before running this command, ensure:
- [ ] Epics are defined in epics.md
- [ ] PRD and architecture documents exist
- [ ] Sprint-status.yaml exists (via sprint-planning workflow)
- [ ] Operator has reviewed epic vision

## Workflow Steps

### Step 1: Build Dependency Graph

Analyze epic stories and build dependency-aware batches:

1. **Load epics.md**

2. **Parse all story definitions**:
   Extract story skeleton (title, ACs) for each:
   ```
   ### Story 1.1: Project Setup
   ### Story 1.2: User Model
   ### Story 1.3: Authentication Endpoints
   ### Story 2.1: Content Model
   ### Story 2.2: Content Creation API
   ...
   ```

3. **Build dependency graph** using `dependency-graph.xml`:
   ```xml
   <call-template name="build-story-dependency-graph">
     <with-param name="epics_file" select="'sprint-artifacts/epics.md'" />
     <with-param name="output_batches" select="$batches" />
   </call-template>
   ```

4. **Dependency graph output**:
   ```yaml
   batches:
     - batch_id: 0
       name: "Foundation Stories"
       stories:
         - 1-1-project-setup
         - 1-2-user-model
       dependencies: []
       parallel_safe: true
       estimated_time_minutes: 8

     - batch_id: 1
       name: "Core Authentication"
       stories:
         - 1-3-auth-endpoints
         - 1-4-session-mgmt
         - 2-1-content-model
       dependencies: [batch-0]
       parallel_safe: true
       estimated_time_minutes: 6

     - batch_id: 2
       name: "Feature Development"
       stories:
         - 2-2-content-create
         - 2-3-content-list
         - 3-1-metrics-track
         - 3-2-metrics-display
       dependencies: [batch-1]
       parallel_safe: true
       estimated_time_minutes: 8

     - batch_id: 3
       name: "Advanced Features"
       stories:
         - 2-4-content-edit
         - 2-5-content-delete
         - 3-3-metrics-export
         - 4-1-csv-export
       dependencies: [batch-2]
       parallel_safe: true
       estimated_time_minutes: 7
   ```

5. **Validate no circular dependencies**:
   If circular dependencies detected, abort and report:
   ```
   ❌ Circular dependency detected in story graph!

   Story 2.3 depends on Story 3.1
   Story 3.1 depends on Story 3.4
   Story 3.4 depends on Story 2.3

   Please review epics.md and resolve circular references.
   ```

### Step 2: Present Execution Plan to Operator

Show batch execution plan for approval:

```
🔍 Parallel Story Batch Creation Plan

Total Stories: 18
Batches: 4
Execution: Sequential batches, parallel within each batch

┌─────────────────────────────────────────────────────────────┐
│ Batch 0: Foundation Stories (2 stories, parallel)          │
│   ├─ 1-1-project-setup                                     │
│   └─ 1-2-user-model                                        │
│   Dependencies: None                                        │
│   Estimated Time: 8 minutes                                 │
│   → Operator Review Checkpoint ←                            │
├─────────────────────────────────────────────────────────────┤
│ Batch 1: Core Authentication (3 stories, parallel)         │
│   ├─ 1-3-auth-endpoints (depends on 1-2)                   │
│   ├─ 1-4-session-mgmt (depends on 1-2)                     │
│   └─ 2-1-content-model (depends on 1-1)                    │
│   Dependencies: Batch 0 complete                            │
│   Estimated Time: 6 minutes                                 │
│   → Operator Review Checkpoint ←                            │
├─────────────────────────────────────────────────────────────┤
│ Batch 2: Feature Development (4 stories, parallel)         │
│   ├─ 2-2-content-create (depends on 2-1)                   │
│   ├─ 2-3-content-list (depends on 2-1)                     │
│   ├─ 3-1-metrics-track (depends on 1-3)                    │
│   └─ 3-2-metrics-display (depends on 3-1)                  │
│   Dependencies: Batch 1 complete                            │
│   Estimated Time: 8 minutes                                 │
│   → Operator Review Checkpoint ←                            │
├─────────────────────────────────────────────────────────────┤
│ Batch 3: Advanced Features (4 stories, parallel)           │
│   ├─ 2-4-content-edit (depends on 2-2)                     │
│   ├─ 2-5-content-delete (depends on 2-2)                   │
│   ├─ 3-3-metrics-export (depends on 3-2)                   │
│   └─ 4-1-csv-export (depends on 3-3)                       │
│   Dependencies: Batch 2 complete                            │
│   Estimated Time: 7 minutes                                 │
│   → Operator Review Checkpoint ←                            │
└─────────────────────────────────────────────────────────────┘

Total Estimated Time (parallel): ~29 minutes
vs Sequential: ~36 minutes
Savings: ~7 minutes (19%)

Operator Touchpoints:
- After each batch: Review stories for vision alignment
- Inject feedback before next batch begins
- Maintain creative control while automation handles details

Proceed with parallel batch story creation? (y/n)
```

If operator declines, return to conversation.
If operator approves, continue.

### Step 3: Process Batch 0 (Foundation)

Foundation batch must complete first:

1. **Initialize coordination for Batch 0**:
   ```yaml
   # .system/parallel-story-batch-0-coordination.yaml
   orchestrator:
     started_at: "{timestamp}"
     status: initialized
     batch_id: 0
     batch_name: "Foundation Stories"
     total_work_units: 2
     config:
       max_terminals: 2
       work_type: story-creation
       timeout_minutes: 10

   work_units:
     1-1-project-setup:
       id: 1-1-project-setup
       type: story-creation
       epic_id: 1
       story_number: 1
       title: "Project Setup"
       output_file: "stories/1-1-project-setup.md"
       context:
         epic_excerpt: "{from epics.md}"
         prd_excerpt: "{relevant FRs}"
         previous_story_learnings: null  # First story
         batch_learnings: null           # First batch

     1-2-user-model:
       id: 1-2-user-model
       type: story-creation
       epic_id: 1
       story_number: 2
       title: "User Model"
       output_file: "stories/1-2-user-model.md"
       context:
         epic_excerpt: "{from epics.md}"
         prd_excerpt: "{relevant FRs}"
         previous_story_learnings: null
         batch_learnings: null

   work_queue:
     pending: ["1-1-project-setup", "1-2-user-model"]
   ```

2. **Spawn 2 parallel story-worker agents**:
   ```
   Task tool (for each story):
     subagent_type: general-purpose
     model: sonnet
     description: "Story creation for {story-key}"
     prompt: |
       You are a STORY WORKER agent creating a detailed user story.

       ROLE: Transform epic story skeleton into complete story file with:
       - Refined user story statement
       - Detailed BDD acceptance criteria
       - Task/subtask breakdown
       - Comprehensive dev notes

       COORDINATION:
       - Coordination file: .system/parallel-story-batch-0-coordination.yaml
       - Your terminal ID: terminal-{n}
       - Story assignment: {story-key}

       STORY CONTEXT:
       {Load from work_unit.context}

       Epic ID: {epic_id}
       Story Number: {story_number}
       Title: {title}

       Epic Excerpt:
       {epic_excerpt from epics.md - this story's section}

       PRD Context:
       {prd_excerpt - functional requirements this story addresses}

       Architecture Guidance:
       {Load from architecture.md - relevant patterns, standards}

       DELIVERABLE:
       Create {output_file} with this structure:

       ```markdown
       # Story {epic}.{num}: {Title}

       **Epic:** Epic {epic} - {Epic Title}
       **Status:** drafted
       **Created:** {timestamp}

       ## User Story

       As a {role}
       I want to {capability}
       So that {benefit}

       ## Acceptance Criteria

       1. **Given** {context}
          **When** {action}
          **Then** {outcome}

       2. **Given** {context}
          **When** {action}
          **Then** {outcome}

       [... 3-7 acceptance criteria in BDD format ...]

       ## Tasks and Subtasks

       ### Task 1: {Task description}
       - [ ] {Subtask 1}
       - [ ] {Subtask 2}
       - [ ] {Subtask 3}

       ### Task 2: {Task description}
       - [ ] {Subtask 1}
       - [ ] {Subtask 2}

       [... map tasks to acceptance criteria ...]

       ## Dev Notes

       **Architecture:**
       - {Pattern to follow from architecture.md}
       - {Framework/library to use}
       - {File structure guidance}

       **Dependencies:**
       - {npm packages / pip packages needed}
       - {External services to integrate}

       **Testing Requirements:**
       - {What to test - map to ACs}
       - {Testing framework and location}
       - {Coverage requirements}

       **Security Considerations:**
       - {Auth requirements}
       - {Input validation}
       - {Data sanitization}

       **Performance:**
       - {Performance targets}
       - {Optimization guidance}

       **References:**
       - PRD: {FR numbers}
       - Architecture: {section references}
       - Epic: Epic {num}

       ## Dev Agent Record

       _(This section is filled during story implementation)_

       **Completion Notes:**
       **Debug Log:**
       **File List:**

       ## Senior Developer Review

       _(This section is filled during code review)_
       ```

       STORY CREATION GUIDELINES:

       1. **Expand on epic skeleton**:
          - Epic has basic story outline
          - Add implementation details omitted from epic/PRD
          - Include UI specifics, validation rules, error handling

       2. **BDD Acceptance Criteria**:
          - Given/When/Then format
          - Cover all functional requirements
          - Include edge cases and error scenarios
          - Make testable and measurable

       3. **Task Breakdown**:
          - Break ACs into concrete dev tasks
          - Each task has 2-5 subtasks
          - Clear, actionable items

       4. **Dev Notes - Critical Context**:
          - Reference architecture patterns
          - Cite specific technologies/frameworks
          - Security and performance guidance
          - Point to code examples if available

       5. **Vertical Slice**:
          - Story delivers complete, usable feature
          - Includes backend + frontend + tests
          - No "half-implemented" state

       6. **Foundation Stories Special**:
          - Story 1.1 should establish project structure
          - Include setup instructions, scaffolding
          - Define patterns others will follow

       COORDINATION PROTOCOL:

       1. BEFORE starting:
          - Lock, update status to in-progress, unlock

       2. DURING story creation:
          - Update heartbeat every 2min

       3. ON SUCCESS:
          - Write story file to {output_file}
          - Lock coordination file
          - Update status to completed
          - Record result_file path
          - Move from assigned → completed
          - Increment orchestrator.completed
          - Unlock

       4. ON ERROR:
          - Lock, set status=failed, record error, unlock

       Begin story creation now. Report when complete.
   ```

3. **Monitor Batch 0 progress**:
   ```
   Batch 0: Foundation Stories - Progress
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Completed: 1/2 [50%]
   Elapsed: 4m 12s

   ✓ terminal-1: 1-1-project-setup (completed in 4m 12s)
   ⟳ terminal-2: 1-2-user-model (in progress - 3m 45s)
   ```

4. **Wait for Batch 0 completion**

### Step 4: Operator Review Batch 0

**OPERATOR TOUCHPOINT**: Review foundation stories before proceeding

1. **Aggregate batch learnings**:
   Scan completed Batch 0 stories for patterns:
   ```markdown
   # Batch 0 Learnings

   ## Common Patterns Established
   - Project uses Express.js for API
   - Database: PostgreSQL with Sequelize ORM
   - Auth: JWT tokens with bcrypt
   - File structure: MVC pattern

   ## Dependencies Identified
   - express, sequelize, bcrypt, jsonwebtoken
   - Testing: Jest + Supertest

   ## Architectural Decisions
   - REST API endpoints under /api/v1
   - Environment config in .env
   - Migrations in db/migrations/

   ## Recommendations for Next Batch
   - Reference user model from 1-2
   - Follow authentication middleware pattern from 1-1
   - Maintain MVC structure
   ```

   Save to: `.system/batch-0-learnings.md`

2. **Prompt operator for review**:
   ```
   📋 Batch 0 Complete - Review Required

   Stories Created:
   ✓ 1-1-project-setup.md
   ✓ 1-2-user-model.md

   These are FOUNDATION stories that establish:
   - Project structure and patterns
   - Core technologies and frameworks
   - Authentication approach

   All future stories will build on these decisions.

   Please review:
   1. Open stories/1-1-project-setup.md
      - Verify project structure aligns with vision
      - Check tech stack choices
      - Confirm authentication approach

   2. Open stories/1-2-user-model.md
      - Verify user model fields
      - Check validation rules
      - Confirm security measures

   Options:
   1. Approve - Proceed to Batch 1
   2. Revise - Modify stories before continuing
   3. Inject Guidance - Add notes for next batch

   Choice (1/2/3):
   ```

3. **Handle operator response**:
   - If "Approve": Save batch learnings, proceed to Batch 1
   - If "Revise": Allow edits, re-review, then proceed
   - If "Inject Guidance": Capture operator notes, add to batch-1 context

### Step 5: Process Remaining Batches

For Batch 1, 2, 3... repeat similar process:

1. **Initialize coordination for Batch N**
2. **Include learnings from previous batch**:
   ```yaml
   work_units:
     2-2-content-create:
       context:
         epic_excerpt: "..."
         prd_excerpt: "..."
         previous_batch_learnings: "{load .system/batch-{n-1}-learnings.md}"
         operator_guidance: "{any injected guidance}"
   ```

3. **Spawn parallel story-workers** (one per story in batch)
4. **Monitor progress**
5. **Aggregate batch learnings**
6. **Operator review checkpoint**
7. **Proceed to next batch** or conclude

### Step 6: Update Sprint Status

After all batches complete:

1. **Lock sprint-status.yaml**

2. **Update all created stories**:
   ```yaml
   # Before
   1-1-project-setup: backlog
   1-2-user-model: backlog
   ...

   # After
   1-1-project-setup: drafted
   1-2-user-model: drafted
   ...
   ```

3. **Unlock and report**:
   ```
   Sprint Status Updated:
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Stories Created: 18
   Status: backlog → drafted

   All stories ready for context assembly or operator review.
   ```

### Step 7: Final Report

```
✅ Parallel Story Batch Creation Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Stories Created: 18
Batches Processed: 4
Operator Reviews: 4 (one per batch)

Execution Time: 29m 15s
vs Sequential: ~36m
Time Saved: 6m 45s (19%)

Batch Performance:
├─ Batch 0: 2 stories, 8m 23s (foundation)
├─ Batch 1: 3 stories, 6m 45s
├─ Batch 2: 4 stories, 7m 52s
└─ Batch 3: 4 stories, 6m 15s

Learning Transfer:
✓ Batch 0 learnings informed Batch 1
✓ Batch 1 learnings informed Batch 2
✓ Batch 2 learnings informed Batch 3
✓ Operator guidance injected at each checkpoint

Next Steps:
1. Run /parallel-story-context to generate contexts (22min for 18 stories)
2. Or review stories manually before context generation
3. Begin development: /bmad:bmm:workflows:dev-story
```

---

## Error Handling

### Dependency Validation Failure
```
❌ Story dependency validation failed!

Story 2-3-content-list depends on 2-1-content-model
But 2-1-content-model is in the same batch (Batch 1)

This violates batch independence requirements.

Suggested fix:
- Move 2-3-content-list to Batch 2 (depends on Batch 1)
- Or remove dependency if stories are truly independent

Auto-fix dependency graph? (y/n)
```

### Operator Rejects Batch
```
📋 Batch 1 Review - Revisions Requested

Operator feedback:
"Story 1-3 should use OAuth instead of JWT.
 Story 2-1 needs to include image upload support."

Options:
1. Regenerate affected stories with new guidance
2. Manual edit - operator will fix stories
3. Abort batch processing

If regenerating:
- 1-3-auth-endpoints will be recreated
- 2-1-content-model will be recreated
- Batch 1 completion time +5 minutes

Choice (1/2/3):
```

### Batch Timeout
```
⚠ Batch 2 execution timeout

Expected time: 8 minutes
Actual time: 12 minutes (ongoing)
Terminals still in progress: 2/4

Slowest story: 3-1-metrics-track (10m, complex)

Options:
1. Continue waiting (+5min extension)
2. Mark slow terminals as failed, proceed to review
3. Abort batch, investigate

Choice (1/2/3):
```

---

## Operator Touchpoints

This command prioritizes operator vision injection:

1. **Before Execution**: Approve execution plan and batch structure
2. **After Each Batch**: Review stories, inject guidance for next batch
3. **Revisions**: Request story regeneration if needed
4. **Guidance Injection**: Add context-specific notes for future batches

The operator maintains creative control while automation handles:
- Story formatting and structure
- Parallelization and coordination
- Learning transfer between batches
- Technical detail expansion

---

## Success Criteria

- ✅ All stories created with complete structure
- ✅ BDD acceptance criteria for every story
- ✅ Task breakdowns map to ACs
- ✅ Dev notes provide architectural guidance
- ✅ Batch learnings propagate to later batches
- ✅ Operator reviews and approves each batch
- ✅ Time savings vs sequential creation
- ✅ Dependency ordering maintained

---

## Next Commands

After `/parallel-story-batch` completes:

- `/parallel-story-context` - Generate contexts for all drafted stories (22min)
- `/bmad:bmm:workflows:review-story-batch` - Deep review of story batch
- `/bmad:bmm:workflows:dev-story` - Begin story implementation
