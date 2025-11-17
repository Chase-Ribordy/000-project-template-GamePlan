# MCP Server Troubleshooting Guide

Comprehensive troubleshooting for Component Registry MCP Server setup and operation.

## Quick Diagnostic Checklist

Start here for the most common issues:

1. ✅ **Is the path in config absolute?** (not relative)
2. ✅ **Did you restart Claude Desktop completely?** (quit from system tray)
3. ✅ **Is Node.js installed?** Run `node --version` (should see v22.x or similar)
4. ✅ **Can the server run manually?** Test: `node component-registry.js`
5. ✅ **Are logs being created?** Check `%APPDATA%\Claude\logs\mcp*.log`

## Common Issues and Solutions

### Issue 1: Claude Desktop Not Connecting to MCP Server

**Symptoms:**
- No hammer/wrench icon in Claude Desktop
- MCP tools not available
- No log files created in Claude logs folder

**Possible Causes & Solutions:**

#### Cause A: Claude Desktop Version Doesn't Support MCP

MCP support was added in recent versions of Claude Desktop.

**Solution:**
1. Check your version: Help → About in Claude Desktop
2. Update to the latest version if needed
3. MCP requires Claude Desktop version 0.7.0 or higher

#### Cause B: Developer Mode Not Enabled

Some versions require enabling developer features.

**Solution:**
1. Open Claude Desktop
2. Go to Settings (gear icon)
3. Look for a "Developer" section
4. Enable any MCP-related settings

#### Cause C: Claude Desktop Not Fully Restarted

Simply closing the window doesn't fully quit the application.

**Solution:**
1. Find Claude Desktop in system tray (Windows) or menu bar (Mac)
2. Right-click → Quit (not just close window)
3. Wait 5-10 seconds
4. Reopen Claude Desktop from start menu/applications

#### Cause D: Permissions Issue

Windows might be blocking Node.js execution.

**Solution:**
1. Try running Claude Desktop as administrator (once to test)
2. Check Windows Defender or antivirus logs
3. Add Claude Desktop to allowed applications if needed

### Issue 2: No MCP Log Files Created

**Expected log files:**
- Windows: `C:\Users\{username}\AppData\Roaming\Claude\logs\mcp.log`
- Mac: `~/Library/Application Support/Claude/logs/mcp.log`

**What it means:** Claude Desktop hasn't tried to start the server at all.

**Solutions:**
1. Verify Claude Desktop version supports MCP
2. Check that config file is in the correct location
3. Verify config file JSON is valid (no syntax errors)
4. Check Settings → Developer → Local MCP Servers in Claude Desktop

### Issue 3: Path Not Absolute

**Error indicators:**
- Server doesn't start
- Logs show "file not found" or path errors

**Problem:** Config has relative path instead of absolute path.

**Wrong:**
```json
{
  "mcpServers": {
    "component-registry": {
      "command": "node",
      "args": ["./mcp-servers/component-registry.js"]  // ❌ Relative path
    }
  }
}
```

**Correct:**
```json
{
  "mcpServers": {
    "component-registry": {
      "command": "node",
      "args": ["C:/full/path/to/project/.system/mcp-servers/component-registry.js"]  // ✅ Absolute
    }
  }
}
```

### Issue 4: Node Modules Missing

**Symptoms:**
- Server fails to start
- Logs show "Cannot find module" errors

**Solution:**
```bash
cd .system/mcp-servers
npm install
```

**Verify dependencies are installed:**
- `@modelcontextprotocol/sdk` should be in `node_modules/`
- `package.json` should have `"type": "module"`

### Issue 5: Server Configuration Syntax Error

**Symptoms:**
- Claude Desktop doesn't load any MCP servers
- Config appears correct but nothing works

**Solution:**
1. Validate your JSON at https://jsonlint.com
2. Check for:
   - Missing commas
   - Unescaped backslashes (use `\\` or `/` in paths)
   - Trailing commas
   - Missing quotes

**Example of valid config:**
```json
{
  "mcpServers": {
    "component-registry": {
      "command": "node",
      "args": [
        "C:/Users/chase/Downloads/project-template/.system/mcp-servers/component-registry.js"
      ]
    }
  }
}
```

### Issue 6: Server Starts But Tools Not Available

**Symptoms:**
- MCP server shows as connected in Claude Desktop
- But tools don't appear when you try to use them

**Diagnostic steps:**
1. Check the server logs: `%APPDATA%\Claude\logs\mcp-server-component-registry.log`
2. Look for errors during tool listing

**Solution:**
- Server handshake might be failing
- Check that server responds to `tools/list` request
- Test server manually:
  ```bash
  cd .system/mcp-servers
  node test-server.js
  ```

### Issue 7: Wrong Working Directory

**Symptoms:**
- Server can't find component files
- File operations fail

**Solution:** Add `cwd` to config:
```json
{
  "mcpServers": {
    "component-registry": {
      "command": "node",
      "args": ["C:/path/to/component-registry.js"],
      "cwd": "C:/path/to/project"  // Add this
    }
  }
}
```

## Testing the Server

### Manual Server Test

Test if the server can start at all:

```bash
cd C:\Users\chase\Downloads\project-template\.system\mcp-servers
node component-registry.js
```

