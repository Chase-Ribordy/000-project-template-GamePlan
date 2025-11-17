# Orchestrator-EXE Documentation

Complete documentation and examples for the Orchestrator-EXE parallel work coordination system.

---

## Quick Navigation

### 📚 Main Documentation

**[EXAMPLES.md](./EXAMPLES.md)** - **START HERE**
- Complete operator guide with end-to-end examples
- Step-by-step walkthroughs for all modes
- Decision guides and troubleshooting
- ~1200 lines of comprehensive documentation

### 📁 Example Files

All examples located in: `.system/parallel-work/examples/`

**Session & Coordination:**
- **[session-example.yaml](../../.system/parallel-work/examples/session-example.yaml)** - Active parallel session structure
- **[dependencies-example.yaml](../../.system/parallel-work/examples/dependencies-example.yaml)** - Dependency analysis & strategies
- **[coordination-log-example.yaml](../../.system/parallel-work/examples/coordination-log-example.yaml)** - Event log & metrics

**Operational Examples:**
- **[terminal-prompts-manual.md](../../.system/parallel-work/examples/terminal-prompts-manual.md)** - Manual mode terminal prompts (4 scenarios)
- **[yaml-contracts-autonomous.md](../../.system/parallel-work/examples/yaml-contracts-autonomous.md)** - Autonomous mode contracts (3 examples)
- **[activation-scenarios.md](../../.system/parallel-work/examples/activation-scenarios.md)** - Complete workflow walkthroughs (4 scenarios)

### 🧪 Validation & Testing

**Test Suite:** `tests/orchestrator-exe/`

**Run All Tests:**
```bash
cd tests/orchestrator-exe
bash run-all-tests.sh
```

**Individual Tests:**
```bash
node tests/orchestrator-exe/skill-isolation-test.js
node tests/orchestrator-exe/mcp-integration-test.js
node tests/orchestrator-exe/parallel-session-tracking-test.js
```

**Validation Checklist:**
- **[VALIDATION-CHECKLIST.md](../../tests/orchestrator-exe/VALIDATION-CHECKLIST.md)** - Manual verification guide

---

## What is Orchestrator-EXE?

Orchestrator-EXE is a **parallel work coordination agent** that enables multiple stories to be developed simultaneously during BMad Method sprints, achieving **1.5x-3x speedup** over sequential execution.

### Key Features

- ✅ **Dependency Analysis** - Identifies parallelizable stories
- ✅ **Manual Mode** - Generates terminal prompts for operator-driven coordination
- ✅ **Autonomous Mode** - Executes stories via MCP-validated contracts
- ✅ **Mixed Mode** - Manual template story → autonomous replication
- ✅ **Phase Awareness** - Adapts to first/second/third-pass context
- ✅ **Conflict Detection** - Identifies and resolves resource conflicts

### Architecture

- **Isolated from BMAD** - No event-driven interactions, operates independently
- **Top-Down Coordination** - Orchestrator → Agents (never reverse)
- **Direct Invocation** - Uses slash commands for agent coordination
- **8 Specialized Skills** - Each skill handles specific coordination aspect

---

## Quick Start

### 1. Complete Sprint Planning
```bash
/bmad:bmm:workflows:sprint-planning
```

### 2. Activate Orchestrator
```bash
/orchestrator-exe
```

### 3. Follow the Menu
- Orchestrator analyzes dependencies
- Recommends manual or autonomous mode
- Generates prompts or contracts

### 4. Execute Parallel Work
- **Manual:** Copy-paste terminal prompts
- **Autonomous:** Approve contracts, let orchestrator execute

**Result:** Stories complete in parallel with significant speedup

---

## Documentation Structure

### For Operators (Start Here)

