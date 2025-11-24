# Coordinate Agents Skill

**Isolation Level**: ORC-EXE only
**Invocation**: Direct (not event-driven)
**Purpose**: Delegate work to sub-agents through Task() spawning

## Overview

This skill enables ORC-EXE to coordinate sub-agents (Dev, SM, Architect, etc.) through Task() spawning rather than event-driven communication. It manages the handoff of work items, tracks agent assignments, and maintains coordination history.

## Invocation Pattern

```
orc-exe → coordinate-agents.md → Task() sub-agent
```

Sub-agents are spawned via Claude Code's Task tool and communicate results via contract files.

## Capabilities

### 1. Agent Delegation
- **Select Agent**: Choose appropriate agent based on task type
- **Prepare Context**: Package story, phase, and execution context for agent
- **Spawn**: Create sub-agent via Task() with clear instructions
- **Monitor**: Track completion via contract files

### 2. Agent Communication
- **Contract Files**: Agents write status to `.system/contracts/`
- **Progress Updates**: Read contracts to monitor progress
- **Dependency Alerts**: Include dependency info in agent prompts

### 3. Coordination Tracking
- **Log Handoffs**: Record agent assignments in `.system/parallel-work/coordination-log.yaml`
- **Track Progress**: Monitor agent work via contracts
- **Capture Results**: Store agent outputs and decisions

## Task-to-Agent Mapping

```yaml
task_types:
  story_development:
    agent: dev-first-pass
    persona: .system/agents/dev-first-pass.md
    context: [story_file, epic_context, architecture]

  component_polish:
    agent: dev-second-pass
    persona: .system/agents/dev-second-pass.md
    context: [component_contracts, first_pass_code]

  bug_fixing:
    agent: dev-third-pass
    persona: .system/agents/dev-third-pass.md
    context: [bug_list, component_code]

  story_creation:
    agent: sm
    persona: .system/agents/sm.md
    context: [prd, architecture]

  sprint_updates:
    agent: sm
    persona: .system/agents/sm.md
    context: [sprint_status, story_id]

  architecture_review:
    agent: architect
    persona: .system/agents/architect.md
    context: [tech_decisions, constraints]
```

## Usage Example

```
Operator: *start (First Pass)
ORC-EXE: [Loads coordinate-agents.md skill]

Skill Process:
1. Read stories from docs/stories/
2. Load parallel-boundaries.yaml for chunk info
3. Identify parallelizable stories in current chunk
4. For each story, spawn Task():
   Task({
     description: "Story 1-1: User Auth",
     subagent_type: "general-purpose",
     prompt: "[dev-first-pass persona + story context]"
   })
5. Monitor contracts for completion
6. Report progress to operator

Result: Stories implemented in parallel, contracts track completion
```

## Coordination Log Format

```yaml
coordinations:
  - timestamp: "2025-11-15T10:30:00Z"
    session_id: "task-001"
    agent: "dev-first-pass"
    story: "1-2-user-authentication"
    phase: "first-pass"
    status: "completed"
    contract: ".system/contracts/story-1-2-completion.yaml"
    outcome: "Story implemented, tests passing"

  - timestamp: "2025-11-15T11:15:00Z"
    session_id: "task-002"
    agent: "dev-first-pass"
    story: "1-3-plant-data-model"
    phase: "first-pass"
    status: "in_progress"
    contract: ".system/contracts/story-1-3-completion.yaml"
```

## Isolation Rules

1. **Direct Invocation Only**: Only orc-exe can call this skill
2. **No External Events**: Uses contract files, not event systems
3. **Task-Based**: Spawns sub-agents via Task() tool
4. **Top-Down Flow**: orc-exe → skill → Task() agent (never reversed)

## Agent Assignment Workflow

### Standard Workflow:
1. Identify task type (story development, sprint update, etc.)
2. Select appropriate agent from task mapping
3. Load agent persona from `.system/agents/[agent-name].md`
4. Spawn via Task() with persona + context
5. Monitor contract file for completion
6. Log coordination in coordination-log.yaml

### Parallel Execution:
1. Load parallel-boundaries.yaml
2. Identify independent stories in current chunk
3. Spawn multiple Task() calls in single message (parallel)
4. Monitor all contracts for completion
5. Proceed when chunk complete

### Example: Story Development Assignment
```
ORC-EXE identifies task: "Implement story 1-1-user-auth"

Step 1: Select agent
  Agent: dev-first-pass
  Persona: .system/agents/dev-first-pass.md

Step 2: Gather context
  Story: docs/stories/1-1-user-auth.md
  Architecture: docs/finalized-plan/architecture.md
  Chunk: chunk-01 (from parallel-boundaries.yaml)

Step 3: Spawn Task()
  Task({
    description: "Story 1-1: User Authentication",
    subagent_type: "general-purpose",
    prompt: "[dev-first-pass persona]\n[story context]\n[instructions]"
  })

Step 4: Monitor contract
  Watch: .system/contracts/story-1-1-completion.yaml

Step 5: Log assignment
  Update: .system/parallel-work/coordination-log.yaml
```

## Integration Points

**Reads**:
- `docs/sprint-artifacts/sprint-status.yaml` (story queue)
- `docs/sprint-artifacts/parallel-boundaries.yaml` (chunk definitions)
- `.system/execution-status.yaml` (current phase)
- `.system/agents/*.md` (agent personas)
- `.system/contracts/*.yaml` (completion status)

**Writes**:
- `.system/parallel-work/coordination-log.yaml` (delegation history)
- `.system/contracts/*.yaml` (via spawned agents)

**Spawns**:
- dev-first-pass agents via Task()
- dev-second-pass agents via Task()
- dev-third-pass agents via Task()
- sm agent via Task()
- architect agent via Task()
