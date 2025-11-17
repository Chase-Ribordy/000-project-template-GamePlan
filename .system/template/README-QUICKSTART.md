# Quick Start Guide

Get up and running with the quality-first project template in 5 minutes.

## 1. Copy This Template

```bash
# Copy the entire project-template folder to your new project
cp -r project-template my-new-project
cd my-new-project
```

## 2. Validate Your Environment

Run the checklist to ensure everything is set up correctly:

```bash
/checklist
```

This will:
- ✅ Verify folder structure (12 folders)
- ✅ Check MCP server installation
- ✅ Generate Claude Desktop config
- ✅ Validate quality infrastructure
- ✅ Show environment status report

**Important**: Copy/paste the MCP config from checklist output into your Claude Desktop settings.

## 3. Learn from the Example

Before building your own components, study the **example-button**:

### View the Contract
```bash
cat .system/contracts/example-button-contract.md
```

Shows you:
- How to define inputs/outputs
- CSS namespacing rules
- Test cases from contract
- Integration requirements

### Study the Implementation
```bash
ls -la .system/components/example-button/
```

Files you'll see:
- `example-button.js` - Component code (109 lines)
- `example-button.css` - Namespaced styles
- `example-button.test.js` - 13 tests from contract
- `README.md` - Workflow explanation

### Test in Sandbox
```bash
# Open in browser
open .system/sandbox/example-button-test.html
# Or use: start .system/sandbox/example-button-test.html (Windows)
```

Click buttons to see:
- Automated test suite
- All 3 visual variants
- Performance metrics
- Real-time logging

## 4. Start Your First Component

Use the **quality-first workflow**:

### Step 1: Define Contract
```bash
/define-contract my-component
```

This creates:
- `.system/contracts/my-component-contract.md` (fill this out)
- `.system/components/my-component/my-component.test.js` (test stub)

**Why contract first?** Defining interfaces before code prevents 70% of integration bugs.

### Step 2: Write Tests
Edit `.system/components/my-component/my-component.test.js`:
- Base tests on your contract
- Run: `npm test .system/components/my-component/my-component.test.js`
- Tests should fail (no implementation yet)

**Why test first?** TDD catches bugs in seconds, not hours.

### Step 3: Implement Component
Create implementation files:
- `.system/components/my-component/my-component.js`
- `.system/components/my-component/my-component.css`

Write code until all tests pass.

### Step 4: Validate
```bash
/validate-component my-component
```

This runs 4 validation levels:
1. Syntax (< 1s)
2. Unit Tests (< 10s)
3. Contract Compliance (< 1s)
4. Integration Safety (< 30s)

### Step 5: Prove in Sandbox
```bash
/prove-it-works my-component
```

Opens sandbox test environment:
- Visual verification
- Performance check
- No console errors
- Manual + automated tests

### Step 6: Mark as Proven
After sandbox testing passes:
```bash
# MCP tool marks component as proven
# Moves to .system/proven/ folder
# Ready for integration
```

## 5. Understanding the Folders

### Core Development
- **`.system/components/`** - Small, modular pieces (50-200 lines)
- **`references/`** - Complete prototypes (500-2000 lines)
- **`boilerplate/`** - Component templates

### Quality Infrastructure (in .system/)
- **`.system/contracts/`** - Interface definitions (create BEFORE coding)
- **`.system/validation/`** - Pre-flight checks
- **`.system/sandbox/`** - Isolated testing
- **`.system/proven/`** - Validated components only

### Automation
- **`scripts/`** - Build scripts and checklists
- **`.system/mcp-servers/`** - Component registry MCP server
- **`.claude/commands/`** - 47 slash commands

### Documentation
- **`docs/`** - Project knowledge base

## 6. Key Slash Commands

### Quality Workflow
- `/define-contract [name]` - Create contract before code
- `/validate-component [name]` - Run 4-level validation
- `/prove-it-works [name]` - Test in sandbox

### Integration
- `/integrate [component] [target]` - Safe component integration
- `/checklist` - Environment validation

### Development
- `/next-steps` - Session handoff generator
- `/debug-css` - Self-checking CSS debugger

### BMAD Workflows (37 commands)
See `.claude/commands/bmad/` for full SDLC workflows:
- `/prd` - Product requirements
- `/architecture` - System design
- `/dev-story` - Story development
- And 34 more...

## 7. Common Workflows

### Solo Developer (You)
```bash
# Quick iteration
/define-contract button
# Edit contract + write tests
/validate-component button --quick
# Iterate until passing
/prove-it-works button
```

### Before Integration
```bash
# Full validation
/validate-component my-component
/prove-it-works my-component
# If both pass:
/integrate my-component target.html
```

### Session Handoff
```bash
# End of session
/next-steps
# Creates handoff document
# Next session: Read and continue
```

## 9. Example: Building a Donut Chart

Full workflow example:

```bash
# 1. Contract (10 min)
/define-contract donut-chart
# Define: inputs (data array), outputs (onClick event), CSS namespace

# 2. Tests (20 min)
# Write tests in .system/components/donut-chart/donut-chart.test.js
# Test rendering, data handling, events, edge cases

# 3. Implementation (45 min)
# Create donut-chart.js and donut-chart.css
# Iteratively run tests until all pass

# 4. Validation (2 min)
/validate-component donut-chart
# ✅ Syntax, Tests, Contract, Integration all pass

# 5. Sandbox (5 min)
/prove-it-works donut-chart
# Visual check, performance test, no errors

# 6. Integration (5 min)
/integrate donut-chart dashboard.html
# MCP validates safety, creates injection markers

# Total: 87 minutes for a proven, tested, integrated component
```

## 10. Next Steps

1. **Study the example**: Open `.system/components/example-button/README.md`
2. **Run checklist**: Ensure MCP is configured
3. **Build something small**: Start with a simple button or card
4. **Follow the workflow**: Contract → Test → Code → Validate → Sandbox → Prove
5. **Read README-STRUCTURE.md**: Understand the architecture
6. **Explore BMAD commands**: 37 workflows for full SDLC

## Need Help?

- **Architecture**: Read `README-STRUCTURE.md`
- **Philosophy**: Read `README-BUILD-PLAN.md`
- **Example code**: See `.system/components/example-button/`
- **MCP setup**: Run `/checklist` for config
- **Commands**: Run `/help` or check `.claude/commands/`

## The Three Rules

1. **Contract before code** - Define interfaces first
2. **Test before implement** - TDD catches bugs early
3. **Prove before integrate** - Sandbox validation prevents conflicts

Follow these rules, and you'll build faster with fewer bugs.

---

**Remember**: You have a working example (`example-button`) that demonstrates the entire workflow. When in doubt, look at how it was done there.
