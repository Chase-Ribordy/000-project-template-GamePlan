# Cleanup Notes: Development → Production Template

This document tracks all files to delete when creating the clean production template.

**Current Branch:** Development (messy, with tests and artifacts)
**Target:** Clean template on main/production branch

---

## PHASE 1: Development Artifacts (Delete First)

### Build Logs (17 files) - `.system/template/build-logs/`
```
.system/template/build-logs/
├── BATCH_1_2_COMPLETE.md
├── CLAUDE_CHAT_REVIEW_ADDRESSED.md
├── CLEANUP_TERMINAL_1.md
├── CLEANUP_TERMINAL_2.md
├── CLEANUP_TERMINAL_3.md
├── MCP_SERVER_ENHANCED.js
├── PARALLEL_EXECUTION_MASTER.md
├── PARALLEL_PROMPTS.md
├── PARALLEL_PROMPTS_BATCH3.md
├── PARALLEL_PROMPTS_QUALITY.md
├── README.md
├── SIMPLE_START.md
├── TERMINAL_1_REORGANIZE_COMMANDS.md
├── TERMINAL_2_CREATE_SKILLS.md
├── TERMINAL_3_ENHANCE_CHECKLIST.md
├── TERMINAL_4_DOCUMENTATION_UPDATES.md
└── reorganization/  (entire directory)
```

### MCP Server Diagnostics
```
.system/mcp-servers/DIAGNOSTIC.md
.system/mcp-servers/SUCCESS.md
```

### Planning Artifacts
```
.system/template/planning-notes.md
.system/template/README-VALIDATION.md
```

### User-Specific Config
```
.claude/settings.local.json  (keep .local.example.json)
```

---

## PHASE 2: Test Files (Delete for Production)

### Test Infrastructure
```
tests/                              # Entire folder
├── setup.js
├── README.md
├── jest.config.js
├── run-parallel.js
├── run-all-parallel.js
├── terminal-*.sh                   # 6 terminal scripts
├── unit/
├── integration/
├── fixtures/
├── utils/
└── orc-exe/
```

### Test Configuration
```
jest.config.js                      # Root level
package.json                        # Remove test scripts (keep package.json)
```

---

## PHASE 3: Runtime/Generated Files (Reset for Clean State)

### Execution Tracking (Reset to empty state)
```
.system/execution-status.yaml       # Reset to template state
.system/events/event-log.yaml       # Reset to empty events
```

### Any Generated Logs
```
.system/**/*.log                    # Any .log files
.system/**/*.json                   # Generated JSON (not config)
```

### Parallel Work State
```
.system/parallel-work/session_*.yaml
.system/parallel-work/dependencies_*.yaml
.system/parallel-work/coordination-log-*.yaml
.system/review-queue.yaml
.system/pass-history.yaml
```

### Agent State Files (Reset)
```
.system/agents/active-agents.yaml   # Reset to empty
.system/agents/handoff-history.yaml # Reset to empty
```

---

## PHASE 4: Test Documentation
```
TEST-WALKTHROUGH.md                 # End-to-end test guide
TEST-PROMPT.md                      # Prompt for guided test
ignore.md                           # Delete this file last
```

---

## FILES ALREADY DELETED (This Session)

These were deleted during documentation consolidation:
```
START_HERE.md                       # Redundant with README.md
README-IMPLEMENTATION.md            # Redundant (too technical)
docs/README-OPERATOR.md             # Redundant (now agent-facing)
docs/README-WORKFLOW.md             # Redundant (consolidated)
```

---

## ESSENTIAL FILES (Keep in Production Template)

### Root Level
```
README.md                           # Human-facing guide
package.json                        # Dependencies (remove test scripts)
.gitignore                          # Git patterns
```

### Documentation
```
docs/
├── README.md                       # Agent-facing
├── orc-exe/               # Orchestrator docs
├── TROUBLESHOOTING.md
└── PARALLEL-TESTING-GUIDE.md       # Maybe remove?
```

### System Infrastructure
```
.system/
├── README.md                       # Agent-facing
├── README-AUTONOMOUS.md
├── boilerplate/                    # Component templates
├── contracts/                      # Contract system
├── components/                     # Work-in-progress (empty)
├── proven/                         # Validated (empty)
├── sandbox/                        # Test harness
├── agents/                         # Agent definitions
├── mcp-servers/                    # MCP server (FUNCTIONAL)
├── validation/                     # Quality gates
├── events/                         # Event system (reset)
└── template/                       # Setup docs (keep essential)
```

### Claude Configuration
```
.claude/
├── config/                         # Settings (keep)
├── commands/                       # Slash commands (keep all)
├── skills/                         # Skills (keep all)
└── agents/                         # Agent definitions (keep)
```

### Empty Directories (Keep Structure)
```
src/                                # Production code destination
assets/                             # User assets
references/                         # User prototypes
```

---

## CLEANUP COMMANDS

### Quick Cleanup (Development Artifacts Only)
```bash
# Remove build logs
rm -rf .system/template/build-logs/

# Remove diagnostics
rm -f .system/mcp-servers/DIAGNOSTIC.md
rm -f .system/mcp-servers/SUCCESS.md

# Remove planning artifacts
rm -f .system/template/planning-notes.md
rm -f .system/template/README-VALIDATION.md

# Remove user-specific config
rm -f .claude/settings.local.json
```

### Full Production Cleanup
```bash
# All of the above, plus:

# Remove tests
rm -rf tests/
rm -f jest.config.js

# Reset runtime files
# (Would need to restore to template state, not just delete)

# Remove this file
rm -f ignore.md
```

---

## VERIFICATION CHECKLIST

Before marking production branch ready:

- [ ] All build-log files removed (17 files)
- [ ] MCP diagnostic files removed
- [ ] Planning artifacts removed
- [ ] User config removed (.claude/settings.local.json)
- [ ] Tests removed (entire tests/ folder)
- [ ] Runtime files reset to template state
- [ ] `/checklist` runs successfully
- [ ] `/orc-exe` launches correctly
- [ ] Example component intact (.system/components/example-button/)
- [ ] MCP server starts (test with component-registry.js)
- [ ] README.md reflects clean template usage
- [ ] This file (ignore.md) removed

---

## BRANCHING STRATEGY

```
main (production)     ← Clean template, verified working
    ↑
    │ (merge after verification)
    │
staging               ← Minimal cleanup, testing passed
    ↑
    │ (merge after MCP/orchestrator tested)
    │
development           ← Current state (this branch)
```

### When to Create Branches
1. **Now:** Stay on development, keep testing
2. **After MCP verified:** Create staging with Phase 1 cleanup
3. **After full test:** Create main with Phase 1-4 cleanup

---

## UNTESTED SYSTEMS (Verify Before Production)

These systems exist but haven't been tested end-to-end:

- [ ] MCP Server (`component-registry.js`)
- [ ] `/orc-exe` full workflow
- [ ] Component integration (`/integrate`)
- [ ] Contract validation (4 levels)
- [ ] Three-pass execution
- [ ] Parallel work coordination

**Test these BEFORE creating production branch.**

---

## NOTES

- MCP server is FUNCTIONAL (not placeholder) - 8 implemented tools
- Skills system is comprehensive (60+ skills)
- Contracts-first approach is solid architecture
- Build logs are purely diagnostic - safe to delete
- Tests are well-structured but only needed for template development

---

**This file should be deleted in the final production template.**
