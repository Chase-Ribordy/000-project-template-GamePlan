# Parallel Testing Guide

Run these commands in **separate terminals** simultaneously to test the entire system in parallel for 3-4x faster execution.

## Quick Start - Copy-Paste Commands

Open 6 terminals and copy ONE command into EACH terminal:

### 🔵 TERMINAL 1 - Contract Compliance (19 tests, ~3-5s)
```bash
cd "C:\Users\chase\Downloads\project-template" && npm run test:contracts
```

### 🟢 TERMINAL 2 - MCP Integration (12 tests, ~8-10s)
```bash
cd "C:\Users\chase\Downloads\project-template" && npm run test:mcp
```

### 🟡 TERMINAL 3 - 4-Level Validation (17 tests, ~3-5s)
```bash
cd "C:\Users\chase\Downloads\project-template" && npm run test:validation
```

### 🟣 TERMINAL 4 - Architecture Validation (31 tests, ~5-6s)
```bash
cd "C:\Users\chase\Downloads\project-template" && npm run test:architecture
```

### 🔵 TERMINAL 5 - Skills & Workflows (25 tests, ~5-6s)
```bash
cd "C:\Users\chase\Downloads\project-template" && npm run test:skills
```

### 🔴 TERMINAL 6 - Smoke Tests (18 tests, ~5-6s)
```bash
cd "C:\Users\chase\Downloads\project-template" && npm run test:smoke
```

---

## Expected Results

When all 6 terminals complete:

```
Terminal 1: ✅ 19 tests passed (Contract Compliance)
Terminal 2: ✅ 12 tests passed (MCP Integration)
Terminal 3: ✅ 17 tests passed (4-Level Validation)
Terminal 4: ✅ 31 tests passed (Architecture)
Terminal 5: ✅ 25 tests passed (Skills & Workflows)
Terminal 6: ✅ 18 tests passed (Smoke Tests)

TOTAL: 122 tests passed in ~10 seconds!
```

**vs ~30-40 seconds if run sequentially (3-4x speedup!)**

---

## Visual Layout

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Terminal 1     │  │  Terminal 2     │  │  Terminal 3     │
│  Contracts      │  │  MCP            │  │  Validation     │
│  19 tests       │  │  12 tests       │  │  17 tests       │
│  ~3-5s          │  │  ~8-10s         │  │  ~3-5s          │
└─────────────────┘  └─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Terminal 4     │  │  Terminal 5     │  │  Terminal 6     │
│  Architecture   │  │  Skills         │  │  Smoke Tests    │
│  31 tests       │  │  25 tests       │  │  18 tests       │
│  ~5-6s          │  │  ~5-6s          │  │  ~5-6s          │
└─────────────────┘  └─────────────────┘  └─────────────────┘

All running SIMULTANEOUSLY → Total time: ~10s
```

---

## How To Execute

### Option 1: Command Line Terminals (Recommended)

1. Open 6 command prompt/PowerShell/terminal windows
2. Copy-paste one command block into each terminal
3. Press Enter on all 6 terminals quickly
4. Watch them all run in parallel!

### Option 2: Claude Code Terminals

1. Open 6 Claude Code chat sessions
2. Copy-paste one command block into each session
3. All will execute in parallel
4. Check results in each session

### Option 3: VS Code Split Terminals

1. Open VS Code
2. Split terminal 6 times (Ctrl+Shift+5 repeatedly)
3. Copy-paste one command into each split
4. Run all simultaneously

### Option 4: tmux/screen (Linux/Mac)

```bash
# Create 6 panes in tmux
tmux new-session \; \
  split-window -h \; \
  split-window -v \; \
  select-pane -t 0 \; \
  split-window -v \; \
  select-pane -t 2 \; \
  split-window -v \; \
  select-pane -t 4 \; \
  split-window -v

# Then paste commands into each pane
```

---

## Platform-Specific Commands

### Windows Command Prompt / PowerShell

```cmd
REM Terminal 1
cd C:\Users\chase\Downloads\project-template && npm run test:contracts

REM Terminal 2
cd C:\Users\chase\Downloads\project-template && npm run test:mcp

REM Terminal 3
cd C:\Users\chase\Downloads\project-template && npm run test:validation

REM Terminal 4
cd C:\Users\chase\Downloads\project-template && npm run test:architecture

REM Terminal 5
cd C:\Users\chase\Downloads\project-template && npm run test:skills

