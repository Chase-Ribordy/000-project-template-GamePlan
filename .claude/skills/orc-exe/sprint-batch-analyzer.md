# Sprint Batch Analyzer

**Isolation Level**: ORC-EXE only
**Invocation**: Direct (not event-driven)
**Purpose**: Parse sprint status, identify parallelizable stories, build dependency graphs, and suggest parallel execution strategies with terminal assignments

---

## Overview

The Sprint Batch Analyzer skill enables the ORC-EXE to analyze sprint status from BMAD Scrum Master output and intelligently batch stories for parallel execution across multiple terminals. It parses YAML sprint artifacts, analyzes story dependencies, identifies parallel-safe work units, and outputs actionable terminal assignments with execution strategies.

This skill is critical for maximizing developer throughput by orchestrating concurrent story development while respecting dependencies and complexity constraints.

---

## Invocation Pattern

**Direct Call (Operator-initiated):**
```
Analyze the current sprint status and suggest parallel batching strategy
```

**Context-aware Call:**
```
Review sprint-status.yaml and tell me which stories can run in parallel across 3 terminals
```

**Advanced Call:**
```
Parse sprint status, build dependency graph, and create terminal assignments for stories in ready-for-dev status
```

---

## Capabilities

### 1. Sprint Status Parsing

**Read and parse:**
- `docs/sprint-artifacts/sprint-status.yaml` (BMAD Scrum Master output)
- Extract `development_status` section
- Identify stories by status: `backlog`, `drafted`, `ready-for-dev`, `in-progress`, `review`, `done`
- Filter for actionable stories (`ready-for-dev`, `drafted`)

**Example Input:**
```yaml
development_status:
  epic-1: contexted
  1-1-user-authentication: ready-for-dev
  1-2-account-management: drafted
  1-3-plant-data-model: ready-for-dev
  1-4-ui-components: in-progress
  1-5-api-integration: backlog
```

**Parsed Output:**
```
Actionable Stories:
  Ready for Dev: 1-1-user-authentication, 1-3-plant-data-model
  Drafted: 1-2-account-management
  In Progress: 1-4-ui-components
```

### 2. Dependency Graph Analysis

**Read and analyze:**
- `.system/parallel-work/dependencies-template.yaml`
- Build directed acyclic graph (DAG) of story dependencies
- Identify root nodes (no dependencies)
- Calculate parallel-safe batches (stories with no shared dependencies)

**Example Dependency Input:**
```yaml
dependencies:
  "1-1-user-authentication":
    depends_on: []
    status: "ready"
    parallel_safe: true
    priority: 1

  "1-2-account-management":
    depends_on: ["1-1-user-authentication"]
    status: "blocked"
    parallel_safe: false
    priority: 2

  "1-3-plant-data-model":
    depends_on: []
    status: "ready"
    parallel_safe: true
    priority: 1
```

**Dependency Graph:**
```
Root Nodes (Parallel-Safe):
  - 1-1-user-authentication (priority: 1)
  - 1-3-plant-data-model (priority: 1)

Blocked Nodes:
  - 1-2-account-management (depends on: 1-1-user-authentication)
```

### 3. Parallel Execution Strategy

**Factors analyzed:**
- Story complexity (estimate from story file size, acceptance criteria count)
- Dependency chains (critical path analysis)
- Terminal capacity (operator-specified or default: 3)
- Priority levels (from dependency metadata)
- Current pass context (first-pass vs second-pass from execution-status.yaml)

**Strategy Output:**
```
Parallel Execution Strategy:
  Available Terminals: 3
  Parallelizable Stories: 2 (1-1, 1-3)
  Sequential Stories: 1 (1-2 waits for 1-1)

  Recommendation:
    - Assign 1-1 and 1-3 to separate terminals (parallel)
    - Queue 1-2 for terminal 1 after 1-1 completes
```

### 4. Terminal Batching & Assignment

