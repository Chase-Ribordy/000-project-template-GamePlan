# Agent System Overview

## Purpose

The Agent System enables **intelligent, automated task assignment** and **specialized execution** through a hierarchical multi-agent architecture. This system abstracts complexity from operators by automatically selecting optimal agents for each task, coordinating parallel work, and managing contract-based hand offs.

## Philosophy

**"Operators focus on ideas, agents handle execution."**

The agent system is designed to:
- Automatically assign tasks to specialized agents
- Minimize operator decision fatigue
- Maximize sprint velocity through intelligent parallelization
- Ensure quality through progressive validation
- Enable autonomous execution where safe, manual control where needed

## Architecture

### Three-Layer Agent Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│ STRATEGIC LAYER - Coordination & Planning               │
├─────────────────────────────────────────────────────────┤
│ orchestrator-exe      Top-level sprint coordination     │
│ resource-allocator    Capacity planning & load balance  │
└─────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────┐
│ TACTICAL LAYER - Execution Specialists                  │
├─────────────────────────────────────────────────────────┤
│ integration-manager    Component lifecycle & MCP coord  │
│ validation-controller  Progressive 4-level validation   │
│ development-executor   Story implementation wrapper     │
└─────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────┐
│ SUPPORT LAYER - Specialized Analysis & Generation       │
├─────────────────────────────────────────────────────────┤
│ contract-architect     Interface definition & contracts │
│ dependency-analyst     Dependency graphs & sequencing   │
│ testing-specialist     Test gen & sandbox validation    │
└─────────────────────────────────────────────────────────┘
```

### Agent Roles

**Strategic Agents**: High-level coordination, capacity planning, resource allocation
**Tactical Agents**: Execute specific workflows (integration, validation, development)
**Support Agents**: Provide specialized analysis, generation, or advisory services

## Key Components

### 1. Agent Capabilities Registry
**File**: `agent-capabilities.yaml`

Defines all agents with:
- Specializations and skills
- Task type mappings
- Execution modes
- Success criteria
- Escalation rules

This registry is the **source of truth** for agent capabilities.

### 2. Agent Definitions
**Location**: `strategic/`, `tactical/`, `support/`

Each agent has a comprehensive markdown definition:
- Agent identity and purpose
- Capabilities and responsibilities
- Decision-making logic
- Workflows and examples
- Success criteria and escalation rules

Agents are **personas** that Claude embodies when assigned a task.

### 3. Agent Selector Skill
**File**: `.claude/skills/orchestrator-exe/agent-selector.md`

The **brain** of automatic agent assignment:
- Multi-criteria decision matrix
- Scores agents based on task fit
- Returns optimal agent with confidence score
- Provides reasoning for selection

### 4. Agent State Tracking

**active-agents.yaml**: Real-time tracking of which agents are running in which terminals
**agent-assignments.yaml**: Historical log of all agent assignments with outcomes
**handoff-history.yaml**: Contract-based handoffs between agents

These files enable:
- Availability checking (don't double-assign)
- Performance metrics
- Assignment optimization over time

## How It Works

### Automatic Agent Assignment Flow

```
1. Operator invokes /orchestrator-exe
   ↓
2. Orchestrator identifies next task (story, integration, etc.)
   ↓
3. Orchestrator calls agent-selector skill with task context:
   - Task type (component-integration, story_implementation, etc.)
   - Complexity (1-5)
   - Current pass (first/second/third)
   - Dependencies and risk level
   ↓
4. Agent-selector scores all candidate agents:
   - Task type match (35% weight)
   - Complexity handling (25%)
   - Execution mode fit (20%)
   - Skill access (15%)
   - Availability (5%)
   - Pass awareness (5%)
   ↓
5. Agent-selector returns recommendation:
   - Selected agent (e.g., integration-manager)
   - Confidence score (0-1)
   - Execution mode (manual/autonomous)
   - Reasoning
   ↓
6. Orchestrator generates terminal prompt:
   - Terminal header with agent name
   - "Load Agent: Read .system/agents/[layer]/[agent-name].md"
   - Task description and context
   - Expected deliverables
   ↓
7. Operator copies prompt into terminal
   ↓
8. Claude reads agent persona and executes as that agent
   ↓
9. Agent completes task and reports back to orchestrator
   ↓
10. Orchestrator logs outcome and proceeds to next task
```

### Example Assignment

```yaml
Task: Integrate login-form component
Context:
  type: component-integration
  complexity: 3 (moderate)
  pass: second
  risk: medium

Agent Selection:
  candidates_scored:
    - integration-manager: 0.94 (selected)
    - development-executor: 0.54

  selected: integration-manager
  reasoning: "Component integration specialist, autonomous capable,
              perfect task type match, optimal for second pass UI work"

Terminal Prompt Generated:
  "TERMINAL 2: INTEGRATION-MANAGER
   Load Agent: Read and embody .system/agents/tactical/integration-manager.md
   Task: Integrate login-form component
   Mode: Autonomous
   [... context and deliverables ...]"

Execution:
  - Operator pastes prompt into terminal 2
  - Claude reads integration-manager.md persona
  - Executes integration autonomously
  - Reports completion to orchestrator
