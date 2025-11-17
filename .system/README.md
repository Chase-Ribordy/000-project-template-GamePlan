# .system/ - Agent Infrastructure (Operator: Ignore This Folder!)

> **Note**: This is the main README for the `.system/` folder, which contains all agent-managed infrastructure for quality workflows, validation, and component architecture.

**For Operators:** You don't need to understand or navigate this folder!

The `.system/` folder contains **agent-managed infrastructure** that handles quality workflows, validation, and component architecture behind the scenes.

## Operator Simplicity

Instead of managing `.system/` directly:

1. **Create prototypes** in `references/` (Claude Chat)
2. **Run `/integrate`** to shard them
3. **Let agents handle** the rest (contracts, validation, proving)

## When to Look in .system/

**Almost never!** But if you must:

- **Understanding autonomous execution:** `.system/README-AUTONOMOUS.md` ← READ THIS
- **Checking execution status:** `.system/execution-status.yaml`
- **Viewing event log:** `.system/events/event-log.yaml`
- **Debugging MCP server:** `.system/mcp-servers/`
- **Checking contracts:** `.system/contracts/` (reference only)
- **Viewing proven components:** `.system/proven/` (read-only)

**For everything else in `.system/`, you can safely ignore it.**

---

# Architecture Overview (For Developers)

**For Operators:** You can skip this section! It explains how the system works internally, which you don't need to know to use it effectively.

**For Developers:** This section explains the architectural relationships that enable quality enforcement and autonomous execution.

## The Core Architecture: Skills ↔ MCP ↔ Contracts ↔ Components

### 1. Event-Driven Skills System

**What It Is:**
The autonomous execution system is built on an event-driven architecture where skills listen for specific events and execute automatically.

**How It Works:**
```
User Action (/integrate)
    ↓
Event Emitted (component_extracted)
    ↓
Skill Triggered (contract-creation)
    ↓
Work Completed
    ↓
New Event Emitted (contract_created)
    ↓
Next Skill Triggered (component-validation)
    ↓
... continues through pipeline ...
```

**Key Skills:**
- `contract-creation` - Generates component contracts from analyzed code
- `component-validation` - Runs 4 progressive validation levels
- `sandbox-testing` - Creates and executes visual/interactive tests
- `component-integration` - Injects components into production files
- `production-ready` - Migrates integrated components to src/ production folder
- `pass-orchestration` - Manages workflow pass transitions
- `progress-reporter` - Tracks real-time execution status

**Event Flow:**
```
component_extracted → contract_created → validation_completed →
component_proven → component_integrated → component_production_ready →
pass_completed
```

### 2. MCP Server: The Component Registry

**What MCP Is:**
MCP (Model Context Protocol) is a **component registry server** that provides:
- Centralized component tracking
- CSS/JS namespace conflict detection
- Dependency relationship management
- Integration safety validation

**Why It Exists:**
Without MCP, components could:
- Use conflicting CSS class names (`.button` colliding with `.button`)
- Define duplicate JavaScript functions
- Create circular dependencies
- Break existing integrations silently

**MCP Architecture:**
```
.system/mcp-servers/component-registry.js
    ↓
Exposes Tools:
├─ register_component()      - Add component to registry
├─ check_conflicts()         - Query for CSS/JS conflicts
├─ get_dependencies()        - Retrieve dependency graph
├─ update_component()        - Modify component metadata
└─ list_components()         - View all registered components
    ↓
Used By Skills:
├─ contract-creation         - Registers new contracts
├─ component-validation      - Queries conflicts (Level 4)
└─ component-integration     - Updates integration status
```

**MCP Data Store:**
```json
{
  "components": {
    "login-form": {
      "cssNamespace": ".login-form-",
      "jsAPI": ["LoginForm.init", "LoginForm.validate"],
      "dependencies": ["animated-input", "submit-button"],
      "status": "integrated"
    },
    "submit-button": {
      "cssNamespace": ".submit-button-",
      "jsAPI": ["SubmitButton.render"],
      "dependencies": [],
      "status": "integrated"
    }
  }
}
```

### 3. Contracts: Interface Definitions

**What Contracts Are:**
Contracts are **interface specifications** created BEFORE component implementation. They define:
- Component purpose and behavior
- Input/output API surface
- CSS namespace requirements (`.component-name-` prefix mandatory)
- JavaScript API methods
- Dependencies on other components
- Integration requirements

