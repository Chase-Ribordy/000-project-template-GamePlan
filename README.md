# Quality-First Project Template

A clean, operator-focused development template for building high-quality software fast.

## Quick Start (5 Minutes)

```bash
# 1. Copy template to your project
cp -r project-template my-project
cd my-project

# 2. Validate environment
/checklist

# 3. Read setup guide (one time)
cat .system/template/README-QUICKSTART.md

# 4. Start building
/define-contract my-first-component
```

## Your Workspace (What You Touch)

As an operator, you work in these folders:

### `docs/` - Your Knowledge Base
Write and organize all project documentation:
- PRDs (`/prd` creates these)
- Architecture docs (`/architecture`)
- Planning notes
- Research findings
- Decision records

### `references/` - Claude Chat Prototypes
Build complete features in Claude Chat (full context), save here:
- Complete UI pages (500-2000 lines)
- Working prototypes
- Proof-of-concept code

Then use `/integrate` to shard into components.

### Your Output (Automated Migration)
After running `/integrate` and quality workflows:
1. `.system/components/` - Components are extracted and built (50-200 lines each)
2. `.system/contracts/` - Component specifications are generated
3. `.system/proven/` - Components pass all 4 validation levels
4. `src/` - **Production-ready components** (automatically migrated from `.system/proven/`)

You work in `src/` for version control and deployment. You don't navigate `.system/` - it's all automated.

### `assets/` - Project Files
Images, fonts, icons, data files, media.

### `tests/` - Test Visibility
See all tests and coverage at a glance:
- Component tests
- Integration tests
- Module documentation
- Coverage reports

## Hidden Infrastructure (Ignore This)

### `.system/` - Agent Infrastructure
Contains all the machinery that makes quality workflows work:
- `components/` - Built/sharded components (managed by agents)
- `contracts/` - Component specifications (created by `/define-contract`)
- `proven/` - Validated components (created by `/prove-it-works`)
- `sandbox/` - Testing environment
- `validation/` - Quality gates
- `mcp-servers/` - Component registry
- `template/` - Setup documentation

**You never need to navigate here.** Slash commands handle everything.

Only exception: Initial setup - read `.system/template/README-QUICKSTART.md` once.

## Your Workflow

Based on your actual process:

### L: Claude Chat (Docs & Prototypes)
1. **Simplify plan** → Write to `docs/`
2. **Talk to agent** → `/pm` for PRD
3. **Finish specifics** → Refine docs
4. **Create PRD** → `/prd`
5. **Design UI/UX** → Outline in docs, `/create-ux-design`
6. **Formalize** → `/architect` for system design
7. **Build prototypes** → Claude Chat → Save to `references/`

### R: VSCode/Claude Code (Agentic Flow)
8. **Create prompts per component** → `/sm` for epics & stories
9. **Begin development** → `/dev-story`
10. **Integrate references** → `/integrate references/my-feature.html`
11. **Manual test** → Check milestones
12. **Debug** → `/quick-fix`, `/improve`, `/debug-css`
13. **Final tests** → `/tea` for documentation
14. **Push** → `git push`

## Autonomous Execution System ⚡

**One command, complete automation.** `/integrate` extracts components, creates contracts, validates quality (4 levels), sandbox tests, integrates safely, and migrates to production `src/` folder - all in ~45 seconds with zero manual actions. Event-driven skills auto-trigger, MCP validates integration conflicts, and execution status tracks progress in real-time.

**Three-Pass Workflow:** Backend First (`/dev-story`) → Component Integration (`/integrate`) → Debug & Polish (`/debug-css`, `/quick-fix`)

**Learn more:** `.system/README-AUTONOMOUS.md` - Complete technical documentation

## The "Slow is Fast" Principle

**Traditional**: Code (30 min) → Debug (3 hours) → Fix (2 hours) = **5.5 hours** ❌

**Quality-first**: Contract (10 min) → Test (20 min) → Code (30 min) → Validate (10 min) = **1.3 hours** ✅

