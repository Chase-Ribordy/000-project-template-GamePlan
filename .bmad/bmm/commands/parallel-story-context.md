# Parallel Story Context Assembly Command

**Command:** `/parallel-story-context`

**Purpose:** Generate story context XMLs in parallel across multiple terminals

**When to Use:**
- After stories are drafted (status: drafted in sprint-status.yaml)
- Before marking stories ready-for-dev
- Recommended by agents via `detect-story-context-opportunity` skill

**Time Savings:**
- Sequential: 50 stories × 3min = 150 minutes
- Parallel: 50 stories / 7 terminals = ~22 minutes
- **Savings: 128 minutes (85%)**

---

## Prerequisites

Before running this command, ensure:
- [ ] Stories exist in drafted status (sprint-status.yaml)
- [ ] Story files are complete with ACs, tasks, dev notes
- [ ] PRD, architecture, epics exist (for context assembly)

## Workflow Steps

### Step 1: Identify Drafted Stories

Scan sprint-status.yaml for stories needing context:

1. **Load sprint-status.yaml**

2. **Find all drafted stories**:
   ```yaml
   # Example sprint-status.yaml
   1-1-user-auth: drafted
   1-2-profile-mgmt: drafted
   1-3-session-mgmt: drafted
   2-1-content-create: drafted
   2-2-content-list: backlog      # Skip (not drafted)
   # ... more stories
   ```

   Extract list of story keys where status == "drafted"

3. **Validate story files exist**:
   For each drafted story, verify file exists:
   ```
   stories/1-1-user-auth.md
   stories/1-2-profile-mgmt.md
   stories/1-3-session-mgmt.md
   ...
   ```

4. **Check for existing contexts**:
   Skip stories that already have context files:
   ```
   stories/1-1-user-auth-context.md  # Already exists, skip
   ```

5. **Build work list**:
   ```javascript
   stories_needing_context = [
     {
       story_key: "1-2-profile-mgmt",
       story_file: "stories/1-2-profile-mgmt.md",
       output_file: "stories/1-2-profile-mgmt-context.md"
     },
     {
       story_key: "1-3-session-mgmt",
       story_file: "stories/1-3-session-mgmt.md",
       output_file: "stories/1-3-session-mgmt-context.md"
     },
     // ... 48 more stories
   ]
   ```

### Step 2: Get Operator Confirmation

**HYBRID TRIGGER**: Prompt operator for approval

```
🔍 Parallel Story Context Opportunity Detected

Stories Needing Context: 50
Current Status: drafted
Target Status: ready-for-dev

Context Assembly:
Each story will receive a comprehensive context XML containing:
├─ Story metadata (epic, user story, ACs)
├─ Relevant documentation excerpts (PRD, architecture, epics)
├─ Existing code interfaces and patterns
├─ Dependencies (packages, frameworks)
├─ Testing standards and examples
└─ Architectural constraints

Execution Plan:
┌─────────────────────────────────────────────────────┐
│ Terminal Configuration:     │ 7 parallel terminals │
│ Stories per terminal:        │ ~7 stories each      │
│ Estimated time per story:    │ ~3 minutes           │
├─────────────────────────────────────────────────────┤
│ Total Time (parallel):       │ ~22 minutes          │
│ vs Sequential:               │ ~150 minutes         │
│ Savings:                     │ 128 minutes (85%)    │
└─────────────────────────────────────────────────────┘

Once complete, all 50 stories will be marked ready-for-dev.

Proceed with parallel context assembly? (y/n)
```

If operator declines, return to conversation.
If operator approves, continue.

### Step 3: Initialize Parallel Coordination

Set up coordination for 50 work units across 7 terminals:

1. **Create coordination file**:
   ```bash
   cp .bmad/core/utils/parallel/coordination-template.yaml \
      .system/parallel-context-coordination.yaml
   ```

2. **Initialize orchestrator state**:
   ```yaml
   orchestrator:
     started_at: "{timestamp}"
     status: initialized
     total_work_units: 50
     config:
       max_terminals: 7
       work_type: context-assembly
       timeout_minutes: 10

   work_units:
     1-2-profile-mgmt:
       id: 1-2-profile-mgmt
       type: story-context
       title: "Profile Management"
       priority: 1
       estimated_time_minutes: 3
       output_file: "stories/1-2-profile-mgmt-context.md"
       context:
         story_key: "1-2-profile-mgmt"
         story_file: "stories/1-2-profile-mgmt.md"
         epic_id: 1
         story_number: 2

     # ... remaining 49 stories ...

   work_queue:
     pending: [list of 50 story keys]
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
       epics: "sprint-artifacts/epics.md"
       tech_spec: "sprint-artifacts/tech-spec.md"  # If exists
     project:
       name: "{project-name}"
       tech_stack: [...]
       testing_framework: "{framework}"
   ```

