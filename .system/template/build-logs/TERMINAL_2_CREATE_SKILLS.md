# TERMINAL 2: Convert Commands to Claude Skills

## Objective
Convert agent-facing slash commands to Claude skills so agents can call them autonomously, reducing operator coordination burden.

## Background
Commands like `/validate-component` and `/prove-it-works` reference `.system/` paths and are part of the agent workflow. Converting to skills means agents can auto-validate during development without operator needing to remember to run commands at the right time.

## Scope
- Create `.claude/skills/` directory
- Convert 2 commands to skills: `validate-component`, `prove-it-works` (partial)
- Delete original command files
- Create skills README

## Tasks

### 1. Create Skills Directory

```bash
mkdir -p .claude/skills
```

### 2. Create validate-component Skill

Create `.claude/skills/validate-component.md`:

```markdown
# Component Validation Skill

Auto-run 4-level progressive validation on components before integration.

## When to Use This Skill

**Automatic Triggers**:
- After implementing a component in `components/[name]/`
- Before integrating a component
- When operator asks to "validate" or "check quality"
- Before marking story as done

**Manual Override**: Operator can still run validation manually if needed

## What This Skill Does

Runs 4-level progressive validation from `.system/validation/`:

### Level 1: Syntax Validation (fast, <1s)
- Check JavaScript parses without errors
- Check CSS syntax valid
- Check no undefined variables

### Level 2: Unit Test Validation (medium, <10s)
- Run all `*.test.js` files
- Verify all assertions pass
- Check test coverage >80%

### Level 3: Contract Compliance (fast, <1s)
- Load contract from `.system/contracts/[name]-contract.md`
- Verify implementation matches specification:
  - Input/output types correct
  - CSS namespace followed
  - DOM ID reservations respected
  - Dependencies declared

### Level 4: Integration Safety (medium, <30s)
- Check for CSS conflicts (duplicate selectors, namespace violations)
- Check for DOM ID conflicts
- Check for dependency conflicts
- Verify component isolation

## How to Use

When you (the agent) complete a component implementation:

1. Check if component exists in `components/[name]/`
2. Run this validation skill automatically
3. Report results to operator with clear pass/fail
4. If any level fails: Stop and report specific issues
5. If all pass: Suggest next step (sandbox testing via prove-it-works skill)

## Example Usage

```
[Agent completes components/button/button.js]

Agent: "I've completed the button component. Running validation..."

[Auto-runs validation skill]

✅ Level 1: Syntax Valid (0.2s)
✅ Level 2: Unit Tests Pass (3.1s) - 12/12 assertions
✅ Level 3: Contract Compliant (0.1s) - Matches button-contract.md
✅ Level 4: Integration Safe (1.8s) - No conflicts detected

Agent: "All validation levels passed! Ready for sandbox testing. Should I run prove-it-works skill?"
```

## Validation Scripts

Located in `.system/validation/`:
- `pre-flight-check.sh` - Main validation orchestrator
- `syntax-check.js` - Level 1
- `test-runner.js` - Level 2
- `contract-validator.js` - Level 3
- `integration-checker.js` - Level 4

## MCP Integration

This skill calls MCP tool: `run_preflight_checks`

```javascript
// MCP call
await mcpClient.call('run_preflight_checks', {
  componentName: 'button',
  componentPath: 'components/button/'
});
```

## Philosophy

**"Fail fast, fix early"** - Catch bugs in seconds, not hours.

Progressive validation means:
- Quick checks first (syntax) - 0.2s feedback
- Expensive checks later (tests) - Only if syntax passes
- Integration checks last - Only if tests pass

This saves time by failing early on simple issues.

## Notes for Agents

- Always run this skill before suggesting integration
- Report validation results clearly to operator
- If validation fails: Show specific errors and suggest fixes
- If validation passes: Suggest next step (sandbox testing)
- Don't proceed to integration if any level fails
```

### 3. Create prove-it-works Skill (Partial)

Create `.claude/skills/prove-it-works.md`:

