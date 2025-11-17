# Claude Skills - Agent Infrastructure Automation

This folder contains **Claude skills** that automate agent-facing operations. Skills are invisible to operators and automatically triggered by agent context.

---

## What Are Skills?

Skills are **autonomous workflows** that agents execute without manual operator commands. Unlike slash commands (which operators type), skills are called automatically when agents detect the need.

---

## Available Skills

### 1. contract-creation
**Replaces:** `/define-contract`
**Triggers:** Operator requests new component
**Does:** Generates contract + test stub in `.system/`

### 2. component-validation
**Replaces:** `/validate-component`
**Triggers:** Component ready for integration
**Does:** 4-level validation (syntax, tests, contract, integration)

### 3. sandbox-testing
**Replaces:** `/prove-it-works`
**Triggers:** Component passes validation
**Does:** Creates isolated test environment, archives to `.system/proven/`

### 4. environment-check
**Replaces:** Part of `/checklist`
**Triggers:** Session start or manual `/checklist`
**Does:** Validates `.system/` infrastructure, offers fixes

### 5. mcp-setup
**Replaces:** `/integrate-mcp`
**Triggers:** First-time setup or MCP missing
**Does:** One-time MCP server configuration

---

## Skills vs. Slash Commands

| Type | Trigger | Visibility | Example |
|------|---------|------------|---------|
| **Skill** | Agent context | Invisible | `contract-creation` auto-runs when operator says "create button component" |
| **Slash Command** | Operator types | Manual | `/quick-fix` requires operator to type command |

---

## Migration from Old Commands

| Old Command | New Approach |
|-------------|--------------|
| `/define-contract` | `contract-creation` skill (auto) |
| `/validate-component` | `component-validation` skill (auto) |
| `/prove-it-works` | `sandbox-testing` skill (auto) |
| `/integrate-mcp` | `mcp-setup` skill (auto) |
| `/checklist` | Calls `environment-check` skill |

---

## How Skills Work

```
Operator: "I need a button component"

Agent (internal thinking):
1. Detects component creation request
2. Calls contract-creation skill
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
