# Terminal 1: Skills Creation & Command Cleanup

**Time estimate: 15-20 min**

---

## Task 1: Create Skills Folder Structure

```bash
mkdir -p .claude/skills
```

---

## Task 2: Create Skill Files

### File 1: contract_creation.md

```bash
cat > .claude/skills/contract_creation.md << 'EOF'
# Contract Creation Skill

**Auto-triggered when:** Operator requests to create a new component

**Purpose:** Generate contract definitions and test stubs before implementation

---

## What This Skill Does

1. Prompts operator for component details:
   - Component name
   - Purpose/description
   - Expected props/inputs
   - Expected outputs/events
   - Dependencies

2. Creates `.system/contracts/[component]-contract.md` with:
   - Interface definition
   - Props specification
   - Events specification
   - Usage examples
   - Acceptance criteria

3. Creates test stub at `.system/components/[component]/[component].test.js`

4. Returns contract path to operator for review

---

## Trigger Patterns

Operator says:
- "Create new component [name]"
- "I need a [component] component"
- "Define contract for [component]"

---

## Skill Behavior

```
Operator: "Create new component button"

Agent (auto-executes):
1. Interactive questions about button component
2. Generates .system/contracts/button-contract.md
3. Creates .system/components/button/button.test.js stub
4. Responds: "✅ Contract created: .system/contracts/button-contract.md"
```

---

## Old Command Replaced

This skill replaces: `/define-contract`

---

## Files Created

- `.system/contracts/[component]-contract.md`
- `.system/components/[component]/[component].test.js`
EOF
```

### File 2: component_validation.md

```bash
cat > .claude/skills/component_validation.md << 'EOF'
# Component Validation Skill

**Auto-triggered when:** Component is ready for integration or operator requests validation

**Purpose:** Run 4-level progressive validation before integration

---

## What This Skill Does

Runs 4 validation levels on components in `.system/components/`:

### Level 1: Syntax Check (fast, <1s)
- JavaScript syntax validation
- CSS syntax validation
- HTML structure validation

### Level 2: Unit Tests (medium, <10s)
- Runs component test suite
- Checks test coverage
- Reports pass/fail

### Level 3: Contract Compliance (fast, <1s)
- Reads `.system/contracts/[component]-contract.md`
- Validates interface matches contract
- Checks props/events match specification

### Level 4: Integration Safety (medium, <30s)
- Queries MCP server for conflicts
- Checks namespace collisions
- Validates dependencies available

---

## Trigger Patterns

Operator says:
- "Validate [component]"
- "Is [component] ready?"
- "Check [component] quality"

Auto-triggered by `/integrate` before integration

---

## Skill Behavior

```
Operator: "Validate button component"

Agent (auto-executes):
Level 1: ✅ Syntax valid
Level 2: ✅ 12/12 tests pass
Level 3: ✅ Contract compliance verified
Level 4: ⚠️  Potential CSS conflict with .btn class

Result: "Needs attention - CSS namespace conflict"
```

---

## Old Command Replaced

This skill replaces: `/validate-component`

---

## Output

- Console report of all 4 levels
- Creates: `.system/components/[component]/validation-report.md`
- Returns: Pass/Fail status
EOF
```

### File 3: sandbox_testing.md

```bash
cat > .claude/skills/sandbox_testing.md << 'EOF'
# Sandbox Testing Skill

**Auto-triggered when:** Component passes validation, ready for visual verification

**Purpose:** Create isolated test environment to prove component works

---

## What This Skill Does

1. Reads `.system/sandbox/test-template.html`
2. Injects component from `.system/components/[component]/`
3. Creates `.system/sandbox/[component]-test.html` with:
   - Component in isolation
   - Interactive controls
   - Visual verification checklist
4. Opens in browser for manual testing
5. On operator approval, moves to `.system/proven/[component]/`

---

## Trigger Patterns

Operator says:
- "Test [component] in sandbox"
- "Prove [component] works"
- "Show me [component]"

Auto-triggered by `/integrate` after validation passes

---

## Skill Behavior

```
Operator: "Prove button works"

