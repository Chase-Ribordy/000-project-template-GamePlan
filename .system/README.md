# .system/ - Agent Infrastructure

> **Agent-facing documentation.** Operators should read the root `README.md` instead.

This folder contains all agent-managed infrastructure for quality workflows, validation, and component architecture.

---

## Architecture: Skills ↔ MCP ↔ Contracts ↔ Components

### Event-Driven Skills System

The autonomous execution system uses event-driven architecture:

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
- `production-ready` - Migrates integrated components to src/
- `pass-orchestration` - Manages workflow pass transitions
- `progress-reporter` - Tracks real-time execution status

**Event Flow:**
```
component_extracted → contract_created → validation_completed →
component_proven → component_integrated → component_production_ready →
pass_completed
```

---

### MCP Servers

MCP (Model Context Protocol) provides agent-accessible tools for automation.

**Configuration:** `.mcp.json`

#### Component Registry MCP

Provides centralized component tracking:
- CSS/JS namespace conflict detection
- Dependency relationship management
- Integration safety validation

**Location:** `.system/mcp-servers/component-registry.js`

**Tools exposed:**
- `register_component()` - Add component to registry
- `check_conflicts()` - Query for CSS/JS conflicts
- `get_dependencies()` - Retrieve dependency graph
- `update_component()` - Modify component metadata
- `list_components()` - View all registered components

#### Playwright MCP

Enables **fully autonomous browser testing** - agents can open browsers, run tests, capture screenshots, and read console output without operator intervention.

**Package:** `@playwright/mcp`

**Key Tools:**
- `browser_navigate` - Navigate to URLs
- `browser_click` / `browser_type` - Interact with elements
- `browser_take_screenshot` - Capture visual state
- `browser_console_messages` - Read console output
- `browser_evaluate` - Execute JavaScript
- `browser_snapshot` - Get accessibility tree

**Documentation:** `.system/testing/playwright-config.md`

**Key Benefit:** Operators do NOT need to manually relay console information. Playwright MCP provides direct browser access to agents.

---

### Contracts: Interface Definitions

Contracts define component specifications BEFORE implementation:
- Component purpose and behavior
- Input/output API surface
- CSS namespace requirements (`.component-name-` prefix mandatory)
- JavaScript API methods
- Dependencies on other components

**Location:** `.system/contracts/[component]-contract.md`

---

### 4-Level Validation

| Level | Check | Purpose |
|-------|-------|---------|
| 1 | Syntax | HTML, CSS, JS valid? |
| 2 | Unit Tests | Run component.test.js |
| 3 | Contract Compliance | Matches contract specification? |
| 4 | Integration Safety | MCP conflict detection |

---

## Folder Structure

```
.system/
├── agents/           # Multi-agent coordination system
├── components/       # Work-in-progress components
├── contracts/        # Component specifications
├── proven/           # Validated components ready for integration
├── sandbox/          # Test HTML files
├── testing/          # Playwright MCP config & autonomous testing
├── validation/       # Quality gate scripts
├── mcp-servers/      # Component registry server
├── events/           # Event log (event-log.yaml)
├── template/         # Setup documentation
└── execution-status.yaml  # Real-time progress tracking
```

---

## Key Files

| File | Purpose |
|------|---------|
| `execution-status.yaml` | Real-time execution tracking |
| `events/event-log.yaml` | Complete event history |
| `agents/agent-capabilities.yaml` | Agent registry |
| `agents/active-agents.yaml` | Current assignments |

---

## Agent Hierarchy

```
ORCHESTRATION
├─ orc-exe               Supreme orchestrator, spawns sub-agents via Task()

PLANNING
├─ pm                    Product manager, creates PRD
├─ architect             System architect, creates architecture

SPRINT SETUP
├─ sm                    Scrum master, creates stories and epics

EXECUTION (Pass-Specific Developers)
├─ dev-base              Developer template
├─ dev-first-pass        Skeleton builder (functional backend, ugly frontend)
├─ dev-second-pass       Component builder (polished UI)
└─ dev-third-pass        Bug fix specialist (production hardening)
```

---

## Related Documentation

- `README-AUTONOMOUS.md` - Autonomous execution deep dive
- `agents/README.md` - Agent system overview
- `mcp-servers/README.md` - MCP server setup
- `testing/playwright-config.md` - Playwright MCP autonomous testing guide
- `template/README-QUICKSTART.md` - Initial setup