**Expected behavior:**
- No error messages
- Server waits silently (it's waiting for MCP protocol messages)
- Press Ctrl+C to stop

**If you see errors:**
- "Cannot find module" → Run `npm install`
- Syntax errors → Check your JavaScript code
- Path errors → Verify file locations

### Verify Node.js

```bash
node --version
```

**Should show:** v18.0.0 or higher (v22.x recommended)

If not installed:
- Windows: Download from https://nodejs.org
- Mac: Use `brew install node`

### Check Dependencies

```bash
cd .system/mcp-servers
npm list
```

**Should show:**
```
├── @modelcontextprotocol/sdk@0.5.0
└── (other dependencies)
```

## Viewing Logs

### Windows
```bash
# View all MCP logs
dir %APPDATA%\Claude\logs\mcp*.log

# View component-registry server log
type %APPDATA%\Claude\logs\mcp-server-component-registry.log

# Tail the log (PowerShell)
Get-Content %APPDATA%\Claude\logs\mcp-server-component-registry.log -Wait -Tail 20
```

### Mac/Linux
```bash
# View all MCP logs
ls ~/Library/Application\ Support/Claude/logs/mcp*.log

# View component-registry server log
cat ~/Library/Application\ Support/Claude/logs/mcp-server-component-registry.log

# Tail the log
tail -f ~/Library/Application\ Support/Claude/logs/mcp-server-component-registry.log
```

### What to Look For in Logs

**Good signs:**
```
Server started
Received initialize request
Tools registered: 8
```

**Bad signs:**
```
Error: Cannot find module
ENOENT: no such file or directory
Connection refused
Handshake failed
```

## Configuration File Locations

### Windows
```
C:\Users\{username}\AppData\Roaming\Claude\claude_desktop_config.json
```

Quick access:
```bash
notepad %APPDATA%\Claude\claude_desktop_config.json
```

### Mac
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

Quick access:
```bash
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

## Common Scenarios Q&A

### Q: "Can I run the server manually to test it?"

**A:** Yes, for testing only:
```bash
node component-registry.js
```

But remember: Claude Desktop must run it for actual use. Manual testing just verifies it starts without errors.

### Q: "I have multiple projects. How do I switch between them?"

**A: Option 1** - Change config and restart:
1. Edit `claude_desktop_config.json`
2. Update path to new project's server
3. Restart Claude Desktop

**A: Option 2** - Run multiple servers:
```json
{
  "mcpServers": {
    "project1-registry": {
      "command": "node",
      "args": ["C:/Projects/project1/.system/mcp-servers/component-registry.js"]
    },
    "project2-registry": {
      "command": "node",
      "args": ["C:/Projects/project2/.system/mcp-servers/component-registry.js"]
    }
  }
}
```

Both servers run simultaneously!

### Q: "Does the server work with Claude Code CLI?"

**A:** No, this MCP server is specifically for Claude Desktop. Claude Code (the CLI) doesn't currently support MCP servers in the same way.

### Q: "Do I need to keep a terminal open?"

**A:** No! Claude Desktop manages the server process entirely. No terminal needed.

### Q: "How do I know the handshake succeeded?"

**A:** Check the logs for:
```
Received initialize request
Sending initialize response
Received tools/list request
Sending 8 tools
```

Or in Claude Desktop:
- Settings → Developer → MCP Servers should show "component-registry"
- Status should be green/connected
- Tools should be listed

### Q: "What if I update the server code?"

**A:**
1. Make your changes to `component-registry.js`
2. Fully quit Claude Desktop
3. Reopen Claude Desktop
4. New version loads automatically

No need to restart anything else!

### Q: "I'm getting 'Claude Desktop must be running' - what does that mean?"

**A:** It means the MCP server ONLY works when Claude Desktop is open:
- Claude Desktop CLOSED → Server NOT running
- Claude Desktop OPEN → Server runs automatically

This is by design - Claude Desktop manages the server lifecycle.

## Advanced Diagnostics

### Enable MCP Debug Logging

**Windows:**
Set environment variable before starting Claude Desktop:
```bash
set DEBUG=mcp:*
```

**Mac:**
```bash
export DEBUG=mcp:*
```

Then start Claude Desktop from terminal to see debug output.

### Verify Config is Being Read

**Check:**
1. Open Claude Desktop
2. Settings → Developer → Local MCP Servers
3. If you see "No servers added", the config isn't being read

**Common reasons:**
- Config file in wrong location
- JSON syntax error preventing file parse
- Permissions issue reading the file

### Test with Minimal Config

Create a minimal test config to isolate issues:

```json
{
  "mcpServers": {
    "test-server": {
      "command": "node",
      "args": ["--version"]
    }
  }
}
```

This should at least show that Claude Desktop can run Node.js commands.

## Still Having Issues?

If none of the above solutions work:

1. **Collect diagnostic info:**
   - Claude Desktop version
   - Node.js version
   - Operating system
   - Full error messages from logs
   - Your config file (with paths sanitized)

2. **Check the server implementation:**
   - Verify `component-registry.js` exists
   - Check for syntax errors in the JavaScript
   - Ensure it implements MCP protocol correctly

3. **Try a fresh start:**
   - Delete `node_modules/` folder
   - Run `npm install` again
   - Test server manually
   - Update config with fresh absolute path
   - Completely restart Claude Desktop

4. **Verify environment:**
   - Node.js PATH is set correctly
   - No proxy/firewall blocking local connections
   - Sufficient disk space for logs
   - Proper file permissions

## Reference: Full Working Example

**Config file:** `C:\Users\chase\AppData\Roaming\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "component-registry": {
      "command": "node",
      "args": [
        "C:/Users/chase/Downloads/project-template/.system/mcp-servers/component-registry.js"
      ],
      "cwd": "C:/Users/chase/Downloads/project-template"
    }
  }
}
```

**Key points:**
- ✅ Absolute paths (not relative)
- ✅ Forward slashes or escaped backslashes
- ✅ Valid JSON syntax
- ✅ Correct file locations
- ✅ Working directory set

**After setup:**
1. Quit Claude Desktop completely
2. Wait 5 seconds
3. Reopen Claude Desktop
4. Check Settings → Developer → MCP Servers
5. Should see "component-registry" connected
6. Test: "List all registered components"