Agent (auto-executes):
1. Creates .system/sandbox/button-test.html
2. Opens in browser: http://localhost:8000/sandbox/button-test.html
3. Waits for operator verification

Operator: "Looks good!"

Agent:
4. Moves .system/components/button/ → .system/proven/button/
5. Responds: "✅ Button proven and archived"
```

---

## Old Command Replaced

This skill replaces: `/prove-it-works`

---

## Files Created

- `.system/sandbox/[component]-test.html` (temporary)
- `.system/proven/[component]/` (on approval)
EOF
```

### File 4: environment_check.md

```bash
cat > .claude/skills/environment_check.md << 'EOF'
# Environment Check Skill

**Auto-triggered when:** Session starts or operator runs `/checklist`

**Purpose:** Validate development environment setup

---

## What This Skill Does

Validates entire `.system/` infrastructure:

1. **Folder Structure Check:**
   - .system/components/
   - .system/contracts/
   - .system/proven/
   - .system/sandbox/
   - .system/validation/
   - .system/mcp-servers/
   - .system/notifications/
   - .system/scripts/
   - .system/template/

2. **MCP Server Check:**
   - node_modules installed
   - component-registry.js exists
   - Server responds to ping

3. **Git Check:**
   - Repository initialized
   - .gitignore configured

4. **Config Check:**
   - .claude/ structure valid
   - Skills folder exists

5. **Interactive Fixes:**
   - Offers to create missing folders
   - Offers to install MCP dependencies
   - Offers to initialize git

---

## Trigger Patterns

Operator says:
- "/checklist" (manual command)
- "Check environment"
- "Is everything set up?"

Auto-triggered: Session start (optional)

---

## Skill Behavior

```
Operator: "/checklist"

Agent (auto-executes):
✅ Folder structure complete
✅ MCP server running
❌ Git not initialized
⚠️  .gitignore missing

Interactive: "Initialize git repository? (y/n)"
Operator: "y"
✅ Git initialized

Result: "Environment ready! 🚀"
```

---

## Old Command Replaced

This skill enhances: `/checklist` (command still exists, calls this skill)

---

## Output

- Validation report
- Interactive fixes
- Environment status
EOF
```

### File 5: mcp_setup.md

```bash
cat > .claude/skills/mcp_setup.md << 'EOF'
# MCP Setup Skill

**Auto-triggered when:** First-time project setup or MCP not detected

**Purpose:** One-time MCP server configuration

---

## What This Skill Does

1. Creates `.system/mcp-servers/` folder
2. Initializes package.json
3. Installs MCP dependencies
4. Creates `component-registry.js` server
5. Tests server connectivity
6. Configures Claude Desktop (if needed)

---

## Trigger Patterns

Operator says:
- "Set up MCP"
- "Configure component registry"
- "First-time setup"

Auto-triggered: `/checklist` detects missing MCP

---

## Skill Behavior

```
Operator: "/checklist"

Agent (detects missing MCP, auto-executes):
1. Creating .system/mcp-servers/
2. Installing dependencies... (30s)
3. Configuring component-registry.js
4. Testing server... ✅
5. MCP ready!

Result: "MCP server configured and running"
```

---

## Old Command Replaced

This skill replaces: `/integrate-mcp`

---

## Files Created

- `.system/mcp-servers/package.json`
- `.system/mcp-servers/component-registry.js`
- `.system/mcp-servers/node_modules/`
EOF
```

### File 6: README.md

