# Agent Selection Guide

## Overview

This guide explains how the **agent-selector skill** automatically chooses the optimal agent for each task. Understanding this process helps operators make informed decisions when reviewing agent recommendations.

## The Agent Selection Process

### 1. Task Analysis

When orc-exe identifies a task, it extracts key characteristics:

```yaml
task_characteristics:
  type: component-integration | story_implementation | validation | etc.
  complexity: 1-5 (trivial to critical)
  pass: first | second | third
  risk: low | medium | high
  dependencies: [list of blocking dependencies]
  story_pattern: new_feature | enhancement | bug_fix | refactor
```

**Example:**
```yaml
task:
  type: component-integration
  component: login-form
  complexity: 3  # moderate
  pass: second
  risk: medium
  dependencies: [auth-service]
```

### 2. Multi-Criteria Scoring

The agent-selector skill scores each candidate agent using **6 weighted criteria**:

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Task Type Match | 35% | How well agent's specialization matches task |
| Complexity Handling | 25% | Agent's ability to handle task complexity |
| Execution Mode Fit | 20% | Match between required mode and agent capability |
| Skill Access | 15% | Agent has skills needed for task |
| Current Availability | 5% | Agent not already assigned |
| Pass Awareness | 5% | Agent effectiveness in current pass |

**Total Score Formula:**
```
Score = (task_type_match × 0.35) +
        (complexity_handling × 0.25) +
        (execution_mode_fit × 0.20) +
        (skill_access × 0.15) +
        (current_availability × 0.05) +
        (pass_awareness × 0.05)
```

### 3. Detailed Scoring Breakdown

#### Task Type Match (35%)

Maps task types to agent specializations:

| Task Type | Primary Agent | Score | Alternative |
|-----------|---------------|-------|-------------|
| component-integration | integration-manager | 1.0 | development-executor (0.3) |
| component-validation | validation-controller | 1.0 | testing-specialist (0.6) |
| story_implementation | development-executor | 1.0 | dev-first-pass (0.7) |
| contract_generation | contract-architect | 1.0 | - |
| dependency_analysis | dependency-analyst | 1.0 | resource-allocator (0.6) |
| test_generation | testing-specialist | 1.0 | validation-controller (0.6) |

**Scoring:**
- Perfect match (in specializations): **1.0**
- Partial match (related capability): **0.6**
- General capability: **0.3**
- No match: **0.0**

#### Complexity Handling (25%)

Agents perform best at certain complexity levels:

| Agent Layer | Sweet Spot | Complexity Range |
|-------------|------------|------------------|
| Strategic | 4-5 (complex-critical) | All |
| Tactical | 2-4 (simple-complex) | 1-5 |
| Support | 1-3 (trivial-moderate) | 1-4 |

**Scoring:**
- In sweet spot: **1.0**
- One level off: **0.7**
- Two levels off: **0.4**
- Far outside range: **0.2**

#### Execution Mode Fit (20%)

Match task's required mode to agent's capabilities:

| Required Mode | Agent Capability | Score |
|---------------|------------------|-------|
| fully_autonomous | fully_autonomous | 1.0 |
| autonomous | autonomous or fully_autonomous | 1.0 |
| supervised | supervised or autonomous | 0.8 |
| manual | manual or supervised | 1.0 |
| advisory | advisory | 1.0 |

**Mode Compatibility:**
- Exact match: **1.0**
- Compatible (agent can do more): **0.8**
- Requires adaptation: **0.5**
- Incompatible: **0.0**

#### Skill Access (15%)

Does agent have required skills?

```
Required skills: [skill1, skill2, skill3]
Agent has: [skill1, skill2, skill4]

Match: 2 out of 3 = 66%
Score: 0.66
```

**Scoring:**
- All skills (100%): **1.0**
- Most skills (>75%): **0.7**
- Some skills (>50%): **0.5**
- Few skills (<50%): **0.2**

#### Current Availability (5%)

Check active-agents.yaml:

| Agent Status | Score |
|--------------|-------|
| Not assigned | 1.0 |
| Assigned but can handle parallel | 0.5 |
| At capacity | 0.0 |

#### Pass Awareness (5%)

Agent effectiveness varies by pass:

| Pass | Preferred Agents | Score Boost |
|------|------------------|-------------|
| First (backend-first) | development-executor, contract-architect | +0.2 |
| Second (UI polish) | integration-manager, validation-controller | +0.2 |
| Third (hardening) | validation-controller, testing-specialist | +0.2 |

