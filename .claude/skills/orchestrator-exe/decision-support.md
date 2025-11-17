# Decision Support Skill

**Isolation Level**: Orchestrator-EXE only
**Invocation**: Direct (not event-driven)
**Purpose**: Provide manual vs autonomous execution recommendations

## Overview

This skill helps the Orchestrator-EXE (and the operator) decide when to use manual control versus autonomous execution for different types of actions. It analyzes complexity, risk, and context to recommend the appropriate execution mode.

## Decision Philosophy

### Manual vs Autonomous: Core Rationale

**Choose Manual Mode When:**
- **Need control**: More operator involvement ensures correct interpretation of requirements
- **Need input**: Design decisions or clarifications required during execution
- **Criteria unclear**: Ambiguous requirements increase risk of misinterpretation
- **Higher risk**: Mistakes could significantly impact the project or other work streams
- **Novel patterns**: First-time implementations benefit from human oversight

**Choose Autonomous Mode When:**
- **Clear criteria**: Requirements are well-defined and unambiguous
- **Low risk**: Mistakes are easily caught and corrected
- **Need volume/speed**: High-value output requires throughput over hand-holding
- **Obvious goals**: If operator is frustrated with slow progress, goals are likely clear enough for autonomous execution
- **Proven patterns**: Repeated tasks can run automatically with confidence

**Key Insight - Speed as a Signal:**
When operators express frustration about build speed ("this is taking too long, just build it"), this is a strong signal that:
1. The goals/requirements are more obvious than initially assessed
2. The criteria are clear enough for autonomous execution
3. Volume and speed are prioritized over iterative refinement
4. Trust in autonomous systems is warranted

In these cases, switch to autonomous mode to deliver volume while the operator focuses on review and strategic direction.

### Integration with Pass Awareness

Decision Support determines **HOW** to execute (manual vs autonomous mode), while `pass-awareness-advisor.md` provides **WHERE** we are in development (first/second/third pass context).

**Combined Decision Making:**
```
Pass Context (from pass-awareness-advisor.md):
  "You're in first pass - building foundation"

Decision Support (this skill):
  "Criteria unclear + first story → Manual mode recommended"

Result:
  First pass + unclear criteria = Manual iterative development
```

```
Pass Context (from pass-awareness-advisor.md):
  "Second pass - UX enhancement phase"

Decision Support (this skill):
  "Clear UX spec + low risk + operator wants speed → Autonomous mode"

Result:
  Second pass + clear criteria + speed need = Autonomous for volume
```

The two skills are complementary:
- **pass-awareness-advisor.md** → Provides phase-appropriate context
- **decision-support.md** → Determines execution mode based on criteria clarity and risk
- **Together** → Intelligent, context-aware execution strategy

## Invocation Pattern

```
orchestrator-exe → decision-support.md → recommendation (manual/autonomous)
```

## Capabilities

### 1. Mode Recommendation
Analyze an action and recommend execution mode:
- **Manual**: Requires operator approval before execution
- **Autonomous**: Can execute automatically with minimal supervision
- **Hybrid**: Start autonomous, escalate to manual if issues arise

### 2. Risk Assessment
Evaluate risk factors for each action:
- **Complexity**: How intricate is the operation?
- **Impact**: What's affected if it goes wrong?
- **Reversibility**: Can it be easily undone?
- **Dependencies**: Does it affect other work streams?

### 3. Context Awareness
Consider current execution context:
- **Phase** (1st/2nd/3rd pass): Different phases have different risk profiles
- **Parallel Work**: Are other sessions affected?
- **Story Status**: First story vs established pattern
- **Operator Skill Level**: From config.yaml user_skill_level

## Decision Matrix

### Action Complexity Classification

```yaml
routine_actions:
  # Safe for autonomous execution
  - action: "Run tests"
    complexity: "low"
    risk: "low"
    recommendation: "autonomous"
    rationale: "Reversible, read-only operation"

  - action: "Update sprint status (story done)"
    complexity: "low"
    risk: "low"
    recommendation: "autonomous"
    rationale: "Simple YAML update, easily reversible"

  - action: "Execute story (established pattern)"
    complexity: "medium"
    risk: "low"
    recommendation: "autonomous"
    phase_context:
      first_pass: "autonomous (proven pattern)"
      second_pass: "autonomous (component integration is standardized)"
      third_pass: "autonomous (quick fixes are routine)"

moderate_actions:
  # Recommend manual oversight
  - action: "Execute first story in sprint"
    complexity: "medium"
    risk: "medium"
    recommendation: "manual"
    rationale: "Sets pattern for remaining stories, worth reviewing"

  - action: "Integrate new component (first time)"
    complexity: "medium"
    risk: "medium"
    recommendation: "manual"
    rationale: "Novel integration, may need design decisions"

  - action: "Resolve merge conflict in parallel work"
    complexity: "medium"
    risk: "high"
    recommendation: "manual"
    rationale: "High risk of code conflicts, needs operator judgment"

complex_actions:
  # Always require manual control
  - action: "Change architecture decision"
    complexity: "high"
    risk: "high"
    recommendation: "manual"
    rationale: "Strategic decision with wide impact"

  - action: "Modify dependency graph"
    complexity: "medium"
    risk: "high"
    recommendation: "manual"
    rationale: "Affects story sequencing across all sessions"

  - action: "Debug production issue"
    complexity: "high"
    risk: "high"
    recommendation: "manual"
    phase_context:
      third_pass: "manual (critical fixes need oversight)"
```

