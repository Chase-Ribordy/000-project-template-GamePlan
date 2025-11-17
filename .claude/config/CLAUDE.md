# Claude Code Configuration & Project Guide

## Table of Contents

- [Part 1: Claude Code Setup](#part-1-claude-code-setup)
- [Part 2: Project Architecture](#part-2-project-architecture)
- [Part 3: Coding Conventions](#part-3-coding-conventions)

---

# Part 1: Claude Code Setup

## Project Summary

This project uses a customized Claude Code setup with:
- **Automatic sound notifications** when user input or bash permissions are needed
- **Pre-configured allowed tools** to reduce permission prompts
- **Smart hooks** that trigger notifications automatically

## 🔔 Notification Protocol (Fully Automatic)

This project uses **automatic hook-based notifications** configured in `.claude/settings.json`. You do NOT need to manually run `python notify.py`.

### Zero-Lag Event-Based System

The notification sound plays **immediately** (zero lag) when operator input is required:

1. **When you finish responding** (`Stop` event)
   - Triggers instantly when response completes and input field is ready
   - Ensures operator knows you're done and waiting for input
   - Event-based, not polling - no delays

2. **When permission is needed** (`permission_prompt` event)
   - Triggers instantly when bash or tool permission dialog appears
   - Alerts operator that approval is required to continue
   - Covers bash commands, file operations, etc.

### How It Works

- Hooks are defined in `.claude/settings.json` (NOT a separate hooks.json file)
- Both events are native Claude Code events - no polling or arbitrary delays
- Sound plays exactly when operator intervention is needed
- No sounds during AI thinking or processing

### Manual Notification (Not Recommended)

You should **NOT** manually run `python notify.py` - the hooks handle everything automatically. The operator wants notifications only when input is actually needed, not arbitrarily during processing.

## ⚙️ Allowed Tools Configuration

This project uses **allowed tools** instead of dangerous mode to reduce permission prompts while maintaining security.

### Pre-Approved Commands

The following bash commands are pre-approved and won't require permission:
- `git *` - All git operations
- `npm *` / `pip *` / `python *` - Package management and Python execution
- `ls`, `pwd`, `mkdir`, `cp`, `mv` - Safe file system operations
- `cat`, `grep`, `find`, `echo` - File reading and searching

### File Access Rules

- **Read access**: All project files and common config files
- **Write/Edit access**: Project directories with appropriate restrictions
- **Protected files**: System-critical files require explicit permission

### When You Still Need Permission

Some operations intentionally require permission for safety:
- Destructive commands (rm, force operations)
- Network operations (curl, wget)
- System modifications
- Operations outside the project directory

## 📋 Claude Code Best Practices

1. **Do NOT manually trigger notifications** - Hooks handle this automatically
2. **Use TodoWrite** for complex multi-step tasks
3. **Respect allowed tools** - They're configured for your safety and efficiency
4. **Check `.claude/settings.json`** if notifications aren't working (hooks section at bottom)

## 🔧 Activating Hooks

After Claude Code starts:
- Hooks in `.claude/settings.json` are loaded automatically
- If you modify hooks during a session, run `/hooks` to reload them
- Restart Claude Code if `/hooks` doesn't work

---

# Part 2: Project Architecture

## What This Project Is

**Quality-First Project Template** with **Autonomous Execution System** for building high-quality web applications with Claude Code.

- **Development methodology**: BMAD (Build, Measure, Adapt, Deploy) + Autonomous Component Integration
- **Testing framework**: Jest with parallel execution (50% CPU core usage)
- **Coverage targets**: 80% across branches, functions, lines, statements
- **Validation approach**: Progressive 4-level validation with contract-first development

## Three-Pass Execution Workflow

The project follows a **three-pass development model** that separates concerns and ensures quality at each stage:

### Pass 1: Backend Development (BMAD)
**Tools**: `/dev-story`, BMAD workflows

**Purpose**: Core functionality, data layer, business logic

**Output**: Tested backend components with 80% coverage

**Workflow**:
1. Planning phase: `/pm` (product manager), `/architect` (technical design)
2. Story creation: `/create-epics-and-stories`
3. Development: `/dev-story` (implements with tests)
4. Quality gates: Unit tests, coverage requirements

### Pass 2: Component Integration (Autonomous)
**Tools**: `/integrate`, event-driven skills

**Purpose**: Extract Claude Chat prototypes into production components

**Output**: Validated, sandbox-tested, production-ready components in `src/`

**Workflow**:
1. Operator creates HTML prototype in Claude Chat
2. Saves prototype to `references/`
3. Runs `/integrate` command
4. Autonomous pipeline executes:
   - Component extraction (`component_extracted` event)
   - Contract creation (`contract_created` event)
   - Component validation (`validation_completed` event)
   - Sandbox testing (`component_proven` event)
   - Production migration (`component_production_ready` event)

### Pass 3: Debug & Polish (Manual)
**Tools**: `/debug-css`, `/quick-fix`, manual refinement

**Purpose**: Visual polish, edge cases, UX refinement

**Workflow**:
1. Manual testing and visual review
2. Bug fixes and edge case handling
3. Performance optimization
4. Final quality review

## Event-Driven Skills System

The project uses an **event-driven autonomous execution model** where skills coordinate automatically.

### How It Works

1. **Commands emit events** (e.g., `component_extracted`)
2. **Skills listen for events** (defined in `.claude/skills/trigger-matrix.yaml`)
3. **Skills auto-execute** when conditions are met
4. **Skills emit new events**, triggering the next skill
5. **Complete pipeline executes autonomously**

### Example Event Chain

```
/integrate command
  ↓
component_extracted
  ↓
contract-creation skill (auto-executes)
  ↓
contract_created
  ↓
component-validation skill (auto-executes)
  ↓
validation_completed
  ↓
sandbox-testing skill (auto-executes)
  ↓
component_proven
  ↓
component-integration skill (auto-executes)
  ↓
component_integrated
  ↓
production_ready skill (auto-executes)
  ↓
component_production_ready (DONE!)
```

### Autonomy Configuration

Skills are configured in `.claude/skills/trigger-matrix.yaml`:
- `fully_autonomous: true` - No manual approval needed
- `require_sandbox_approval: false` - Auto-approve sandbox tests
- `max_parallel_components: 5` - Process up to 5 components simultaneously

## File Organization

### Operator Workspace (Human-Created)
**Where you work**:
- `docs/` - Project documentation (PRDs, architecture, epics, stories)
- `references/` - Claude Chat prototypes for `/integrate` command
- `src/` - Production-ready components (migrated from `.system/proven/`)
- `assets/` - Images, fonts, media files
- `tests/` - Test suites (unit, integration)

### Agent Workspace (AI-Created)
**Where agents work**:
- `.system/components/` - Work-in-progress components
- `.system/contracts/` - Component interface definitions
- `.system/proven/` - Validated, sandbox-tested components
- `.system/sandbox/` - Isolated testing environments
- `.system/execution-status.yaml` - Three-pass progress tracking
- `.system/events/` - Event log for autonomous execution tracking

### Infrastructure (Permanent)
**Committed to version control**:
- `.system/agents/` - Agent definitions for orchestration
- `.system/boilerplate/` - Component templates (CSS, JS, test files)
- `.system/scripts/` - Build automation
- `.system/validation/` - Quality gate scripts
- `.system/mcp-servers/` - Component registry server for conflict detection
- `.bmad/` - BMAD methodology workflows
- `.claude/` - Claude Code configuration (agents, commands, skills)

### Build Output (Git-Ignored)
**Generated, not committed**:
- `public/` - Deployable build output (bundled CSS/JS, optimized assets)
- `node_modules/` - Dependencies
- `coverage/` - Test coverage reports
- `.jest-cache/` - Test cache

## Component Migration Flow

Components move through this pipeline:

```
1. references/          (Operator creates prototype)
        ↓
2. .system/components/  (Agent extracts & develops)
        ↓
3. .system/proven/      (Passes all 4 validation levels)
        ↓
4. src/                 (Production-ready source code)
        ↓
5. public/              (Bundled for deployment)
```

## Progress Tracking

### Execution Status
**File**: `.system/execution-status.yaml`

Tracks:
- Current pass (1, 2, or 3)
- Current story being worked on
- Component status (created, validated, proven, integrated)
- Metrics and speedup stats

### Event Log
**Folder**: `.system/events/`

Records all events emitted during autonomous execution for debugging and auditing.

## MCP Integration Safety

**MCP Server**: `.system/mcp-servers/component-registry-server.js`

**Purpose**: Prevent namespace conflicts and maintain dependency graphs

**Features**:
- Component registry with CSS/JS namespace tracking
- Dependency graph management
- Real-time conflict detection
- Integration safety validation (Level 4)

**Query before integration**: All components must query MCP registry before integration to prevent:
- CSS class name collisions
- JavaScript API conflicts
- Circular dependencies

## Key Workflows

### Planning & Backend Development (BMAD)

```bash
# Step 1: Product planning
/pm

# Step 2: Technical architecture
/architect

# Step 3: Create epics and stories
/create-epics-and-stories

# Step 4: Develop story with tests
/dev-story
```

### Component Integration (Autonomous)

```bash
# Step 1: Create HTML prototype in Claude Chat
# Step 2: Save to references/ folder
# Step 3: Run integration command
/integrate

# Autonomous pipeline handles the rest!
```

### Debug & Polish (Manual)

```bash
# Quick CSS fixes
/debug-css

# General bug fixes
/quick-fix

# Code improvements
/improve
```

## Quick Command Reference

### BMAD Workflows
- `/pm` - Product manager (PRD creation)
- `/architect` - Technical architecture
- `/create-epics-and-stories` - Break down PRD into deliverables
- `/dev-story` - Implement story with tests
- `/code-review` - Senior developer review

### Component Integration
- `/integrate` - Extract and integrate Claude Chat prototype
- `/checklist` - Validate component readiness

### Debug & Polish
- `/debug-css` - CSS debugging and fixes
- `/quick-fix` - Quick bug fixes
- `/improve` - Code improvements and refactoring

### Orchestration
- `/orchestrator-exe` - Advanced parallel orchestration (up to 8 terminals)

### Project Status
- Check `.system/execution-status.yaml` for current pass and progress
- Check `.system/events/` for recent autonomous execution activity

---

# Part 3: Coding Conventions

## Contract-First Development

**Always define the interface before implementation.**

### Contract Structure

Every component MUST have a contract file in `.system/contracts/{component-name}-contract.md` that defines:

1. **Component Purpose** - What it does and why it exists
2. **Public API** - All exposed methods and their signatures
3. **CSS Namespace** - All CSS classes that will be used
4. **Dependencies** - Other components this depends on
5. **Events** - Events emitted or consumed
6. **HTML Structure** - Expected DOM structure
7. **Acceptance Criteria** - How to verify it works

### Contract Example

```markdown
# Login Form Contract

## Purpose
Provides user authentication interface with email/password validation.

## Public API
- `LoginForm.init(containerId)` - Initialize form in specified container
- `LoginForm.validate()` - Validate form fields, returns boolean
- `LoginForm.submit()` - Submit form data, returns Promise
- `LoginForm.reset()` - Clear all fields
- `LoginForm.on(event, callback)` - Event listener registration

## CSS Namespace
All classes prefixed with `.login-form-`
- `.login-form-container`
- `.login-form-input`
- `.login-form-button`
- `.login-form-error`
- `.login-form-loading`

## Dependencies
- `InputValidator.js` - Field validation
- `ApiClient.js` - Authentication API calls

## Events Emitted
- `login:success` - Successful authentication
- `login:error` - Authentication failed
- `login:validation-error` - Form validation failed

## HTML Structure
<div class="login-form-container">
  <form class="login-form">
    <input type="email" class="login-form-input">
    <input type="password" class="login-form-input">
    <button class="login-form-button">Login</button>
  </form>
</div>
```

## CSS Conventions

### Namespacing Rule (MANDATORY)

**Every component MUST use a unique class prefix: `.component-name-`**

```css
/* Login Form Component */
.login-form-container { }
.login-form-input { }
.login-form-button { }
.login-form-error { }

/* Product Card Component */
.product-card-container { }
.product-card-image { }
.product-card-title { }
.product-card-price { }
```

**Enforcement**: Level 3 validation checks for namespace compliance

### BEM-Inspired Modifiers

Use double-dash for modifiers within component namespace:

```css
/* Base component */
.button-primary { }

/* State modifiers */
.button-primary--loading { }
.button-primary--disabled { }
.button-primary--success { }

/* Size modifiers */
.button-primary--small { }
.button-primary--large { }
```

### State Classes

Use `is-` or `has-` prefixes for state:

```css
.login-form-container.is-loading { }
.product-card.is-selected { }
.modal.is-open { }
.form.has-errors { }
```

### CSS Organization

Within each component CSS file:

```css
/* 1. Container/Layout */
.component-container { }

/* 2. Elements */
.component-header { }
.component-body { }
.component-footer { }

/* 3. Modifiers */
.component-container--variant { }

/* 4. States */
.component-container.is-active { }

/* 5. Media Queries */
@media (min-width: 768px) {
  .component-container { }
}
```

## JavaScript Conventions

### Encapsulation Rule (MANDATORY)

**Every component MUST expose a single namespace object: `ComponentName`**

```javascript
// Login Form Component
const LoginForm = {
  init(containerId) { },
  validate() { },
  submit() { },
  reset() { }
};

// Product Card Component
const ProductCard = {
  render(data) { },
  update(id, data) { },
  destroy(id) { }
};
```

**Enforcement**: Level 3 validation checks for API compliance with contract

### Module Pattern

Use IIFE (Immediately Invoked Function Expression) for encapsulation:

```javascript
const ComponentName = (function() {
  // Private variables
  let state = {};
  let config = {};

  // Private methods
  function privateHelper() {
    // ...
  }

  // Public API
  return {
    init(options) {
      config = { ...config, ...options };
      // initialization logic
    },

    doSomething() {
      privateHelper();
      // public method logic
    }
  };
})();
```

### Event-Driven Communication

Components communicate via custom events:

```javascript
// Emit events
const event = new CustomEvent('component:action', {
  detail: { data: 'value' }
});
document.dispatchEvent(event);

// Listen for events
document.addEventListener('component:action', (e) => {
  console.log(e.detail.data);
});
```

### Dependency Injection

Pass dependencies explicitly, don't rely on globals:

```javascript
const LoginForm = (function(validator, apiClient) {
  return {
    init(containerId) {
      // Use injected dependencies
      validator.validate(...);
      apiClient.post(...);
    }
  };
})(InputValidator, ApiClient);
```

### Error Handling

Always handle errors gracefully:

```javascript
async submit() {
  try {
    const result = await apiClient.post('/auth', data);
    return { success: true, result };
  } catch (error) {
    console.error('LoginForm: Submit failed', error);
    return { success: false, error: error.message };
  }
}
```

### Naming Conventions

- **Functions/Methods**: camelCase (`getUserData`, `validateForm`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`, `API_ENDPOINT`)
- **Component Objects**: PascalCase (`LoginForm`, `ProductCard`)
- **Private methods**: prefix with underscore (`_privateMethod`)

## Testing Requirements

### Coverage Targets (MANDATORY)

**Must achieve 80% minimum across all metrics:**
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

### Test File Organization

Each component has a corresponding test file:

```
src/component-name/
├── component-name.js
└── component-name.test.js
```

### Test Structure

```javascript
describe('ComponentName', () => {
  describe('init', () => {
    test('should initialize with default config', () => {
      // Arrange
      const containerId = 'test-container';

      // Act
      ComponentName.init(containerId);

      // Assert
      expect(ComponentName.isInitialized()).toBe(true);
    });
  });

  describe('validate', () => {
    test('should return true for valid input', () => {
      // Test implementation
    });

    test('should return false for invalid input', () => {
      // Test implementation
    });
  });
});
```

### Contract Compliance Testing

Tests must verify contract compliance:

```javascript
describe('Contract Compliance', () => {
  test('should expose all contract-defined methods', () => {
    expect(typeof ComponentName.init).toBe('function');
    expect(typeof ComponentName.validate).toBe('function');
    expect(typeof ComponentName.submit).toBe('function');
  });

  test('should use correct CSS namespace', () => {
    const html = ComponentName.render();
    expect(html).toContain('component-name-container');
    expect(html).toContain('component-name-input');
  });
});
```

## Validation Gates (4 Levels)

Components MUST pass all 4 levels before integration:

### Level 1: Syntax Check
- JavaScript syntax validation
- CSS syntax validation
- HTML structure validation
- No linting errors

### Level 2: Unit Tests
- All tests pass
- 80% coverage minimum
- No failing assertions
- No console errors during tests

### Level 3: Contract Compliance
- All contract-defined methods exist
- CSS namespace matches contract
- API signatures match contract
- Dependencies declared correctly

### Level 4: MCP Integration Safety
- Query component registry
- No CSS class conflicts
- No JavaScript API conflicts
- No circular dependencies
- Dependency graph valid

**Enforcement**: Automated via validation skills, cannot skip levels

## MCP Integration Protocol

Before integrating any component:

1. **Query Registry**: Check for conflicts
   ```javascript
   // Skills automatically query MCP server
   const conflicts = await checkRegistry({
     componentName: 'login-form',
     cssClasses: ['.login-form-container', '.login-form-input'],
     jsApi: ['LoginForm.init', 'LoginForm.validate']
   });
   ```

2. **Resolve Conflicts**: If conflicts found, rename or refactor

3. **Register Component**: After successful integration
   ```javascript
   await registerComponent({
     name: 'login-form',
     version: '1.0.0',
     cssNamespace: 'login-form-',
     jsApi: 'LoginForm',
     dependencies: ['input-validator', 'api-client']
   });
   ```

4. **Update Dependency Graph**: Maintain component relationships

## Event-Driven Coordination

### How Skills Trigger Each Other

Skills listen for events and auto-execute when conditions are met.

**Example: Component Integration Pipeline**

```yaml
# .claude/skills/trigger-matrix.yaml

contract-creation:
  triggers:
    - component_extracted
  emits:
    - contract_created

component-validation:
  triggers:
    - contract_created
  emits:
    - validation_completed

sandbox-testing:
  triggers:
    - validation_completed
  emits:
    - component_proven

production_ready:
  triggers:
    - component_integrated
  emits:
    - component_production_ready
```

### Event Naming Convention

**Pattern**: `noun_verb` (past tense)

Examples:
- `component_extracted`
- `contract_created`
- `validation_completed`
- `component_proven`
- `component_integrated`
- `component_production_ready`

## Best Practices Summary

### Do's
✅ Define contract BEFORE writing code
✅ Use component namespace for ALL CSS classes
✅ Expose single object for JavaScript API
✅ Write tests to achieve 80% coverage
✅ Pass all 4 validation levels
✅ Query MCP registry before integration
✅ Handle errors gracefully
✅ Use dependency injection
✅ Document public APIs

### Don'ts
❌ Skip contract creation
❌ Use global CSS classes without namespace
❌ Expose multiple global variables
❌ Skip tests or accept low coverage
❌ Integrate without MCP registry check
❌ Use globals instead of dependency injection
❌ Leave console.log statements in production code
❌ Modify components directly in `src/` (edit in `.system/components/` and re-validate)

## Migration Flow Reminder

```
Development:     .system/components/     (Work in progress)
                         ↓
Validation:      4-level validation      (Syntax → Tests → Contract → MCP)
                         ↓
Proven:          .system/proven/         (Passed all validation)
                         ↓
Production:      src/                    (Production-ready source)
                         ↓
Deployment:      public/                 (Bundled build output)
```

---

## Additional Resources

- **Project README**: `README.md` - Project overview and quick start
- **System Architecture**: `.system/README.md` - Detailed infrastructure documentation
- **Autonomous Execution**: `.system/README-AUTONOMOUS.md` - Event-driven skills documentation
- **Testing Guide**: `tests/README.md` - Test organization and parallel execution
- **Contract Testing**: `tests/CONTRACT-TESTING.md` - Contract compliance testing guide
- **Execution Status**: `.system/execution-status.yaml` - Current progress tracking
- **Trigger Matrix**: `.claude/skills/trigger-matrix.yaml` - Event-skill mapping

---

**Remember**: This template is designed for quality-first development with autonomous execution. Follow the conventions, trust the validation gates, and let the event-driven skills handle the coordination!
