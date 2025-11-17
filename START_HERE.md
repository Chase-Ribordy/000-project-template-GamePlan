# START HERE - Project Template Quick Start

Welcome to the **Autonomous Execution Project Template**!

## What Is This Template?

This is a project template designed for building high-quality web applications with Claude Code. The key differentiator is the **autonomous execution system** - a workflow that handles component integration, validation, and quality assurance with minimal manual intervention.

**Key benefit:** What used to take hours of manual integration work now happens in minutes with a single command.

---

## Three-Pass Execution Model

This template uses a three-pass development approach:

```
┌─────────────────────────────────────────────────────────────┐
│                    THREE-PASS EXECUTION                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  FIRST PASS: Backend & Core Logic                          │
│  Tool: /dev-story (BMAD Method)                             │
│  Output: Validated backend, business logic, data models     │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  SECOND PASS: Component Integration ★ AUTONOMOUS ★         │
│  Tool: /integrate                                           │
│  Output: Fully integrated, tested, validated components     │
│  Magic: 98% time reduction, quality enforced automatically  │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  THIRD PASS: Polish & Refinement                            │
│  Tools: /debug-css, /quick-fix, manual tools                │
│  Output: Production-ready application                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**First Pass:** Build your backend and core functionality using BMAD's `/dev-story` workflow. This handles business logic, data models, and backend infrastructure.

**Second Pass:** Integrate UI components with `/integrate`. This is where the autonomous magic happens - one command handles sharding, validation, testing, contract verification, and integration safety checks. **Fully autonomous.**

**Third Pass:** Final polish with manual tools. Debug CSS, fix edge cases, optimize performance.

---

## Quick Start Checklist

### Step 1: Verify Environment
Run `/checklist` to ensure all dependencies and tooling are configured correctly.

```bash
/checklist
```

### Step 2: Plan Your Project (BMAD Method)
Use BMAD workflows to create your product plan, architecture, and user stories:

- `/pm` - Create Product Requirements Document (PRD)
- `/architect` - Design system architecture
- `/create-epics-and-stories` - Break work into deliverable stories

### Step 3: Start Development
Begin implementing your first story:

```bash
/dev-story
```

This handles backend logic, data models, and core functionality with test-driven development.

### Step 4: Integrate Components ← AUTONOMOUS MAGIC
Once you have components ready (in `references/` or built during dev-story), integrate them:

```bash
/integrate
```

**What happens automatically:**
- Component sharding and extraction
- Contract validation
- Test generation and execution
- Integration safety checks
- Quality gate enforcement
- Component registry updates

**You can't skip validation steps.** Quality is enforced, not optional.

### Step 5: Polish and Refine
Use manual tools for final touches:

- `/debug-css` - Fix styling issues
- `/quick-fix` - Address minor bugs
- Manual testing and optimization

---

## Key Features

### One Command = Entire Quality Pipeline
Running `/integrate` executes a complete quality workflow:

1. **Shard** prototype into modular components
2. **Validate** syntax, structure, and contracts
3. **Test** functionality and integration safety
4. **Prove** components work in isolation
5. **Integrate** into your codebase
6. **Register** in component registry

### 98% Time Reduction
What used to take hours:
- Manual component extraction
- Writing tests
- Integration debugging
- Quality checks

Now takes minutes with `/integrate`.

### Quality Enforced, Not Optional
You **cannot skip** validation steps. If a component fails:
- Syntax check → Integration blocked
- Contract mismatch → Integration blocked
- Test failure → Integration blocked
- Integration conflict (MCP-detected) → Integration blocked

This ensures every component meets quality standards before entering your codebase.

### MCP: Your Integration Safety Net
**MCP (Model Context Protocol)** is the component registry server that prevents integration conflicts. It tracks:
- CSS class names (prevents `.button` from colliding with another `.button`)
- JavaScript API methods (prevents duplicate function names)
- Component dependencies (prevents circular references)

**Result:** Zero integration conflicts. Level 4 validation queries MCP before allowing integration, catching conflicts that would otherwise break production.

---

## Navigation - Where to Go Next

### Essential Documentation
- **README.md** - Project overview and autonomous execution system
- **docs/README-OPERATOR.md** - Detailed 3-phase workflow guide with BMAD integration
- **docs/README-WORKFLOW.md** - Complete BMAD + Autonomous integration guide
- **.system/README.md** - Architecture overview (Skills ↔ MCP ↔ Contracts ↔ Components)
- **.system/README-AUTONOMOUS.md** - Technical deep dive into autonomous execution

### First Command to Run
```bash
/checklist
```

This validates your environment and ensures you're ready to start development.

### Learning the Workflow
1. Read **README.md** (5 minutes) - Understand the big picture
2. Scan **docs/README-OPERATOR.md** (10 minutes) - Learn the workflow
3. Run `/checklist` - Verify your setup
4. Start building! - Use BMAD workflows to plan and execute

---

## Getting Help

### Check Execution Status
View the current state of autonomous execution:

```bash
cat .system/execution-status.yaml
```

### View Event Log
See detailed logs of autonomous execution events:

```bash
cat .system/events/event-log.yaml
```

### Troubleshooting
Consult the autonomous execution documentation:

```bash
.system/README-AUTONOMOUS.md
```

For specific issues:
- **MCP server problems:** `.system/mcp-servers/`
- **Contract questions:** `.system/contracts/`
- **Validation failures:** Check event log for details

---

## You're Ready!

This template handles the heavy lifting of quality assurance and integration. Your job is to:

1. **Plan** with BMAD workflows
2. **Build** backend with `/dev-story`
3. **Integrate** components with `/integrate`
4. **Polish** with manual tools

The autonomous execution system ensures quality at every step.

**Next step:** Run `/checklist` to verify your environment, then start planning your project!