**Contract Location:** `.system/contracts/[component]-contract.md`

**Contract Example:**
```markdown
# Login Form Contract

## Interface
- **Inputs:** email (string), password (string)
- **Outputs:** loginSuccess (event), loginError (event)
- **API:** LoginForm.init(), LoginForm.validate(), LoginForm.reset()

## CSS Requirements
- **Namespace:** `.login-form-` prefix for ALL classes
- **Example:** `.login-form-container`, `.login-form-input`, `.login-form-button`

## Dependencies
- animated-input (for input field animations)
- submit-button (for form submission)

## Integration Points
- Emits `login:success` event with user token
- Listens for `form:reset` event
```

**Why Contracts Matter:**
- **Design before code:** Clarifies requirements before implementation
- **Validation target:** Component must implement contract specification
- **Conflict prevention:** Enforces CSS/JS namespacing
- **Integration safety:** Documents dependencies and events

### 4. Components: Contract Implementations

**What Components Are:**
Components are **self-contained implementations** that conform to their contract specifications.

**Component Structure:**
```
.system/components/login-form/
├── login-form.html          # Component markup
├── login-form.css           # Namespaced styles (.login-form-*)
├── login-form.js            # Component logic (LoginForm.*)
├── login-form.test.js       # Unit tests
└── validation-report.md     # 4-level validation results
```

**Key Principles:**
- **Contract compliance:** Must implement contract interface exactly
- **CSS namespacing:** ALL classes use `.component-name-` prefix
- **JS encapsulation:** API methods use `ComponentName.*` pattern
- **Self-contained:** Can function independently or with declared dependencies
- **Testable:** Includes unit tests and sandbox tests

