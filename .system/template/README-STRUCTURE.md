# Project Template Structure

Complete folder reference for BMad + Claude Code quality-first development template.

## Directory Structure

```
project-template/
├── .bmad/                 # BMad Methodology Framework (227 files)
├── .claude/               # Claude Code Configuration
│   ├── commands/          # Slash commands (BMAD + personal)
│   └── config/            # Settings, permissions, hooks
├── .system/               # Agent-managed infrastructure (don't touch)
│   ├── components/        # Modular components (sharded, small files)
│   ├── contracts/         # Component contracts & specifications
│   ├── mcp-servers/       # Component registry MCP server
│   ├── proven/            # Production-ready validated components
│   ├── sandbox/           # Isolated testing environment
│   ├── template/          # Project template documentation
│   └── validation/        # Quality gates & pre-flight checks
├── docs/                  # Project documentation & knowledge base
├── scripts/               # Automation scripts
├── references/            # Complete prototypes (large, reusable)
├── templates/             # Component scaffolding templates
├── assets/                # Project assets (logos, images, etc.)
├── output/                # AI test workspace
├── tests/                 # Project test files
├── notify.py              # Notification sound script
└── README-STRUCTURE.md           # This file
```

## Core Folders

### `.bmad/` - BMad Methodology Framework
Complete BMad methodology implementation with 227 files organized into:

**Configuration (`_cfg/`)**
- `agent-manifest.csv` - Registry of all available agents
- `workflow-manifest.csv` - Workflow registry
- `task-manifest.csv` - Task registry
- `tool-manifest.csv` - Tool registry
- `manifest.yaml` - Installation metadata (v6.0.0-alpha.9)

**Core Module (`core/`)**
- `agents/` - Core agent definitions (bmad-master, web-orchestrator)
- `tasks/` - Core tasks (advanced-elicitation, index-docs, validate-workflow)
- `tools/` - Core tools (shard-doc)
- `workflows/` - Core workflows (brainstorming, party-mode)

**BMad Method Module (`bmm/`)**
- `agents/` - Team member agents (analyst, architect, dev, pm, sm, tea, tech-writer, ux-designer)
- `docs/` - Comprehensive documentation (14+ guides)
- `teams/` - Team configuration files
- `testarch/` - Test architecture knowledge base (21 testing pattern files)
- `workflows/` - SDLC phase workflows:
  - `1-analysis/` - Research, domain analysis, product brief
  - `2-plan-workflows/` - PRD, tech specs, UX design
  - `3-solutioning/` - Architecture, gate checks
  - `4-implementation/` - Story development, code review, sprint planning, retrospectives

### `.claude/` - Claude Code Configuration
Pre-configured Claude Code setup organized into:

**Configuration Files (`config/`)**
- `CLAUDE.md` - Primary instruction file for Claude Code agents
- `settings.json` - Permission tiers (allow/ask/deny) and hooks configuration
- `settings.local.json` - Local environment overrides
- `SETUP_SUMMARY.md` - Complete setup documentation

**Slash Commands (`commands/`)**
- `bmad/` - 37 BMAD command wrappers (agents, workflows, tasks, tools)
- `personal/` - Custom integration commands:
  - `/integrate` - Shard files & create injection architecture
  - `/integrate-mcp` - Setup component registry MCP server
  - `/next-steps` - Generate session handoff documentation
  - `/checklist` - Pre-game ritual & project setup
  - `/debug-css` - Self-checking CSS/animation debugger
  - `/quick-fix` - Rapid narrow-scope bug fixes
  - `/improve` - Creative problem-solving for unclear changes

**Permission Tiers**
- **Auto-approved**: Read, Grep, Edit, Write, git, npm, pip, python, ls, mkdir, cp, mv, cat, grep, find, echo
- **Requires permission**: rm, curl, wget, ssh, system modifications
- **Blocked**: sudo, su (destructive operations)

### `assets/` - Project Assets
Store project branding and visual assets:
- `logo.webp` - Project logo (3.6KB)
- Add images, icons, fonts, etc. as needed

### `references/` - Complete Prototypes Library
**Purpose**: Storage for **complete, working prototypes** built in isolation (typically in Claude Chat)

**Use Case**:
- Build entire features/components in Claude Chat with full context
- Store finished, working pieces of code
- Keep as reference for integration later
- Reuse across multiple projects

**Characteristics**:
- **Complete implementations** (500-2000 lines) - ready to use as-is
- **Built elsewhere** - typically in Claude Chat where you can iterate freely
- **Reusable across projects** - not project-specific
- **Larger scope** - complete functionality with HTML, CSS, and JS