```bash
cat > .claude/skills/README.md << 'EOF'
# Claude Skills - Agent Infrastructure Automation

This folder contains **Claude skills** that automate agent-facing operations. Skills are invisible to operators and automatically triggered by agent context.

---

## What Are Skills?

Skills are **autonomous workflows** that agents execute without manual operator commands. Unlike slash commands (which operators type), skills are called automatically when agents detect the need.

---

## Available Skills

### 1. contract_creation
**Replaces:** `/define-contract`
**Triggers:** Operator requests new component
**Does:** Generates contract + test stub in `.system/`

### 2. component_validation
**Replaces:** `/validate-component`
**Triggers:** Component ready for integration
**Does:** 4-level validation (syntax, tests, contract, integration)

### 3. sandbox_testing
**Replaces:** `/prove-it-works`
**Triggers:** Component passes validation
**Does:** Creates isolated test environment, archives to `.system/proven/`

### 4. environment_check
**Replaces:** Part of `/checklist`
**Triggers:** Session start or manual `/checklist`
**Does:** Validates `.system/` infrastructure, offers fixes

### 5. mcp_setup
**Replaces:** `/integrate-mcp`
**Triggers:** First-time setup or MCP missing
**Does:** One-time MCP server configuration

---

## Skills vs. Slash Commands

| Type | Trigger | Visibility | Example |
|------|---------|------------|---------|
| **Skill** | Agent context | Invisible | `contract_creation` auto-runs when operator says "create button component" |
| **Slash Command** | Operator types | Manual | `/quick-fix` requires operator to type command |

---

## Migration from Old Commands

| Old Command | New Approach |
|-------------|--------------|
| `/define-contract` | `contract_creation` skill (auto) |
| `/validate-component` | `component_validation` skill (auto) |
| `/prove-it-works` | `sandbox_testing` skill (auto) |
| `/integrate-mcp` | `mcp_setup` skill (auto) |
| `/checklist` | Calls `environment_check` skill |

---

## How Skills Work

```
Operator: "I need a button component"

Agent (internal thinking):
1. Detects component creation request
2. Calls contract_creation skill
3. Interactive questions about button
4. Generates .system/contracts/button-contract.md
5. Creates test stub

Agent (visible response):
"✅ Button contract created. Ready for implementation."
```

---

## Troubleshooting

### Skill Not Triggering?
- Check agent has access to skills folder
- Verify skill markdown syntax
- Try explicit trigger phrase

### Skill Errors?
- Check `.system/` folder structure exists
- Verify MCP server running
- Review skill output logs

---

## Operator Takeaway

**You don't need to know these exist!**

Skills abstract agent infrastructure. Just use natural language and let agents handle the automation.

Focus on:
- Creating prototypes in `references/`
- Running `/integrate` to shard them
- Using `/quick-fix` and `/debug-css` as needed
EOF
```

---

## Task 3: Delete Obsolete Commands

```bash
rm .claude/commands/personal/define-contract.md
rm .claude/commands/personal/validate-component.md
rm .claude/commands/personal/prove-it-works.md
rm .claude/commands/personal/integrate-mcp.md
```

---

## Task 4: Update /integrate.md (Hybrid Approach)

```bash
# This requires reading the existing file and updating it
# Read current content first, then modify to call skills
```

**Update strategy:**
1. Read `.claude/commands/personal/integrate.md`
2. Add section "Automated Sub-Workflows" that calls skills:
   - After sharding: Call `contract_creation` skill for each component
   - After contract: Call `component_validation` skill
   - After validation: Call `sandbox_testing` skill
3. Update workflow diagram to show skill integration

---

## Validation

After all tasks complete:

```bash
# Check skills folder created
ls -la .claude/skills/

# Verify 6 files exist
ls .claude/skills/
# Should show:
# - contract_creation.md
# - component_validation.md
# - sandbox_testing.md
# - environment_check.md
# - mcp_setup.md
# - README.md

# Verify old commands deleted
ls .claude/commands/personal/
# Should NOT show:
# - define-contract.md
# - validate-component.md
# - prove-it-works.md
# - integrate-mcp.md
```

---

## Completion Checklist

- [ ] `.claude/skills/` folder created
- [ ] 5 skill files created
- [ ] Skills README created
- [ ] 4 obsolete commands deleted
- [ ] `/integrate.md` updated to hybrid approach

---

**Report back when complete!**