```markdown
# Prove It Works Skill (Sandbox Testing)

Auto-create sandbox test environments for isolated component testing.

## When to Use This Skill

**Automatic Triggers**:
- After component passes all 4 validation levels
- When operator asks to "test in isolation" or "sandbox test"
- Before marking component as proven

**Manual Override**: Operator still verifies in browser and confirms proven status

## What This Skill Does

Creates isolated sandbox test environment in `.system/sandbox/`:

### Sandbox Creation

1. **Copy component to sandbox**:
   - Copy from `components/[name]/` to `.system/sandbox/[name]/`
   - Include all files (.js, .css, .test.js, assets)

2. **Create minimal test HTML**:
   - Use template from `.system/sandbox/test-template.html`
   - Inject component with minimal dependencies
   - No external dependencies (isolate completely)

3. **Generate test instructions**:
   - Create `[name]-test-plan.md` with test scenarios
   - Include visual regression checks
   - Include behavior tests
   - Include performance checks

### Operator Verification Required

**This skill DOES NOT mark as proven automatically** - operator must verify:
- Visual rendering correct
- Behavior works as expected
- No console errors
- Performance acceptable

## How to Use

When you (the agent) complete validation:

1. Run this skill to create sandbox
2. Report to operator: "Sandbox created at `.system/sandbox/[name]/`"
3. Provide test instructions
4. Ask operator to verify in browser
5. Wait for operator confirmation
6. If operator confirms: Call MCP `mark_as_proven` tool

## Example Usage

```
[Agent runs validation, all levels pass]

Agent: "Validation passed! Creating sandbox test environment..."

[Auto-runs prove-it-works skill]

✅ Sandbox created: .system/sandbox/button/
✅ Test HTML: .system/sandbox/button/button-test.html
✅ Test plan: .system/sandbox/button/button-test-plan.md

Agent: "Please open .system/sandbox/button/button-test.html in your browser and verify:
1. Button renders correctly (blue background, white text)
2. Click triggers console.log('Button clicked!')
3. Hover shows darker blue
4. No console errors

If all looks good, I'll mark as proven and move to .system/proven/"

[Operator tests in browser and confirms]

Operator: "Looks good!"

Agent: [Calls MCP mark_as_proven] "Component marked as proven ✓"
```

## Sandbox Files

Located in `.system/sandbox/`:
- `test-template.html` - Minimal HTML template
- `[component]/` - Isolated component copy
- `[component]/[component]-test.html` - Generated test file
- `[component]/[component]-test-plan.md` - Test instructions

## MCP Integration

This skill calls MCP tools:
- `test_in_sandbox` - Verify sandbox test exists
- `mark_as_proven` - Move to proven (after operator confirms)

```javascript
// Create sandbox
await mcpClient.call('test_in_sandbox', {
  componentName: 'button'
});

// After operator confirms
await mcpClient.call('mark_as_proven', {
  componentName: 'button'
});
```

## Proven Component Archive

After operator verification, component moves to `.system/proven/`:
- Read-only reference
- Production-ready archive
- Only validated components
- Ready for integration

## Philosophy

**"Prove it works, don't hope it works"**

Sandbox testing ensures:
- Component works in complete isolation
- No hidden dependencies
- Visual rendering correct
- Behavior matches expectations

## Notes for Agents

- Always create sandbox after validation passes
- Provide clear test instructions to operator
- Wait for operator browser verification
- Only mark as proven after operator confirms
- Report final location: `.system/proven/[name]/`
```

### 4. Delete Original Command Files

```bash
# These commands are now skills
rm .claude/commands/personal/define-contract.md
rm .claude/commands/personal/validate-component.md
rm .claude/commands/personal/prove-it-works.md
```

**Note**: `define-contract.md` will also become a skill (contract creation).

### 5. Create define-contract Skill

Create `.claude/skills/define-contract.md`:

```markdown
# Define Contract Skill

Auto-create component contracts before implementation to prevent integration bugs.

## When to Use This Skill

**Automatic Triggers**:
- Before implementing a new component
- When operator says "create component [name]"
- When sharding via /integrate creates new components

**Manual Override**: Operator can still define contracts interactively if needed

## What This Skill Does

Creates contract file in `.system/contracts/[name]-contract.md` defining:

1. **Component Specification**:
   - Purpose and description
   - Input parameters and types
   - Output/return values
   - Events emitted

2. **CSS Namespace**:
   - Reserved class prefix (e.g., `.btn-`, `.modal-`)
   - Prevents CSS conflicts

3. **DOM Reservations**:
   - Reserved ID patterns (e.g., `#btn-*`)
   - Prevents ID conflicts

4. **Dependencies**:
   - Required libraries
   - Other components it depends on
   - External resources (fonts, icons)

5. **Test Requirements**:
   - Unit test expectations
   - Integration test scenarios
   - Edge cases to handle

## How to Use

When you (the agent) start implementing a component:

1. Check if contract exists in `.system/contracts/[name]-contract.md`
2. If not: Run this skill to create contract
3. Use contract as specification for implementation
4. Validate against contract via validate-component skill