**Generate terminal assignments with:**
- Story IDs grouped by terminal
- Execution order within each terminal
- Dependency notes and warnings
- Estimated complexity/duration (if available)

**Example Output:**
```markdown
## Terminal Assignment Plan

### Terminal 1 - Critical Path
Stories: 1-1-user-authentication → 1-2-account-management
Complexity: Medium → High
Dependencies: 1-2 waits for 1-1 completion
Priority: 1 → 2

### Terminal 2 - Independent Track
Stories: 1-3-plant-data-model
Complexity: Medium
Dependencies: None (parallel-safe)
Priority: 1

### Terminal 3 - Available
Status: Ready for next batch
Queue: Empty

### Execution Notes:
- Terminal 1 and 2 can start immediately (parallel)
- Terminal 1 story 1-2 blocks until 1-1 completes
- Monitor Terminal 1 completion to unblock queue
```

### 5. Complexity & Risk Analysis

**Analyze each story:**
- Acceptance criteria count (from story YAML)
- Estimated effort (if present in metadata)
- Cross-story dependencies (risk of integration conflicts)
- Component reuse patterns (from `.system/components/`)

**Risk Assessment:**
```
Risk Analysis:
  High Risk: 1-2-account-management (depends on 1-1, complex acceptance criteria)
  Medium Risk: 1-1-user-authentication (critical path, no dependencies)
  Low Risk: 1-3-plant-data-model (isolated, simple criteria)
```

---

## Usage Examples

### Example 1: Basic Sprint Analysis

**Operator Input:**
```
Analyze current sprint and suggest batching strategy
```

**Skill Output:**
```markdown
# Sprint Batch Analysis - 2025-11-15

## Sprint Status Summary
- Total Stories: 5
- Ready for Dev: 2 (1-1, 1-3)
- Drafted: 1 (1-2)
- In Progress: 1 (1-4)
- Done: 0
- Backlog: 1 (1-5)

## Dependency Analysis
Root Stories (No Dependencies):
  ✓ 1-1-user-authentication (ready-for-dev, priority: 1)
  ✓ 1-3-plant-data-model (ready-for-dev, priority: 1)

Blocked Stories:
  ⚠ 1-2-account-management (depends on: 1-1-user-authentication)

## Parallel Execution Strategy
Available for Immediate Parallel Execution:
  - 1-1-user-authentication (Terminal 1)
  - 1-3-plant-data-model (Terminal 2)

Queued for Sequential Execution:
  - 1-2-account-management (Terminal 1, after 1-1 completes)

## Terminal Assignments
See detailed assignments below...
```

### Example 2: Advanced Analysis with Constraints

**Operator Input:**
```
Analyze sprint for 4 terminals, prioritize stories with priority level 1, consider first-pass constraints
```

**Skill Output:**
```markdown
# Sprint Batch Analysis - First Pass Mode

## Configuration
- Terminals: 4
- Pass: first-pass (minimal markup, core functionality only)
- Priority Filter: Level 1 only

## Filtered Stories (Priority 1)
- 1-1-user-authentication (ready-for-dev)
- 1-3-plant-data-model (ready-for-dev)

## Terminal Assignments (4 Terminals)

### Terminal 1 - Auth Track
Stories: 1-1-user-authentication
Pass Guidance: First pass - core auth only, no UI polish
Dependencies: None
Estimated Duration: 2-3 hours

### Terminal 2 - Data Model Track
Stories: 1-3-plant-data-model
Pass Guidance: First pass - schema + basic CRUD, no validation
Dependencies: None
Estimated Duration: 2-3 hours

### Terminal 3 & 4 - Available
Status: Ready for next batch or priority 2 stories
Queue: Empty (no more priority 1 stories)

## First-Pass Reminders
- Focus on core functionality only
- Minimal error handling
- No UI polish or edge cases
- Quick validation, then move to second pass
```

### Example 3: Dependency Graph Visualization