## Recommendation Algorithm

### Step 1: Classify Action
```
Input: action_type, current_context
Output: complexity_level, risk_level
```

### Step 2: Apply Context Modifiers
```yaml
context_modifiers:
  phase:
    first_pass:
      risk_modifier: "+1" # Higher risk - establishing patterns
    second_pass:
      risk_modifier: "0"  # Neutral - standardized process
    third_pass:
      risk_modifier: "-1" # Lower risk - quick fixes

  parallel_work:
    active_sessions_count:
      "1":
        risk_modifier: "0"  # No parallelism, lower risk
      "2-3":
        risk_modifier: "+1" # Moderate parallelism, coordinate carefully
      "4+":
        risk_modifier: "+2" # High parallelism, manual oversight critical

  story_pattern:
    first_in_epic:
      risk_modifier: "+1" # Novel pattern, higher risk
    repeated_pattern:
      risk_modifier: "-1" # Established pattern, lower risk

  operator_skill:
    beginner:
      autonomy_threshold: "conservative" # More manual control
    intermediate:
      autonomy_threshold: "balanced"     # Standard recommendations
    advanced:
      autonomy_threshold: "aggressive"   # More autonomy
```

### Step 3: Generate Recommendation
```
If (risk_level >= autonomy_threshold):
  recommendation = "manual"
  provide_rationale()
Else:
  recommendation = "autonomous"
  provide_confidence_level()
```

## Usage Examples

### Example 1: Simple Decision Query
```
Operator: *decide run-tests

Orchestrator-EXE: [Invokes decision-support.md]

Skill Analysis:
- Action: "run-tests"
- Complexity: LOW
- Risk: LOW (read-only)
- Context: first_pass, 1 active session
- Operator Skill: intermediate

Recommendation: AUTONOMOUS
Rationale: Testing is a low-risk, reversible operation. Safe to run automatically.
Confidence: HIGH
```

### Example 2: Complex Decision Query
```
Operator: *decide execute-story

Orchestrator-EXE: [Invokes decision-support.md]

Skill Analysis:
- Action: "execute-story"
- Story: "1-2-user-authentication" (first in epic)
- Complexity: MEDIUM
- Risk: MEDIUM (first story sets pattern)
- Context: first_pass, 2 active sessions (parallel work)
- Operator Skill: intermediate

Recommendation: MANUAL
Rationale: This is the first story in the epic and you have parallel work active.
           Manual oversight recommended to:
           1. Establish the pattern for subsequent stories
           2. Ensure coordination between parallel sessions
           3. Verify auth patterns align with architecture
Confidence: MEDIUM

Alternative: You can switch to autonomous mode if you want to proceed automatically,
             but I recommend reviewing the story implementation before marking it done.
```

### Example 3: Context-Aware Recommendation
```
Operator: *decide integrate-component

Orchestrator-EXE: [Invokes decision-support.md]

Skill Analysis:
- Action: "integrate-component"
- Component: "LoginForm" (new component)
- Phase: second_pass
- Complexity: MEDIUM
- Base Risk: MEDIUM
- Context Modifiers:
  - second_pass: 0 (standardized integration process)
  - new_component: +1 (first time integration)
  - operator_skill (intermediate): balanced threshold
- Adjusted Risk: MEDIUM-HIGH

Recommendation: MANUAL
Rationale: While second-pass integration is standardized, this is a NEW component.
           Manual review recommended for:
           1. First-time component extraction verification
           2. Design system alignment check
           3. Contract validation

After Integration: Subsequent integrations of PROVEN components can be autonomous.
```

## Mode Switching Recommendations

### When to Switch to Manual Mode
```yaml
triggers:
  - "First story in new epic"
  - "Parallel work conflict detected"
  - "Novel architectural pattern"
  - "Production issue debugging"
  - "Dependency graph changes"
```

### When to Switch to Autonomous Mode
```yaml
triggers:
  - "Repeated story pattern (3+ similar stories completed)"
  - "Routine test execution"
  - "Proven component integration"
  - "Standard status updates"
  - "Quick fixes in third-pass"
```

## Isolation Rules

1. **Direct Invocation Only**: Only orchestrator-exe can call this skill
2. **No Event Emission**: Does not emit events to BMAD event system
3. **Synchronous Operation**: Returns recommendation immediately
4. **Advisory Only**: Never executes actions, only provides recommendations

## Integration Points

**Reads**:
- `.bmad/bmm/config.yaml` (operator skill level)
- `.system/execution-status.yaml` (current phase)
- `.system/parallel-work/active-sessions.yaml` (parallelism context)
- `docs/sprint-artifacts/sprint-status.yaml` (story history/patterns)

**Writes**:
- `.system/parallel-work/decision-log.yaml` (recommendation history)

**Returns**:
- Recommendation object:
  ```yaml
  action: "execute-story"
  recommendation: "manual"
  confidence: "medium"
  rationale: "First story in epic, sets pattern"
  alternatives: ["Switch to autonomous after first story"]
  ```