**Example Structure**:
```
references/
├── auth-module/
│   ├── auth.html        # Complete auth UI (500 lines)
│   ├── auth.js          # Full authentication logic
│   └── auth.css         # All styling
└── donut-animation/
    └── donut-complete.html  # 2000-line working animation
```

**Best Practices**:
- Document each component's purpose and usage
- Include inline comments explaining complex logic
- Note any dependencies or requirements
- Version control important components

### `.system/components/` - Modular Component Architecture
**Purpose**: Storage for **modular, sharded pieces** extracted from large files OR built as small, focused units

**Use Case**:
- Break 2000-line files into smaller pieces (max 200 lines each) using `/integrate`
- Build small, focused modules designed to be injected together
- Enable parallel development on different parts
- Prevent context window blowout

**Characteristics**:
- **Small, focused modules** (50-200 lines each)
- **Part of a larger whole** - designed to be injected together via markers
- **Project-specific** - tied to current project structure
- **Namespaced** - CSS isolation to prevent conflicts

**Example Structure**:
```
.system/components/
├── header/
│   ├── header.html      # Just the header (150 lines)
│   ├── header.css       # Header-specific styles
│   └── header.test.js   # Unit test for header
├── donut-animation/
│   ├── donut.js         # Animation logic only (120 lines)
│   └── donut.css        # Animation styles (100 lines)
└── bio-section/
    └── bio.html         # Bio mechanics section (180 lines)
```

**Integration Workflow**:
1. Components are sharded from large files using `/integrate`
2. Each component registered with MCP server for conflict detection
3. Main file reduced to injection markers: `<!-- INJECT:component-name -->`
4. Assembly happens automatically with validation

**Key Differences from References**:
| Aspect | References | Components |
|--------|-----------|------------|
| **Size** | Large (500-2000 lines) | Small (50-200 lines) |
| **Scope** | Complete features | Modular pieces |
| **Origin** | Built in Claude Chat | Built here OR extracted |
| **Purpose** | Reusable prototypes | Project-specific modules |
| **Integration** | Manual copy/paste | Automatic injection |

### `.system/` - Agent Infrastructure
**Purpose**: Contains all agent-managed infrastructure that operators typically don't need to navigate

**Subfolders**:
- `components/` - Modular component architecture (see above)
- `contracts/` - Component contracts and specifications
- `mcp-servers/` - MCP servers for component registry
- `proven/` - Validated production-ready components
- `sandbox/` - Isolated testing environment
- `template/` - Template documentation files
- `validation/` - Quality gates and pre-flight checks

**Abstraction Philosophy**: Operators work in `references/` and run `/integrate` - agents handle the rest automatically.

### `templates/` - Component Templates & Scaffolding
**Purpose**: Store reusable component templates for rapid scaffolding

**Usage**:
- Define standard structure for new components
- Maintain architectural consistency
- Quick-start boilerplate for common patterns
- Used by automation scripts (build-components.sh)

**Example Templates**:
- `component-spec.md` - Specification template
- `component.js` - JavaScript component template
- `component.test.js` - Test template
- `component.css` - Styles template

### `.system/mcp-servers/` - Model Context Protocol Servers
**Purpose**: MCP servers for safe component integration and tooling

**Primary Server**: `component-registry.js`
- Tracks all registered components
- Validates CSS namespace conflicts
- Checks dependency chains
- Provides integration safety checks
- Generates injection strategies

**Setup**: Use `/integrate-mcp` command to configure

### `scripts/` - Automation Scripts
**Purpose**: Build automation and workflow scripts

**Key Scripts**:
- `build-components.sh` - Batch TDD component builder
- `checklist.md` - Pre-game ritual content (used by `/checklist` command)

### `output/` - AI Testing Workspace
**Purpose**: AI builds and tests components here before integration

**Workflow**:
1. AI generates new components in `output/`
2. AI writes and runs tests to validate functionality
3. Once validated, components move to project or `references/`
4. Keeps main project clean during development

**Benefits**:
- Isolates experimental code from production
- Provides clear visibility into what AI is building
- Allows review before integration
- Maintains clean project structure

### `tests/` - Project Test Suite
**Purpose**: Store all project test files

**Structure** (add as needed):
- `unit/` - Unit tests
- `integration/` - Integration tests
- `e2e/` - End-to-end tests
- `fixtures/` - Test data and fixtures
- `utils/` - Test utilities and helpers

### `.system/contracts/` - Component Contracts
**Purpose**: Define component interfaces BEFORE writing code

**Use Case**:
- Prevents 70% of integration bugs by defining expectations upfront
- Forces thinking through inputs, outputs, dependencies
- Creates clear contract between components

**What Goes Here**:
- Component interface definitions (inputs/outputs)
- CSS namespace reservations
- DOM requirements
- Dependency declarations