REM Terminal 6
cd C:\Users\chase\Downloads\project-template && npm run test:smoke
```

### Linux / Mac / Git Bash

```bash
# Terminal 1
cd ~/Downloads/project-template && npm run test:contracts

# Terminal 2
cd ~/Downloads/project-template && npm run test:mcp

# Terminal 3
cd ~/Downloads/project-template && npm run test:validation

# Terminal 4
cd ~/Downloads/project-template && npm run test:architecture

# Terminal 5
cd ~/Downloads/project-template && npm run test:skills

# Terminal 6
cd ~/Downloads/project-template && npm run test:smoke
```

---

## Quick Test: Run Just 3 Terminals

If you want to run fewer terminals, start with these 3 core suites:

**Terminal 1: Contract Compliance**
```bash
cd "C:\Users\chase\Downloads\project-template" && npm run test:contracts
```

**Terminal 2: 4-Level Validation**
```bash
cd "C:\Users\chase\Downloads\project-template" && npm run test:validation
```

**Terminal 3: Smoke Tests**
```bash
cd "C:\Users\chase\Downloads\project-template" && npm run test:smoke
```

This covers contracts, validation pipeline, and end-to-end smoke tests (54 tests total).

---

## Automated Option

If you want ONE command that runs all 6 in parallel automatically:

```bash
cd "C:\Users\chase\Downloads\project-template" && npm run test:all
```

This spawns all 6 test suites as background processes and shows a summary when done.

---

## Timing Expectations

| Terminal | Test Suite | Tests | Expected Time |
|----------|-----------|-------|---------------|
| 1 | Contract Compliance | 19 | 3-5 seconds |
| 2 | MCP Integration | 12 | 8-10 seconds |
| 3 | 4-Level Validation | 17 | 3-5 seconds |
| 4 | Architecture | 31 | 5-6 seconds |
| 5 | Skills & Workflows | 25 | 5-6 seconds |
| 6 | Smoke Tests | 18 | 5-6 seconds |

**Total parallel time:** ~10 seconds (limited by longest terminal)
**Sequential time:** ~30-40 seconds
**Speedup:** 3-4x faster

---

## Troubleshooting

### All terminals finish too quickly
- Check if tests are actually running
- Look for error messages
- Try running one terminal first to verify setup

### One terminal fails
- Read the error message carefully
- That specific test suite may have found an issue
- Other terminals should still pass
- Fix the issue and re-run just that terminal

### Want to run just specific tests
Use any combination:
```bash
# Just 3 terminals
npm run test:contracts    # Terminal 1
npm run test:validation   # Terminal 2
npm run test:smoke        # Terminal 3
```

### Tests are slow
- Check if other processes are consuming CPU
- Jest is configured for 50% CPU usage in parallel
- MCP tests take longest (~8-10s) - this is normal

---

## Advanced Usage

### Watch Mode in Parallel

Run tests in watch mode across multiple terminals for continuous testing:

```bash
# Terminal 1
npm run test:contracts -- --watch

# Terminal 2
npm run test:validation -- --watch

# Terminal 3
npm run test:smoke -- --watch
```

Changes to code will auto-trigger tests in parallel!

### CI/CD Parallel Execution

For automated CI/CD pipelines:

```yaml
# GitHub Actions example
jobs:
  test:
    strategy:
      matrix:
        suite: [contracts, mcp, validation, architecture, skills, smoke]
    runs-on: ubuntu-latest
    steps:
      - run: npm run test:${{ matrix.suite }}
```

All 6 suites run in parallel GitHub runners!

---

## What Each Suite Tests

**Contract Compliance (19 tests)**
- YAML contract structure validation
- Component interface compliance
- Contract-to-code mapping

**MCP Integration (12 tests)**
- MCP server connectivity
- Component registration
- Conflict detection queries

**4-Level Validation (17 tests)**
- Level 1: Syntax validation
- Level 2: Unit test compliance
- Level 3: Contract compliance
- Level 4: Integration safety

**Architecture (31 tests)**
- Directory structure
- File organization
- System component relationships
- Build intelligence setup

**Skills & Workflows (25 tests)**
- Autonomous skill definitions
- Event-driven triggers
- Orchestrator-exe skills
- Workflow configurations

**Smoke Tests (18 tests)**
- End-to-end system checks
- Critical path validation
- Integration smoke tests

---

## Related Documentation

- Test organization: `tests/README.md`
- Jest configuration: `jest.config.js`
- Package scripts: `package.json`