## Example Contract

```markdown
# Button Component Contract

## Purpose
Reusable button component with multiple variants (primary, secondary, danger)

## Input Parameters
- `label` (string, required) - Button text
- `variant` (string, optional) - 'primary' | 'secondary' | 'danger', default: 'primary'
- `onClick` (function, required) - Click handler
- `disabled` (boolean, optional) - Disabled state, default: false

## Output
Returns: Button DOM element

## Events
- `click` - Emitted on button click (if not disabled)

## CSS Namespace
Reserved prefix: `.btn-`
Classes:
- `.btn-primary`
- `.btn-secondary`
- `.btn-danger`
- `.btn-disabled`

## DOM Reservations
No IDs reserved (button uses classes only)

## Dependencies
None (vanilla JavaScript)

## Test Requirements
- Unit: Verify all variants render
- Unit: Verify disabled state prevents clicks
- Integration: Verify no CSS conflicts with other .btn-* classes
- Edge: Test with empty label, test with very long label

## Created By
Agent (define-contract skill)

## Created Date
2025-01-15
```

## Template Location

Uses template from `.system/boilerplate/component-spec.md`

## MCP Integration

This skill calls MCP tool: `validate_contract`

```javascript
await mcpClient.call('validate_contract', {
  componentName: 'button',
  contractPath: '.system/contracts/button-contract.md'
});
```

## Philosophy

**"Define before you build"**

Contract-first development prevents 70% of integration bugs by:
- Declaring intent upfront
- Reserving namespaces
- Specifying interfaces
- Preventing conflicts

## Notes for Agents

- Always create contract BEFORE writing implementation
- Use contract as source of truth for tests
- Validate implementation against contract
- Update contract if requirements change (document changes)
```

### 6. Create Skills README

Create `.claude/skills/README.md`:

```markdown
# Claude Skills

Auto-called quality gates for agent-autonomous validation and workflow.

## What Are Skills?

Skills are agent-callable functions that run automatically during development. Unlike slash commands (operator-invoked), skills are called by agents when needed.

## Available Skills

### validate-component
**Purpose**: 4-level progressive validation
**When**: After component implementation, before integration
**Auto-trigger**: Component file saved in `components/`
**Manual**: Operator can request validation

### prove-it-works
**Purpose**: Sandbox testing in isolation
**When**: After validation passes
**Auto-trigger**: Validation levels 1-4 all pass
**Manual**: Operator can request sandbox test
**Note**: Operator still verifies in browser and confirms

### define-contract
**Purpose**: Contract-first development
**When**: Before implementing new component
**Auto-trigger**: New component creation, /integrate sharding
**Manual**: Operator can define contracts interactively

## Skill vs Command

| Aspect | Skills | Commands |
|--------|--------|----------|
| Invoked by | Agents (auto) | Operators (manual) |
| Timing | Automatic triggers | Operator decides when |
| Purpose | Quality gates | Interactive workflows |
| Examples | validate, prove, contract | /integrate, /debug-css, /quick-fix |

## Philosophy

**Skills = Autonomous quality enforcement**

Agents use skills to:
- Validate automatically (catch bugs early)
- Test in isolation (prove it works)
- Define contracts (prevent conflicts)

This reduces operator burden - agents handle quality gates autonomously.

## Operators Still Control

Operators retain control over:
- When to integrate (manual decision)
- Browser verification (manual testing)
- Marking as proven (manual confirmation)
- Debugging (manual investigation)

Skills handle the repetitive validation work; operators handle judgment calls.

## Total Count

- **3 Skills**: validate-component, prove-it-works, define-contract
- **7 Personal Commands**: checklist, integrate-mcp, integrate, debug-css, quick-fix, improve, next-steps
- **37 BMAD Commands**: Full SDLC workflows

**Total**: 3 skills + 44 commands = 47 tools
```

### 7. Verify Skills Directory

```bash
ls -la .claude/skills/
cat .claude/skills/README.md
```

Expected structure:
```
.claude/skills/
├── define-contract.md
├── validate-component.md
├── prove-it-works.md
└── README.md
```

## Success Criteria
- [ ] `.claude/skills/` directory created
- [ ] 3 skill files created (validate-component, prove-it-works, define-contract)
- [ ] Skills README.md created
- [ ] Original command files deleted from personal/
- [ ] Skills properly documented with auto-trigger conditions

## Notes
- Skills are read by agents via Claude Code's skill system
- Agents will automatically call skills when trigger conditions met
- Operators can still manually request skill execution if needed
- This reduces coordination burden on operators
