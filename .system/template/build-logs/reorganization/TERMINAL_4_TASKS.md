# Terminal 4: Operator Workflow Documentation

**Time estimate: 10-15 min**

---

## Overview

Create clear operator documentation for the simplified workflow with 7 commands and invisible skills.

---

## Task 1: Create docs/README-OPERATOR.md

```bash
# Ensure docs/ folder exists
mkdir -p docs

cat > docs/README-OPERATOR.md << 'EOF'
# Operator Workflow - Simplified 3-Phase Development

**Philosophy:** Maximum simplicity. Agents handle infrastructure, you focus on creativity.

---

## Your Workspace (What You Touch)

```
project/
├── docs/           ← Write requirements, architecture, notes
├── references/     ← Save Claude Chat prototypes here
└── assets/         ← Project files (images, data, etc.)
```

**That's it!** Everything else is agent-managed infrastructure.

---

## Your Commands (7 Total)

### Session Management
- **/checklist** - Start every session (validates environment)
- **/next-steps** - End session (creates handoff doc)

### Development
- **/integrate** - Shard Claude Chat prototypes into components
- **/quick-fix** - Rapid bug fixes (surgical, narrow scope)
- **/debug-css** - Systematic CSS debugging
- **/improve** - Creative problem-solving

### Reference
- **/workflow** - View this guide

---

## 3-Phase Workflow

### Phase 0: Session Start (2 minutes)

**Every session starts with:**

```bash
/checklist
```

**What it does:**
- Validates `.system/` folder structure
- Checks MCP server running
- Verifies git configured
- Offers interactive fixes for any issues

**Expected output:**
```
✅ Folder structure complete
✅ MCP server running
✅ Git initialized
✅ Environment ready! 🚀
```

**When to skip:** Never! Always run /checklist at session start.

---

### Phase 1: Planning & Prototyping (2-4 hours)

**Location: Claude Chat (Left screen)**

#### Step 1: Define Requirements (BMAD)

Use BMAD workflows in Claude Chat for planning:

```
/pm               - Activate product manager agent
/prd              - Generate product requirements document
/architect        - Design system architecture
/create-epics-and-stories - Break into deliverable stories
```

**Output locations:**
- Save PRD → `docs/prd.md`
- Save architecture → `docs/architecture.md`
- Save epics → `docs/epics/`
- Save stories → `docs/stories/`

#### Step 2: Prototype Features (Claude Chat)

Build complete features as single-file prototypes:

```
Claude Chat: "Build a dashboard with user stats, charts, and navigation"

Result: Complete 1500-line HTML file with embedded CSS/JS
```

**Save to:**
- `references/dashboard.html`
- `references/user-profile.html`
- `references/analytics-page.html`

**Why prototypes?**
- Full context (Claude Chat has 200k tokens)
- Beautiful UI (leverage Claude's design knowledge)
- Complete features (everything in one file)

---

### Phase 2: Execution (Variable Time)

**Location: VSCode + Claude Code (Right screen)**

This is where prototypes become production code.

#### Pass 1: Backend-First (Get It Working)

**Goal:** Features work, not pretty yet

**Approach:**
- Use BMAD `/dev-story` for backend features
- Basic HTML structure
- Minimal CSS (positioning only)
- Focus on functionality

**Example:**
```
/dev-story user-authentication
```

Agent implements:
- Database schema
- API endpoints
- Basic auth flow
- Simple login form (no styling)

#### Pass 2: Component Integration (Make It Beautiful)

**Goal:** Beautiful, user-friendly interface

**Workflow:**

1. **Create prototypes in Claude Chat:**
   ```
   "Build a beautiful login form with animations"
   → Save to references/login.html
   ```

2. **Shard in Claude Code:**
   ```bash
   /integrate references/login.html
   ```

3. **Agent automatically:**
   - Shards into components → `.system/components/`
   - Creates contracts → `.system/contracts/`
   - Validates each component (4 levels)
   - Proves in sandbox → `.system/sandbox/`
   - Archives proven → `.system/proven/`

4. **Review results:**
   ```
   Agent: "✅ 4 components validated and proven:
          - login-form (ready)
          - animated-input (ready)
          - submit-button (ready)
          - error-message (needs attention: CSS conflict)"
   ```

5. **Fix issues:**
   ```bash
   /debug-css error-message
   ```

**What's happening behind the scenes:**
- `contract_creation` skill runs (invisible)
- `component_validation` skill runs (invisible)
- `sandbox_testing` skill runs (invisible)
- You just see results!

#### Pass 3: Debug & Polish (Production Ready)

**Goal:** Ship-quality code

**Tools:**

```bash
# Systematic CSS debugging
/debug-css [component-name]
→ Creates isolated test file
→ Runs self-checking with metrics
→ Fixes layout/animation issues