**Example Contract**:
```
.system/contracts/donut-chart-contract.md:
- Inputs: data (array), config (object)
- Outputs: onSegmentClick event
- CSS: .component-donut-chart-*
- DOM: Requires #chart-container
- Dependencies: None
```

**Workflow**:
1. `/define-contract component-name` - Create contract in `.system/contracts/`
2. Write tests based on contract
3. Implement component to satisfy contract
4. `/validate-component` - Verify compliance

### `.system/validation/` - Validation Tools
**Purpose**: Progressive validation (syntax → tests → contracts → integration)

**What Goes Here**:
- Pre-flight check script
- Validation configurations
- Lint rules
- Test runners

**Progressive Validation Levels**:
1. **Level 1**: Syntax (fast, <1s)
2. **Level 2**: Unit Tests (medium, <10s)
3. **Level 3**: Contract Compliance (fast, <1s)
4. **Level 4**: Integration Safety (medium, <30s)

**Usage**:
```bash
./validation/pre-flight-check.sh component-name
# Or use slash command:
/validate-component component-name
```

### `.system/sandbox/` - Isolated Testing
**Purpose**: Test components in complete isolation before integration

**What Goes Here**:
- Component test environments
- Isolated HTML files
- Visual regression tests
- Performance tests

**Workflow**:
1. Component built in `.system/components/`
2. `/prove-it-works component` - Test in sandbox
3. Verify rendering, behavior, performance
4. If passes: Component moves to `.system/proven/`

**Why Sandbox**:
- No interference from other components
- Catch integration issues early
- Prove it works before integrating

### `.system/proven/` - Validated Components
**Purpose**: Components that passed ALL validation levels

**Entry Requirements**:
- ✅ Syntax valid
- ✅ Unit tests pass (100%)
- ✅ Contract compliant
- ✅ Integration safe
- ✅ Sandbox tested

**Workflow**:
Only components that have been fully validated go here. Integration should ONLY use proven components.

**Quality Gate**: No component integrates without being proven first.

## Development Workflow

### References vs Components Architecture

**When to Use References**:
- ✅ Building complete features in Claude Chat
- ✅ Want to save working prototypes for future projects
- ✅ Iterating on design without worrying about integration
- ✅ Creating reusable modules across multiple projects

**When to Use Components**:
- ✅ File is >200 lines and causing context issues
- ✅ Building project-specific modular architecture
- ✅ Need to work on pieces in parallel
- ✅ Want automatic conflict detection via MCP
- ✅ Enabling TDD component development

### Component-Driven Development Workflow

**Scenario 1: Build in Claude Chat → Shard → Integrate**
1. Build complete prototype in Claude Chat → save to `references/`
2. Run `/integrate` to shard into `.system/components/` (max 200 lines each)
3. Components auto-registered with MCP server
4. Main file reduced to injection markers
5. Assembly happens with validation

**Scenario 2: Existing Large File → Component Architecture**
1. Have: `src/main.html` (2000 lines - context blowout!)
2. Run `/integrate src/main.html`
3. Shards into `.system/components/` folder (header, animations, bio, etc.)
4. Result: `src/main.html` becomes 50 lines with `<!-- INJECT:name -->` markers
5. Original saved to `references/` as backup

**Scenario 3: Component-First Development**
1. Build small: Create `.system/components/button/` (100 lines)
2. Test in isolation: `.system/components/button/button.test.js`
3. Inject when ready: Add to main file via marker
4. Reuse elsewhere: If useful across projects, copy to `references/`

### Quality Workflow

**See `.system/template/README-QUICKSTART.md` for complete quality-first development workflow.**

**Key commands:** `/define-contract`, `/validate-component`, `/prove-it-works`, `/integrate`

### BMad Methodology Integration
1. **Analysis Phase**: Use `/bmad:bmm:workflows:research` and `/bmad:bmm:workflows:product-brief`
2. **Planning Phase**: Use `/bmad:bmm:workflows:prd` and `/bmad:bmm:workflows:tech-spec`
3. **Solution Phase**: Use `/bmad:bmm:workflows:architecture`
4. **Implementation Phase**: Use `/bmad:bmm:workflows:create-story` and `/bmad:bmm:workflows:dev-story`
5. **Review Phase**: Use `/bmad:bmm:workflows:code-review`

### Notification System
The template includes automatic notification setup:
- `notify.py` plays a soft beep when operator input is needed
- Configured in `.claude/settings.json` hooks
- Triggers on:
  - Response completion (Stop event)
  - Permission requests (permission_prompt event)
- Zero-lag, event-based system

## Using This Template

