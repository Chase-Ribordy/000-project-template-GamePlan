# Parallel Epic Breakdown Command

**Command:** `/parallel-epic-breakdown`

**Purpose:** Orchestrate parallel decomposition of epics into detailed stories across multiple terminals

**When to Use:**
- After PRD is complete and epic structure is defined
- When 2+ epics need to be broken down into stories
- Recommended by agents via `detect-epic-parallelization` skill

**Time Savings:**
- Sequential: 5 epics × 5min = 25 minutes
- Parallel: 1 epic (foundation) + 4 parallel = ~10 minutes
- **Savings: 15 minutes (60%)**

---

## Prerequisites

Before running this command, ensure:
- [ ] PRD exists and is complete
- [ ] Epic structure is proposed (epic goals, FR coverage)
- [ ] Operator has reviewed and approved epic vision
- [ ] Output folder structure exists

## Workflow Steps

### Step 1: Validate Prerequisites

Check that all required artifacts exist:

```bash
# Required files
- {project-root}/sprint-artifacts/PRD.md
- Epic structure defined (either in epics.md outline or separate epic proposals)

# Optional but recommended
- {project-root}/sprint-artifacts/architecture.md
- {project-root}/sprint-artifacts/domain-brief.md
```

If any critical files missing, report error and abort:
```
❌ Cannot proceed with parallel epic breakdown:

Missing: PRD.md
The PRD is required to extract functional requirements for epic story creation.

Run /bmad:bmm:workflows:prd first, then retry /parallel-epic-breakdown
```

### Step 2: Load Epic Structure

Parse epic definitions to identify parallelization opportunities:

1. **Load epic structure** from:
   - Existing `epics.md` (if partially complete)
   - Epic proposals from PM/SM
   - PRD epic outline section

2. **Extract epic metadata**:
   ```javascript
   epics = [
     {
       id: "epic-1",
       number: 1,
       title: "User Authentication",
       goal: "Enable secure user authentication and authorization",
       functional_requirements: ["FR1", "FR2", "FR3"],
       is_foundation: true  // Epic 1 always foundation
     },
     {
       id: "epic-2",
       number: 2,
       title: "Content Management",
       goal: "Enable users to create and manage content",
       functional_requirements: ["FR4", "FR5", "FR6"],
       is_foundation: false
     },
     // ... more epics
   ]
   ```

3. **Build epic dependency graph** using `dependency-graph.xml`:
   - Epic 1 always sequential (foundation)
   - Identify which epics can run in parallel (no cross-dependencies)
   - Create execution groups

### Step 3: Get Operator Confirmation

**HYBRID TRIGGER**: Prompt operator for approval

```
🔍 Parallel Epic Breakdown Opportunity Detected

Epics to Process: 4 total
├─ Epic 1: User Authentication (sequential - foundation)
├─ Epic 2: Content Management (parallel)
├─ Epic 3: Usage Metrics (parallel)
└─ Epic 4: Export Functionality (parallel)

Execution Plan:
┌─────────────────────────────────────────────────────┐
│ Phase 1: Epic 1 Foundation          │ ~6 minutes   │
│ Phase 2: Epics 2-4 Parallel         │ ~6 minutes   │
├─────────────────────────────────────────────────────┤
│ Total Time:                         │ ~12 minutes  │
│ vs Sequential:                      │ ~25 minutes  │
│ Savings:                            │ 13 minutes   │
└─────────────────────────────────────────────────────┘

Each epic will be decomposed into detailed stories with:
- BDD-style acceptance criteria
- Task breakdowns
- Dev notes with architectural guidance
- Traceability to functional requirements

Before proceeding:
• Have you reviewed and approved the epic goals/vision?
• Are you comfortable with parallel execution across terminals?

Proceed with parallel epic breakdown? (y/n)
```

If operator says no or requests changes:
- Return to agent conversation
- Allow epic refinement
- Re-prompt when ready

If operator approves, continue to Step 4.

### Step 4: Initialize Parallel Coordination

Set up coordination infrastructure:

1. **Create coordination file**:
   ```bash
   cp .bmad/core/utils/parallel/coordination-template.yaml \
      .system/parallel-epic-coordination.yaml
   ```

