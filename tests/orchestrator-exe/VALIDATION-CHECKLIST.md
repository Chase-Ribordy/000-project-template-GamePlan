# Orchestrator-EXE Validation Checklist

Use this checklist to manually verify orchestrator-exe integration and functionality.

---

## Automated Tests

Run automated validation suite:

```bash
cd tests/orchestrator-exe
bash run-all-tests.sh
```

- [ ] All automated tests pass
- [ ] No failures in skill isolation test
- [ ] No failures in MCP contract integration test
- [ ] No failures in parallel session tracking test

---

## Manual Validation Checklist

### 1. Skill Isolation

**Verification Steps:**

- [ ] All 8 orchestrator-exe skills exist in `.claude/skills/orchestrator-exe/`
  - [ ] `contract-orchestrator.md`
  - [ ] `coordinate-agents.md`
  - [ ] `track-parallel-work.md`
  - [ ] `decision-support.md`
  - [ ] `sprint-batch-analyzer.md`
  - [ ] `terminal-prompt-generator.md`
  - [ ] `parallel-coordinator.md`
  - [ ] `pass-awareness-advisor.md`

- [ ] Each skill file contains "Isolation Level: Orchestrator-EXE only"
- [ ] Each skill file contains "Invocation Pattern: Direct (not event-driven)"
- [ ] No BMAD agent files reference orchestrator-exe skills
- [ ] Orchestrator-exe agent does NOT emit BMAD events
- [ ] Orchestrator-exe agent does NOT subscribe to BMAD events

**Expected Behavior:**
- Orchestrator-exe operates independently of BMAD event system
- Skills can only be invoked by orchestrator-exe agent
- Top-down coordination maintained (orchestrator → agents, never reverse)

---

### 2. MCP Contract Integration

**Verification Steps:**

- [ ] `contract-orchestrator.md` skill exists and documents:
  - [ ] Markdown to YAML conversion process
  - [ ] Contract schema requirements
  - [ ] MCP validation integration points

- [ ] Example contracts in `.system/parallel-work/examples/yaml-contracts-autonomous.md`:
  - [ ] Valid YAML syntax
  - [ ] Complete contract schemas (contract_id, integration_points, error_handling, etc.)
  - [ ] MCP validation metadata present
  - [ ] Autonomous execution plans defined

- [ ] Contract directory structure exists:
  - [ ] `.bmad/bmm/contracts/` (for markdown contracts)
  - [ ] `.system/parallel-work/contracts/` (for YAML contracts)

**Expected Behavior:**
- Markdown contracts can be converted to YAML
- YAML contracts can be validated by MCP server
- Autonomous execution uses validated contracts

---

### 3. Parallel Session Tracking

**Verification Steps:**

- [ ] Session tracking files exist:
  - [ ] `.system/parallel-work/session-template.yaml`
  - [ ] `.system/parallel-work/dependencies-template.yaml`
  - [ ] `.system/parallel-work/examples/session-example.yaml`
  - [ ] `.system/parallel-work/examples/dependencies-example.yaml`
  - [ ] `.system/parallel-work/examples/coordination-log-example.yaml`

- [ ] Session example contains:
  - [ ] session_id, session_type, mode, phase
  - [ ] Terminal assignments (terminal_id, story_id, status, progress)
  - [ ] Coordination rules (conflict_zones, merge_points)
  - [ ] Communication log

- [ ] Dependencies example contains:
  - [ ] Story dependency graph
  - [ ] Multiple parallel work strategies
  - [ ] Conflict detection and resolution
  - [ ] Recommendations

- [ ] Coordination log contains:
  - [ ] Event types (session_start, agent_delegation, conflict_detected, etc.)
  - [ ] Isolation verification (no BMAD event emissions)
  - [ ] Coordination metrics

**Expected Behavior:**
- Sessions can track multiple terminals working in parallel
- Dependencies are properly analyzed
- Conflicts are detected and logged
- Coordination events are recorded

---

### 4. Workflow Integration

**Verification Steps:**

- [ ] Orchestrator-exe agent file exists: `.claude/agents/orchestrator-exe.md`
- [ ] Orchestrator-exe slash command exists: `.claude/commands/orchestrator-exe.md`
- [ ] Sprint-planning workflow creates `sprint-status.yaml`
- [ ] Orchestrator-exe can read and analyze `sprint-status.yaml`
- [ ] Orchestrator-exe reads `execution-status.yaml` for phase context

**Expected Behavior:**
- After sprint-planning completes, operator can invoke `/orchestrator-exe`
- Orchestrator analyzes sprint-status.yaml and recommends parallel strategies
- Phase awareness (first/second/third pass) guides recommendations

---

### 5. Manual Mode Operation

**Verification Steps:**