# Rapid bug fixes
/quick-fix [issue]
→ Plan → Implement → Verify
→ Surgical, narrow scope only

# Creative problem-solving
/improve [feature/issue]
→ Auto-discovers relevant files
→ Analyzes problem
→ Recommends solution
→ Implements after approval
```

**This pass focuses on:**
- Visual polish (animations, transitions, micro-interactions)
- Edge cases (error handling, loading states)
- Performance (lazy loading, optimization)
- Accessibility (ARIA labels, keyboard navigation)

---

### Phase 3: Wrap-Up (30 minutes)

**End every session with:**

```bash
/next-steps
```

**Creates:** `docs/next-steps.md`

**Includes:**
- What was accomplished
- Current blockers
- Ready queue (what's next)
- Context crumbs (important details)
- Handoff notes (for next session/developer)

**Also consider:**
- Run tests: `npm test`
- Commit changes: `git add . && git commit -m "feat: ..."`
- Push to remote: `git push`

---

## Mental Model: Two Screens, Two Contexts

### Left Screen: Claude Chat
- **Context:** Full product (200k tokens)
- **Use for:** Planning, prototyping complete features
- **Output:** Docs, complete HTML prototypes

### Right Screen: VSCode + Claude Code
- **Context:** Modular components (focused)
- **Use for:** Production code, debugging, integration
- **Output:** Production codebase

---

## Command Decision Tree

### "I'm starting a session"
→ `/checklist`

### "I need to plan a feature"
→ Claude Chat + BMAD workflows → `docs/`

### "I built a prototype in Claude Chat"
→ Save to `references/` → `/integrate`

### "This component has a CSS bug"
→ `/debug-css [component]`

### "This feature has a bug"
→ `/quick-fix [issue]`

### "I need to improve/refactor something"
→ `/improve [feature]`

### "I'm ending a session"
→ `/next-steps`

### "How do I...?"
→ `/workflow` (you are here!)

---

## What You DON'T Need to Do

**You don't need to:**
- ❌ Navigate `.system/` folder (agent infrastructure)
- ❌ Write contracts manually (skills handle it)
- ❌ Run validation manually (skills handle it)
- ❌ Create sandbox tests (skills handle it)
- ❌ Remember 37 BMAD commands (use a few key ones)
- ❌ Understand component architecture (abstracted)

**You focus on:**
- ✅ Creative work (design, features, UX)
- ✅ Requirements (what to build)
- ✅ Prototyping (complete features)
- ✅ Integration (running /integrate)
- ✅ Debugging (when needed)

---

## Example: Full Feature Workflow

### 1. Session Start
```bash
/checklist
# ✅ Environment ready!
```

### 2. Plan in Claude Chat
```
/pm
→ Define user dashboard feature
→ Save to docs/prd.md

/architect
→ Design component architecture
→ Save to docs/architecture.md
```

### 3. Prototype in Claude Chat
```
"Build a user dashboard with:
- Header with user avatar and notifications
- Stats cards showing key metrics
- Chart showing user activity over time
- Recent activity feed
- Quick actions sidebar"

→ Claude generates beautiful 1500-line prototype
→ Save to references/dashboard.html
```

### 4. Integrate in Claude Code
```bash
/integrate references/dashboard.html

# Agent (invisible skills running):
# - Sharding into components...
# - Creating contracts...
# - Validating components...
# - Proving in sandbox...

# Agent output:
✅ 8 components validated and proven:
   - dashboard-header (ready)
   - user-avatar (ready)
   - notification-bell (ready)
   - stats-card (ready)
   - activity-chart (ready)
   - activity-feed (ready)
   - quick-actions (ready)
   - card-container (ready)

All components archived in .system/proven/
Ready for production integration!
```

### 5. Debug (if needed)
```bash
# If there's an issue:
/debug-css activity-chart
→ Agent creates isolated test
→ Identifies chart overflow issue
→ Fixes CSS
→ Re-validates
```

### 6. Session End
```bash
/next-steps

# Creates docs/next-steps.md:
## Accomplished
- ✅ Dashboard prototype created
- ✅ 8 components integrated and proven
- ✅ CSS issues resolved

## Next Session
- Integrate dashboard into main app
- Add user data loading
- Test on mobile devices