2. **Initialize orchestrator state**:
   ```yaml
   orchestrator:
     started_at: "2025-01-16T10:30:00Z"
     status: initialized
     total_work_units: 4
     config:
       max_terminals: 4  # One per epic (Epic 1 + 3 parallel)
       work_type: epic-breakdown
       timeout_minutes: 15

   work_units:
     epic-1:
       id: epic-1
       type: epic-breakdown
       title: "User Authentication"
       priority: 1  # Highest priority (foundation)
       estimated_time_minutes: 6
       output_file: "epic-1-section.md"
       context:
         epic_number: 1
         epic_goal: "Enable secure user authentication and authorization"
         functional_requirements: ["FR1", "FR2", "FR3"]
         prd_path: "sprint-artifacts/PRD.md"
         is_foundation: true

     epic-2:
       id: epic-2
       type: epic-breakdown
       title: "Content Management"
       priority: 2
       estimated_time_minutes: 5
       output_file: "epic-2-section.md"
       context:
         epic_number: 2
         epic_goal: "Enable users to create and manage content"
         functional_requirements: ["FR4", "FR5", "FR6"]
         prd_path: "sprint-artifacts/PRD.md"
         dependencies: ["epic-1"]

     # ... epic-3, epic-4 ...

   work_queue:
     pending: ["epic-1", "epic-2", "epic-3", "epic-4"]
     assigned: []
     in_progress: []
     completed: []
     failed: []

   shared_context:
     project_root: "{absolute-path}"
     output_folder: "sprint-artifacts"
     documents:
       prd: "sprint-artifacts/PRD.md"
       architecture: "sprint-artifacts/architecture.md"
     standards:
       ac_format: "BDD (Given/When/Then)"
       dev_notes_required: true
   ```

3. **Create output directory** for epic sections:
   ```bash
   mkdir -p {output_folder}/.temp/epic-sections
   ```

### Step 5: Process Epic 1 Foundation (Sequential)

Epic 1 must complete before parallel execution begins:

1. **Assign Epic 1 to terminal-1**:
   Update coordination file (with locking):
   ```yaml
   terminals:
     terminal-1:
       agent_type: epic-worker
       work_unit_id: epic-1
       status: assigned
       assigned_at: "{timestamp}"
   work_queue:
     pending: ["epic-2", "epic-3", "epic-4"]
     assigned: ["epic-1"]
   ```

2. **Spawn Epic 1 worker**:
   Use Task tool to launch `epic-worker` agent:
   ```
   Task tool:
     subagent_type: general-purpose
     model: sonnet
     description: "Epic 1 foundation breakdown"
     prompt: |
       You are an EPIC WORKER agent processing Epic 1 (foundation epic).

       ROLE: Decompose Epic 1 into detailed, actionable user stories with BDD acceptance criteria.

       COORDINATION:
       - Coordination file: .system/parallel-epic-coordination.yaml
       - Your terminal ID: terminal-1
       - Work unit: epic-1

       EPIC ASSIGNMENT:
       {Load epic-1 context from coordination file}

       Epic Number: 1
       Epic Title: User Authentication
       Epic Goal: Enable secure user authentication and authorization
       Functional Requirements: FR1, FR2, FR3

       PRD CONTEXT:
       {Load and include relevant FR1, FR2, FR3 sections from PRD}

       DELIVERABLE:
       Create epic-1-section.md with the following structure:

       ```markdown
       ## Epic 1: User Authentication

       **Epic Goal:** {goal}

       **Value:** {business value}

       **Functional Requirements:** FR1, FR2, FR3

       ### Story 1.1: {Title}

       **User Story:**
       As a {role}
       I want to {capability}
       So that {benefit}

       **Acceptance Criteria:**
       1. **Given** {context}
          **When** {action}
          **Then** {outcome}

       2. **Given** {context}
          **When** {action}
          **Then** {outcome}

       [... more ACs ...]

       **Tasks:**
       1. {Task description}
          - {Subtask}
          - {Subtask}
       2. {Task description}

       **Dev Notes:**
       - Architectural guidance: {pattern to follow}
       - Dependencies: {packages, frameworks}
       - Testing requirements: {what to test}
       - Security considerations: {important security notes}

       ---

       ### Story 1.2: {Title}
       [... repeat structure ...]

       ---

       [... more stories ...]
       ```

       CRITICAL REQUIREMENTS:
       - Epic 1 is the FOUNDATION epic - it establishes:
         * Project structure (directories, config files)
         * Core infrastructure (database, auth, API framework)
         * Shared utilities and helpers
       - All other epics will depend on Epic 1 completion
       - First story (1.1) should be project setup
       - Include detailed dev notes about patterns to follow

       STORY GUIDELINES:
       - Vertical slices: Each story delivers complete functionality
       - No forward dependencies: Don't reference future stories
       - BDD acceptance criteria: Given/When/Then format
       - Include implementation details missing from PRD
       - 3-7 stories per epic (adjust based on complexity)

       COORDINATION PROTOCOL:
       1. BEFORE starting work:
          - Lock: .system/parallel-epic-coordination.yaml.lock
          - Update: terminals.terminal-1.status = "in-progress"
          - Update: terminals.terminal-1.started_at = "{timestamp}"
          - Unlock: delete lock file

       2. WHILE working:
          - Update heartbeat every 2 minutes:
            terminals.terminal-1.last_heartbeat = "{timestamp}"

       3. ON SUCCESS:
          - Write output to: sprint-artifacts/.temp/epic-sections/epic-1-section.md
          - Lock coordination file
          - Update: terminals.terminal-1.status = "completed"
          - Update: terminals.terminal-1.completed_at = "{timestamp}"
          - Update: terminals.terminal-1.result_file = "sprint-artifacts/.temp/epic-sections/epic-1-section.md"
          - Move work_queue: epic-1 from assigned → completed
          - Increment: orchestrator.completed
          - Unlock

       4. ON ERROR:
          - Lock coordination file
          - Update: terminals.terminal-1.status = "failed"
          - Update: terminals.terminal-1.error_message = "{error details}"
          - Move work_queue: epic-1 from assigned → failed
          - Increment: orchestrator.failed
          - Unlock

       FILE LOCKING:
       - Create lock: touch .system/parallel-epic-coordination.yaml.lock
       - Max retries: 10 attempts
       - Backoff: 500ms exponential
       - ALWAYS unlock, even on error

       Begin epic breakdown now. Report when complete.
   ```

