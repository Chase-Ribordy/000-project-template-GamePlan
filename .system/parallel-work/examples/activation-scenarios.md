# ORC-EXE Activation Scenarios

This document demonstrates complete end-to-end workflows showing how and when to activate orc-exe, sample conversations, and decision-making scenarios.

---

## Scenario 1: Triggering ORC-EXE After Sprint Planning

### Context
- **Epic**: 1-user-management (6 stories)
- **Sprint**: Week 3, 2025
- **Phase**: First Pass
- **Operator**: Development Team Lead

### Step-by-Step Workflow

#### Step 1: Sprint Planning Completion

**Operator invokes BMAD Scrum Master:**

```bash
# Terminal: Main development environment
$ /bmad:bmm:workflows:sprint-planning
```

**BMAD SM Agent Output:**

```
Sprint Planning Workflow - Phase 4 Implementation
==================================================

Reading Epic files from .bmad/bmm/planning/4-implementation/epics/...
Found 1 epic: 1-user-management.md

Analyzing stories in epic...
- 1-1-user-authentication (2h estimate)
- 1-2-user-profile-management (1.5h estimate)
- 1-3-password-reset-flow (2h estimate)
- 1-4-role-based-access-control (3h estimate)
- 1-5-admin-dashboard (2.5h estimate)
- 1-6-audit-logging (1h estimate)

Total effort: 12 hours
Total stories: 6

Creating sprint-status.yaml...
✓ Sprint status file created: .bmad/bmm/planning/4-implementation/sprint-status.yaml

Sprint Planning Complete!

Next Steps:
1. Review sprint-status.yaml for story priorities
2. Consider using /orc-exe for parallel work coordination
3. Begin development with /dev-story [story-id]
```

#### Step 2: Review Sprint Status

**Operator reviews sprint-status.yaml:**

```yaml
# Contents of sprint-status.yaml (abbreviated)
sprint_id: "sprint_2025_week_3"
epics:
  - epic_id: "1-user-management"
    stories:
      - story_id: "1-1-user-authentication"
        status: "TODO"
        estimated_effort: "2h"
      - story_id: "1-2-user-profile-management"
        status: "TODO"
        estimated_effort: "1.5h"
      # ... more stories
```

**Operator Decision Point:**
> "I have 6 stories totaling 12 hours. Some stories are independent. Should I work sequentially or use parallel coordination?"

#### Step 3: Invoke ORC-EXE

**Operator activates orchestrator:**

```bash
$ /orc-exe
```

**ORC-EXE Agent Activation:**

```
═══════════════════════════════════════════════════════════════════════════════
ORC-EXE: Execution Phase Coordinator
═══════════════════════════════════════════════════════════════════════════════
Reading sprint-status.yaml...
✓ Found sprint: sprint_2025_week_3
✓ Found 1 epic: 1-user-management (6 stories, 12h effort)

Reading execution-status.yaml...
✓ Current phase: FIRST PASS

Phase Context: Focus on core logic, minimal error handling

Analyzing parallelization opportunities...
Using sprint-batch-analyzer skill...

Analysis Complete!
──────────────────────────────────────────────────────────────────────────────

PARALLEL WORK OPPORTUNITIES IDENTIFIED:

Independent Stories (can run in parallel):
  - 1-1-user-authentication (2h)
  - 1-3-password-reset-flow (2h)
  - 1-6-audit-logging (1h) [soft dependency on 1-1]

Dependent Stories (must run sequentially after dependencies):
  - 1-2-user-profile-management (depends on 1-1)
  - 1-4-role-based-access-control (depends on 1-1)
  - 1-5-admin-dashboard (depends on 1-2, 1-4)

RECOMMENDED STRATEGY: Balanced Parallelism (Strategy 2)
  - Wave 1: 3 stories in parallel (1-1, 1-3, 1-6)
  - Wave 2: 2 stories in parallel (1-2, 1-4)
  - Wave 3: 1 story (1-5)
  - Sequential duration: 12 hours
  - Parallel duration: 9 hours
  - Speedup: 1.8x

──────────────────────────────────────────────────────────────────────────────
```

#### Step 4: Decision Support - Manual vs Autonomous