**Scoring:**
- Optimal for pass: **1.0**
- Neutral for pass: **0.7**
- Less effective for pass: **0.4**

### 4. Agent Ranking

After scoring all candidates, agents are ranked by total score:

```
Candidates:
  1. integration-manager: 0.94 ✓ Selected
  2. development-executor: 0.54
  3. validation-controller: 0.42
```

**Selection Rules:**
1. Choose highest score
2. If tie (<0.05 difference):
   - Prefer agent with fewer active assignments
   - Prefer agent with better historical success rate
   - Prefer tactical layer over support (for execution tasks)

### 5. Confidence Threshold

The confidence score determines recommendation strength:

| Confidence | Meaning | Action |
|------------|---------|--------|
| >0.90 | Excellent match | Auto-assign (if low risk) |
| 0.75-0.90 | Strong match | Recommend, auto-assign if autonomous |
| 0.50-0.75 | Moderate match | Recommend, suggest operator review |
| <0.50 | Weak match | Escalate, suggest task breakdown |

## Real-World Examples

### Example 1: Component Integration (High Confidence)

**Task:**
```yaml
type: component-integration
component: login-form
complexity: 3
pass: second
risk: medium
```

**Scoring:**

**integration-manager:**
- Task type match: 1.0 (perfect - component integration specialist)
- Complexity handling: 1.0 (tactical, complexity 3 in sweet spot)
- Execution mode: 1.0 (autonomous capable)
- Skill access: 1.0 (component-integration, MCP, contracts)
- Availability: 1.0 (not assigned)
- Pass awareness: 1.0 (optimal for second pass)
- **Total: 0.94** ✓

**development-executor:**
- Task type match: 0.3 (general capability, not specialized)
- Complexity handling: 0.7 (can handle, but not optimal)
- Execution mode: 0.7 (needs supervision for integration)
- Skill access: 0.5 (dev workflows, missing MCP integration)
- Availability: 1.0
- Pass awareness: 0.6
- **Total: 0.54**

**Selection:** integration-manager (0.94 > 0.54)
**Confidence:** 94% (Excellent)
**Reasoning:** "Component integration specialist with autonomous capability and perfect task type match. Optimal for second-pass UI integration."

### Example 2: Story Implementation (Manual Mode, High Risk)

**Task:**
```yaml
type: story_implementation
story: 1-1-user-authentication-backend
complexity: 4
pass: first
risk: high
```

**Scoring:**

**development-executor:**
- Task type match: 1.0 (story implementation specialist)
- Complexity handling: 1.0 (tactical, complexity 4 in range)
- Execution mode: 0.7 (manual recommended for high risk)
- Skill access: 1.0 (dev workflows, test writing)
- Availability: 1.0
- Pass awareness: 1.0 (optimal for first pass backend work)
- **Total: 0.965** ✓

**Selection:** development-executor (only candidate)
**Confidence:** 96.5% (Excellent)
**Mode Override:** autonomous → manual (due to high risk + first pass)
**Reasoning:** "Complex backend foundation work in first pass requires manual execution. Development-executor wraps dev workflows with orchestrator coordination."

### Example 3: Validation (Fully Autonomous)

**Task:**
```yaml
type: component-validation
component: signup-form
complexity: 2
pass: second
risk: low
```

**Scoring:**

**validation-controller:**
- Task type match: 1.0 (validation specialist)
- Complexity handling: 1.0 (tactical, complexity 2 in range)
- Execution mode: 1.0 (fully autonomous capable)
- Skill access: 1.0 (4-level validation, sandbox, testing)
- Availability: 1.0
- Pass awareness: 1.0 (optimal for second pass)
- **Total: 1.0** ✓

**Selection:** validation-controller (perfect score)
**Confidence:** 100% (Perfect)
**Mode:** fully_autonomous
**Reasoning:** "Progressive validation specialist with fully autonomous execution. All 4 levels will be validated automatically with auto-approval if tests pass."

### Example 4: Dependency Analysis (Advisory)

**Task:**
```yaml
type: dependency_analysis
stories: 8
complexity: 2
pass: planning
risk: low
```

**Scoring:**

