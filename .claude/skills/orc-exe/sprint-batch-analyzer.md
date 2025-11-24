# Sprint Batch Analyzer

**Isolation Level**: ORC-EXE only
**Invocation**: Direct (not event-driven)
**Purpose**: Parse sprint status, identify parallelizable stories, build dependency graphs, and suggest parallel execution strategies

---

## Overview

The Sprint Batch Analyzer skill enables ORC-EXE to analyze sprint status and intelligently batch stories for parallel execution via Task() spawning. It parses YAML sprint artifacts, analyzes story dependencies, identifies parallel-safe work units, and outputs actionable execution strategies.

This skill is critical for maximizing throughput by orchestrating concurrent story development while respecting dependencies and complexity constraints.

---

## Invocation Pattern

**Direct Call (Operator-initiated):**
```
Analyze the current sprint status and suggest parallel batching strategy
```

**Context-aware Call:**
```
Review sprint-status.yaml and tell me which stories can run in parallel
```

**Advanced Call:**
```
Parse sprint status, build dependency graph, and create Task() assignments for stories in ready status
```

---

## Capabilities

### 1. Sprint Status Parsing

**Read and parse:**
- `docs/sprint-artifacts/sprint-status.yaml` (SM agent output)
- Extract story status information
- Identify stories by status: `pending`, `in_progress`, `completed`, `blocked`
- Filter for actionable stories (`pending`)

**Example Input:**
```yaml
stories:
  - id: "1-1"
    title: "User Authentication"
    status: "pending"
    pass: "first"
  - id: "1-2"
    title: "Account Management"
    status: "pending"
    dependencies: ["1-1"]
  - id: "1-3"
    title: "Plant Data Model"
    status: "pending"
```

**Parsed Output:**
```
Actionable Stories:
  Ready (no deps): 1-1-user-authentication, 1-3-plant-data-model
  Blocked: 1-2-account-management (depends on 1-1)
```

### 2. Dependency Graph Analysis

**Read and analyze:**
- `docs/sprint-artifacts/parallel-boundaries.yaml`
- Build directed acyclic graph (DAG) of story dependencies
- Identify root nodes (no dependencies)
- Calculate parallel-safe batches (stories with no shared dependencies)

**Example Dependency Input:**
```yaml
chunks:
  - id: "chunk-01"
    name: "Authentication"
    stories:
      - id: "1-1"
        can_parallel: true
      - id: "1-2"
        depends_on: ["1-1"]
```

**Dependency Graph:**
```
Root Nodes (Parallel-Safe):
  - 1-1-user-authentication
  - 1-3-plant-data-model

Blocked Nodes:
  - 1-2-account-management (depends on: 1-1)
```

### 3. Parallel Execution Strategy

**Factors analyzed:**
- Story complexity (from story metadata)
- Dependency chains (critical path analysis)
- Chunk boundaries (from parallel-boundaries.yaml)
- Current pass context (first/second/third from execution-status.yaml)

**Strategy Output:**
```
Parallel Execution Strategy:
  Parallelizable Stories: 2 (1-1, 1-3)
  Sequential Stories: 1 (1-2 waits for 1-1)

  Recommendation:
    - Spawn Task() for 1-1 and 1-3 in parallel
    - Queue 1-2 for execution after 1-1 completes
```

### 4. Task() Assignment Generation

**Generate Task() assignments with:**
- Story IDs and context
- Agent persona to load
- Dependency notes and warnings
- Contract file to write on completion

**Example Output:**
```markdown
## Task() Assignment Plan

### Parallel Batch 1 (spawn together)
Task({
  description: "Story 1-1: User Authentication",
  subagent_type: "general-purpose",
  prompt: "[dev-first-pass persona + story context]"
})

Task({
  description: "Story 1-3: Plant Data Model",
  subagent_type: "general-purpose",
  prompt: "[dev-first-pass persona + story context]"
})

### Sequential (after 1-1 completes)
Task({
  description: "Story 1-2: Account Management",
  subagent_type: "general-purpose",
  prompt: "[dev-first-pass persona + story context]"
})

### Execution Notes:
- Batch 1 can start immediately (parallel Task() calls)
- Story 1-2 waits for contract: .system/contracts/story-1-1-completion.yaml
```