**Orchestrator invokes decision_support skill:**

```
DECISION SUPPORT: Manual vs Autonomous Execution
──────────────────────────────────────────────────────────────────────────────

Analyzing context for execution mode recommendation...

Factors:
  ✓ Phase: First Pass (exploratory, unknown patterns)
  ✓ Story complexity: Medium
  ✓ Dependencies: Some (3 independent, 3 dependent)
  ✓ Contracts available: No (first-pass doesn't require contracts)
  ✓ Risk tolerance: Medium

RECOMMENDATION: MANUAL MODE

Reasoning:
  - First-pass development involves exploration and decision-making
  - Core logic patterns not yet established
  - Human judgment valuable for architectural choices
  - Coordination overhead is low (only 3 conflicts)
  - Autonomous mode more suitable for second/third-pass

Alternative: If you want autonomous mode, complete story 1-1 manually first
to establish patterns, then use autonomous for 1-2, 1-3, 1-6.

──────────────────────────────────────────────────────────────────────────────

MENU OPTIONS:

[1] Generate Manual Terminal Prompts (Recommended)
    → I'll create copy-paste ready commands for 3 terminals
    → You coordinate manually based on prompts

[2] Generate Autonomous Contracts
    → I'll create YAML contracts for MCP validation
    → I'll execute stories autonomously

[3] Mixed Mode (Manual then Autonomous)
    → Start with manual for story 1-1
    → Extract pattern, continue autonomously

[4] View Detailed Dependency Analysis
    → See complete dependency graph and conflict zones

[5] Adjust Strategy
    → Choose different parallelism strategy

Select option [1-5]:
```

#### Step 5: Operator Selects Manual Mode

**Operator input:** `1`

**Orchestrator generates terminal prompts:**

```
Generating manual terminal prompts using terminal-prompt-generator skill...

✓ Terminal prompts generated!
✓ Session file created: .system/parallel-work/session_2025-01-15_093012.yaml
✓ Dependency graph saved: .system/parallel-work/dependencies_epic_1.yaml

──────────────────────────────────────────────────────────────────────────────
TERMINAL PROMPTS READY
──────────────────────────────────────────────────────────────────────────────

I've generated detailed prompts for 3 terminals below.
Open 3 terminal windows and copy-paste the commands.

I'll monitor coordination and notify you of conflicts or merge points.

[Full terminal prompts displayed - see terminal-prompts-manual.md for details]
```

#### Step 6: Operator Executes Parallel Work

**Operator opens 3 terminals and pastes commands:**

- **Terminal 1:** `/dev-story 1-1-user-authentication`
- **Terminal 2:** `/dev-story 1-3-password-reset-flow`
- **Terminal 3:** (waits for T1 milestone) `/dev-story 1-6-audit-logging`

**Orchestrator monitors and coordinates via track_parallel_work skill**

---

## Scenario 2: Autonomous Mode with Contracts (Second-Pass)

### Context
- **Epic**: 2-payment-processing (4 stories)
- **Sprint**: Week 4, 2025
- **Phase**: Second Pass (error handling, contracts)
- **Operator**: Senior Engineer

### Workflow

#### Step 1: ORC-EXE Activation

```bash
$ /orc-exe
```

**Orchestrator Analysis:**

```
Reading sprint-status.yaml...
✓ Epic: 2-payment-processing (4 stories, 10h effort)

Reading execution-status.yaml...
✓ Current phase: SECOND PASS

Phase Context: Add error handling, validation, contracts for MCP validation

Analyzing...

PARALLEL OPPORTUNITIES:
  - 2-1-stripe-integration (3h)
  - 2-2-payment-webhooks (2.5h)
  - Both share payment domain - coordination needed

DECISION SUPPORT: AUTONOMOUS MODE

Reasoning:
  - Second-pass has established patterns (error handling is standard)
  - Contracts can define integration points clearly
  - MCP validation can ensure correctness
  - Lower risk (first-pass core logic already working)
  - Autonomous mode efficiency gains significant

RECOMMENDATION: Use autonomous mode with contract validation

──────────────────────────────────────────────────────────────────────────────

MENU:
[1] Generate Manual Terminal Prompts
[2] Generate Autonomous Contracts (Recommended)
[3] Mixed Mode
[4] View Contracts Template

Select option [1-4]:
```