3. **Monitor Epic 1 progress**:
   - Poll coordination file every 5 seconds
   - Display progress updates to operator
   - Wait for completion

4. **Verify Epic 1 output**:
   - Check epic-1-section.md exists and is well-formed
   - Verify contains foundation stories (project setup, infrastructure)
   - Report completion:
     ```
     ✓ Epic 1 Foundation Complete (5m 34s)
       - 4 stories created
       - Output: epic-1-section.md
     ```

### Step 6: Process Epics 2-N in Parallel

Now that foundation is established, parallelize remaining epics:

1. **Spawn parallel epic workers**:
   For each remaining epic (epic-2, epic-3, epic-4):

   - Assign to terminal-{n}
   - Update coordination file (with locking)
   - Spawn Task agent with same epic-worker prompt
   - Pass epic-specific context

   All 3 agents run simultaneously in separate terminals.

2. **Monitor parallel execution**:
   Poll coordination file and display real-time progress:
   ```
   Parallel Epic Breakdown - Progress
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Completed: 2/4 [50%]
   In Progress: 2
   Failed: 0
   Elapsed: 8m 15s

   Terminals:
   ✓ terminal-1: Epic 1 - User Authentication (completed in 5m 34s)
   ✓ terminal-2: Epic 2 - Content Management (completed in 4m 52s)
   ⟳ terminal-3: Epic 3 - Usage Metrics (in progress - 3m 23s)
   ⟳ terminal-4: Epic 4 - Export Functionality (in progress - 3m 23s)
   ```

3. **Wait for all terminals to complete**

4. **Handle any failures**:
   If terminal fails:
   ```
   ⚠ Epic 3 breakdown failed (terminal-3)
   Error: Unable to parse FR coverage from PRD

   Retry epic-3? (y/n)
   ```

   If yes, reassign to new terminal and retry.

### Step 7: Merge Epic Sections

Once all epics complete, merge into unified epics.md:

1. **Use merge-results.xml utility**:
   ```xml
   <call-template name="merge-epic-sections">
     <with-param name="section_files" select="[
       'epic-1-section.md',
       'epic-2-section.md',
       'epic-3-section.md',
       'epic-4-section.md'
     ]" />
     <with-param name="output_file" select="'sprint-artifacts/epics.md'" />
     <with-param name="epic_count" select="4" />
   </call-template>
   ```

