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