- [ ] Terminal prompts example exists: `.system/parallel-work/examples/terminal-prompts-manual.md`
- [ ] Example shows:
  - [ ] Formatted terminal layouts
  - [ ] Copy-paste ready commands
  - [ ] Coordination notes
  - [ ] First-pass, second-pass, third-pass examples
  - [ ] Inter-story and intra-story parallelism

- [ ] `terminal-prompt-generator` skill can generate prompts

**Expected Behavior:**
- Operator receives formatted terminal prompts
- Prompts include story context, dependencies, coordination notes
- Copy-paste commands ready for each terminal
- Clear guidance on when to start each terminal

---

### 6. Autonomous Mode Operation

**Verification Steps:**

- [ ] YAML contracts examples exist: `.system/parallel-work/examples/yaml-contracts-autonomous.md`
- [ ] Examples show:
  - [ ] Component integration contracts
  - [ ] Parallel story execution contracts
  - [ ] Pattern replication contracts
  - [ ] MCP validation metadata
  - [ ] Autonomous execution plans

- [ ] `contract-orchestrator` skill documented
- [ ] `decision_support` skill can recommend autonomous vs manual

**Expected Behavior:**
- For second-pass or pattern-based work, autonomous mode recommended
- Contracts define integration points, error handling, testing
- MCP server validates contracts before autonomous execution
- Orchestrator executes stories based on validated contracts

---

### 7. Documentation Completeness

**Verification Steps:**

- [ ] `docs/orchestrator-exe/EXAMPLES.md` exists
- [ ] Documentation includes:
  - [ ] End-to-end workflow examples
  - [ ] Manual mode examples
  - [ ] Autonomous mode examples
  - [ ] Mixed mode examples
  - [ ] Decision-making scenarios
  - [ ] Troubleshooting guide

- [ ] Examples are realistic and comprehensive
- [ ] Screenshots or formatted output samples included
- [ ] Clear guidance for operators

**Expected Behavior:**
- Operators can reference documentation to understand workflows
- Examples cover common scenarios
- Troubleshooting guide helps resolve issues

---

## Status Command Validation

**Note:** `/orc-status` and related commands mentioned in examples are NOT YET IMPLEMENTED.

- [ ] ⚠️ **TODO**: Implement `/orc-status` command
- [ ] ⚠️ **TODO**: Implement `/orc-pause` command
- [ ] ⚠️ **TODO**: Implement `/orc-resume` command
- [ ] ⚠️ **TODO**: Implement `/orc-log` command
- [ ] ⚠️ **TODO**: Implement `/orc-abort` command

These commands are referenced in documentation but require implementation.

---

## Expected Failures (Known Limitations)

These are expected and acceptable:

- [ ] Status commands (orc-status, etc.) not yet implemented
- [ ] No actual MCP server available for live contract validation
- [ ] Autonomous execution is conceptual (requires MCP server integration)

---

## Success Criteria

Orchestrator-EXE is properly integrated if:

✅ All automated tests pass
✅ All 8 skills exist with proper isolation markers
✅ Example files exist and are structurally complete
✅ YAML contracts have valid syntax and complete schemas
✅ Session tracking examples demonstrate parallel coordination
✅ Documentation is comprehensive and covers all scenarios
✅ Workflow integration with sprint-planning is clear

---

## Troubleshooting

### Test Failures

**Skill Isolation Test Fails:**
- Check that all skill files have "Isolation Level: Orchestrator-EXE only"
- Verify no BMAD agents reference orchestrator skills

**MCP Contract Test Fails:**
- Ensure YAML syntax is valid in example contracts
- Verify all required contract fields are present

**Session Tracking Test Fails:**
- Check that example YAML files exist
- Ensure session and dependencies examples have complete structure

### Common Issues

**Missing Dependencies:**
```bash
npm install js-yaml  # Required for YAML parsing in tests
```

**Permission Issues:**
```bash
chmod +x tests/orchestrator-exe/run-all-tests.sh
```

---

## Next Steps After Validation

Once validation passes:

1. **Try Manual Mode:**
   - Run sprint-planning workflow
   - Invoke `/orchestrator-exe`
   - Follow generated terminal prompts

2. **Review Examples:**
   - Study `activation-scenarios.md` for workflows
   - Review `terminal-prompts-manual.md` for prompt format
   - Understand `yaml-contracts-autonomous.md` for autonomous mode

3. **Implement Status Commands (Optional):**
   - Create `/orc-status` command for session monitoring
   - Add other monitoring/control commands as needed

4. **Connect MCP Server (Advanced):**
   - Set up MCP server for contract validation
   - Enable autonomous mode with real validation

---

## Validation Sign-Off

Validation completed by: _______________________

Date: _______________________

All checks passed: [ ] Yes [ ] No

Notes:
_______________________________________________________________________
_______________________________________________________________________
_______________________________________________________________________