2. **Merge utility will**:
   - Validate all sections exist
   - Merge in numerical order
   - Generate FR coverage matrix
   - Report statistics

### Step 8: Update Sprint Status

Initialize sprint-status.yaml with all stories:

```bash
# Run sprint-planning workflow
/bmad:bmm:workflows:sprint-planning
```

This scans epics.md and creates sprint-status.yaml with all stories in backlog.

### Step 9: Cleanup and Report

1. **Clean up temporary files**:
   ```bash
   rm -rf sprint-artifacts/.temp/epic-sections
   rm .system/parallel-epic-coordination.yaml
   rm .system/parallel-epic-coordination.yaml.lock  # If exists
   ```

2. **Generate final report**:
   ```
   ✅ Parallel Epic Breakdown Complete!
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Output: sprint-artifacts/epics.md

   Epics Created: 4
   ├─ Epic 1: User Authentication (4 stories)
   ├─ Epic 2: Content Management (6 stories)
   ├─ Epic 3: Usage Metrics (5 stories)
   └─ Epic 4: Export Functionality (3 stories)

   Total Stories: 18

   Functional Requirements Coverage:
   ✓ FR1-FR12: All requirements mapped to stories

   Execution Time: 11m 47s
   vs Sequential: ~25m
   Time Saved: 13m 13s (53%)

   Next Steps:
   1. Review epics.md for vision alignment
   2. Run /parallel-story-context to generate story contexts
   3. Begin development with /bmad:bmm:workflows:dev-story
   ```

3. **Archive coordination data**:
   Save final coordination state for learning:
   ```bash
   cp .system/parallel-epic-coordination.yaml \
      .system/parallel-patterns/epic-breakdown-{timestamp}.yaml
   ```

---

## Error Handling

### Timeout (terminal > 15 minutes)
```
⚠ Terminal-3 processing Epic 3 has exceeded timeout (15 minutes)

Options:
1. Continue waiting (extend timeout by 10 minutes)
2. Mark as failed and retry
3. Abort parallel execution

Choice (1/2/3):
```

### Lock Acquisition Failure
```
❌ Failed to acquire coordination file lock after 10 attempts

Possible causes:
- Another process is stuck holding the lock
- File permission issues
- Lock file not being released properly

Manual intervention required:
1. Check if .system/parallel-epic-coordination.yaml.lock exists
2. If stale (>2 minutes old), delete it manually
3. Retry command

Delete stale lock now? (y/n)
```

### Missing Epic Section
```
❌ Epic merge failed: Missing epic-2-section.md

Terminal-2 status: completed
Expected output: sprint-artifacts/.temp/epic-sections/epic-2-section.md
Actual: File not found

Options:
1. Check terminal-2 logs for errors
2. Retry epic-2 breakdown
3. Create epic-2 manually and retry merge

Choice (1/2/3):
```

### Validation Failure
```
⚠ Epic 4 section validation warnings:

Missing required sections:
- "### Epic Goal" section not found

Structural issues:
- Story 4.3 has no acceptance criteria

Proceed with merge anyway? (y/n)
```

---

## Operator Touchpoints

This command includes strategic operator touchpoints:

1. **Before Execution**: Confirm epic vision and approve parallel execution
2. **After Epic 1**: Review foundation epic before proceeding to parallel phase
3. **After Completion**: Review merged epics.md for vision alignment
4. **On Errors**: Decide on retry/abort strategies

The operator stays focused on vision and strategic decisions while the infrastructure handles parallelization, coordination, and technical details.

---

## Success Criteria

- ✅ All epics decomposed into detailed stories
- ✅ All functional requirements covered (FR coverage matrix validates)
- ✅ Epic 1 foundation stories establish infrastructure
- ✅ No circular dependencies between stories
- ✅ All stories have BDD acceptance criteria
- ✅ Dev notes provide architectural guidance
- ✅ Time savings realized (50%+ faster than sequential)
- ✅ sprint-status.yaml initialized with all stories

---

## Next Commands

After `/parallel-epic-breakdown` completes:

- `/parallel-story-context` - Generate contexts for all stories in parallel
- `/bmad:bmm:workflows:story-ready` - Mark specific stories ready for dev
- `/bmad:bmm:workflows:dev-story` - Begin story implementation