```

## Agent Execution Modes

### Manual
- Operator drives all decisions
- Agent assists and recommends
- High control, lower speed
- **Use for**: Foundation work, high risk, novel patterns

### Supervised
- Agent executes with checkpoints
- Operator approves at key decision points
- Balanced control and speed
- **Use for**: Moderate complexity, first-time workflows

### Autonomous
- Agent executes fully, escalates on failure
- Operator reviews results after completion
- Low control, high speed
- **Use for**: Clear requirements, proven patterns, second/third pass work

### Fully Autonomous
- Agent executes end-to-end, no operator interaction
- Auto-approves if success criteria met
- Minimal control, maximum speed
- **Use for**: Simple, repetitive tasks (validation, testing)

### Advisory
- Agent returns analysis/recommendations only
- No execution
- **Use for**: Planning, dependency analysis, capacity planning

## Integration with BMAD

The agent system **extends** BMAD, not replaces it:

**BMAD Agents** (existing):
- Workflow-based (PM, Architect, Dev, SM, TEA, etc.)
- Invoked via slash commands (/dev-story, /prd, etc.)
- Remain in `.claude/commands/bmad/`

**Specialized Agents** (new):
- Task-based (Integration Manager, Validation Controller, etc.)
- Assigned via agent-selector
- Located in `.system/agents/`

**Development-Executor Agent**: Wraps BMAD dev workflows, providing unified interface for orchestrator

## Contract-Based Handoffs

Agents coordinate via **contracts** (YAML specifications):

```yaml
handoff:
  from_agent: contract-architect
  to_agent: validation-controller

  task: validate_component

  inputs:
    component: login-form
    contract: .system/contracts/login-form-contract.yaml

  outputs_required:
    validation_report: .system/validation/login-form-validation.yaml
    status: [passed/failed]

  acceptance_criteria:
    - All 4 validation levels passed
    - Component in .system/proven/
```

Contracts ensure:
- Clear handoff boundaries
- Validated inputs/outputs
- Traceable workflows
- Autonomous chains (event-driven)

## Directory Structure

```
.system/agents/
├── README.md (this file)
├── AGENT-SELECTION-GUIDE.md (how to use agent selector)
│
├── agent-capabilities.yaml (registry)
├── active-agents.yaml (real-time state)
├── agent-assignments.yaml (historical log)
├── handoff-history.yaml (handoff tracking)
│
├── strategic/
│   ├── orchestrator-exe.md
│   └── resource-allocator.md
│
├── tactical/
│   ├── integration-manager.md
│   ├── validation-controller.md
│   └── development-executor.md
│
└── support/
    ├── contract-architect.md
    ├── dependency-analyst.md
    └── testing-specialist.md
```

## Getting Started

### For Operators

**1. Invoke Orchestrator:**
```
/orchestrator-exe
```

**2. Orchestrator automatically:**
- Loads agent capabilities
- Analyzes ready tasks
- Recommends agents
- Generates terminal prompts

**3. Copy-paste prompts into terminals:**
```
TERMINAL 1: INTEGRATION-MANAGER
Load Agent: Read and embody .system/agents/tactical/integration-manager.md
Task: [task description]
```

**4. Let agents execute:**
- Manual mode: Approve at checkpoints
- Autonomous mode: Review after completion

### For Agent Development

**To create a new agent:**
1. Define capabilities in `agent-capabilities.yaml`
2. Create agent persona markdown in appropriate layer folder
3. Add task type mapping
4. Test via orchestrator assignment

**Agent Persona Template:**
```markdown
# [Agent Name] Agent

## Agent Identity
You are the **[Agent Name]**, a [layer] [role]...

## Core Purpose
[What this agent does]

## Agent Capabilities
[Skills and responsibilities]

## Workflow
[Execution process]

## Success Criteria
[How success is measured]

## Escalation Rules
[When to escalate to orchestrator]
```

## Performance Metrics

The system tracks:
- Agent utilization (assignments per agent)
- Assignment confidence scores
- Success rates by agent
- Execution mode distribution
- Average task duration by agent
- Escalation frequency

**View metrics**: Check `agent-assignments.yaml` statistics section

## Best Practices

### Operator Guidelines
1. Trust agent recommendations (>70% confidence)
2. Override when you have specific context agent doesn't
3. Use manual mode for unfamiliar tasks
4. Review autonomous execution outcomes periodically
5. Report agent performance issues to improve system

### Agent Design Principles
1. Single responsibility per agent
2. Clear success criteria
3. Graceful failure handling
4. Autonomous where safe, manual where necessary
5. Comprehensive logging and reporting

### System Maintenance
1. Review agent-assignments.yaml weekly for patterns
2. Update agent-capabilities.yaml based on outcomes
3. Refine task type mappings as needed
4. Archive historical data after sprint completion
5. Monitor for agent overutilization or underutilization

## Troubleshooting

### Agent Assignment Issues

**Low confidence scores (<50%):**
- Task may not match any agent specialization
- Consider breaking down task or using BMAD workflow directly

**Agent unavailable:**
- Check active-agents.yaml
- Consider queueing task or adding terminals

**Execution mode mismatch:**
- High-risk task assigned autonomous mode
- Override via orchestrator or decision-support skill

### Handoff Failures

**Broken handoff chain:**
- Check handoff-history.yaml for failure point
- Review acceptance criteria
- Escalate to orchestrator

**Circular dependencies:**
- Review dependency-analyst output
- Fix story dependencies in sprint-status.yaml

## References

- **Agent Capabilities**: `agent-capabilities.yaml`
- **Selection Guide**: `AGENT-SELECTION-GUIDE.md`
- **Orchestrator Persona**: `strategic/orchestrator-exe.md`
- **Agent Selector Skill**: `.claude/skills/orchestrator-exe/agent-selector.md`

## Notes

- Agent system is **opt-in** via orchestrator-exe
- BMAD workflows continue to work independently
- Agents can invoke BMAD workflows (e.g., development-executor wraps /dev-story)
- System designed for **evolution** - add agents as needed
- Performance improves over time as assignment history grows

---

**Version**: 1.0.0
**Last Updated**: 2025-11-15
**Status**: Production Ready