## Command Reference

See `.bmad/` for 37 total workflows covering full SDLC.

| Command | Use When | Common Scenarios | Output Location |
|---------|----------|------------------|-----------------|
| **Quality Workflow Commands** |
| `/checklist` | Starting session, validating environment | Pre-game ritual, environment validation, dependency checks | Terminal output |
| `/integrate` | Converting prototypes to components | After building in Claude Chat, sharding large files, component extraction | `.system/components/`, injection markers in source |
| `/define-contract` | Before coding a component | New component planning, API design, interface definition | `.system/contracts/` |
| `/validate-component` | Before integration | Quality gate check, syntax/test/contract validation | Terminal output + validation logs |
| `/prove-it-works` | Testing component in isolation | Sandbox testing, visual validation, interaction testing | `.system/sandbox/` (HTML files) |
| **Development & Debugging** |
| `/quick-fix` | Narrow scope bug fixes | Small bugs, typos, obvious fixes, targeted corrections | In-place file edits |
| `/debug-css` | CSS issues and conflicts | Styling bugs, layout problems, visual regressions | In-place CSS edits + proof screenshots |
| `/improve` | Creative problem solving | Refactoring, optimization, exploring alternatives | In-place improvements |
| `/dev-story` | Implementing user stories | Feature development, story execution, task implementation | Story-specific files |
| **Planning & Documentation** |
| `/pm` | Starting product planning | New features, product decisions, requirements gathering | `docs/` |
| `/prd` | Creating requirements docs | Formal product specs, stakeholder alignment | `docs/prd/` |
| `/create-ux-design` | Designing user experience | UI/UX planning, visual design, interaction design | `docs/design/`, visual mockups |
| `/architect` | System design decisions | Technical architecture, infrastructure planning | `docs/architecture/` |
| `/sm` | Breaking down work | Epic creation, story writing, sprint planning | `docs/epics/`, `docs/stories/` |
| **Testing & Quality** |
| `/tea` | Writing tests and docs | Test creation, documentation, coverage reports | `tests/`, component docs |
| `/code-review` | Reviewing completed work | Pre-commit review, quality check, senior dev review | Review comments in story files |
| **Session Management** |
| `/next-steps` | Ending work session | Handoff documentation, progress summary, next actions | Terminal output + handoff doc |
| `/workflow` | Understanding the process | Learning the methodology, workflow questions | Terminal output |

### Usage Patterns by Scenario

**Starting a new feature:**
1. `/pm` → Discuss requirements
2. `/prd` → Document requirements
3. `/architect` → Design system
4. `/sm` → Create epics & stories
5. `/dev-story` → Implement

**Converting Claude Chat prototype:**
1. `/integrate references/my-feature.html` → Auto-shard & validate
2. Review injection markers
3. Test in browser

**Fixing a bug:**
- **Small/obvious**: `/quick-fix`
- **CSS-related**: `/debug-css`
- **Complex/creative**: `/improve`

**Before committing:**
1. `/validate-component` → Quality checks
2. `/prove-it-works` → Sandbox test
3. `/tea` → Ensure tests/docs
4. `/code-review` → Senior review
5. `git commit && git push`

**Starting/ending sessions:**
- **Start**: `/checklist` → Validate environment
- **End**: `/next-steps` → Document handoff

## Example: Your Actual Workflow

```bash
# ===== L: Claude Chat =====
# Build dashboard prototype in Claude Chat
# → Complete, working, 1500 lines, single HTML file
# → Copy to references/dashboard-v1.html

# ===== R: VSCode/Claude Code =====

# Create epics & stories
/sm
# → Writes to docs/epics/, docs/stories/

# Integrate prototype
/integrate references/dashboard-v1.html
# → Creates .system/components/user-card/
# → Creates .system/components/stats-widget/
# → Creates .system/components/activity-feed/
# → Main file now has injection markers

# Build each component properly
/define-contract user-card
# → Writes contract to .system/contracts/
# → Creates test stub in .system/components/user-card/

# Validate before integration
/validate-component user-card
# ✅ Syntax, Tests, Contract, Integration - all pass

# Manual testing milestone
# Open in browser, check console, test interactions

# Debug issues
/debug-css user-card
# → Self-checking debugger with proof of fix

# Final push
git add .
git commit -m "Add dashboard with user card, stats, activity feed"
git push
```