### Starting a New Project
1. **Copy entire `project-template/` folder** to your new project location
2. **Rename the folder** to your project name
3. **Customize configurations**:
   - Update `.bmad/core/config.yaml` (user_name, output_folder)
   - Update `.bmad/bmm/config.yaml` (project_name, preferences)
   - Review `.claude/settings.json` permissions for your needs
   - Update `.claude/CLAUDE.md` with project-specific instructions
4. **Run `/checklist`** to validate environment quality
5. **Initialize git repository** (if needed)
6. **Add project-specific folders** as you need them:
   - `lib/` - Project libraries
   - `docs/` - Project documentation
   - `scripts/` - Utility scripts
   - `src/` - Source code
   - `public/` - Static assets
   - etc.

### Customization Guidelines

**BMad Configuration**
- Edit `.bmad/core/config.yaml` to set your preferences
- Edit `.bmad/bmm/config.yaml` for project-specific settings
- Customize team configurations in `.bmad/bmm/teams/`

**Claude Code Configuration**
- Add project-specific instructions to `.claude/CLAUDE.md`
- Adjust permissions in `.claude/settings.json` based on your workflow
- Create custom slash commands in `.claude/commands/`

**Development Folders**
- Organize `templates/` by component type or framework
- Structure `references/` by feature or domain
- Keep `output/` clean - archive or delete after integration
- Organize `tests/` to match your project structure

## Optional Folders (Add as Needed)

Create these directories when your project requires them:

- `lib/` - Shared libraries and utilities
- `docs/` - Project documentation
- `scripts/` - Build scripts, utilities, automation
- `src/` - Source code (or `app/`, `components/`, etc.)
- `public/` - Static assets served publicly
- `config/` - Configuration files
- `data/` - Data files, seeds, migrations
- `logs/` - Application logs
- `dist/` or `build/` - Compiled output
- `.github/` - GitHub workflows and actions
- `cypress/`, `playwright/` - E2E testing frameworks

## Key Files to Understand

### Configuration Files
- `.bmad/_cfg/manifest.yaml` - BMad version and metadata
- `.bmad/core/config.yaml` - Core BMad configuration
- `.bmad/bmm/config.yaml` - BMad Method Module configuration
- `.claude/settings.json` - Claude Code permissions and hooks
- `.claude/CLAUDE.md` - Claude Code instructions and best practices

### Documentation Files
- `.bmad/bmm/docs/quick-start.md` - Getting started with BMad
- `.bmad/bmm/docs/README.md` - BMad Method Module overview
- `.claude/SETUP_SUMMARY.md` - Claude Code setup guide
- `README-STRUCTURE.md` - This file

### Notification Setup
- `notify.py` - Notification sound script
- `.claude/settings.json` - Contains hooks configuration for automatic notifications

## Best Practices

### Workflow Management
1. Use TodoWrite tool for task tracking
2. Follow BMad methodology phases sequentially
3. Leverage slash commands for common operations
4. Document architectural decisions in `.bmad/bmm/docs/`

### Code Organization
1. Keep components modular and testable
2. Use `templates/` for consistency
3. Build in `output/` before integrating
4. Archive successful patterns in `references/`
5. Maintain comprehensive tests in `tests/`

### AI Collaboration
1. Let AI build in `output/` workspace
2. Review before moving to main project
3. Use notification system to stay informed
4. Leverage pre-configured permissions for productivity

### Version Control
1. Commit `.bmad/` and `.claude/` configurations
2. Add `.gitignore` for `output/` if desired (working directory)
3. Track `templates/` and `references/` for team sharing
4. Document changes in project README

## Support and Documentation

### BMad Methodology
- Quick Start: `.bmad/bmm/docs/quick-start.md`
- Workflow Guides: `.bmad/bmm/docs/workflows-*.md`
- FAQ: `.bmad/bmm/docs/faq.md`
- Glossary: `.bmad/bmm/docs/glossary.md`

### Claude Code Integration
- Setup Guide: `.claude/SETUP_SUMMARY.md`
- Instructions: `.claude/CLAUDE.md`
- Available commands: Use `/help` in Claude Code

### Getting Help
- BMad Issues: Check `.bmad/bmm/docs/faq.md`
- Claude Code Issues: https://github.com/anthropics/claude-code/issues
- Review workflow documentation in `.bmad/bmm/docs/`

## Next Steps

1. **Copy this template** to your new project location
2. **Customize configurations** for your project
3. **Review the documentation** in `.bmad/bmm/docs/`
4. **Start with planning phase** using `/bmad:bmm:workflows:product-brief`
5. **Build with confidence** using the component-driven workflow

This template is designed to scale from quick prototypes to enterprise applications while maintaining consistency, quality, and developer productivity.