## Context
- Dashboard uses Chart.js for activity visualization
- Stats cards use real-time WebSocket updates
- Consider adding export functionality
```

**Total time:** 3-4 hours (most in Claude Chat prototyping)

---

## Advanced Tips

### Tip 1: Prototype First, Always
Never code components from scratch. Build in Claude Chat first, then `/integrate`.

**Why?**
- Claude Chat has full context
- Better UI/UX decisions
- Faster iteration
- Complete features, not fragments

### Tip 2: Use BMAD for Planning, Not Coding
BMAD is for requirements, architecture, and stories. For actual code, use prototyping → integration.

### Tip 3: Let Skills Work Invisibly
You don't need to think about contracts, validation, or proving. Just `/integrate` and review results.

### Tip 4: Debug Systematically
- CSS issues: `/debug-css`
- Feature bugs: `/quick-fix`
- Complex problems: `/improve`

Don't mix tools—each has a specific purpose.

### Tip 5: End Every Session with /next-steps
Future you (or another developer) will thank you for the context.

---

## Troubleshooting

### "/checklist fails with MCP errors"
→ Run once: Skills will auto-setup MCP on first run
→ Follow interactive prompts

### "/integrate creates too many components"
→ Expected! Agents shard for modularity
→ Review in `.system/proven/` after validation
→ Proven components are production-ready

### "I don't understand .system/ folder"
→ Perfect! You're not supposed to
→ It's agent infrastructure
→ Just use `/integrate` and let agents handle it

### "Validation fails on a component"
→ Agent will report which level failed
→ Use `/quick-fix` or `/debug-css` to resolve
→ Re-run `/integrate` after fix

---

## Remember

**Simplicity is the goal.**

You have 7 commands. You work in 3 folders. Everything else is automated.

Focus on creativity, let agents handle infrastructure.

---

**Questions? Run `/workflow` anytime to see this guide!**
EOF
```

---

## Task 2: Create .claude/commands/personal/README.md

```bash
cat > .claude/commands/personal/README.md << 'EOF'
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
| `/define-contract` | `contract_creation` | Creating new component |
| `/validate-component` | `component_validation` | Before integration |
| `/prove-it-works` | `sandbox_testing` | After validation passes |
| `/integrate-mcp` | `mcp_setup` | First-time setup |

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
- Auto-calls `contract_creation` skill for each component
- Auto-calls `component_validation` skill (4 levels)
- Auto-calls `sandbox_testing` skill
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
EOF
```

---

## Task 3: Update .claude/skills/README.md

**Already created in Terminal 1, but verify it exists:**

```bash
cat .claude/skills/README.md
```

**If Terminal 1 hasn't completed yet, create it:**

See Terminal 1 tasks for content (contract_creation, component_validation, etc.)

---

## Task 4: Verify Documentation Links

```bash
# Check all created docs exist
ls -la docs/README-OPERATOR.md
ls -la .claude/commands/personal/README.md
ls -la .claude/skills/README.md

# Verify content
head -20 docs/README-OPERATOR.md
head -20 .claude/commands/personal/README.md
```

---

## Validation Commands

```bash
# 1. Verify README-OPERATOR.md created
cat docs/README-OPERATOR.md | grep "3-Phase Workflow"
# Should show section exists

# 2. Verify personal commands README created
cat .claude/commands/personal/README.md | grep "7 commands"
# Should show command count

# 3. Verify skills README exists (from Terminal 1)
ls .claude/skills/README.md
# Should exist

# 4. Check documentation is comprehensive
wc -l docs/README-OPERATOR.md
# Should be ~400-500 lines (comprehensive guide)

wc -l .claude/commands/personal/README.md
# Should be ~200-300 lines (detailed reference)

# 5. Verify all commands documented
grep -E "^### /" .claude/commands/personal/README.md
# Should show all 7 commands with ### headers
```

---

## Completion Checklist

- [ ] `docs/README-OPERATOR.md` created (comprehensive 3-phase guide)
- [ ] `.claude/commands/personal/README.md` created (7 commands reference)
- [ ] `.claude/skills/README.md` verified (from Terminal 1)
- [ ] All documentation links work
- [ ] Command count verified (7 remaining)
- [ ] Phase mapping clear (0, 2, 3)
- [ ] Skills vs commands distinction explained
- [ ] Operator simplicity emphasized throughout

---

## Troubleshooting

### If docs/ folder doesn't exist:
```bash
mkdir -p docs
```

### If content seems incomplete:
- Check line count (should be substantial)
- Verify all sections present
- Ensure examples included

### If Terminal 1 hasn't finished skills README:
- Wait for Terminal 1 to complete
- Or create skills README using Terminal 1's content

---

## Content Verification

### README-OPERATOR.md should include:
- ✅ 3-phase breakdown (Phase 0, 1, 2, 3)
- ✅ 7 commands with when to use
- ✅ Full feature workflow example
- ✅ Two-screen mental model (Claude Chat + VSCode)
- ✅ Command decision tree
- ✅ What you DON'T need to do
- ✅ Troubleshooting section

### personal/README.md should include:
- ✅ All 7 commands listed
- ✅ Quick reference table
- ✅ Phase mapping
- ✅ Skills migration table (old → new)
- ✅ Detailed command documentation
- ✅ Skills vs commands distinction

---

**Report back when complete!**