## File Organization

```
my-project/
├── .bmad/               # BMAD methodology (37 workflows)
├── .claude/             # Your project config
├── .system/             # Infrastructure (agent-managed)
│   ├── components/     # Built components (agent-created)
│   ├── contracts/      # Component specs (created by /define-contract)
│   ├── proven/         # Validated components (created by /prove-it-works)
│   ├── sandbox/        # Testing environment
│   ├── validation/     # Quality gates
│   ├── mcp-servers/    # Component registry
│   ├── template/       # Setup docs (read once)
│   └── boilerplate/    # Component templates
├── assets/              # ← YOU: Project files (images, fonts, media)
├── docs/                # ← YOU: Knowledge base (PRDs, architecture)
├── public/              # Build output (bundled for deployment, git-ignored)
├── references/          # ← YOU: Claude Chat prototypes
├── src/                 # ← YOU: Production-ready components
└── tests/               # ← YOU: All tests (unit, integration)
```

**You spend 95% of time in**: `docs/`, `references/`, `src/`, `assets/`, `tests/`

**Agents work in**: `.system/components/`, `.system/contracts/`, `.system/proven/`

**Agents migrate to production**: `.system/proven/` → `src/` (fully automated)

**You never navigate**: `.system/` (slash commands handle it)

## Example Component

See `.system/components/example-button/` for complete example:
- Contract → Test → Code → Sandbox workflow
- Proper CSS namespacing
- Clean, documented implementation
- Interactive sandbox: `open .system/sandbox/example-button-test.html`

## Three Rules

1. **Contract before code** - Prevents 70% of bugs
2. **Test before implement** - Catches bugs in seconds
3. **Prove before integrate** - No conflicts

## Areas for Improvement (Your Notes)

Based on your workflow, these are the friction points:

### Integration (Biggest Room for Improvement)
- **Problem**: Too many bugs upon integration, especially CSS
- **Current**: Manual integration with errors
- **Solution**: `/integrate` with MCP validation
- **Techniques**: Sharding, injection markers, namespace validation

### Milestone Testing
- **Problem**: Need better checkpoints before showing to operator
- **Current**: Manual testing, ad-hoc
- **Solution**: `/validate-component` + `/prove-it-works`
- **Benefit**: Automated quality gates

### Parallel Development
- **Problem**: Building components sequentially
- **Current**: One at a time
- **Solution**: Build multiple prototypes in Claude Chat, integrate in parallel
- **Benefit**: Faster delivery

### CSS Debugging
- **Problem**: CSS conflicts and breakage
- **Current**: Manual trial-and-error
- **Solution**: `/debug-css` with self-checking + proof
- **Benefit**: Confident fixes

## Getting Help

**First time setup**:
→ `.system/template/README-QUICKSTART.md`

**MCP issues**:
→ `.system/template/mcp-setup.md`

**Architecture questions**:
→ `.system/template/README-STRUCTURE.md`

**Integration workflow**:
→ `.system/template/integration-workflow.md`

**Autonomous execution**:
→ `.system/README-AUTONOMOUS.md`

**Check execution status**:
→ `cat .system/execution-status.yaml`

**View event log**:
→ `cat .system/events/event-log.yaml`

**Example code**:
→ `.system/components/example-button/`

---

## Documentation Map

Complete guide to all documentation in this template:

### 📍 **Start Here**
- **`START_HERE.md`** - Quick-start overview and 3-pass execution model
- **`README.md`** (this file) - Project overview and operator guide
- **`README-IMPLEMENTATION.md`** - Implementation summary and autonomous system details