**Operator Input:**
```
Show me the dependency graph for epic-1 stories
```

**Skill Output:**
```
Epic-1 Dependency Graph:

[1-1-user-authentication] ──┐
         (ready)            │
                            ├──> [1-2-account-management]
                            │           (blocked)
                            │
[1-3-plant-data-model] ─────┘
         (ready)

Parallel-Safe Pairs:
  ✓ 1-1 + 1-3 (no shared dependencies)

Critical Path:
  1-1 → 1-2 (longest chain: 2 stories)

Recommendation:
  Start 1-1 and 1-3 in parallel
  Queue 1-2 for execution after 1-1 completes
```

---

## Integration Points

### Reads:
- `docs/sprint-artifacts/sprint-status.yaml` - Sprint status from BMAD Scrum Master
- `.system/parallel-work/dependencies-template.yaml` - Story dependency graph
- `.system/execution-status.yaml` - Current pass and execution state
- `.bmad/bmm/config.yaml` - Project configuration (optional, for context)
- `docs/epics/*.md` - Epic files (optional, for story metadata)
- `docs/stories/*.md` - Story files (optional, for acceptance criteria analysis)

### Writes:
- Console output only (no file writes)
- Formatted analysis reports
- Terminal assignment plans
- Dependency visualizations

### Invokes:
- None (pure analysis skill, no agent invocation)

---

## Isolation Rules

### ORC-EXE Only
- This skill runs exclusively in the ORC-EXE isolation layer
- Does NOT emit events to BMAD event system
- Does NOT invoke BMAD agents directly
- Synchronous operation with direct console output

### Top-Down Flow Only
- Orchestrator → Sprint Batch Analyzer (allowed)
- Sprint Batch Analyzer → Orchestrator (return values only)
- Sprint Batch Analyzer → BMAD agents (NOT allowed)

### No Side Effects
- Read-only operations on sprint artifacts
- No modification of sprint-status.yaml
- No dependency graph updates
- No session tracking writes (analysis only)

### Integration with Terminal Prompt Generator
- Output designed to feed into `terminal-prompt-generator` skill
- Terminal assignments format compatible with prompt generation
- Batching strategy informs prompt context and guidance

---

## Error Handling

### Missing Files
```
⚠ Error: sprint-status.yaml not found at docs/sprint-artifacts/
  Suggestion: Run BMAD Scrum Master workflow (/sprint-planning) first
```

### Invalid YAML
```
⚠ Error: Failed to parse sprint-status.yaml (line 42: invalid syntax)
  Suggestion: Check YAML formatting or regenerate with /sprint-planning
```

### Circular Dependencies
```
⚠ Error: Circular dependency detected in dependency graph
  Chain: 1-2 → 1-3 → 1-2
  Suggestion: Review and update .system/parallel-work/dependencies-template.yaml
```

### No Parallelizable Stories
```
ℹ Info: No stories available for parallel execution
  Ready Stories: 0
  All Stories: 5 (3 in-progress, 2 backlog)
  Suggestion: Wait for current stories to complete or promote backlog stories
```

---

## Advanced Usage

### Custom Filtering
```
Analyze sprint for stories with tag: "frontend" and priority >= 2
```

### Capacity Planning
```
Given 6 available terminals and 12 ready stories, optimize batching for maximum throughput
```

### What-If Analysis
```
If story 1-1 completes in 2 hours, what stories become unblocked and how should I reassign terminals?
```

---

## Notes

- This skill is optimized for BMAD sprint artifacts format (sprint-status.yaml)
- Dependency analysis requires `.system/parallel-work/dependencies-template.yaml` to exist
- If no dependency file exists, assumes all ready-for-dev stories are parallel-safe
- Terminal assignments are suggestions only - operator has final discretion
- Complexity analysis is heuristic-based (acceptance criteria count, file size)
- Integration with `terminal-prompt-generator` skill for end-to-end orchestration workflow
