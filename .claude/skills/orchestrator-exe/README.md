# Orchestrator-EXE Skills

**Isolation Level**: Orchestrator-EXE Agent Only
**Architecture**: Direct Invocation (Non-Event-Driven)

## Overview

This directory contains skills exclusively for the Orchestrator-EXE agent. Unlike the autonomous, event-driven skills in `.claude/skills/`, these skills operate through **direct invocation** and are **isolated** from the BMAD event system.

## Isolation Mechanism

### Key Differences from BMAD Skills

| Aspect | BMAD Skills (.claude/skills/) | Orchestrator-EXE Skills |
|--------|-------------------------------|-------------------------|
| **Invocation** | Event-driven (autonomous) | Direct calling (manual) |
| **Communication** | Event emission/listening | Synchronous return values |
| **Access** | Any agent/workflow | Orchestrator-EXE only |
| **Autonomy** | Fully autonomous | Controlled by orchestrator |
| **Coordination** | Horizontal (peer-to-peer) | Top-down (hierarchical) |

### Why Isolation?

The Orchestrator-EXE operates as a **top-level coordinator** that:
1. **Manages other agents** (not managed by them)
2. **Coordinates directly with the operator** (not with other agents as peers)
3. **Makes strategic decisions** (not tactical, reactive responses to events)

This requires a different skill architecture:
- **Direct control** over skill execution
- **Synchronous operation** for immediate feedback
- **No event interference** from autonomous BMAD system
- **Operator-centric** decision flow

## Skills Included

### 1. `coordinate-agents.md`
**Purpose**: Direct agent delegation and communication

**What it does**:
- Selects appropriate BMAD agent for a task
- Packages story/context for agent handoff
- Manages agent lifecycle (invoke → monitor → complete)
- Logs coordination history

**When to use**:
- Operator uses `*coordinate [agent-name]`
- Orchestrator needs to delegate story work
- Multi-agent coordination required

### 2. `track-parallel-work.md`
**Purpose**: Parallel session monitoring and synchronization

**What it does**:
- Registers terminal sessions (intra-story and inter-story parallelism)
- Syncs status across multiple sessions
- Detects conflicts and dependency violations
- Manages merge points

**When to use**:
- Operator uses `*track-session` to register new terminal
- Operator uses `*sync-sessions` to check parallel work status
- Multiple terminals working simultaneously

### 3. `decision-support.md`
**Purpose**: Manual vs autonomous execution recommendations

**What it does**:
- Analyzes action complexity and risk
- Considers context (phase, parallel work, operator skill)
- Recommends execution mode (manual/autonomous/hybrid)
- Provides rationale and alternatives
- Integrates with pass-awareness-advisor.md for context-aware decisions

**When to use**:
- Operator uses `*decide [action]` for guidance
- Orchestrator evaluating whether to require approval
- Uncertain about execution mode for complex action

### 4. `sprint-batch-analyzer.md`
**Purpose**: Sprint status parsing and parallel batching strategy

**What it does**:
- Parses sprint-status.yaml to identify story batches
- Determines optimal parallel execution strategy
- Identifies dependencies and sequencing constraints
- Recommends batch sizes for parallel terminals

**When to use**:
- Planning parallel story execution
- Determining which stories can run simultaneously
- Optimizing throughput for multiple terminals

### 5. `terminal-prompt-generator.md`
**Purpose**: Generate copy-paste ready prompts for parallel execution

**What it does**:
- Creates ready-to-run prompts for each terminal
- Includes story context and pass-awareness
- Formats for easy copy-paste workflow
- Provides terminal-specific instructions

**When to use**:
- Setting up multiple parallel terminals
- Need quick prompts for story execution
- Streamlining parallel workflow setup

### 6. `pass-awareness-advisor.md`
**Purpose**: Context-aware advisory guidance based on development pass phase

**What it does**:
- Detects current pass (first/second/third)
- Provides pass-specific advisory messages and nudges
- Identifies natural checkpoints and transition points
- Recommends phase-appropriate approaches
- Complements decision-support.md with contextual guidance