### 👤 **Operator Guides** (How to use the system)
- **`docs/README-OPERATOR.md`** - Detailed 3-phase workflow guide
- **`docs/README-WORKFLOW.md`** - BMAD Method integration and workflow patterns
- **`docs/TROUBLESHOOTING.md`** - Common issues and solutions
- **`docs/PARALLEL-TESTING-GUIDE.md`** - Parallel test execution (6 terminals, 3-4x speedup)

### 🏗️ **Architecture & System** (Understanding the infrastructure)
- **`.system/README.md`** - System architecture (Skills ↔ MCP ↔ Contracts ↔ Components)
- **`.system/README-AUTONOMOUS.md`** - Autonomous execution deep dive
- **`.system/agents/README.md`** - Agent system overview (3 layers: Strategic, Tactical, Support)

### 🎯 **Orchestrator-EXE** (Parallel execution coordinator)
- **`docs/orchestrator-exe/README.md`** - Complete navigation and documentation index
- **`docs/orchestrator-exe/EXAMPLES.md`** - Comprehensive operator guide with examples
- **`docs/orchestrator-exe/USAGE_GUIDE.md`** - Detailed usage patterns and workflows
- **`.claude/agents/orchestrator-exe.md`** - Command definition and menu
- **`.system/agents/strategic/orchestrator-exe.md`** - Agent persona and behaviors

### 🔧 **Skills & Event System** (Autonomous workflows)
- **`.claude/skills/event-system.md`** - Event-driven skills architecture
- **`.claude/skills/README.md`** - Autonomous skills overview
- **`.claude/skills/orchestrator-exe/README.md`** - Orchestrator-exe skills index
- **`.claude/skills/testing-with-jest.md`** - Jest testing guide for agents

### 🧪 **Testing** (Quality assurance)
- **`docs/PARALLEL-TESTING-GUIDE.md`** - Parallel test execution guide
- **`tests/README.md`** - Test organization and philosophy (if exists)
- **`jest.config.js`** - Jest configuration
- **`package.json`** - Test scripts (6 suites, 122 tests)

### 📚 **BMAD Method** (Workflow methodology)
- **`.bmad/bmm/README.md`** - BMAD Method overview
- **`.bmad/bmm/agents/`** - BMAD workflow agents (PM, Architect, Dev, SM, TEA, etc.)
- **`.bmad/bmm/workflows/`** - 37 workflows across SDLC phases

### 🎨 **Component System** (Building blocks)
- **`.system/components/README.md`** - Component structure and organization
- **`.system/contracts/README.md`** - Contract system (if exists)
- **`.system/components/example-button/`** - Complete example component

### 🛠️ **Setup & Configuration**
- **`.system/template/README-QUICKSTART.md`** - One-time setup (5 min)
- **`.system/template/README-STRUCTURE.md`** - Directory structure guide
- **`.system/template/mcp-setup.md`** - MCP server configuration
- **`.system/template/integration-workflow.md`** - Integration workflow guide

### 📊 **Reference & Status**
- **`.system/execution-status.yaml`** - Real-time execution progress tracking
- **`.system/events/event-log.yaml`** - Event system audit log
- **`.system/parallel-work/`** - Parallel session tracking and coordination

---

## Next Steps

1. **Run `/checklist`** - Validate your environment
2. **Read `.system/template/README-QUICKSTART.md`** - One-time setup (5 min)
3. **Study `.system/components/example-button/`** - See the workflow in action
4. **Start building** - Use your actual workflow (L + R)
5. **Iterate** - Contract → Test → Code → Validate → Prove

---

**Remember**: You work in `docs/`, `references/`, `assets/`, `tests/`, `templates/`. Components, contracts, and validation are handled by agents in `.system/` via slash commands.

**Start here**: `.system/template/README-QUICKSTART.md` (5 minutes)
