# Coordinate Agents Skill

**Isolation Level**: ORC-EXE only
**Invocation**: Direct (not event-driven)
**Purpose**: Delegate work to BMAD agents through top-down coordination

## Overview

This skill enables the ORC-EXE to coordinate BMAD agents (Dev, SM, Architect, etc.) through direct delegation rather than event-driven communication. It manages the handoff of work items, tracks agent assignments, and maintains coordination history.

## Invocation Pattern

```
orc-exe → coordinate-agents.md → BMAD agent
```

Unlike autonomous BMAD skills that emit/listen to events, this skill is directly invoked by orc-exe and operates synchronously.

## Capabilities

### 1. Agent Delegation
- **Select Agent**: Choose appropriate BMAD agent based on task type
- **Prepare Context**: Package story, phase, and execution context for agent
- **Handoff**: Transfer control to selected agent with clear instructions
- **Return**: Receive results and update coordination log

### 2. Agent Communication
- **Status Queries**: Request status updates from agents
- **Priority Updates**: Communicate priority changes to agents
- **Dependency Alerts**: Notify agents of blocking dependencies

### 3. Coordination Tracking
- **Log Handoffs**: Record agent assignments in `.system/parallel-work/coordination-log.yaml`
- **Track Progress**: Monitor agent work progress
- **Capture Results**: Store agent outputs and decisions

## Task-to-Agent Mapping

### BMAD Workflow Agents (Existing)

```yaml
task_types:
  story_development:
    agent: dev
    command: /dev-story
    context: [story_file, epic_context, tech_spec]

  component-integration:
    agent: dev
    command: /integrate
    context: [component_contracts, design_system]

  sprint_updates:
    agent: sm
    command: /story-done, /story-ready
    context: [sprint_status, story_id]

  architecture_review:
    agent: architect
    command: /architecture
    context: [tech_decisions, constraints]
```

### Specialized Agents (New - via agent-selector)

For specialized agents, use the **agent-selector** skill to automatically determine optimal agent assignment:

```yaml
specialized_task_types:
  component_lifecycle:
    determination: agent-selector
    candidates: [integration-manager, validation-controller, contract-architect]
    load_from: .system/agents/[layer]/[agent-name].md

  story_execution:
    determination: agent-selector
    candidates: [development-executor, dev (BMAD)]
    load_from: .system/agents/tactical/development-executor.md

  dependency_analysis:
    determination: agent-selector
    candidates: [dependency-analyst]
    load_from: .system/agents/support/dependency-analyst.md

  testing:
    determination: agent-selector
    candidates: [testing-specialist, tea (BMAD)]
    load_from: .system/agents/support/testing-specialist.md
```

**Note**: When coordinating specialized agents, first call agent-selector skill to get recommendation, then load agent persona from `.system/agents/` and execute task.

## Usage Example

```
Operator: *coordinate dev
ORC-EXE: [Loads coordinate-agents.md skill]

Skill Process:
1. Read current story from sprint-status.yaml
2. Gather story context (epic, tech-spec, dependencies)
3. Determine current phase (1st/2nd/3rd pass)
4. Package handoff context
5. Invoke BMAD dev agent with /dev-story
6. Log coordination in coordination-log.yaml
7. Return control to orc-exe when agent completes

Result: Story implemented, orc-exe suggests next action
```

## Coordination Log Format

```yaml
coordinations:
  - timestamp: "2025-11-15T10:30:00Z"
    session_id: "terminal-1"
    agent: "dev"
    command: "/dev-story"
    story: "1-2-user-authentication"
    phase: "first-pass"
    status: "completed"
    outcome: "Story implemented, tests passing"

  - timestamp: "2025-11-15T11:15:00Z"
    session_id: "terminal-2"
    agent: "sm"
    command: "/story-done"
    story: "1-2-user-authentication"
    status: "completed"
    outcome: "Sprint status updated: story marked DONE"
```

## Isolation Rules

1. **Direct Invocation Only**: Only orc-exe can call this skill
2. **No Event Emission**: Does not emit events to BMAD event system
3. **Synchronous Operation**: Waits for agent completion before returning
4. **Top-Down Flow**: orc-exe → skill → agent (never reversed)

## Agent Assignment Workflow (Enhanced)

### For BMAD Agents (Workflow-Based):
1. Identify task type (story development, sprint update, etc.)
2. Select appropriate BMAD agent from task mapping
3. Invoke via slash command (e.g., /dev-story)
4. Log coordination in coordination-log.yaml

### For Specialized Agents (Intelligent Selection):
1. Identify task type and context
2. **Call agent-selector skill** with task characteristics:
   - Task type (component-integration, validation, etc.)
   - Complexity level (1-5)
   - Current pass (first/second/third)
   - Dependencies and risk level
3. **Receive agent recommendation**:
   - Selected agent (e.g., integration-manager)
   - Confidence score
   - Execution mode (manual/autonomous)
   - Reasoning for selection
4. **Load agent persona**: Read `.system/agents/[layer]/[agent-name].md`
5. **Execute task** as the selected agent
6. **Log assignment**: Update `.system/agents/active-agents.yaml` and `agent-assignments.yaml`
7. **Track completion**: Return to orc-exe and update coordination-log.yaml

### Example: Component Integration Assignment
```
ORC-EXE identifies task: "Integrate login-form component"

Step 1: Call agent-selector skill
  Input: {
    task_type: "component-integration",
    component: "login-form",
    complexity: 3,
    pass: "second",
    risk: "medium"
  }

Step 2: Receive recommendation
  Output: {
    selected_agent: "integration-manager",
    confidence: 0.94,
    mode: "autonomous",
    reasoning: "Component integration specialist, autonomous capable"
  }

Step 3: Load agent persona
  Read: .system/agents/tactical/integration-manager.md

Step 4: Execute task
  As integration-manager: Integrate login-form component

Step 5: Log assignment
  Update: .system/agents/active-agents.yaml
  Update: .system/agents/agent-assignments.yaml

Step 6: Return to orchestrator
  Report completion and update coordination-log.yaml
```

## Integration Points

**Reads**:
- `docs/sprint-artifacts/sprint-status.yaml` (story queue)
- `.system/execution-status.yaml` (current phase)
- `.system/parallel-work/active-sessions.yaml` (session context)
- `.system/agents/agent-capabilities.yaml` (specialized agents)
- `.system/agents/active-agents.yaml` (agent availability)

**Writes**:
- `.system/parallel-work/coordination-log.yaml` (delegation history)
- `.system/agents/active-agents.yaml` (agent assignments)
- `.system/agents/agent-assignments.yaml` (assignment decisions)
- `.system/agents/handoff-history.yaml` (contract-based handoffs)

**Invokes**:
- BMAD agents via slash commands (/dev-story, /story-done, etc.)
- Specialized agents via persona loading (Read .system/agents/[layer]/[agent-name].md)
- Agent-selector skill for intelligent assignment
