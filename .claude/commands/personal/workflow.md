# Development Workflow Guide

Quick reference for when to use which commands during development. These phases are **conceptual guides**, not rigid rules - use what makes sense for your project.

---

## Phase 0: Setup & Validation

**Goal**: Get your environment ready

### Essential Commands
- **`/checklist`** - Validate environment, guided setup with permissions
  - Creates missing folders
  - Installs MCP dependencies
  - Initializes git
  - Creates settings.local.json
  - **Use**: First command on any new project, or daily environment check

- **`/integrate-mcp`** - Setup MCP server (one-time only)
  - **Use**: First project setup only, or if MCP broken

**Time**: 5-10 minutes (first project), 30 seconds (daily validation)

---

## Phase 1: Planning

**Goal**: Define what you're building

### Use BMAD Workflows
Located in `.claude/commands/bmad/` - these handle full planning lifecycle:

**Start with one of these**:
- `/brainstorm-project` - Structured ideation
- `/product-brief` - Quick product vision

**Then progress through**:
- `/prd` - Product requirements
- `/architecture` - System design
- `/create-epics-and-stories` - Sprint backlog

**Output**: Requirements docs, architecture, epic/story files

**Time**: 2-4 hours (depends on scope)

---

## Phase 2: Execution

**Goal**: Build with quality-first approach

### Conceptual Sub-Phases (Flexible):

#### Pass 1: Backend-First (Get It Working)
Focus on functionality, minimal frontend
- Use BMAD `/dev-story` for backend features
- Basic HTML structure, minimal CSS
- **Goal**: Features work, not pretty yet

#### Pass 2: Component Integration (Make It Beautiful)
Add polished frontend with components
- **`/integrate`** - Shard large prototype files into components
- Agents handle contracts/validation (future: will be skills)
- **Goal**: Beautiful, user-friendly interface

#### Pass 3: Debug & Polish (Production Ready)
Final cleanup and optimization
- **`/debug-css`** - Systematic CSS debugging
- **`/quick-fix`** - Rapid bug fixes (narrow scope)
- **`/improve`** - Creative problem-solving (exploratory)
- **Goal**: Production-ready code

### Essential Commands for Execution

**High-Impact Commands** (use frequently):
- **`/integrate`** - Shard large files into modular components
  - **When**: You have prototype file >200 lines
  - **Output**: Multiple small components registered with MCP

- **`/debug-css`** - CSS debugging methodology
  - **When**: Visual bugs, layout issues, styling problems
  - **Creates**: Isolated test in `debug/` folder
  - **Philosophy**: Test in isolation, then apply fix

- **`/quick-fix`** - Rapid bug fixes
  - **When**: Small bugs, specific issues, narrow scope
  - **Philosophy**: Fast, focused, get it done

- **`/improve`** - Creative improvements
  - **When**: Stuck, need fresh approach, want alternatives
  - **Philosophy**: Exploratory, try new ideas

**Agent-Facing Commands** (will become skills eventually):
- `/define-contract` - Create component contracts before coding
- `/validate-component` - 4-level progressive validation
- `/prove-it-works` - Sandbox testing before integration
- **Note**: For now these are manual commands, future: agents auto-call as skills

**Time**: Varies widely (days to weeks depending on scope)

---

## Phase 3: Wrap-Up

**Goal**: Document, reflect, prepare for next session

### Essential Commands
- **`/next-steps`** - Session handoff documentation
  - **When**: End of every work session
  - **Creates**: Context for next session (what was done, what's next, blockers)

### BMAD Workflows
- `/retrospective` - Sprint retrospective (after epic/sprint complete)
- `/document-project` - Generate project documentation

**Time**: 30 mins - 1 hour

---

## Command Quick Reference

### By Frequency of Use

**Daily/Session**:
- `/checklist` (start of session)
- `/next-steps` (end of session)

**Per Feature/Component**:
- `/integrate` (shard large files)
- `/debug-css` (fix styling)
- `/quick-fix` (fix bugs)
- `/improve` (creative solutions)

**Per Sprint**:
- BMAD planning workflows (`/prd`, `/architecture`, `/create-epics-and-stories`)
- `/retrospective` (end of sprint)

**One-Time**:
- `/integrate-mcp` (first project setup)

---

## Essential vs Optional Commands

### Essential (Learn These First)
Core commands you'll use on every project:

1. **`/checklist`** - Environment validation & setup
2. **`/integrate`** - Shard large files
3. **`/debug-css`** - Fix styling issues
4. **`/quick-fix`** - Fix bugs
5. **`/next-steps`** - Session handoff
6. **BMAD `/prd`** - Requirements
7. **BMAD `/architecture`** - Design

### Optional/Advanced
Useful but not required for every project:

- `/improve` - Creative problem-solving (use when stuck)
- `/define-contract` - Contract-first development (future: skill)
- `/validate-component` - Quality gates (future: skill)
- `/prove-it-works` - Sandbox testing (future: skill)
- All other BMAD workflows (domain research, UX design, etc.)

---

## Typical Project Flow

```
Day 1: Setup
└─ /checklist → Environment ready ✓

Day 1-2: Planning
└─ /prd → /architecture → /create-epics-and-stories → Backlog ready ✓

Week 1-3: Execution (flexible passes)
├─ Pass 1: Build backend (BMAD /dev-story)
├─ Pass 2: Build components (/integrate prototypes)
└─ Pass 3: Debug & polish (/debug-css, /quick-fix, /improve)

End of Sprint: Wrap-Up
└─ /next-steps → /retrospective → Session documented ✓
```

---

## Philosophy

### Phases Are Conceptual
- Not rigid gates or enforced steps
- Use what makes sense for your project
- Small projects might skip Pass 1 (no separate backend)
- Large projects might need multiple Pass 3 iterations
- **Flexibility over rigidity**

### Focus on High-Impact Commands
- Master the 5-7 essential commands first
- Use optional commands as needed
- Don't feel obligated to use every command
- **Quality over quantity**

### Let Agents Handle Repetition (Future)
- Contract creation, validation, sandbox testing → Will become skills
- Agents auto-call these when needed
- Operators focus on judgment calls (debugging, creative solutions)
- **Automation over coordination**

---

## When You're Stuck

**CSS issues?** → `/debug-css`
**Small bug?** → `/quick-fix`
**Need fresh ideas?** → `/improve`
**Large file to break up?** → `/integrate`
**Don't know what to do?** → `/checklist` (validates environment, reminds you of workflow)

---

**Remember**: This is a guide, not rules. Use what helps, skip what doesn't. The goal is shipping quality code, not following a process perfectly.
