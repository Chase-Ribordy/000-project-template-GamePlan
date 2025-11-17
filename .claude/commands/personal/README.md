# Personal Commands - Operator Interface

These are your **manual slash commands**—the simple interface for development.

---

## Quick Reference

| Command | When to Use | Time |
|---------|-------------|------|
| `/checklist` | Session start | 30s |
| `/integrate` | After creating prototype | 2-5 min |
| `/quick-fix` | Bug needs fast fix | 5-10 min |
| `/debug-css` | CSS/animation issue | 10-15 min |
| `/improve` | Feature needs enhancement | 15-30 min |
| `/next-steps` | Session end | 2 min |
| `/workflow` | View workflow guide | - |

**Total: 7 commands** (down from 11!)

---

## Commands by Phase

### Phase 0: Session Start
- **/checklist** - Validate environment, setup checks

### Phase 2: Execution
- **/integrate** - Shard prototypes into components (hybrid: calls skills)
- **/quick-fix** - Rapid surgical bug fixes
- **/debug-css** - Systematic CSS debugging
- **/improve** - Creative problem-solving

### Phase 3: Wrap-Up
- **/next-steps** - Session handoff documentation

### Reference
- **/workflow** - Development workflow guide

---

## What Happened to the Other Commands?

### Converted to Claude Skills (Invisible):

These are now **automated** and run invisibly:

| Old Command | New Skill | Auto-Triggered When |
|-------------|-----------|---------------------|
| `/define-contract` | `contract-creation` | Creating new component |
| `/validate-component` | `component-validation` | Before integration |
| `/prove-it-works` | `sandbox-testing` | After validation passes |
| `/integrate-mcp` | `mcp-setup` | First-time setup |

**See:** `.claude/skills/README.md` for skill documentation

### Why the Change?

**Before:** 11 commands to remember, perfect timing required
**After:** 7 commands focused on creativity, skills handle infrastructure

**Result:** Simpler interface, less cognitive load, same quality

---

## Command Details

### /checklist
**Purpose:** Pre-game ritual for session start

**What it does:**
- Validates `.system/` folder structure
- Checks MCP server status
- Verifies git configuration
- Offers interactive fixes

**When to use:** Start of EVERY session

**Example:**
```bash
/checklist

# Output:
✅ Folder structure complete
✅ MCP server running
✅ Git initialized
✅ Environment ready! 🚀
```

---

### /integrate
**Purpose:** Shard Claude Chat prototypes into production components

**What it does:**
- Breaks large prototypes into modular components
- Auto-calls `contract-creation` skill for each component
- Auto-calls `component-validation` skill (4 levels)
- Auto-calls `sandbox-testing` skill
- Reports validation results

**When to use:** After creating prototype in Claude Chat

**Example:**
```bash
/integrate references/dashboard.html

# Output:
Sharding dashboard.html into components...
✅ 5 components created and validated:
   - dashboard-header (proven)
   - stats-card (proven)
   - activity-chart (proven)
   - user-avatar (proven)
   - notification-bell (needs attention: CSS conflict)

4/5 archived in .system/proven/
```

**Note:** This is a **hybrid command**—you trigger it manually, but it calls skills automatically.

---

### /quick-fix
**Purpose:** Rapid bug fixes with narrow scope

**What it does:**
- Plan → Implement → Verify workflow
- Surgical, focused fixes only
- Fast iteration

**When to use:** Bug needs immediate fix

**When NOT to use:**
- Large refactors (use `/improve`)
- CSS issues (use `/debug-css`)

**Example:**
```bash
/quick-fix login button not submitting form

# Agent:
# 1. Analyzes issue
# 2. Implements fix
# 3. Verifies with test
# 4. Reports success
```

---

### /debug-css
**Purpose:** Systematic CSS debugging with isolation

**What it does:**
- Creates isolated test environment
- Reproduces issue in isolation
- Self-checking with performance metrics
- Fixes layout/animation problems

**When to use:**
- Visual bugs (layout, spacing, alignment)
- Animation issues
- CSS conflicts

**Example:**
```bash
/debug-css activity-chart

# Agent:
# 1. Creates debug/activity-chart-test.html
# 2. Isolates component
# 3. Identifies overflow issue
# 4. Fixes CSS
# 5. Validates fix with metrics
```

---

### /improve
**Purpose:** Creative problem-solving and enhancement

**What it does:**
- Auto-discovers relevant files
- Analyzes problem/opportunity
- Recommends solution with tradeoffs
- Implements after operator approval

**When to use:**
- Feature needs enhancement
- Code needs refactoring
- Performance optimization needed

**Example:**
```bash
/improve dashboard loading performance

# Agent:
# 1. Discovers dashboard files
# 2. Analyzes performance bottlenecks
# 3. Recommends: lazy loading + code splitting
# 4. Waits for approval
# 5. Implements solution
```

---

### /next-steps
**Purpose:** Session handoff documentation

**What it does:**
- Documents what was accomplished
- Lists current blockers
- Identifies ready queue (what's next)
- Captures context crumbs
- Creates handoff notes

**When to use:** End of EVERY session

**Example:**
```bash
/next-steps

# Creates: docs/next-steps.md
## Accomplished
- ✅ Dashboard integrated
- ✅ 8 components proven

## Blockers
- ⚠️ Chart.js version conflict

## Ready Queue
- User authentication flow
- Mobile responsive design

## Context
- Using Chart.js 4.x for visualizations
- WebSocket connection on port 3001
```

---

### /workflow
**Purpose:** View development workflow guide

**What it does:**
- Displays comprehensive workflow documentation
- Shows command decision tree
- Provides examples

**When to use:** Reference anytime

**Example:**
```bash
/workflow
```

---

## Skills vs. Commands

### When It's a Skill (Invisible)
- Repetitive, automatable workflow
- Clear pass/fail criteria
- No creative decision needed
- **Examples:** Contract creation, validation, proving

### When It's a Command (Manual)
- Requires human judgment
- Creative problem-solving
- Explicit operator trigger
- **Examples:** Debugging, improving, integrating

---

## Phase Mapping

### Phase 0: Setup (2 min)
```
/checklist
```

### Phase 1: Planning (2-4 hours)
*Use BMAD in Claude Chat—no personal commands needed*

### Phase 2: Execution (variable)
```
/integrate   # After prototyping
/debug-css   # For CSS issues
/quick-fix   # For bugs
/improve     # For enhancements
```

### Phase 3: Wrap-Up (2 min)
```
/next-steps
```

---

## Simplified Mental Model

```
Operator workflow:
1. /checklist (start)
2. Build in Claude Chat → references/
3. /integrate references/[file]
4. /debug-css or /quick-fix (as needed)
5. /next-steps (end)

Agent handles invisibly:
- Contracts
- Validation
- Sandbox testing
- Component proving
- Quality gates
```

---

## See Also

- **Operator workflow:** `docs/README-OPERATOR.md`
- **Skills documentation:** `.claude/skills/README.md`
- **BMAD workflows:** `.claude/commands/bmad/`
- **Project structure:** `.system/template/README-STRUCTURE.md`

---

**Remember:** You have 7 commands. Focus on creativity, let skills handle infrastructure.
