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

**What's happening behind the scenes:** Event-driven skills auto-run (contract creation → validation → sandbox testing → integration). See `.system/README-AUTONOMOUS.md` for technical details.

---

#### BMAD Integration

**When to use:**
- **BMAD** (`/pm`, `/prd`, `/architect`, `/dev-story`): Planning, requirements, backend scaffolding
- **Autonomous** (`/integrate`, `/debug-css`, `/quick-fix`): UI integration, component validation, debugging

**Workflow:** BMAD plans → Claude Chat prototypes → `/integrate` executes → Check `.system/execution-status.yaml` for completion

See `docs/README-WORKFLOW.md` for detailed BMAD + Autonomous integration patterns.

---

#### Parallel Processing

Processes up to 5 components simultaneously. Smart re-runs skip successful components, only retry failures.

**Check progress:** `cat .system/execution-status.yaml` (current state, component status, metrics) and `.system/events/event-log.yaml` (audit trail)

---

#### Troubleshooting

**Validation failures:** Check `.system/components/{name}/validation-report.md`, fix issues, re-run `/integrate` (smart re-run only retries failures)

**Common issues:**
- Missing CSS namespace (`.component-name-` prefix required)
- Contract mismatch
- Integration conflicts (MCP Level 4 failure)

**Detailed troubleshooting:** See `docs/TROUBLESHOOTING.md`

**Technical deep dive:** See `.system/README-AUTONOMOUS.md`

---

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

---

## Quick Command Reference

- **Start:** `/checklist`
- **Plan:** Claude Chat + `/pm`, `/prd`, `/architect` → `docs/`
- **Prototype:** Claude Chat → save to `references/`
- **Integrate:** `/integrate references/[file].html`
- **Debug:** `/debug-css [component]`, `/quick-fix [issue]`, `/improve [feature]`
- **End:** `/next-steps`, commit & push

**Mental model:** Left screen (Claude Chat) for planning/prototyping, Right screen (VSCode) for production integration

**You don't touch:** `.system/` folder, contracts, validation, sandbox tests (all automated)

---

## Example Workflow

```bash
/checklist                           # Start session
# → Claude Chat: /pm, /prd, /architect (plan + prototype → references/dashboard.html)
/integrate references/dashboard.html  # Shard + validate + prove (autonomous)
/debug-css activity-chart            # Fix issues if needed
/next-steps                          # End session with handoff doc
```

---

## Quick Tips

- **Prototype first:** Build in Claude Chat, then `/integrate` (never code from scratch)
- **BMAD for planning:** Use `/pm`, `/prd`, `/architect` for strategy, not implementation
- **Let skills work:** Don't think about contracts/validation, just `/integrate` and review
- **Debug systematically:** `/debug-css` for styling, `/quick-fix` for bugs, `/improve` for refactoring
- **Always `/next-steps`:** Future you will thank you for the context

---

## Common Questions

**"/checklist fails?"** → Follow interactive MCP setup prompts (one-time)
**"Too many components?"** → Expected sharding for modularity, review in `.system/proven/`
**"Don't understand .system/?"** → Perfect! It's agent infrastructure, use `/integrate` and ignore it
**"Validation fails?"** → Agent reports which level failed, use `/quick-fix` or `/debug-css`, re-run `/integrate`

---

## Remember

**Simplicity is the goal.**

You have 7 commands. You work in 3 folders. Everything else is automated.

Focus on creativity, let agents handle infrastructure.

---

**Questions? Run `/workflow` anytime to see this guide!**
