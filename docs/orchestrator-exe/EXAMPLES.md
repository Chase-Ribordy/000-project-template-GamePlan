# Orchestrator-EXE: Complete Examples & Operator Guide

**Version:** 1.0.0
**Last Updated:** 2025-01-15
**Target Audience:** Development Team Leads, Scrum Masters, Senior Engineers

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [What is Orchestrator-EXE?](#what-is-orchestrator-exe)
3. [When to Use Orchestrator-EXE](#when-to-use-orchestrator-exe)
4. [Complete Workflow Examples](#complete-workflow-examples)
   - [Example 1: First-Pass Manual Mode](#example-1-first-pass-manual-mode)
   - [Example 2: Second-Pass Autonomous Mode](#example-2-second-pass-autonomous-mode)
   - [Example 3: Mixed Mode Transition](#example-3-mixed-mode-transition)
   - [Example 4: Intra-Story Parallelism](#example-4-intra-story-parallelism)
5. [Understanding the Components](#understanding-the-components)
6. [Example Files Reference](#example-files-reference)
7. [Decision Guide: Manual vs Autonomous](#decision-guide-manual-vs-autonomous)
8. [Troubleshooting](#troubleshooting)
9. [Advanced Topics](#advanced-topics)

---

## Quick Start

### Simplest Path: After Sprint Planning

```bash
# 1. Complete sprint planning (BMAD SM creates sprint-status.yaml)
/bmad:bmm:workflows:sprint-planning

# 2. Activate orchestrator-exe
/orchestrator-exe

# 3. Follow the menu - orchestrator recommends manual or autonomous mode
# 4. For manual mode: Copy-paste terminal prompts to separate terminals
# 5. For autonomous mode: Review contracts, approve, let orchestrator execute
```

**Result:** Stories executed in parallel with 1.5x-3x speedup vs sequential execution.

---

## What is Orchestrator-EXE?

Orchestrator-EXE is a top-level coordination agent that enables **parallel story development** during BMad Method sprints. It analyzes story dependencies, recommends parallel execution strategies, and coordinates multiple development terminals.

### Key Capabilities

- **Dependency Analysis:** Identifies which stories can run in parallel
- **Strategy Recommendation:** Suggests optimal parallelism approach
- **Manual Coordination:** Generates terminal prompts for operator-driven parallel work
- **Autonomous Execution:** Executes stories via MCP-validated contracts (second/third-pass)
- **Phase Awareness:** Adapts recommendations based on first/second/third-pass context
- **Conflict Detection:** Identifies and resolves resource conflicts between parallel stories

### Architecture Principles

1. **Isolation from BMAD:** Operates independently, no event-driven interactions
2. **Top-Down Only:** Orchestrator invokes agents, agents never invoke orchestrator
3. **Direct Invocation:** Uses slash commands (`/dev-story`, `/story-done`) to coordinate
4. **Phase-Appropriate:** Recommends manual for first-pass, autonomous for second/third-pass

---

## When to Use Orchestrator-EXE

### ✅ Use Orchestrator-EXE When:

- Sprint has **3+ stories** that could run in parallel
- Some stories are **independent** (no blocking dependencies)
- You have **multiple terminals** or developers available
- You want **1.5x-3x speedup** vs sequential execution
- Epic has clear story breakdown from sprint planning

### ❌ Don't Use Orchestrator-EXE When:

- Sprint has only 1-2 stories (overhead not worth it)
- All stories have **strict sequential dependencies**
- Team is unfamiliar with parallel coordination (learning curve)
- Stories are trivial (<30 min each)

### Recommended Scenarios

| Scenario | Stories | Dependencies | Recommended Mode | Expected Speedup |
|----------|---------|-------------|------------------|------------------|
| **First-pass epic** | 6 stories, 12h total | 3 independent, 3 dependent | Manual, 2 terminals | 1.8x (12h → 6.5h) |
| **Second-pass refactoring** | 5 similar stories | All independent after pattern | Mixed (manual→autonomous) | 2.4x (10h → 4h) |
| **Third-pass large story** | 1 story, 8h estimate | Intra-story parallelism | Manual, 3 terminals | 2x (8h → 4h) |
| **Component integration** | 4 components | Clear contracts | Autonomous | 2.5x (8h → 3.2h) |

---

## Complete Workflow Examples

### Example 1: First-Pass Manual Mode

**Scenario:** Epic 1-user-management with 6 stories, first-pass development

#### Step-by-Step Walkthrough

**1. Sprint Planning Completes**

```bash
$ /bmad:bmm:workflows:sprint-planning
```

**Output:**
```
Sprint Planning Complete!
- Epic: 1-user-management
- Stories: 6 (12 hours total effort)
- Created: sprint-status.yaml

Next: Consider /orchestrator-exe for parallel coordination
```

**2. Activate Orchestrator-EXE**

```bash
$ /orchestrator-exe
```

**Orchestrator Analysis:**
```
═══════════════════════════════════════════════════════════════════════════════
ORCHESTRATOR-EXE: Execution Phase Coordinator
═══════════════════════════════════════════════════════════════════════════════

Reading sprint-status.yaml...
✓ Epic: 1-user-management (6 stories, 12h effort)

Reading execution-status.yaml...
✓ Phase: FIRST PASS (core logic focus)

Analyzing dependencies...

PARALLEL OPPORTUNITIES:
  Independent stories (can run in parallel):
    - 1-1-user-authentication (2h)
    - 1-3-password-reset-flow (2h)
    - 1-6-audit-logging (1h) [soft dependency on 1-1]

  Dependent stories (sequential after dependencies):
    - 1-2-user-profile-management (depends on 1-1)
    - 1-4-role-based-access-control (depends on 1-1)
    - 1-5-admin-dashboard (depends on 1-2, 1-4)

RECOMMENDED STRATEGY: Balanced Parallelism
  - Wave 1: 3 stories in parallel
  - Wave 2: 2 stories in parallel
  - Wave 3: 1 story
  - Sequential: 12h → Parallel: 9h (1.8x speedup)

RECOMMENDATION: MANUAL MODE
  Reason: First-pass exploration benefits from human judgment

MENU:
[1] Generate Manual Terminal Prompts (Recommended)
[2] Generate Autonomous Contracts
[3] View Detailed Dependency Analysis
[4] Adjust Strategy

Select [1-4]:
```

**3. Operator Selects Manual Mode**

**Input:** `1`

**Orchestrator Generates Terminal Prompts:**

```
═══════════════════════════════════════════════════════════════════════════════
TERMINAL 1 - User Authentication
═══════════════════════════════════════════════════════════════════════════════
Story: 1-1-user-authentication
Duration: 2 hours

FIRST PASS FOCUS:
  - Core JWT generation logic
  - Basic login endpoint
  - Users table schema creation
  ⚠️  SKIP: Error handling, rate limiting

COORDINATION:
  ⚠️  You create users table - T3 waits for your completion
  📢 Notify orchestrator when users table ready

COPY-PASTE COMMAND:
/dev-story 1-1-user-authentication

═══════════════════════════════════════════════════════════════════════════════
TERMINAL 2 - Password Reset Flow
═══════════════════════════════════════════════════════════════════════════════
Story: 1-3-password-reset-flow
Duration: 2 hours

FIRST PASS FOCUS:
  - Basic reset token generation
  - Email sending integration
  - Reset tokens table creation
  ⚠️  SKIP: Token expiration, email templates

COORDINATION:
  ✅ Fully independent - start immediately

COPY-PASTE COMMAND:
/dev-story 1-3-password-reset-flow

═══════════════════════════════════════════════════════════════════════════════
TERMINAL 3 - Audit Logging
═══════════════════════════════════════════════════════════════════════════════
Story: 1-6-audit-logging
Duration: 1 hour
⏸️  STATUS: PAUSED - Wait for T1 to complete users table

COORDINATION:
  ⚠️  WAIT for T1 users table schema
  📢 Start when orchestrator signals ready (~30 min)

COPY-PASTE COMMAND (when ready):
/dev-story 1-6-audit-logging

═══════════════════════════════════════════════════════════════════════════════
NEXT STEPS:
1. Open 3 terminal windows
2. Start T1 and T2 immediately
3. Wait for T1 milestone (~30 min) to start T3
4. Orchestrator monitors and coordinates
5. Integration checkpoint when all complete

Session tracking: .system/parallel-work/session_2025-01-15_093012.yaml
═══════════════════════════════════════════════════════════════════════════════
```

**4. Operator Executes Parallel Work**

- **Terminal 1:** Paste `/dev-story 1-1-user-authentication` → Start immediately
- **Terminal 2:** Paste `/dev-story 1-3-password-reset-flow` → Start immediately
- **Terminal 3:** Wait for notification from orchestrator

**[30 minutes later]**

**Terminal 1 Progress:**
```
[T1] Story 1-1: Users table created ✓
[T1] JWT generation implemented ✓
[T1] Basic login endpoint working ✓
```

**Orchestrator Notification:**
```
[Orchestrator] T1 Milestone Reached: users table schema complete
[Orchestrator] 📢 T3 UNBLOCKED - Safe to start audit logging
```

**Operator starts Terminal 3:**
- **Terminal 3:** Paste `/dev-story 1-6-audit-logging` → Start now

**5. Wave 1 Completion & Wave 2 Start**

**[2 hours later - Wave 1 complete]**

```
[Orchestrator] Wave 1 Complete!
  ✓ Story 1-1: DONE (2h)
  ✓ Story 1-3: DONE (2h)
  ✓ Story 1-6: DONE (1h actual, 1.5h elapsed due to wait)

Wave 1 Duration: 2h (vs 5h sequential) - 2.5x speedup

Integration tests running... ✓ PASSED

Wave 2 Ready to Start:
  - 1-2-user-profile-management (depends on 1-1 ✓)
  - 1-4-role-based-access-control (depends on 1-1 ✓)

TERMINALS AVAILABLE: T1, T2, T3
RECOMMENDATION: Use T1 and T2 for wave 2 stories

[Wave 2 terminal prompts generated...]
```

**Operator continues with Wave 2, then Wave 3**

**6. Sprint Completion**

```
═══════════════════════════════════════════════════════════════════════════════
SESSION COMPLETE: session_2025-01-15_093012
═══════════════════════════════════════════════════════════════════════════════

Total Duration: 6.5 hours
Sequential Estimate: 12 hours
Actual Speedup: 1.85x
Coordination Overhead: 30 minutes

Stories Completed: 6
Conflicts Detected: 1 (database schema)
Conflicts Resolved: 1
Tests: All passing

Epic 1-user-management: COMPLETE ✅

Coordination log: .system/parallel-work/coordination-log-session_2025-01-15_093012.yaml
═══════════════════════════════════════════════════════════════════════════════
```

**Result:** Epic completed in 6.5 hours instead of 12 hours, with 1 easily-resolved conflict.

---

### Example 2: Second-Pass Autonomous Mode

**Scenario:** Epic 2-payment-processing, second-pass adding error handling with contracts

#### Step-by-Step Walkthrough

**1. Activate Orchestrator After Sprint Planning**

```bash
$ /orchestrator-exe
```

**Orchestrator Analysis:**
```
Epic: 2-payment-processing (2 stories, 5.5h effort)
Phase: SECOND PASS (error handling, validation, contracts)

Stories:
  - 2-1-stripe-integration (3h)
  - 2-2-payment-webhooks (2.5h)

Both stories share payment domain - coordination required

RECOMMENDATION: AUTONOMOUS MODE
  Reason:
    - Second-pass has established patterns (error handling is standard)
    - Contracts can define integration clearly
    - MCP validation ensures correctness
    - Lower risk (core logic already working from first-pass)

MENU:
[1] Generate Manual Prompts
[2] Generate Autonomous Contracts (Recommended)
[3] Mixed Mode

Select [1-3]:
```

**2. Operator Selects Autonomous Mode**

**Input:** `2`

**Orchestrator Creates Contract Templates:**
```
Generating autonomous contracts for 2 stories...

Created contract templates:
  .bmad/bmm/contracts/payment-gateway-integration.md
  .bmad/bmm/contracts/webhook-handler.md

Please review and customize these contracts.

Contract templates include:
  - Integration points (inputs/outputs)
  - Error handling strategies
  - Testing requirements
  - Acceptance criteria

Type 'ready' when contracts are reviewed.
```

**3. Operator Reviews & Customizes Contracts**

**Operator edits:** `.bmad/bmm/contracts/payment-gateway-integration.md`

```markdown
# Payment Gateway Integration Contract

## Integration Points

### Inputs
- User payment request (JSON)
- Validation: Joi schema

### Outputs
- Payment confirmation (200/201)
- Payment failure (400/402/500)

### External Dependencies
- Stripe API with retry logic (exponential backoff, 3 attempts)

## Error Handling
- Network failures: Retry with exponential backoff
- Invalid payment method: Return 400
- Stripe errors: Log and return 500

## Testing
- Unit tests: Payment logic
- Integration tests: Stripe API (test mode)
- Contract tests: Request/response validation

## Acceptance Criteria
- [ ] All error cases handled
- [ ] Stripe integration working (test mode)
- [ ] Idempotency implemented
```

**Operator types:** `ready`

**4. Orchestrator Converts & Validates Contracts**

```
Converting contracts to YAML...
✓ payment-gateway-integration.yaml
✓ webhook-handler.yaml

Validating via MCP server...

MCP VALIDATION RESULTS:
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
  ⚠ Testing requirements: Add contract tests recommended
  ✓ Acceptance criteria: Measurable

  Validation: PASSED (with warnings)
  Confidence: 87%

──────────────────────────────────────────────────────────────────────────────
Overall: VALID - Ready for autonomous execution

Proceed autonomously? [Y/n]:
```

**Operator input:** `Y`

**5. Autonomous Execution**

```
Starting autonomous execution...

AUTONOMOUS SESSION: session_2025-01-16_140000
Mode: Autonomous with MCP validation
Stories: 2
Terminals: 2

[14:00] Session started
[14:00] T1: Starting 2-1-stripe-integration (autonomous)
[14:00] T2: Starting 2-2-payment-webhooks (autonomous)

[14:30] T1: Implementing error handling per contract...
[14:30] T2: Implementing webhook signature verification...

[15:00] T1: Stripe API integration with retry logic complete
[15:00] T2: Webhook handlers implemented

[15:30] T1: Running tests... ✓ All tests passing
[15:30] T2: Running tests... ✓ All tests passing

[15:45] T1: Story 2-1 DONE - All acceptance criteria met
[15:50] T2: Story 2-2 DONE - All acceptance criteria met

[15:51] Integration tests: ✓ PASSED
[15:51] MCP contract validation: ✓ Both contracts validated

═══════════════════════════════════════════════════════════════════════════════
AUTONOMOUS SESSION COMPLETE
═══════════════════════════════════════════════════════════════════════════════
Duration: 1h 51m (vs 5.5h sequential)
Speedup: 2.96x
Manual intervention: 0 times
Tests: All passing
Contracts: MCP validated ✓

Epic 2-payment-processing: COMPLETE ✅
═══════════════════════════════════════════════════════════════════════════════
```

**Result:** Epic completed autonomously in ~2 hours instead of 5.5 hours, with zero manual intervention.

---

### Example 3: Mixed Mode Transition

**Scenario:** Epic 4-api-refactoring with pattern replication

#### Concept

1. **Manual Phase:** Complete first story to establish refactoring pattern
2. **Transition:** Extract pattern as contract
3. **Autonomous Phase:** Remaining stories auto-executed using pattern

#### Workflow Summary

```
Story 4-1 (manual) → Pattern extracted → Stories 4-2 to 4-6 (autonomous)

Timeline:
  Manual phase: 2h (1 story)
  Autonomous phase: 3h (5 stories in parallel)
  Total: 5h (vs 12h fully manual)
  Speedup: 2.4x
```

**Key Benefits:**
- Manual first story ensures quality pattern
- Autonomous replication ensures consistency
- Best of both worlds: human judgment + automation efficiency

**See:** `.system/parallel-work/examples/activation-scenarios.md` for full walkthrough

---

### Example 4: Intra-Story Parallelism

**Scenario:** Story 3-5-dashboard-redesign (8h estimate, split into 3 tasks)

#### Concept

Single large story split into parallel tasks:
- Task 1: Data visualization (3h)
- Task 2: Responsive layout (2.5h)
- Task 3: Advanced filtering (2h)

**Coordination:** High - all tasks merge into same component

**Timeline:**
- Sequential: 7.5 hours
- Parallel (3 terminals): 4 hours
- Speedup: 1.88x

**Challenges:**
- Component interface coordination
- Merge conflicts expected
- Requires experienced operators

**See:** `.system/parallel-work/examples/terminal-prompts-manual.md` Example 3 for terminal prompts

---

## Understanding the Components

### Skills (8 Total)

| Skill | Purpose | Used In |
|-------|---------|---------|
| **sprint-batch-analyzer** | Analyzes sprint-status.yaml, identifies parallelizable stories | All modes (initial analysis) |
| **decision_support** | Recommends manual vs autonomous mode | All modes (decision point) |
| **terminal-prompt-generator** | Creates formatted terminal prompts | Manual mode |
| **contract-orchestrator** | Converts Markdown→YAML contracts, integrates with MCP | Autonomous mode |
| **coordinate-agents** | Delegates to BMAD agents via slash commands | All modes (agent invocation) |
| **track-parallel-work** | Tracks session state, terminals, progress | All modes (monitoring) |
| **parallel-coordinator** | Detects conflicts, coordinates merge points | All modes (conflict resolution) |
| **pass-awareness-advisor** | Provides phase-appropriate guidance | All modes (recommendations) |

### Data Structures

**Session File:** `.system/parallel-work/session_{id}.yaml`
- Tracks active terminals, stories, progress
- Coordination rules, conflicts, merge points
- Created at session start, updated during execution

**Dependencies File:** `.system/parallel-work/dependencies_{epic}.yaml`
- Story dependency graph
- Parallel work strategies
- Conflict zones and resolutions

**Coordination Log:** `.system/parallel-work/coordination-log-{session_id}.yaml`
- Event log (agent delegations, milestones, conflicts)
- Metrics (speedup, coordination overhead)
- Isolation verification

**Contracts:**
- **Markdown:** `.bmad/bmm/contracts/{component}.md` (human-editable)
- **YAML:** `.system/parallel-work/contracts/{component}.yaml` (MCP-validated)

---

## Example Files Reference

All example files are located in `.system/parallel-work/examples/`

### 1. session-example.yaml

**Purpose:** Shows active parallel session structure

**Contents:**
- Inter-story parallelism (3 terminals, 3 stories)
- Terminal tracking (status, progress, current_task)
- Coordination rules (conflict_zones, merge_points)
- Communication log

**Use Case:** Reference for understanding session state during parallel work

### 2. dependencies-example.yaml

**Purpose:** Shows dependency analysis and parallel strategies

**Contents:**
- Story dependency graph
- 3 parallel work strategies (max parallel, balanced, sequential)
- Conflict detection and resolution
- Recommendations from orchestrator

**Use Case:** Understand how orchestrator analyzes dependencies and recommends strategies

### 3. coordination-log-example.yaml

**Purpose:** Shows behind-the-scenes coordination events

**Contents:**
- 23 coordination events (session start, agent delegation, conflicts, completions)
- Isolation verification (no BMAD event emissions)
- Communication patterns
- Metrics (speedup, overhead)

**Use Case:** Understand orchestrator's coordination process, verify isolation from BMAD

### 4. terminal-prompts-manual.md

**Purpose:** Manual mode terminal prompt examples

**Contents:**
- 4 complete scenarios (first-pass, second-pass, third-pass, mixed-mode)
- Formatted terminal layouts
- Copy-paste ready commands
- Coordination notes

**Use Case:** See what operators receive in manual mode, understand terminal coordination

### 5. yaml-contracts-autonomous.md

**Purpose:** Autonomous mode contract examples

**Contents:**
- Component integration contract
- Parallel story execution contract
- Pattern replication contract
- Complete MCP validation metadata

**Use Case:** Understand autonomous mode contracts, see MCP validation process

### 6. activation-scenarios.md

**Purpose:** End-to-end workflow examples

**Contents:**
- 4 complete scenarios with step-by-step walkthroughs
- Decision-making conversations
- Manual, autonomous, and mixed-mode workflows
- Intra-story parallelism example

**Use Case:** Comprehensive reference for all orchestrator-exe workflows

---

## Decision Guide: Manual vs Autonomous

### Use This Decision Tree

```
Is this first-pass development?
├─ YES → MANUAL MODE (exploration, unknown patterns)
└─ NO → Continue...
    │
    Is there an established pattern from a previous story?
    ├─ YES → AUTONOMOUS MODE (pattern replication)
    └─ NO → Continue...
        │
        Are contracts clearly definable?
        ├─ YES → AUTONOMOUS MODE (contract-driven integration)
        └─ NO → MANUAL MODE (human judgment needed)
```

### Recommendation Matrix

| Phase | Pattern Established | Contracts Clear | Risk | Recommendation |
|-------|---------------------|-----------------|------|----------------|
| First-pass | No | No | High | **Manual** |
| First-pass | No | Yes | Medium | **Manual** (exploration valuable) |
| Second-pass | No | Yes | Medium | **Autonomous** (error handling is standard) |
| Second-pass | Yes | Yes | Low | **Autonomous** (ideal scenario) |
| Third-pass | Yes | No | Low | **Mixed** (manual for UX judgment, autonomous for patterns) |
| Refactoring | Yes (template) | Yes | Low | **Mixed** (manual template, autonomous replication) |

### Risk Assessment

**Low Risk (Autonomous Safe):**
- Error handling patterns (second-pass)
- Refactoring with template
- Component integration with contracts
- Pattern replication

**Medium Risk (Manual Recommended):**
- First-pass of novel features
- Complex architectural decisions
- Unclear integration points
- Learning new frameworks

**High Risk (Manual Required):**
- Production-critical changes without contracts
- Uncertain requirements
- Complex merge conflicts expected
- Team unfamiliar with parallel coordination

---

## Troubleshooting

### Common Issues

#### Issue: Orchestrator Doesn't Find Parallel Opportunities

**Symptoms:**
```
Analyzing dependencies...
No parallel opportunities found.
All stories have strict sequential dependencies.
```

**Causes:**
- Stories have tight dependencies (each depends on previous)
- Epic too small (1-2 stories only)
- Dependencies not accurately reflected in sprint-status.yaml

**Solutions:**
1. Review story breakdown - can any be split?
2. Check if dependencies are real or assumed
3. Use sequential execution (parallel not beneficial here)

#### Issue: Terminal Prompts Not Showing Coordination Notes

**Symptoms:**
- Generated prompts lack coordination warnings
- No information about conflicts or waiting

**Causes:**
- `terminal-prompt-generator` skill not invoked correctly
- Session file not created

**Solutions:**
1. Ensure orchestrator completed dependency analysis
2. Check `.system/parallel-work/session_{id}.yaml` exists
3. Re-invoke orchestrator menu option [1]

#### Issue: MCP Contract Validation Fails

**Symptoms:**
```
MCP Validation: FAILED
Reason: Incomplete integration points
```

**Causes:**
- Contract missing required fields
- Integration points not clearly defined
- Error handling not comprehensive

**Solutions:**
1. Review contract template requirements
2. Add missing sections (integration_points, error_handling, testing, acceptance_criteria)
3. Use manual mode as fallback

#### Issue: Coordination Overhead Too High

**Symptoms:**
- Actual duration worse than sequential
- Constant waiting and blocking between terminals

**Causes:**
- Too many dependencies between parallel stories
- Wrong parallel strategy selected
- Stories too small (overhead > benefit)

**Solutions:**
1. Use more conservative strategy (balanced vs max-parallel)
2. Reduce parallelism (2 terminals instead of 3)
3. Consider sequential execution for small stories

### Debug Commands

**Check session state:**
```bash
cat .system/parallel-work/session_{id}.yaml
```

**View coordination log:**
```bash
cat .system/parallel-work/coordination-log-{session_id}.yaml
```

**Verify isolation (should show no BMAD events):**
```bash
grep "bmad_event" .system/parallel-work/coordination-log-*.yaml
# Should return nothing
```

---

## Advanced Topics

### Creating Custom Parallel Strategies

Modify `dependencies-example.yaml` to add custom strategy:

```yaml
strategies:
  - strategy_id: "strategy_custom"
    name: "Custom High-Risk Parallel"
    parallelism_level: "very_high"
    risk_level: "high"
    execution_plan:
      wave_1:
        terminals: 4
        stories: ["1-1", "1-2", "1-3", "1-6"]
    # ... define waves
```

### Integrating with CI/CD

Autonomous mode can integrate with CI/CD:

```yaml
# In autonomous contract
autonomous_execution:
  ci_integration:
    trigger: "github_actions"
    on_completion: "auto_merge_to_staging"
    rollback_on_failure: true
```

### Custom Contract Validators

Create custom MCP validators for domain-specific contracts:

```yaml
mcp_validation:
  custom_validators:
    - "payment-domain-validator"
    - "security-compliance-validator"
```

### Phase Transition Recommendations

`pass-awareness-advisor` skill can recommend when to transition phases:

**From First-Pass to Second-Pass:**
- All stories have passing tests
- Core logic complete
- Ready for error handling

**From Second-Pass to Third-Pass:**
- Error handling comprehensive
- Contracts validated
- Ready for UX polish

---

## Summary

Orchestrator-EXE enables **parallel story development** with:

✅ **1.5x-3x speedup** vs sequential execution
✅ **Dependency analysis** to identify parallel opportunities
✅ **Manual mode** for first-pass exploration
✅ **Autonomous mode** for second-pass patterns
✅ **Mixed mode** for pattern replication
✅ **Conflict detection** and coordination
✅ **Phase awareness** for appropriate recommendations

**Next Steps:**

1. ✅ Review this documentation
2. ✅ Study example files in `.system/parallel-work/examples/`
3. ✅ Run validation tests: `bash tests/orchestrator-exe/run-all-tests.sh`
4. ▶️ Try manual mode on your next epic
5. ▶️ Experiment with autonomous mode for second-pass
6. ▶️ Master mixed mode for maximum efficiency

**Questions or Issues?** Review [Troubleshooting](#troubleshooting) or check example files.

---

**Document Version:** 1.0.0
**Examples Created:** 2025-01-15
**Validation Tests:** 3 automated test suites available