1. **[EXAMPLES.md](./EXAMPLES.md)** - Complete guide with workflows
2. **[activation-scenarios.md](../../.system/parallel-work/examples/activation-scenarios.md)** - Step-by-step scenarios
3. **[terminal-prompts-manual.md](../../.system/parallel-work/examples/terminal-prompts-manual.md)** - Manual mode reference

### For Understanding the System

1. **[session-example.yaml](../../.system/parallel-work/examples/session-example.yaml)** - How sessions are tracked
2. **[dependencies-example.yaml](../../.system/parallel-work/examples/dependencies-example.yaml)** - Dependency analysis
3. **[coordination-log-example.yaml](../../.system/parallel-work/examples/coordination-log-example.yaml)** - Behind-the-scenes coordination

### For Autonomous Mode

1. **[yaml-contracts-autonomous.md](../../.system/parallel-work/examples/yaml-contracts-autonomous.md)** - Contract examples
2. **Contract Orchestrator Skill** - `.claude/skills/orchestrator-exe/contract-orchestrator.md`

### For Validation

1. **[run-all-tests.sh](../../tests/orchestrator-exe/run-all-tests.sh)** - Automated test suite
2. **[VALIDATION-CHECKLIST.md](../../tests/orchestrator-exe/VALIDATION-CHECKLIST.md)** - Manual checklist

---

## Example Scenarios