### 5. The Complete Flow: Contract → Component → MCP → Validation

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Contract Creation                                  │
│  Skill: contract-creation                                   │
├─────────────────────────────────────────────────────────────┤
│  Input: Extracted component files                           │
│  Process:                                                    │
│    • Analyze component structure                            │
│    • Identify inputs/outputs                                │
│    • Define CSS namespace (.component-name-)                │
│    • Define JS API (ComponentName.*)                        │
│    • Document dependencies                                  │
│  Output: .system/contracts/component-contract.md            │
│  MCP Action: Register contract spec in registry             │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: Component Validation (4 Levels)                    │
│  Skill: component-validation                                │
├─────────────────────────────────────────────────────────────┤
│  Level 1: Syntax Check                                      │
│    • HTML valid?                                            │
│    • CSS parses correctly?                                  │
│    • JS syntax valid?                                       │
│                                                              │
│  Level 2: Unit Tests                                        │
│    • Run component.test.js                                  │
│    • Verify expected behaviors                              │
│                                                              │
│  Level 3: Contract Compliance                               │
│    • Does component implement contract interface?           │
│    • CSS uses correct namespace?                            │
│    • JS API matches contract?                               │
│    • Dependencies declared?                                 │
│                                                              │
│  Level 4: Integration Safety (MCP-based) ← MCP CRITICAL!    │
│    • Query MCP: check_conflicts(component)                  │
│    • MCP returns: Conflicting CSS classes or JS methods?    │
│    • MCP validates: Namespace collision?                    │
│    • Result: PASS (no conflicts) or FAIL (conflicts found)  │
│                                                              │
│  Output: validation-report.md (4 levels × pass/fail)        │
│  MCP Action: Update component status to "validated"         │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: Sandbox Testing                                    │
│  Skill: sandbox-testing                                     │
├─────────────────────────────────────────────────────────────┤
│  Process:                                                    │
│    • Generate interactive test file                         │
│    • Run visual rendering tests                             │
│    • Run interactive behavior tests                         │
│    • Auto-approve if tests pass                             │
│  Output: .system/sandbox/component-test.html                │
│          .system/proven/component/ (on success)             │
│  MCP Action: Update component status to "proven"            │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: Component Integration                              │
│  Skill: component-integration                               │
├─────────────────────────────────────────────────────────────┤
│  Process:                                                    │
│    • Inject HTML into main files with markers               │
│    • Add CSS to stylesheets (namespaced)                    │
│    • Add JS to scripts (encapsulated)                       │
│    • Resolve dependency order                               │
│  Output: Updated production files                           │
│          integration-report.md                              │
│  MCP Action: Update component status to "integrated"        │
│             Register dependencies in MCP graph              │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 5: Production Migration                               │
│  Skill: production-ready                                    │
├─────────────────────────────────────────────────────────────┤
│  Process:                                                    │
│    • Copy component from .system/proven/ to src/            │
│    • Create metadata.json with version info                 │
│    • Generate MIGRATION-REPORT.md                           │
│    • Update src/README.md with component list               │
│  Output: src/{component_name}/* (production source)         │
│  MCP Action: Update component status to "production_ready"  │
│             Add production_path to registry                 │
└─────────────────────────────────────────────────────────────┘
```

### 6. Skills ↔ MCP Integration Patterns

**How Skills Use MCP:**

| Skill | MCP Tool Used | Purpose |
|-------|--------------|---------|
| `contract-creation` | `register_component()` | Register new component contract in registry |
| `component-validation` (Level 4) | `check_conflicts()` | Query for CSS class or JS function name conflicts |
| `component-integration` | `update_component()` | Mark component as integrated, update dependencies |
| `component-integration` | `get_dependencies()` | Resolve dependency order for injection |
| `production-ready` | `update_component()` | Mark component as production ready, add production_path |

**Example: Level 4 Validation with MCP**

```javascript
// component-validation skill (Level 4)

// Extract component metadata
const cssClasses = extractCSSClasses('login-form.css')
// ['.login-form-container', '.login-form-input', '.login-form-submit']

const jsAPI = extractJSAPI('login-form.js')
// ['LoginForm.init', 'LoginForm.validate', 'LoginForm.reset']

// Query MCP for conflicts
const conflicts = await mcp.check_conflicts({
  componentName: 'login-form',
  cssClasses: cssClasses,
  jsAPI: jsAPI
})

if (conflicts.found) {
  // FAIL Level 4
  report.level4 = {
    status: 'FAIL',
    reason: `CSS conflict: ${conflicts.cssConflicts.join(', ')}`,
    action: 'Rename conflicting classes with proper namespace'
  }
} else {
  // PASS Level 4
  report.level4 = {
    status: 'PASS',
    message: 'No integration conflicts detected'
  }
}
```

### 7. Why This Architecture Enables Quality

**Progressive Validation:**
- Each level builds on the previous
- Can't reach Level 4 without passing Levels 1-3
- Ensures both correctness (syntax, tests) AND safety (conflicts)

**MCP-Based Conflict Detection:**
- Without MCP: Hope for the best, fix conflicts after deploy
- With MCP: Conflicts detected BEFORE integration (Level 4 validation)
- Result: Zero integration-related bugs

**Contract-First Development:**
- Without contracts: Code first, document later (maybe)
- With contracts: Design interface first, validate implementation
- Result: Clear interfaces, consistent patterns

**Event-Driven Autonomy:**
- Without events: Manual orchestration of each validation step
- With events: Automatic pipeline execution
- Result: 98% time reduction, consistent quality

**Separation of Concerns:**
```
Contracts  → WHAT (interface specification)
Components → HOW (implementation details)
MCP        → WHERE (namespace registry, conflict detection)
Skills     → WHEN (event-driven execution)
```

### 8. Architecture Decision Rationale

**Why Event-Driven Skills?**
- Eliminates manual orchestration
- Parallel processing (5 components simultaneously)
- Consistent execution order
- Automatic progress tracking

**Why MCP Server?**
- Centralized component registry
- Real-time conflict detection
- Dependency graph management
- Integration safety guarantees

**Why Contract-First?**
- Design before implementation
- Validation target for quality gates
- Enforces architectural patterns (namespacing, encapsulation)
- Documentation built-in

**Why Progressive Validation (4 Levels)?**
- Fail fast (syntax errors caught at Level 1)
- Comprehensive coverage (syntax → tests → contracts → integration)
- Clear feedback (know exactly which level failed)
- Prevents broken code from reaching production

### 9. The Three-Pass Execution Philosophy

**Why Three Passes?**

**Pass 1: Backend-First (Get It Working)**
- Focus: Business logic, APIs, data flow
- Output: Functional features (ugly UI acceptable)
- Skills: Minimal (validation only)

**Pass 2: Component Integration (Make It Beautiful)**
- Focus: UI/UX, component-based architecture
- Output: Beautiful, validated, modular components
- Skills: ALL 6 skills (full autonomous pipeline)

**Pass 3: Debug & Polish (Production Ready)**
- Focus: Edge cases, performance, accessibility
- Output: Ship-quality code
- Skills: Targeted (debug-css, quick-fix)

**Architectural Reasoning:**
- **Separation of concerns:** Backend vs. frontend vs. polish
- **Reduced context switching:** Focus on one type of work at a time
- **Quality gates:** Each pass has different validation criteria
- **Incremental progress:** Ship-quality code emerges iteratively

---

## 10. Multi-Agent Coordination System (NEW)

**What It Is:**
An intelligent agent assignment and coordination system that automatically selects optimal specialized agents for each task, maximizing sprint velocity through intelligent parallelization.

**Location:** `.system/agents/`

**Purpose:**
- Automatically assign tasks to specialized agents
- Coordinate parallel work across multiple terminals
- Minimize operator decision fatigue
- Enable autonomous execution where safe, manual control where needed

**Agent Hierarchy:**

```
STRATEGIC LAYER
├─ orchestrator-exe      Sprint coordination & agent assignment
└─ resource-allocator    Capacity planning & load balancing

TACTICAL LAYER
├─ integration-manager   Component lifecycle & MCP coordination
├─ validation-controller Progressive 4-level validation
└─ development-executor  Story implementation wrapper

SUPPORT LAYER
├─ contract-architect    Interface definition & contract generation
├─ dependency-analyst    Dependency graphs & sequencing
└─ testing-specialist    Test generation & sandbox validation
```

**How It Works:**

1. **Operator invokes** `/orchestrator-exe`
2. **Orchestrator analyzes** ready tasks from sprint status
3. **Agent-selector skill** automatically selects optimal agent using multi-criteria scoring:
   - Task type match (35% weight)
   - Complexity handling (25%)
   - Execution mode fit (20%)
   - Skill access (15%)
   - Current availability (5%)
   - Pass awareness (5%)
4. **Terminal prompts generated** with agent specification and task details
5. **Operator copies** prompt into terminal
6. **Agent executes** task (manual, supervised, or autonomous mode)
7. **Progress tracked** in agent state files
8. **Results reported** back to orchestrator

**Agent State Tracking:**
- `agents/active-agents.yaml` - Real-time agent assignments
- `agents/agent-assignments.yaml` - Historical performance data
- `agents/handoff-history.yaml` - Contract-based handoffs

**Contract-Based Handoffs:**
Agents coordinate via YAML contracts specifying inputs, outputs, and acceptance criteria. Example chain:
```
contract-architect → validation-controller → integration-manager
```

**Integration with Existing Systems:**
- **BMAD Agents**: Workflow-based agents (PM, Dev, Architect, etc.) remain unchanged
- **Development-Executor**: Wraps BMAD dev workflows for unified orchestrator interface
- **Validation-Controller**: Uses existing component-validation skill
- **Integration-Manager**: Uses existing component-integration skill

**Execution Modes:**
- **Manual**: Operator drives decisions (foundation work, high risk)
- **Supervised**: Agent executes with checkpoints (moderate complexity)
- **Autonomous**: Agent executes fully, escalates on failure (clear requirements)
- **Fully Autonomous**: No operator interaction (simple, repetitive tasks)
- **Advisory**: Returns recommendations only (planning, analysis)

**Agent Selection Example:**
```yaml
Task: Integrate login-form component
Analysis:
  type: component-integration
  complexity: 3
  pass: second
  risk: medium

Agent Selection:
  selected: integration-manager
  confidence: 94%
  mode: autonomous
  reasoning: "Component integration specialist with autonomous capability,
              perfect task type match, optimal for second-pass UI integration"

Terminal Prompt:
  "TERMINAL 2: INTEGRATION-MANAGER
   Load Agent: Read and embody .system/agents/tactical/integration-manager.md
   Task: Integrate login-form component
   Mode: Autonomous
   [Expected deliverables...]"
```

**Documentation:**
- `agents/README.md` - Complete agent system overview
- `agents/AGENT-SELECTION-GUIDE.md` - Detailed selection process explanation
- `agents/agent-capabilities.yaml` - Agent registry and task mappings

**For Operators:**
Invoke `/orchestrator-exe` and follow the generated terminal prompts. The system automatically recommends the best agent for each task.

---

# System Infrastructure

**For agents only. Operators can ignore this folder.**

This folder contains all the infrastructure that makes the quality-first workflow possible. As an operator, you don't need to interact with these files directly - the slash commands handle everything for you.

## What's In Here

### `agents/` - Multi-Agent Coordination System (NEW)
Intelligent agent assignment and coordination infrastructure.

**Operator note**: Invoked via `/orchestrator-exe`. System automatically recommends optimal agents for each task. See `agents/README.md` for details.

### `template/` - Template Documentation
How the template works, setup guides, architecture explanations.

**Operator note**: Only needed during initial setup. Read `template/README-QUICKSTART.md` once, then forget about it.

### `validation/` - Quality Gates
Scripts that validate components before integration (syntax, tests, contracts, integration safety).

**Operator note**: Runs automatically via `/validate-component`. You see the results, not the scripts.

### `contracts/` - Component Contracts
Interface definitions created before coding.

**Operator note**: Created via `/define-contract`. You edit the `.md` files, agents validate against them.

### `sandbox/` - Isolated Testing
Test environments for proving components work before integration.

**Operator note**: Created via `/prove-it-works`. You open the HTML files in browser, agents generate them.

### `proven/` - Validated Components
Components that passed all quality gates.

**Operator note**: Automatically populated. Shows what's ready for integration.

### `templates/` - Component Boilerplate
Ready-to-use component templates (JS, CSS, tests, specs).

**Operator note**: Used by build scripts. You rarely touch these directly.

### `mcp-servers/` - MCP Infrastructure
Component registry server for conflict detection and integration validation.

**Operator note**: Set up once via `/integrate-mcp`, then runs in background.

### `scripts/` - Build Automation
Scripts for batch component creation and environment validation.

**Operator note**: Called via slash commands. You don't run them directly.

### `build-intelligence/` - Learning System
Future enhancement for tracking integration patterns and providing warnings.

**Operator note**: Placeholder for now. Will learn from your usage patterns later.

## Operator Workflow

You work in these folders (at top level):
- **`docs/`** - Your knowledge base (PRDs, architecture, planning)
- **`references/`** - Prototypes you build in Claude Chat
- **`src/`** - Production-ready components (migrated from `.system/proven/`)
- **`assets/`** - Project files (images, fonts, data)
- **`tests/`** - All your tests (visibility into coverage)
- **`public/`** - Build output for deployment (git-ignored)

You run these commands:
- `/define-contract` → Creates files in `.system/contracts/`
- `/validate-component` → Runs scripts from `.system/validation/`
- `/prove-it-works` → Uses `.system/sandbox/`
- `/integrate` → Uses `.system/mcp-servers/` for validation
- `/checklist` → Runs `.system/scripts/checklist.md`

**You never need to cd into `.system/`**. The commands handle everything.

## Why This Structure?

**Before**: 9 infrastructure folders cluttering your top level
**After**: 1 `.system/` folder you can mentally ignore

Your project looks clean:
```
my-project/
├── .system/          ← Agents work here (you ignore it)
├── assets/           ← You work here
├── docs/             ← You work here
├── public/           ← Build output (git-ignored)
├── references/       ← You work here
├── src/              ← You work here
└── tests/            ← You work here
```

Simple. Clean. Focused.

## When You Need This Folder

**Initial setup**: Read `.system/template/README-QUICKSTART.md` → 5 minutes → Done

**Troubleshooting**:
- MCP issues? → `.system/template/mcp-setup.md`
- Integration questions? → `.system/template/integration-workflow.md`
- Architecture? → `.system/template/README-STRUCTURE.md`

**Daily work**: Never. Just use slash commands.

## Agent Instructions

Agents: This folder contains all quality infrastructure. Reference these paths in slash commands:

- Contracts: `.system/contracts/`
- Validation: `.system/validation/pre-flight-check.sh`
- Sandbox: `.system/sandbox/`
- Proven: `.system/proven/`
- Boilerplate: `.system/boilerplate/`
- MCP: `.system/mcp-servers/component-registry.js`
- Scripts: `.system/scripts/`
- Build intelligence: `.system/build-intelligence/`

Keep this infrastructure invisible to operators. They work in top-level folders, you handle the plumbing.

---

**TL;DR for operators**: You can pretend this folder doesn't exist. Just use the slash commands.