### 5. Complexity & Risk Analysis

**Analyze each story:**
- Acceptance criteria count (from story file)
- Estimated effort (if present in metadata)
- Cross-story dependencies (risk of integration conflicts)

**Risk Assessment:**
```
Risk Analysis:
  High Risk: 1-2-account-management (depends on 1-1, complex)
  Medium Risk: 1-1-user-authentication (critical path)
  Low Risk: 1-3-plant-data-model (isolated, simple)
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
# Sprint Batch Analysis

## Sprint Status Summary
- Total Stories: 5
- Ready: 2 (1-1, 1-3)
- Blocked: 1 (1-2)
- In Progress: 1 (1-4)
- Completed: 0

## Dependency Analysis
Root Stories (No Dependencies):
  ✓ 1-1-user-authentication (ready, chunk-01)
  ✓ 1-3-plant-data-model (ready, chunk-01)

Blocked Stories:
  ⚠ 1-2-account-management (depends on: 1-1)

## Parallel Execution Strategy
Spawn in parallel via Task():
  - 1-1-user-authentication
  - 1-3-plant-data-model

Queue for sequential:
  - 1-2-account-management (after 1-1)
```

### Example 2: Dependency Graph Visualization

**Operator Input:**
```
Show me the dependency graph for chunk-01 stories
```

**Skill Output:**
```
Chunk-01 Dependency Graph:

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
  Spawn 1-1 and 1-3 via parallel Task() calls
  Queue 1-2 for execution after 1-1 contract complete
```

---

## Integration Points

### Reads:
- `docs/sprint-artifacts/sprint-status.yaml` - Sprint status from SM agent
- `docs/sprint-artifacts/parallel-boundaries.yaml` - Story dependency graph
- `.system/execution-status.yaml` - Current pass and execution state
- `docs/stories/*.md` - Story files (for acceptance criteria analysis)

### Writes:
- Console output only (no file writes)
- Formatted analysis reports
- Task() assignment plans
- Dependency visualizations

### Invokes:
- None (pure analysis skill, no agent invocation)

---

## Isolation Rules

### ORC-EXE Only
- This skill runs exclusively in the ORC-EXE isolation layer
- Synchronous operation with direct console output
- Read-only analysis

### Top-Down Flow Only
- Orchestrator → Sprint Batch Analyzer (allowed)
- Sprint Batch Analyzer → Orchestrator (return values only)

### No Side Effects
- Read-only operations on sprint artifacts
- No modification of sprint-status.yaml
- No dependency graph updates
- Analysis only

---

## Error Handling

### Missing Files
```
⚠ Error: sprint-status.yaml not found at docs/sprint-artifacts/
  Suggestion: Run /orc-exe to trigger SM agent story generation first
```

### Invalid YAML
```
⚠ Error: Failed to parse sprint-status.yaml (line 42: invalid syntax)
  Suggestion: Check YAML formatting or regenerate with SM agent
```

### Circular Dependencies
```
⚠ Error: Circular dependency detected in dependency graph
  Chain: 1-2 → 1-3 → 1-2
  Suggestion: Review and update parallel-boundaries.yaml
```

### No Parallelizable Stories
```
ℹ Info: No stories available for parallel execution
  Ready Stories: 0
  All Stories: 5 (3 in-progress, 2 completed)
  Suggestion: Wait for current stories to complete
```

---

## Notes

- Dependency analysis requires `docs/sprint-artifacts/parallel-boundaries.yaml` to exist
- If no parallel-boundaries file exists, assumes all ready stories are parallel-safe
- Task() assignments are suggestions - orc-exe executes them
- Complexity analysis is heuristic-based (acceptance criteria count)
