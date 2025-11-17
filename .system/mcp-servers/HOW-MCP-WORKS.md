# How MCP Servers Work - Complete Explanation

## The Basics

### What is an MCP Server?

An MCP (Model Context Protocol) server is a **background process** that provides tools/capabilities to AI applications like Claude Desktop.

Think of it like this:
- **Claude Desktop** = The AI chat interface you use
- **MCP Server** = A helper program that gives Claude extra abilities
- **Your component-registry.js** = The specific helper that manages components

## How It Actually Works

### 1. **Startup Process**

```
You open Claude Desktop
         ↓
Claude Desktop reads: C:\Users\chase\AppData\Roaming\Claude\claude_desktop_config.json
         ↓
Finds: "component-registry" server configuration
         ↓
Automatically runs: node component-registry.js
         ↓
Server starts and waits for commands
         ↓
Handshake happens (initialize, list tools)
         ↓
Ready! Server is now running in background
```

### 2. **During Your Chat Session**

```
You type in Claude Desktop: "List all components"
         ↓
Claude (the AI) decides: "I should use the list_components tool"
         ↓
Claude Desktop sends message to your MCP server
         ↓
Your component-registry.js executes: listComponents()
         ↓
Returns result back to Claude Desktop
         ↓
Claude formats the response and shows you
```

### 3. **Shutdown**

```
You close Claude Desktop
         ↓
Claude Desktop stops all MCP servers
         ↓
Your component-registry.js process ends
```

## Important Rules

### ❌ DO NOT run the server manually

```bash
# DON'T DO THIS:
node component-registry.js
```

**Why?** Because:
- The server is designed to be started BY Claude Desktop
- It uses stdio (standard input/output) to communicate
- Running it manually just makes it wait for input forever
- Claude Desktop manages starting/stopping it automatically

### ✅ Claude Desktop Must Be Running

**YES - Claude Desktop MUST be open and running for the MCP server to work**

Here's why:
1. **Claude Desktop starts the server** - It's not running on its own
2. **Claude Desktop manages communication** - It sends requests to the server
3. **Claude Desktop stops the server** - When you close the app, the server stops too

### The Server Lifecycle

```
Claude Desktop CLOSED → MCP Server NOT RUNNING
Claude Desktop OPENS  → MCP Server STARTS
Claude Desktop RUNNING → MCP Server RUNNING
Claude Desktop CLOSES  → MCP Server STOPS
```

## Configuration Per Project

### Important: ONE Config File for ALL Projects

The config file is in your **Claude Desktop settings**, not in your project folder:

**Location:** `C:\Users\chase\AppData\Roaming\Claude\claude_desktop_config.json`

### Current Setup (Single Project)

```json
{
  "mcpServers": {
    "component-registry": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": [
        "C:\\Users\\chase\\Downloads\\project-template\\.system\\mcp-servers\\component-registry.js"
      ]
    }
  }
}
```

This means:
- ✅ Works when you're in `project-template` folder
- ✅ Works from ANY folder (server runs independently)
- ❌ But only manages components in `C:\Users\chase\Downloads\project-template\.system\components`

### Multiple Projects Setup

If you want different MCP servers for different projects:

```json
{
  "mcpServers": {
    "component-registry-project1": {
      "command": "node",
      "args": [
        "C:\\Projects\\project1\\.system\\mcp-servers\\component-registry.js"
      ]
    },
    "component-registry-project2": {
      "command": "node",
      "args": [
        "C:\\Projects\\project2\\.system\\mcp-servers\\component-registry.js"
      ]
    }
  }
}
```

**Result:** Both servers run simultaneously when Claude Desktop opens!

## Typical Workflow

### Daily Use:

1. **Morning:**
   ```
   Open Claude Desktop → Servers auto-start → Handshake happens
   ```

2. **Working:**
   ```
   Chat with Claude → It uses your MCP tools as needed
   ```

3. **Evening:**
   ```
   Close Claude Desktop → Servers auto-stop
   ```

### When Making Server Changes:

1. **Edit** your `component-registry.js` file
2. **Completely quit** Claude Desktop (not just close window)
3. **Reopen** Claude Desktop
4. **New version** of server loads automatically

## What You DON'T Need to Do

❌ Manually start the server
❌ Run node commands
❌ Restart the server during use
❌ Keep a terminal open
❌ Manage the process yourself

## What You DO Need to Do

✅ Keep Claude Desktop open while working
✅ Make sure config file points to correct server location
✅ Fully restart Claude Desktop after changing server code
✅ Check logs if something goes wrong

## How to Tell It's Working

### In Claude Desktop:

1. **Settings → Developer → Local MCP Servers**
   - Should show: "component-registry"
   - Status should be green/active

2. **In a chat, the tools icon** (hammer/wrench)
   - Click it to see available tools
   - Should list all 8 component tools

3. **Try using it:**
   ```
   You: "List all registered components"
   Claude: [uses the MCP tool and shows results]
   ```

### In the Logs:

```bash
# Check if server is running
ls C:\Users\chase\AppData\Roaming\Claude\logs\

# Should see:
mcp.log                              ← Connection logs
mcp-server-component-registry.log    ← Your server's logs
```

## The "Handshake" Explained

The handshake is automatic and happens every time:

```
1. Claude Desktop starts your server
2. Sends "initialize" message
3. Your server responds with capabilities
4. Claude sends "list tools" request
5. Your server responds with all 8 tools
6. Done! Ready to use
```

This happens in **milliseconds** - you won't even notice it.

## Common Scenarios

### Scenario 1: "I want to use the MCP tools"
**Answer:** Just open Claude Desktop and start chatting. The tools are available automatically.

### Scenario 2: "I updated my server code"
**Answer:** Quit and reopen Claude Desktop to load the new version.

### Scenario 3: "Can I use this from the command line?"
**Answer:** Not directly. The server is designed for Claude Desktop. But you could build a different client using the MCP SDK.

### Scenario 4: "Does the server work with Claude Code (CLI)?"
**Answer:** No, this is specifically for Claude Desktop. Claude Code is different and doesn't currently support MCP servers the same way.

### Scenario 5: "I have multiple projects"
**Answer:**
- **Option A:** Change the config to point to different projects as needed
- **Option B:** Run multiple servers simultaneously (one per project)
- **Option C:** Make your server smart enough to detect which project you're in

## Summary

**Think of it like this:**

Your MCP server is like a **plugin** for Claude Desktop:
- Claude Desktop = The app (like VS Code)
- MCP Server = The plugin (like an extension)
- Config file = The settings that tell Claude which plugins to load

**Key Takeaway:**
- Claude Desktop MUST be running
- Server starts/stops automatically with Claude Desktop
- You just chat normally - Claude uses the tools when appropriate
- No manual intervention needed once configured

## Next Steps

Now that it's working:

1. **Start chatting** - Ask Claude to use your component tools
2. **Test it out** - Try registering a component, listing components, etc.
3. **Build more tools** - Add new functionality to your server
4. **Create more servers** - Build servers for other workflows

The magic is that Claude (the AI) decides WHEN to use your tools based on what you ask!