**When to use**:
- Planning story batches to understand phase context
- Checking if checkpoints/transitions are recommended
- Getting phase-appropriate guidance (foundation vs UX vs polish)
- Understanding where you are in the development lifecycle

### 7. `contract-orchestrator.md`
**Purpose**: Generate YAML contracts for autonomous flow validation

**What it does**:
- Parses markdown component contracts from .system/contracts/
- Generates machine-readable YAML contract representations
- Extracts inputs/outputs, CSS rules, dependencies into structured format
- Creates MCP-compatible metadata for contract validation system
- Supports batch processing of multiple components
- Generates companion markdown for human context when needed

**When to use**:
- Preparing components for second-pass autonomous integration
- Need YAML contracts for MCP validation workflow
- Batch processing multiple component contracts
- Automating contract compliance checking

### 8. `parallel-coordinator.md`
**Purpose**: Advanced session coordination with real-time conflict detection

**What it does**:
- Monitors active parallel terminal sessions in real-time
- Detects file conflicts before they occur (proactive conflict prevention)
- Enforces story and component dependency constraints
- Provides intelligent next-action recommendations for idle terminals
- Tracks session lifecycle from initialization to closure
- Generates session performance reports and coordination logs

**When to use**:
- Managing multiple parallel terminals executing stories
- Need conflict detection across concurrent work streams
- Want suggestions for optimal terminal assignments
- Tracking session progress and identifying merge points
- Enforcing dependency rules during parallel execution

### 9. `parallel-status.md`
**Purpose**: Display comprehensive parallel execution status across all active sessions

**What it does**:
- Auto-detects most recent session files (inter-story and intra-story modes)
- Displays pass awareness context with phase-appropriate guidance
- Shows active work, completed tasks, and idle terminals in formatted tables
- Detects and reports file conflicts with risk levels and recommendations
- Identifies blocked stories due to dependencies
- Suggests next actions based on current parallel work state
- Provides clean, scannable terminal output with visual indicators

**When to use**:
- Operator uses `*parallel-status` to view parallel execution status
- Need quick overview of all active terminals and their current work
- Want to see file conflicts and dependency blockers at a glance
- Looking for next action suggestions for idle terminals
- Monitoring progress across multiple concurrent story executions

## Invocation Pattern

### Event-Driven Skills (BMAD)
```
Event Emitted → Trigger Matrix → Skill Auto-Activates → Emits New Events
```
**Example**: Story completion triggers component extraction automatically

### Direct-Invocation Skills (Orchestrator-EXE)
```
Orchestrator Command → Load Skill → Execute Synchronously → Return Result
```
**Example**: `*coordinate dev` loads coordinate-agents.md, delegates to dev agent, returns completion status

## Usage Example

```
# Operator activates orchestrator-exe
/orchestrator-exe

# Orchestrator loads and displays menu
Orchestrator-EXE> Current phase: First Pass (Backend-First)
Orchestrator-EXE> Active sessions: 0
Orchestrator-EXE> Next story: 1-2-user-authentication

# Operator wants to coordinate dev agent
Operator> *coordinate dev

# Orchestrator directly invokes coordinate-agents.md skill
Orchestrator-EXE> [Loading coordinate-agents.md]
Orchestrator-EXE> Delegating story 1-2 to dev agent...
Orchestrator-EXE> Context: first-pass, epic-1, auth-tech-spec
Orchestrator-EXE> Invoking: /dev-story

# Dev agent executes (BMAD workflow)
Dev Agent> Implementing story 1-2...
[Story implementation proceeds...]
Dev Agent> Story complete, tests passing

# Control returns to orchestrator-exe
Orchestrator-EXE> Coordination complete
Orchestrator-EXE> Logged in: .system/parallel-work/coordination-log.yaml
Orchestrator-EXE> Suggested next action: Mark story done (*coordinate sm)
```

## File Structure