### Scenario 1: First-Pass Manual Mode
- **Epic:** 6 stories, 12h total
- **Strategy:** Balanced parallelism (2 terminals)
- **Result:** 6.5h vs 12h sequential (1.85x speedup)
- **See:** [EXAMPLES.md - Example 1](./EXAMPLES.md#example-1-first-pass-manual-mode)

### Scenario 2: Second-Pass Autonomous Mode
- **Epic:** 2 stories with contracts, 5.5h total
- **Strategy:** Full autonomous with MCP validation
- **Result:** 1.9h vs 5.5h sequential (2.9x speedup)
- **See:** [EXAMPLES.md - Example 2](./EXAMPLES.md#example-2-second-pass-autonomous-mode)

### Scenario 3: Mixed Mode (Manual → Autonomous)
- **Epic:** 6 refactoring stories, 12h total
- **Strategy:** Manual template story, autonomous replication
- **Result:** 5h vs 12h manual (2.4x speedup)
- **See:** [EXAMPLES.md - Example 3](./EXAMPLES.md#example-3-mixed-mode-transition)

### Scenario 4: Intra-Story Parallelism
- **Story:** Large dashboard redesign, 8h estimate
- **Strategy:** Split into 3 parallel tasks
- **Result:** 4h vs 8h sequential (2x speedup)
- **See:** [EXAMPLES.md - Example 4](./EXAMPLES.md#example-4-intra-story-parallelism)

---

## Skills Reference

### Analysis & Planning
- **sprint-batch-analyzer** - Analyzes sprint-status.yaml for parallel opportunities
- **decision_support** - Recommends manual vs autonomous mode
- **pass-awareness-advisor** - Provides phase-appropriate guidance

### Manual Mode
- **terminal-prompt-generator** - Creates formatted terminal prompts

### Autonomous Mode
- **contract-orchestrator** - Converts Markdown→YAML contracts, MCP integration

### Coordination
- **coordinate-agents** - Delegates to BMAD agents via slash commands
- **track-parallel-work** - Tracks session state and terminal progress
- **parallel-coordinator** - Detects conflicts, coordinates merge points

**Skills Location:** `.claude/skills/orchestrator-exe/`

---

## File Locations

### Configuration & Agent
- **Agent:** `.claude/agents/orchestrator-exe.md`
- **Slash Command:** `.claude/commands/orchestrator-exe.md`
- **Skills:** `.claude/skills/orchestrator-exe/*.md` (8 skills)

### Data & State
- **Execution Status:** `.system/execution-status.yaml` (THREE-PASS tracking)
- **Sessions:** `.system/parallel-work/session_*.yaml`
- **Dependencies:** `.system/parallel-work/dependencies_*.yaml`
- **Coordination Logs:** `.system/parallel-work/coordination-log-*.yaml`

### Contracts
- **Markdown (human-editable):** `.bmad/bmm/contracts/*.md`
- **YAML (MCP-validated):** `.system/parallel-work/contracts/*.yaml`

### Examples & Documentation
- **Examples:** `.system/parallel-work/examples/`
- **Documentation:** `docs/orchestrator-exe/`
- **Tests:** `tests/orchestrator-exe/`

---

## Validation

### Automated Tests

Run all validation tests:
```bash
cd tests/orchestrator-exe
bash run-all-tests.sh
```

**Tests verify:**
- ✅ Skill isolation (orchestrator-exe only access)
- ✅ MCP contract integration compatibility
- ✅ Parallel session tracking structure
- ✅ No BMAD event emission (isolation from BMAD)

### Manual Validation

Use the checklist:
```bash
cat tests/orchestrator-exe/VALIDATION-CHECKLIST.md
```

**Checklist verifies:**
- All skills exist with proper isolation markers
- Example files structurally complete
- YAML contracts have valid syntax
- Workflow integration with sprint-planning

---

## Common Use Cases

### When to Use Orchestrator-EXE

✅ Sprint has **3+ stories** with some independence
✅ Want **1.5x-3x speedup** vs sequential
✅ Multiple terminals/developers available
✅ Epic has clear story breakdown

### When NOT to Use

❌ Only 1-2 stories (overhead not worth it)
❌ All stories strictly sequential
❌ Team unfamiliar with parallel work
❌ Stories trivial (<30 min each)

---

## Getting Help

### Documentation
1. Start with **[EXAMPLES.md](./EXAMPLES.md)** (comprehensive guide)
2. Review **[activation-scenarios.md](../../.system/parallel-work/examples/activation-scenarios.md)** (workflows)
3. Check **[Troubleshooting section](./EXAMPLES.md#troubleshooting)** in EXAMPLES.md

### Example Files
- Study `.system/parallel-work/examples/*.yaml` for data structures
- Review `.system/parallel-work/examples/*.md` for operational examples

### Validation
- Run tests to verify setup: `bash tests/orchestrator-exe/run-all-tests.sh`
- Use checklist for manual verification

---

## Contributing

### Adding New Examples

1. Create example files in `.system/parallel-work/examples/`
2. Document in `EXAMPLES.md`
3. Add validation tests if applicable

### Improving Documentation

- **EXAMPLES.md** - Main operator guide
- **activation-scenarios.md** - Workflow walkthroughs
- **VALIDATION-CHECKLIST.md** - Verification procedures

---

## Summary

Orchestrator-EXE provides:

📊 **Dependency Analysis** → Identifies parallel opportunities
🎯 **Mode Recommendation** → Manual, autonomous, or mixed
⚡ **Parallel Execution** → 1.5x-3x speedup
🔍 **Conflict Detection** → Resource coordination
✅ **Isolation from BMAD** → Top-down coordination only

**Ready to start?** → Read **[EXAMPLES.md](./EXAMPLES.md)**

---

## Related Documentation

**Agent Definitions:**
- `../../.claude/agents/orchestrator-exe.md` - Command definition and menu
- `../../.system/agents/strategic/orchestrator-exe.md` - Agent persona and behaviors

**Skills:**
- `../../.claude/skills/orchestrator-exe/README.md` - Skills index and descriptions
- `../../.claude/skills/orchestrator-exe/` - Individual skill definitions

**Usage Guides (this directory):**
- `EXAMPLES.md` - Comprehensive operator guide with examples
- `USAGE_GUIDE.md` - Detailed usage patterns and workflows
- Other guides in this directory

---

**Last Updated:** 2025-01-15
**Version:** 1.0.0
**Examples:** 7 files
**Tests:** 3 automated suites
**Documentation:** ~3000 lines total