### Step 4: Distribute Work to Terminals

Spawn 7 parallel context-worker agents:

1. **For each terminal (1-7)**:

   Assign ~7-8 stories to each terminal:
   ```yaml
   terminal-1:
     agent_type: context-worker
     work_units: ["1-2-profile-mgmt", "1-3-session-mgmt", "2-1-content-create", ...]
     status: assigned
   ```

2. **Spawn context-worker agent**:

   Use Task tool to launch agent:
   ```
   Task tool:
     subagent_type: general-purpose
     model: sonnet
     description: "Context assembly for {count} stories"
     prompt: |
       You are a CONTEXT WORKER agent assembling story context XMLs.

       ROLE: Generate comprehensive story-context.md files for assigned stories.

       COORDINATION:
       - Coordination file: .system/parallel-context-coordination.yaml
       - Your terminal ID: terminal-{n}
       - Assigned stories: {work_unit_list}

       SHARED CONTEXT:
       {Load shared_context from coordination file}
       - PRD: {prd_path}
       - Architecture: {architecture_path}
       - Epics: {epics_path}
       - Project root: {project_root}

       DELIVERABLES:
       For each assigned story, create {story-key}-context.md with this structure:

       ```xml
       <?xml version="1.0" encoding="UTF-8"?>
       <story-context>

         <story-metadata>
           <epic_id>{epic}</epic_id>
           <story_id>{story-key}</story_id>
           <user_story>
             {User story statement from story file}
           </user_story>
           <acceptance_criteria>
             {List all ACs from story file}
           </acceptance_criteria>
         </story-metadata>

         <artifacts>
           <docs>
             <prd>
               {Relevant PRD excerpts - FRs this story addresses}
             </prd>
             <architecture>
               {Relevant architecture decisions, patterns, tech stack choices}
             </architecture>
             <epic>
               {Epic context for this story}
             </epic>
             <ux_design>
               {UX/UI specifications if they exist}
             </ux_design>
           </docs>

           <code>
             <!-- Scan codebase for relevant existing code -->
             <interfaces>
               {Existing interfaces, types, models to reuse}
             </interfaces>
             <patterns>
               {Code patterns already established in project}
             </patterns>
             <utilities>
               {Helper functions, utilities available}
             </utilities>
           </code>

           <dependencies>
             <packages>
               {Relevant npm/pip packages from package.json/requirements.txt}
             </packages>
             <frameworks>
               {Framework usage (React, Express, Django, etc.)}
             </frameworks>
           </dependencies>
         </artifacts>

         <interfaces>
           <!-- APIs, function signatures this story should use/implement -->
           <api_endpoints>
             {Endpoints to create or consume}
           </api_endpoints>
           <database_schema>
             {Tables, models to create or modify}
           </database_schema>
           <component_interfaces>
             {React components, classes, modules}
           </component_interfaces>
         </interfaces>

         <constraints>
           <!-- Development constraints and standards -->
           <patterns>
             {Architectural patterns to follow}
           </patterns>
           <standards>
             {Coding standards, naming conventions}
           </standards>
           <security>
             {Security requirements (auth, validation, sanitization)}
           </security>
           <performance>
             {Performance targets, optimization requirements}
           </performance>
         </constraints>

         <tests>
           <standards>
             {Testing framework and standards from architecture}
           </standards>
           <locations>
             {Where to write tests based on project structure}
           </locations>
           <examples>
             {Example tests from existing codebase}
           </examples>
           <ideas>
             {Specific test scenarios for this story's ACs}
           </ideas>
         </tests>

         <previous_story_learnings>
           <!-- If this story follows another, include learnings -->
           {Completion notes, patterns, gotchas from previous story}
         </previous_story_learnings>

       </story-context>
       ```

       CONTEXT ASSEMBLY GUIDELINES:

       1. **Load all source documents**:
          - Read PRD, architecture, epics (full context)
          - Read story file completely
          - Scan codebase for existing patterns

       2. **Extract relevant excerpts**:
          - Don't copy entire documents
          - Include only sections relevant to this story
          - Add citations (document section, page, line)

       3. **Scan codebase intelligently**:
          - Look for existing models, interfaces matching story domain
          - Find helper utilities the dev should reuse
          - Identify patterns to follow

       4. **Be comprehensive but focused**:
          - Context should give dev everything needed
          - Avoid information overload (only relevant context)
          - Prioritize actionable guidance

       5. **Link to previous stories**:
          - If story 2.3, check if 2.2 exists and is complete
          - Extract learnings from previous story completion notes
          - Note dependencies on previously implemented code

       COORDINATION PROTOCOL:

       1. BEFORE starting:
          - Lock coordination file
          - Update terminal status to "in-progress"
          - Update started_at timestamp
          - Unlock

       2. FOR EACH assigned story:
          - Assemble context XML
          - Write to output file
          - Lock coordination file
          - Move story from assigned → in-progress
          - Update heartbeat
          - Unlock

       3. WHEN story context complete:
          - Lock coordination file
          - Move story from in-progress → completed
          - Increment orchestrator.completed counter
          - Unlock

       4. WHEN all assigned stories complete:
          - Lock coordination file
          - Update terminal status to "completed"
          - Update completed_at timestamp
          - Unlock
          - Report completion

       5. ON ERROR:
          - Lock coordination file
          - Update terminal status to "failed"
          - Record error details
          - Move failed story to work_queue.failed
          - Unlock

       FILE LOCKING:
       - Lock: Create .system/parallel-context-coordination.yaml.lock
       - Retry: Up to 10 attempts, 500ms backoff
       - ALWAYS unlock, even on error

       Begin context assembly. Process stories sequentially within your assignment.
       Report progress after each story and when fully complete.
   ```

3. **All 7 terminals spawn simultaneously**, each processing ~7 stories

### Step 5: Monitor Parallel Execution

Poll coordination file and display progress:

```
Parallel Story Context Assembly - Progress
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Completed: 23/50 [46%] ████████████████░░░░░░░░░░░░░░
In Progress: 7
Failed: 0
Elapsed: 10m 15s
Estimated Remaining: 12m 30s

Terminals:
⟳ terminal-1: 4/7 complete (latest: 1-3-session-mgmt)
⟳ terminal-2: 3/7 complete (latest: 2-2-content-list)
✓ terminal-3: 7/7 complete (all done in 9m 45s)
⟳ terminal-4: 3/8 complete (latest: 3-1-metrics-track)
⟳ terminal-5: 4/7 complete (latest: 3-3-metrics-export)
⟳ terminal-6: 2/7 complete (latest: 4-1-csv-export)
⟳ terminal-7: 0/7 complete (starting...)

Recent Completions:
✓ 1-3-session-mgmt (terminal-1, 2m 45s)
✓ 2-1-content-create (terminal-1, 3m 12s)
✓ 2-2-content-list (terminal-2, 2m 58s)
```

Continue polling until all 50 stories complete.

### Step 6: Validate Results

Once all terminals report completion:

1. **Verify all context files created**:
   ```bash
   # Check all 50 context files exist
   for story in stories_needing_context:
     check file exists: stories/{story-key}-context.md
   ```

2. **Validate XML structure**:
   For each context file:
   - Parse XML, ensure well-formed
   - Verify required sections exist
   - Report any malformed contexts

3. **Report validation results**:
   ```
   Validation Results:
   ✓ 50/50 context files created
   ✓ 49/50 well-formed XML
   ⚠ 1 validation warning:
     - stories/3-4-pdf-export-context.md: Missing <tests> section

   Review flagged file? (y/n)
   ```

### Step 7: Update Sprint Status

Mark all stories as ready-for-dev:

1. **Use merge-results utility**:
   ```xml
   <call-template name="merge-story-contexts">
     <with-param name="context_files" select="$all_context_files" />
     <with-param name="sprint_status_file" select="'sprint-status.yaml'" />
   </call-template>
   ```

2. **Atomic status update**:
   - Lock sprint-status.yaml
   - Update all 50 stories: drafted → ready-for-dev
   - Unlock

3. **Report update**:
   ```
   Sprint Status Updated:
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Stories Updated: 50
   Status Change: drafted → ready-for-dev

   Stories Ready for Development:
   Epic 1: User Authentication (4 stories)
   Epic 2: Content Management (12 stories)
   Epic 3: Usage Metrics (8 stories)
   Epic 4: Export Functionality (6 stories)
   [... etc ...]
   ```

### Step 8: Cleanup and Report

1. **Clean up coordination files**:
   ```bash
   # Archive coordination data for learning
   cp .system/parallel-context-coordination.yaml \
      .system/parallel-patterns/context-assembly-{timestamp}.yaml

   # Remove active coordination file
   rm .system/parallel-context-coordination.yaml
   rm .system/parallel-context-coordination.yaml.lock  # If exists
   ```

2. **Generate final report**:
   ```
   ✅ Parallel Story Context Assembly Complete!
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Stories Processed: 50
   Context Files Created: 50
   Status Updated: drafted → ready-for-dev

   Execution Time: 21m 34s
   vs Sequential: ~150m
   Time Saved: 128m 26s (85.6%)

   Average Time per Story: 26 seconds
   Fastest Story: 1-5-logout (18s, terminal-3)
   Slowest Story: 2-7-content-search (4m 12s, terminal-4)

   Terminal Performance:
   ├─ terminal-1: 7 stories, avg 2m 45s
   ├─ terminal-2: 7 stories, avg 2m 52s
   ├─ terminal-3: 7 stories, avg 2m 18s (fastest)
   ├─ terminal-4: 8 stories, avg 3m 15s
   ├─ terminal-5: 7 stories, avg 2m 41s
   ├─ terminal-6: 7 stories, avg 2m 38s
   └─ terminal-7: 7 stories, avg 2m 29s

   All stories are now ready for development!

   Next Steps:
   1. Review story contexts for completeness
   2. Begin development: /bmad:bmm:workflows:dev-story
   3. Or mark specific stories ready: /bmad:bmm:workflows:story-ready
   ```

3. **Update parallel patterns log**:
   Record this execution for future optimization:
   ```markdown
   # Context Assembly - {timestamp}

   **Configuration:**
   - Stories: 50
   - Terminals: 7
   - Model: sonnet

   **Performance:**
   - Total time: 21m 34s
   - Avg per story: 26s
   - Time saved: 128m 26s (85.6%)

   **Learnings:**
   - Terminal-4 slowest due to 8 stories vs 7 (unbalanced)
   - Story 2-7 took 4m due to complex codebase scan
   - Consider: Dynamic load balancing for future runs

   **Recommendations:**
   - Balance work units more evenly (7 or 8, not mixed)
   - Stories with "search" or "complex query" may need more time
   - Consider 8 terminals for 50+ stories
   ```

---

## Error Handling

### Terminal Timeout
```
⚠ Terminal-4 has been processing for 12 minutes (timeout: 10min)

Current story: 2-7-content-search (in progress 9m)
Remaining stories: 3

Options:
1. Extend timeout for terminal-4 (+10 minutes)
2. Mark 2-7-content-search as failed, reassign remaining
3. Wait and continue monitoring

Choice (1/2/3):
```

### Malformed XML
```
⚠ Context validation failed for 3-4-pdf-export-context.md

Error: XML parse error at line 45
Expected closing tag </constraints>, found </constraint>

Terminal: terminal-6
Status: Marked as completed (but output invalid)

Options:
1. Retry 3-4-pdf-export context assembly
2. Manually fix XML error
3. Continue without this context (mark story as drafted)

Choice (1/2/3):
```

### Lock Contention
```
⚠ Terminal-2 unable to acquire lock after 10 retries

This may indicate:
- High lock contention (7 terminals competing)
- Slow file I/O
- Stuck terminal holding lock

Recommendations:
- Increase retry backoff (currently 500ms)
- Check .system/parallel-context-coordination.yaml.lock age
- If lock >2min old, may be stale

Auto-retry with extended backoff? (y/n)
```

### Missing Story File
```
❌ Terminal-5 failed processing 3-2-metrics-display

Error: Story file not found
Expected: stories/3-2-metrics-display.md
Actual: File does not exist

This story is in sprint-status.yaml as "drafted" but file is missing.

Options:
1. Create story first: /bmad:bmm:workflows:create-story
2. Remove from sprint-status.yaml (story doesn't exist)
3. Skip this story, continue with others

Choice (1/2/3):
```

---

## Operator Touchpoints

This command minimizes operator involvement:

1. **Before Execution**: Confirm parallel context assembly (hybrid trigger)
2. **During Execution**: Monitor progress (optional, can walk away)
3. **After Completion**: Review any flagged contexts
4. **Error Handling**: Decide on retry strategies if failures occur

The operator can approve execution and let the system run autonomously for 20+ minutes while contexts are assembled.

---

## Success Criteria

- ✅ All drafted stories receive context XMLs
- ✅ Context XMLs are well-formed and complete
- ✅ All stories updated to ready-for-dev status
- ✅ Time savings realized (80%+ faster than sequential)
- ✅ No manual context assembly required
- ✅ Contexts include comprehensive guidance for dev agents

---

## Next Commands

After `/parallel-story-context` completes:

- `/bmad:bmm:workflows:dev-story` - Begin story implementation
- `/bmad:bmm:workflows:review-story-batch` - Operator reviews stories before dev
- `/bmad:bmm:workflows:story-ready` - Mark specific stories ready (alternative to batch)
