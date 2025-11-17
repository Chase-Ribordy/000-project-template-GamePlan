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