```
.claude/skills/orchestrator-exe/
├── README.md                    # This file
├── coordinate-agents.md         # Agent delegation skill
├── track-parallel-work.md       # Parallel session tracking skill
├── decision-support.md          # Manual/autonomous recommendations
├── sprint-batch-analyzer.md     # Sprint parsing and batch strategy
├── terminal-prompt-generator.md # Copy-paste ready terminal prompts
├── pass-awareness-advisor.md    # Pass-aware advisory guidance
├── contract-orchestrator.md     # YAML contract generation for autonomous flow
├── parallel-coordinator.md      # Advanced session coordination and conflict detection
└── parallel-status.md           # Comprehensive parallel execution status display
```

## Integration with BMAD

While isolated from the event system, orchestrator-exe skills **do** interact with BMAD:

### Reading BMAD State
- `sprint-status.yaml` (created by BMAD sprint-planning)
- `execution-status.yaml` (THREE-PASS system)
- BMAD workflows (invoked via agent coordination)

### Writing to Shared State
- `.system/parallel-work/` (orchestrator-exe domain)
- Coordination logs (for auditing)

### Coordinating BMAD Agents
- Invokes dev agent via `/dev-story`
- Invokes SM agent via `/story-done`, `/story-ready`
- Does NOT interfere with autonomous BMAD skills

## Isolation Rules

**MUST**:
1. Only be invoked by orchestrator-exe agent
2. Operate synchronously (no event emission)
3. Return results directly to orchestrator
4. Respect BMAD state (read-only for most BMAD files)

**MUST NOT**:
1. Emit events to BMAD event system
2. Be invoked by other agents or workflows
3. Modify BMAD framework files (`.bmad/`)
4. Interfere with autonomous BMAD skills

## Adding New Skills

To add a new orchestrator-exe skill:

1. **Create skill file** in this directory: `new-skill.md`
2. **Follow isolation pattern**:
   ```markdown
   # New Skill Name

   **Isolation Level**: Orchestrator-EXE only
   **Invocation**: Direct (not event-driven)
   **Purpose**: Brief description

   ## Overview
   [Skill description]

   ## Invocation Pattern
   orchestrator-exe → new-skill.md → [result]

   ## Isolation Rules
   [Specify isolation requirements]
   ```
3. **Register in agent menu**: Add to `.claude/agents/orchestrator-exe.md`
4. **Document integration points**: What it reads/writes
5. **Update this README**: Add to skills list

## Troubleshooting

### Issue: Skill invoked by non-orchestrator agent
**Symptom**: Skill execution outside orchestrator context
**Fix**: Verify agent ID before skill execution; skills should check caller

### Issue: Skill emitting events
**Symptom**: Unintended autonomous skill triggers
**Fix**: Remove event emission; skills must return values directly

### Issue: BMAD state conflicts
**Symptom**: Orchestrator modifications conflict with BMAD workflows
**Fix**: Review read/write boundaries; orchestrator owns `.system/parallel-work/` only

## References

- **Orchestrator-EXE Agent**: `.claude/agents/orchestrator-exe.md`
- **BMAD Event System**: `.claude/skills/event-system.md`
- **BMAD Autonomous Skills**: `.claude/skills/README.md`
- **Sprint Status**: `docs/sprint-artifacts/sprint-status.yaml`
- **Execution Status**: `.system/execution-status.yaml`

---

## Related Documentation

**Agent Definitions:**
- `../../.claude/agents/orchestrator-exe.md` - Command definition and menu
- `../../.system/agents/strategic/orchestrator-exe.md` - Agent persona and behaviors

**Usage Guides:**
- `../../docs/orchestrator-exe/README.md` - Complete navigation and documentation index
- `../../docs/orchestrator-exe/EXAMPLES.md` - Comprehensive operator guide with examples
- `../../docs/orchestrator-exe/USAGE_GUIDE.md` - Detailed usage patterns and workflows

**This Directory:**
- Individual skill files (.md) in this directory - Specific skill implementations