#### Step 2: Operator Selects Autonomous Mode

**Operator input:** `2`

**Orchestrator invokes contract-orchestrator skill:**

```
Generating autonomous contracts for 2 stories...

Creating Markdown contract templates...
✓ Template: .bmad/bmm/contracts/payment-gateway-integration.md
✓ Template: .bmad/bmm/contracts/webhook-handler.md

These are templates for you to review and customize.

Would you like to:
[A] Review and customize contracts manually (recommended first time)
[B] Auto-generate contracts from story files (faster, may need refinement)

Select [A/B]:
```

**Operator input:** `A`

**Orchestrator provides contract templates for review:**

```
Contract templates created in .bmad/bmm/contracts/

Please review and customize:

1. payment-gateway-integration.md
   - Define Stripe API integration points
   - Specify error handling strategies
   - Define acceptance criteria

2. webhook-handler.md
   - Define webhook event types
   - Specify validation logic
   - Define acceptance criteria

When ready, I'll convert to YAML and validate via MCP.

Type 'ready' when contracts are reviewed and customized.
```

#### Step 3: Operator Reviews Contracts

**Operator edits contracts in .bmad/bmm/contracts/**, then types `ready`

**Orchestrator converts to YAML:**

```
Converting contracts to YAML...

Using contract-orchestrator skill...
✓ payment-gateway-integration.md → payment-gateway-integration.yaml
✓ webhook-handler.md → webhook-handler.yaml

Validating contracts via MCP server...

MCP Validation Results:
──────────────────────────────────────────────────────────────────────────────
Contract: payment-gateway-integration.yaml
  ✓ Integration points: Complete
  ✓ Error handling: Comprehensive
  ✓ Testing requirements: Defined
  ✓ Acceptance criteria: Measurable

  Validation: PASSED
  Confidence: 92%
  Ready for autonomous execution: YES

Contract: webhook-handler.yaml
  ✓ Integration points: Complete
  ✓ Error handling: Comprehensive
  ⚠ Testing requirements: Missing contract tests
  ✓ Acceptance criteria: Measurable

  Validation: PASSED (with warnings)
  Confidence: 87%
  Recommendation: Add contract tests or proceed with manual validation

──────────────────────────────────────────────────────────────────────────────

Overall: Both contracts valid for autonomous execution
Recommendation: Proceed autonomously, but review webhook contract tests manually

Proceed with autonomous execution? [Y/n]:
```

#### Step 4: Operator Approves Autonomous Execution

**Operator input:** `Y`

**Orchestrator begins autonomous execution:**

```
Starting autonomous parallel execution...
──────────────────────────────────────────────────────────────────────────────

AUTONOMOUS SESSION: session_2025-01-16_140000
Mode: Autonomous with MCP validation
Stories: 2 (2-1, 2-2)
Estimated duration: 3 hours
Terminals: 2

Terminal 1: 2-1-stripe-integration (AUTONOMOUS)
  - Implementing error handling per contract
  - Stripe API integration with retry logic
  - Contract validation via MCP

Terminal 2: 2-2-payment-webhooks (AUTONOMOUS)
  - Implementing webhook handlers per contract
  - Signature verification error handling
  - Contract validation via MCP

──────────────────────────────────────────────────────────────────────────────

I will notify you of:
  - Milestones reached
  - Contract validation results
  - Any issues requiring manual intervention
  - Session completion

You can monitor progress via: /orc-status
You can pause autonomous execution via: /orc-pause

Autonomous execution started...
```

**[Orchestrator executes stories autonomously]**

**Periodic notifications:**

```
[10:30] T1 Milestone: Stripe API integration complete, tests passing
[10:45] T2 Milestone: Webhook signature verification implemented
[11:15] T1 Complete: Story 2-1 DONE, all acceptance criteria met
[11:30] T2 Complete: Story 2-2 DONE, all acceptance criteria met
[11:31] Integration tests: PASSED
[11:31] MCP validation: Both contracts validated successfully

──────────────────────────────────────────────────────────────────────────────
AUTONOMOUS SESSION COMPLETE
──────────────────────────────────────────────────────────────────────────────
Duration: 2h 31m (vs 5.5h sequential)
Speedup: 2.18x
Stories completed: 2
Tests: All passing
Contracts: Validated by MCP
Manual intervention: 0 times

Sprint-status.yaml updated: 2-1, 2-2 marked DONE

Ready for next wave or epic.
──────────────────────────────────────────────────────────────────────────────
```

---

## Scenario 3: Mixed Mode (Manual → Autonomous Transition)

### Context
- **Epic**: 4-api-refactoring (6 stories)
- **Sprint**: Week 5, 2025
- **Phase**: Second Pass (refactoring)
- **Pattern**: First story establishes pattern, rest follow autonomously

### Workflow

#### Step 1: Orchestrator Recommendation

```bash
$ /orc-exe
```

**ORC-EXE Analysis:**

```
Epic: 4-api-refactoring
Stories: 6 similar refactoring tasks
Pattern opportunity detected: API endpoint refactoring to RESTful

RECOMMENDATION: MIXED MODE
──────────────────────────────────────────────────────────────────────────────

Strategy:
1. Complete story 4-1 MANUALLY (establishes refactoring pattern)
2. Extract pattern from story 4-1
3. Apply pattern AUTONOMOUSLY to stories 4-2 through 4-6

Benefits:
  - Manual first story ensures quality pattern
  - Autonomous replication ensures consistency
  - Significant time savings (5 stories automated)
  - Lower risk than full autonomous (pattern validated first)

──────────────────────────────────────────────────────────────────────────────

MENU:
[1] Accept Mixed Mode Strategy (Recommended)
[2] Do all manually
[3] Try full autonomous (riskier)

Select [1-3]:
```

#### Step 2: Operator Accepts Mixed Mode

**Operator input:** `1`

**Orchestrator guides manual template story:**

```
Mixed Mode Phase 1: Manual Template Story
──────────────────────────────────────────────────────────────────────────────

Story 4-1: refactor-user-endpoints

This is the TEMPLATE STORY that will establish the refactoring pattern.
Be thorough - the quality of this story determines autonomous execution success.

Focus areas:
  1. Endpoint naming convention (RESTful)
  2. Error handling pattern
  3. Validation strategy
  4. Testing approach

I will analyze your work when complete to extract the pattern.

Ready to start story 4-1? [Y/n]:
```

**Operator completes story 4-1 manually**

#### Step 3: Pattern Extraction

**When story 4-1 marked DONE:**

```
Story 4-1 complete! Analyzing for pattern extraction...

Using pass-awareness-advisor skill to analyze implementation...

PATTERN EXTRACTION COMPLETE
──────────────────────────────────────────────────────────────────────────────

Detected Pattern: API Endpoint Refactoring

Steps identified:
  1. Rename endpoints to /api/v1/{resource}/{id} format
  2. Add Joi validation schemas (src/validators/{resource}.validator.ts)
  3. Standardize error responses (400, 404, 500 with JSON schema)
  4. Add integration tests (tests/integration/{resource}.integration.test.ts)

Quality assessment: HIGH (story 4-1 has comprehensive implementation)
Confidence for autonomous replication: 95%

This pattern can be applied to stories 4-2 through 4-6.

Proceed with autonomous replication? [Y/n]:
```

#### Step 4: Autonomous Pattern Replication

**Operator input:** `Y`

**Orchestrator executes remaining stories autonomously:**

```
Autonomous Pattern Replication Started
──────────────────────────────────────────────────────────────────────────────

Generating contracts for stories 4-2 through 4-6 based on pattern...

✓ Contract: 4-2-refactor-product-endpoints
✓ Contract: 4-3-refactor-order-endpoints
✓ Contract: 4-4-refactor-inventory-endpoints
✓ Contract: 4-5-refactor-shipping-endpoints
✓ Contract: 4-6-refactor-notification-endpoints

MCP validation: All contracts valid (96% confidence)

Starting parallel execution (3 terminals)...

Wave 1: Stories 4-2, 4-3, 4-4 (parallel)
Wave 2: Stories 4-5, 4-6 (parallel)

Estimated completion: 3 hours

[Autonomous execution proceeds...]

[Completion notification:]
──────────────────────────────────────────────────────────────────────────────
MIXED MODE SESSION COMPLETE

Manual phase: 1 story (2h)
Autonomous phase: 5 stories (3h) - 2.5x speedup vs manual
Total: 6 stories in 5 hours (vs 12h fully manual)
Overall speedup: 2.4x

Pattern consistency: 100% (all stories follow template)
Tests: All passing
Code review recommended: Stories 4-2 through 4-6 (autonomous generated)

Epic 4 COMPLETE!
──────────────────────────────────────────────────────────────────────────────
```

---

## Scenario 4: Intra-Story Parallelism (Large Story)

### Context
- **Story**: 3-5-dashboard-redesign (LARGE - 8h estimate)
- **Phase**: Third Pass (UX enhancement)
- **Approach**: Split single story into parallel tasks

### Workflow

```bash
$ /orc-exe
```

**ORC-EXE detects large story:**

```
Large Story Detected: 3-5-dashboard-redesign
──────────────────────────────────────────────────────────────────────────────

Story estimate: 8 hours (exceeds 4h threshold for single-story execution)

Recommendation: INTRA-STORY PARALLELISM
Split story into parallel tasks executed simultaneously

Proposed task breakdown:
  - Task 1: Data visualization charts (3h)
  - Task 2: Responsive layout & design (2.5h)
  - Task 3: Advanced filtering & search (2h)

Parallelism: 3 terminals, 1 story
Estimated duration: 4 hours (vs 8h sequential)
Coordination: High (shared UI components, merge conflicts possible)

──────────────────────────────────────────────────────────────────────────────

INTRA-STORY MODE OPTIONS:

[1] Generate coordinated terminal prompts (Manual)
    → Each terminal works on different tasks of same story
    → High coordination via orchestrator
    → Merge point at end

[2] Autonomous task execution (Risky for UI work)
    → Requires precise component interface contracts
    → Not recommended for third-pass UX (human judgment valuable)

[3] Cancel - work on story sequentially

Select [1-3]:
```

**Operator selects intra-story manual mode:**

```
Generating intra-story parallel task prompts...

⚠️  INTRA-STORY COORDINATION PROTOCOL

This is more complex than inter-story parallelism because all terminals
work on the SAME story and will merge into the SAME codebase.

Coordination critical points:
  1. Component interfaces must be defined upfront
  2. Merge conflicts are expected - plan merge strategy
  3. Frequent communication between terminals needed

[Full terminal prompts with task breakdown - see terminal-prompts-manual.md Example 3]
```

**Operator executes with high coordination, orchestrator facilitates merge point**

---

## Common Decision Patterns

### When to Use Manual Mode
- ✅ First-pass development (exploration)
- ✅ Novel features without established patterns
- ✅ High complexity requiring human judgment
- ✅ Learning new technologies or frameworks

### When to Use Autonomous Mode
- ✅ Second-pass with clear patterns (error handling, validation)
- ✅ Pattern replication (template story completed)
- ✅ Contract-driven integration (MCP validation available)
- ✅ Low-risk, well-defined tasks

### When to Use Mixed Mode
- ✅ Refactoring epics (establish pattern, replicate)
- ✅ Transition from exploration to execution
- ✅ Building confidence in autonomous execution
- ✅ Epic with mix of novel and repetitive stories

### When to Use Intra-Story Parallelism
- ✅ Large stories (>4h estimate)
- ✅ Clearly decomposable into independent tasks
- ✅ Operator comfortable with merge conflict resolution
- ✅ Time-sensitive (speedup needed)

---

## Monitoring & Control Commands

### During Orchestrator Session

```bash
# Check current session status
$ /orc-status

# Pause autonomous execution
$ /orc-pause

# Resume paused session
$ /orc-resume

# View coordination log
$ /orc-log

# Abort session (preserves work)
$ /orc-abort
```

---

## See Also

- `terminal-prompts-manual.md` - Detailed terminal prompt examples
- `yaml-contracts-autonomous.md` - Contract examples for autonomous mode
- `session-example.yaml` - Active session data structure
- `coordination-log-example.yaml` - Behind-the-scenes coordination tracking