**dependency-analyst:**
- Task type match: 1.0 (dependency specialist)
- Complexity handling: 1.0 (support, complexity 2 in sweet spot)
- Execution mode: 1.0 (advisory mode)
- Skill access: 1.0 (sprint-batch-analyzer, graph algorithms)
- Availability: 1.0
- Pass awareness: 0.5 (N/A for planning phase)
- **Total: 0.975** ✓

**Selection:** dependency-analyst
**Confidence:** 97.5% (Excellent)
**Mode:** advisory
**Reasoning:** "Specialized in dependency graph construction and critical path analysis. Returns recommendations to orchestrator for capacity planning."

## When Agent Selection Fails

### Low Confidence (<50%)

**Causes:**
- Task doesn't match any agent specialization
- Multiple agents score equally (tie)
- Required skills missing from all agents

**Solutions:**
1. Break down task into smaller subtasks
2. Use workflow directly (/dev-story, /prd, etc.)
3. Assign to general development-executor with manual mode
4. Consider creating new specialized agent for this task type

**Example:**
```
Task: "Refactor entire authentication system architecture"
Scores: All agents <0.40

Recommendation: Break into subtasks:
  1. Architecture review (use /architect)
  2. Code refactoring (development-executor, manual)
  3. Testing (testing-specialist)
  4. Integration (integration-manager)
```

### Agent Unavailable

**Cause:**
Agent already assigned to another terminal

**Solutions:**
1. Queue task for when agent becomes available
2. Assign to next-best agent (second highest score)
3. Add more terminals for parallel execution
4. Rebalance workload via resource-allocator

### Mode Mismatch

**Cause:**
High-risk task recommended for autonomous mode

**Solution:**
Orchestrator overrides mode based on risk assessment from decision-support skill

**Example:**
```
Agent-selector recommends: integration-manager, autonomous mode
Decision-support assesses: HIGH RISK (first integration, novel pattern)
Override: integration-manager, supervised mode
```

## Optimizing Agent Selection

### Improving Assignment Quality

**1. Update Agent Capabilities:**
- Add new specializations as agents prove capable
- Refine skill access lists
- Adjust execution mode capabilities

**2. Refine Task Type Mappings:**
- Add new task types as patterns emerge
- Update primary/alternative agent assignments
- Adjust weights based on outcomes

**3. Learn from History:**
- Review agent-assignments.yaml weekly
- Identify patterns in successful assignments
- Adjust scoring criteria weights if needed

### Custom Weighting (Advanced)

For specific project needs, adjust criteria weights in agent-capabilities.yaml:

```yaml
selection_criteria:
  task_type_match:
    weight: 0.40  # Increased from 0.35 (prioritize specialization)
  complexity_handling:
    weight: 0.20  # Decreased from 0.25
  execution_mode_fit:
    weight: 0.25  # Increased from 0.20 (prioritize autonomous capability)
  skill_access:
    weight: 0.10  # Decreased from 0.15
  current_availability:
    weight: 0.03  # Decreased from 0.05
  pass_awareness:
    weight: 0.02  # Decreased from 0.05
```

## Frequently Asked Questions

**Q: Can I override agent-selector's recommendation?**
A: Yes! Operator always has final authority. If you disagree with the recommendation, choose a different agent or mode.

**Q: What if I want a specific agent?**
A: You can manually assign agents by loading their persona directly without using agent-selector.

**Q: Do I have to use agent-selector?**
A: No. It's opt-in via orc-exe. You can continue using workflows independently.

**Q: How accurate are the confidence scores?**
A: Confidence scores are based on the multi-criteria rubric. Over time, as agent-assignments.yaml grows, the system learns and improves.

**Q: Can agents invoke other agents?**
A: Yes, via contract-based handoffs. For example, validation-controller automatically hands off to testing-specialist for Level 2 validation.

**Q: What happens if an agent fails?**
A: The agent escalates to orc-exe with failure details. Orchestrator can reassign to different agent or escalate to operator.

## Summary

**Agent-selector** automatically chooses the best agent for each task using a **6-criteria weighted scoring system**. This:
- Reduces operator decision fatigue
- Increases sprint velocity
- Ensures optimal agent-task matching
- Enables intelligent automation

**Key Takeaways:**
1. Task type match is most important (35% weight)
2. Confidence >75% is strong recommendation
3. Execution mode can be overridden for safety
4. Operator can always override recommendations
5. System learns and improves over time

---

**See Also:**
- README.md - Agent system overview
- agent-capabilities.yaml - Full agent definitions
- .claude/skills/orc-exe/agent-selector.md - Selection skill implementation
