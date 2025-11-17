# /checklist - Project Setup & Validation

Validates your project environment and guides you through setup with permission-based fixes. Use this when starting work on a project (especially after copying from template).

## What This Does

**Validates & Optionally Fixes**:
- Folder structure is complete (asks permission to create missing folders)
- MCP server is installed and working (asks permission to run npm install)
- Claude Desktop MCP configuration (provides exact config to copy/paste)
- Git repository is initialized (asks permission to initialize)
- Notification system is active (guides Python setup if needed)
- Settings and permissions are correct (asks permission to create settings.local.json)
- All slash commands are loaded

**Interactive Setup**: For each issue found, asks "Would you like me to fix this?" before making changes.

## Usage

```bash
# Interactive setup & validation (recommended for first use)
/checklist

# Quick validation only (no setup prompts)
/checklist --quick
```

## Validation Workflow

### Phase 1: Folder Structure Validation

Check all required folders exist:
```bash
# Validate core structure
test -d .bmad && echo "✅ BMAD methodology" || echo "❌ Missing .bmad/"
test -d .claude && echo "✅ Claude Code config" || echo "❌ Missing .claude/"
test -d docs && echo "✅ Documentation" || echo "❌ Missing docs/"
test -d .system/mcp-servers && echo "✅ MCP servers" || echo "❌ Missing .system/mcp-servers/"
test -d .system/scripts && echo "✅ Automation scripts" || echo "❌ Missing .system/scripts/"
test -d .system/components && echo "✅ Components" || echo "❌ Missing .system/components/"
test -d references && echo "✅ References" || echo "❌ Missing references/"
test -d .system/boilerplate && echo "✅ Boilerplate" || echo "❌ Missing .system/boilerplate/"
```

**If --quick mode**: Skip to next phase

**If interactive mode and missing folders found**:
```
❌ Missing: .system/scripts/

Would you like me to create missing folders? (y/n)
```

If operator says **yes**:
```bash
# Create missing folders
mkdir -p .system/scripts
mkdir -p .system/contracts
mkdir -p .system/validation
mkdir -p .system/sandbox
mkdir -p .system/proven
mkdir -p components
mkdir -p references
mkdir -p docs
mkdir -p assets
mkdir -p tests

echo "✅ Created missing folders"
```

If operator says **no**: Continue to next phase

### Phase 2: MCP Server Validation

Check MCP server is installed and working:
```bash
# Check installation
test -d .system/mcp-servers/node_modules && echo "✅ MCP dependencies installed" || echo "❌ MCP dependencies not installed"

# Test server (quick start/stop)
cd .system/mcp-servers
timeout 2s node component-registry.js 2>&1 | grep -q "error" && echo "❌ MCP server has errors" || echo "✅ MCP server working"
cd ../..
```

**If --quick mode**: Skip to next phase

**If interactive mode and node_modules missing**:
```
❌ MCP dependencies not installed

Would you like me to run npm install in .system/mcp-servers/? (y/n)

This will install the @modelcontextprotocol/sdk package.
Time estimate: 30-60 seconds
```

If operator says **yes**:
```bash
cd .system/mcp-servers && npm install && cd ../..
echo "✅ MCP dependencies installed"
```

If operator says **no**: Skip to next phase

**IMPORTANT: Check Claude Desktop Configuration**

The MCP server must be configured in Claude Desktop to work:

```bash
# Display current project path
echo ""
echo "📍 Current project path:"
pwd

echo ""
echo "⚙️  Claude Desktop MCP Configuration Check:"
echo ""
echo "The component-registry MCP server must be configured in Claude Desktop."
echo ""
echo "Configuration file location:"
echo "  Windows: %APPDATA%\\Claude\\claude_desktop_config.json"
echo "  Mac: ~/Library/Application Support/Claude/claude_desktop_config.json"
echo ""
echo "Add this configuration (using the absolute path shown above):"
echo ""
echo '{'
echo '  "mcpServers": {'
echo '    "component-registry": {'
echo '      "command": "node",'
echo '      "args": ["'$(pwd)'/.system/mcp-servers/component-registry.js"]'
echo '    }'
echo '  }'
echo '}'
echo ""
echo "After updating config:"
echo "  1. Save the file"
echo "  2. Restart Claude Desktop"
echo "  3. Test by asking Claude Desktop: 'What MCP tools do you have?'"
echo ""
```

### Phase 3: Git Repository Check

```bash
# Check git initialized
if [ -d .git ]; then
  echo "✅ Git repository initialized"
  git status -s | wc -l | xargs echo "   Modified files:"
  git branch --show-current | xargs echo "   Current branch:"
else
  echo "❌ Git not initialized"
fi
```

**If --quick mode**: Skip to next phase

**If interactive mode and .git missing**:
```
❌ Git not initialized

Would you like me to initialize git repository? (y/n)

This will run: git init
```

If operator says **yes**:
```bash
git init
echo "✅ Git repository initialized"
echo ""
echo "You can make your first commit later with:"
echo "  git add ."
echo "  git commit -m 'Initial commit - Project template setup'"
```

If operator says **no**: Skip to next phase

### Phase 4: Configuration Validation

Check critical config files:
```bash
# Settings
test -f .claude/config/settings.json && echo "✅ Settings configured" || echo "❌ Missing settings.json"

# Check if settings.local.json exists (optional personal config)
test -f .claude/config/settings.local.json && echo "✅ Personal settings (settings.local.json)" || echo "⚠️ No personal settings (optional)"

# Check notification system
test -f .system/notifications/notify.py && python .system/notifications/notify.py && echo "✅ Notifications working" || echo "⚠️ Notification system not configured (optional)"

# Check if hooks are configured in settings.local.json
if [ -f .claude/config/settings.local.json ]; then
  if grep -q '"hooks"' .claude/config/settings.local.json; then
    echo "✅ Notification hooks configured"
  else
    echo "⚠️ Hooks section missing in settings.local.json (notifications won't trigger automatically)"
  fi
fi
```

**If --quick mode**: Skip to next phase

**If interactive mode and settings.local.json missing**:
```
⚠️ No personal settings (settings.local.json)

This file is optional but recommended for:
- Sound notifications when Claude finishes responding (Stop hook)
- Machine-specific tool permissions
- Personal environment variables

Would you like me to create settings.local.json from the example template? (y/n)
```

If operator says **yes**:
```bash
cp .claude/config/settings.local.example.json .claude/config/settings.local.json
echo "✅ Created .claude/config/settings.local.json"
echo ""
echo "The file includes:"
echo "  - Stop hook: Plays sound when Claude finishes responding"
echo "  - Permissions: Add your machine-specific tool permissions"
echo ""
echo "Next steps:"
echo "1. (Optional) Edit .claude/config/settings.local.json"
echo "2. (Optional) Update Python path if needed:"
echo "   - Windows: Change 'python' to 'C:/Python313/python.exe' if default doesn't work"
echo "   - macOS/Linux: Change 'python' to 'python3'"
echo "3. Test: You should hear a beep when Claude finishes responding"
echo ""
```

If operator says **no**: Skip to next phase

**If interactive mode and hooks missing from existing settings.local.json**:
```
⚠️ Your settings.local.json exists but is missing the hooks section

Without hooks, you won't get sound notifications when Claude finishes responding.

Would you like me to add the Stop hook to your settings.local.json? (y/n)

This will add a sound notification that plays when Claude is done and waiting for your input.
```

If operator says **yes**:
```bash
# Create backup
cp .claude/config/settings.local.json .claude/config/settings.local.json.backup

# Add hooks section using Python to properly merge JSON
python3 << 'EOF'
import json
import sys

# Read existing settings
with open('.claude/config/settings.local.json', 'r') as f:
    settings = json.load(f)

# Add hooks if not present
if 'hooks' not in settings:
    settings['hooks'] = {
        "Stop": [
            {
                "hooks": [
                    {
                        "type": "command",
                        "command": "python .system/notifications/notify.py"
                    }
                ]
            }
        ]
    }

    # Write back
    with open('.claude/config/settings.local.json', 'w') as f:
        json.dump(settings, f, indent=2)

    print("✅ Added Stop hook to settings.local.json")
    print("   You should now hear a beep when Claude finishes responding")
else:
    print("✅ Hooks already configured")
EOF
```

If operator says **no**: Skip to next phase

### Phase 5: Slash Commands Validation

List available custom commands:
```bash
echo "Custom slash commands:"
ls -1 .claude/commands/personal/ | sed 's/\.md$//' | sed 's/^/  \//'
```

### Phase 6: Read Checklist from .system/scripts/checklist.md

Load and display the pre-game ritual checklist:
```bash
cat .system/scripts/checklist.md
```

Display interactively so user can check off items.

### Phase 7: Quality Infrastructure Validation

Check quality-first architecture:
```bash
echo "Quality Infrastructure:"

# Check quality folders
test -d contracts && echo "  ✅ .system/contracts/" || echo "  ❌ Missing .system/contracts/"
test -d validation && echo "  ✅ .system/validation/" || echo "  ❌ Missing .system/validation/"
test -d sandbox && echo "  ✅ .system/sandbox/" || echo "  ❌ Missing .system/sandbox/"
test -d proven && echo "  ✅ .system/proven/" || echo "  ❌ Missing .system/proven/"

# Check validation tools
test -f .system/validation/pre-flight-check.sh && test -x .system/validation/pre-flight-check.sh && echo "  ✅ Pre-flight validator" || echo "  ⚠️ Pre-flight validator missing/not executable"

# Check contract template
test -f .system/contracts/component-contract-template.md && echo "  ✅ Contract template" || echo "  ⚠️ Contract template missing"

# Check sandbox template
test -f .system/sandbox/test-template.html && echo "  ✅ Sandbox template" || echo "  ⚠️ Sandbox template missing"
```

### Phase 8: Component Quality Check

If components exist, validate them:
```bash
if [ -d .system/components ] && [ "$(ls -A .system/components)" ]; then
  echo ""
  echo "Component Quality Check:"

  for component in .system/components/*/; do
    component_name=$(basename "$component")

    # Skip if not a directory
    [ -d "$component" ] || continue

    echo "  Checking: $component_name"

    # Check contract exists
    if [ -f ".system/contracts/$component_name-contract.md" ]; then
      echo "    ✅ Contract defined"
    else
      echo "    ⚠️ No contract (create with /define-contract)"
    fi

    # Check tests exist
    if [ -f "$component/$component_name.test.js" ]; then
      echo "    ✅ Tests exist"
    else
      echo "    ⚠️ No tests"
    fi

    # Check if validated
    if [ -f "$component/metadata.json" ]; then
      if grep -q '"validated":true' "$component/metadata.json"; then
        echo "    ✅ Validated"
      else
        echo "    ⚠️ Not validated"
      fi
    fi
  done
else
  echo "No components yet (OK for new project)"
fi
```

### Phase 9: Quality Summary Report

Create enhanced quality-focused summary:
```markdown
# Environment Quality Report

**Date**: [timestamp]
**Project**: [folder name]
**Status**: [✅ READY / ⚠️ WARNINGS / ❌ ERRORS]

## Structure ✅
- Folders: [X/12 present] (8 base + 4 quality)
- Key files: [X/Y present]

## Configuration ✅
- MCP Server: [status]
- Git: [initialized/not initialized]
- Notifications: [working/not working]

## Quality Infrastructure ✅
- .system/contracts/: [present/missing]
- .system/validation/: [present/missing]
- .system/sandbox/: [present/missing]
- .system/proven/: [present/missing]
- Validation tools: [ready/incomplete]

## Components
- Total: [X]
- With contracts: [X]
- With tests: [X]
- Validated: [X]
- Proven: [X]

## Slash Commands
- BMAD: 37 commands
- Personal: 10 commands (7 base + 3 quality)
- Total: 47 commands

## Quality Status
[✅ All quality gates in place / ⚠️ Some quality tools missing]

## Ready for Quality-First Development?
[Yes/No - with specific recommendations if No]

---

## Recommendations

**For New Projects:**
1. Define contracts before coding: /define-contract
2. Write tests first (TDD)
3. Validate progressively: /validate-component
4. Prove in sandbox: /prove-it-works

**Principle:** "Validation is cheaper than debugging"

See .system/contracts/README.md for quality-first workflow.
```

### Phase 10: Environment Summary

Create summary report:
```markdown
# Environment Validation Summary

**Date**: [timestamp]
**Project**: [folder name]
**Status**: [✅ READY / ⚠️ WARNINGS / ❌ ERRORS]

## Structure
- Folders: [X/8 present]
- Key files: [X/Y present]

## Configuration
- MCP Server: [status]
- MCP Desktop Config: [⚠️ MUST CONFIGURE - see output above]
- Git: [initialized/not initialized]
- Notifications: [working/not working]

## Slash Commands
- BMAD: 37 commands
- Personal: [X] commands
- Total: [X] commands

## Ready to Code?
[Yes/No - with specific issues if No]

---

See .system/scripts/checklist.md for pre-game ritual items.
```

## Example Output

```
🔍 Validating Project Environment...

✅ BMAD methodology
✅ Claude Code config
✅ Documentation
✅ MCP servers
✅ Automation scripts
✅ Components
✅ References
✅ Templates

✅ MCP dependencies installed
✅ MCP server working

📍 Current project path:
C:/Users/username/projects/my-project

⚙️  Claude Desktop MCP Configuration Check:

The component-registry MCP server must be configured in Claude Desktop.

Configuration file location:
  Windows: %APPDATA%\Claude\claude_desktop_config.json
  Mac: ~/Library/Application Support/Claude/claude_desktop_config.json

Add this configuration (using the absolute path shown above):

{
  "mcpServers": {
    "component-registry": {
      "command": "node",
      "args": ["C:/Users/username/projects/my-project/.system/mcp-servers/component-registry.js"]
    }
  }
}

After updating config:
  1. Save the file
  2. Restart Claude Desktop
  3. Test by asking Claude Desktop: 'What MCP tools do you have?'

✅ Git repository initialized
   Modified files: 3
   Current branch: feature/new-feature

✅ Settings configured
✅ Notifications working
✅ Build plan
✅ Structure docs

Custom slash commands:
  /checklist
  /debug-css
  /improve
  /integrate
  /integrate-mcp
  /next-steps
  /quick-fix

---

📋 Pre-Game Ritual Checklist

[Contents of .system/scripts/checklist.md displayed here]

---

✅ ENVIRONMENT READY

All systems operational. Ready to code!

Run /next-steps at end of session for handoff documentation.
```

## Validation Modes

### Full Validation (default)
Runs all checks + displays checklist

### Quick Validation
```bash
/checklist --quick
```
Only runs critical checks (structure, MCP, git)

## When to Run

- ✅ **Start of every session** - Ensure environment is ready
- ✅ **After copying template** - Verify new project setup
- ✅ **After pulling changes** - Check nothing broke
- ✅ **Before major work** - Confirm all systems operational

## Final Setup Summary

After all phases complete, show summary:

```markdown
═══════════════════════════════════════
SETUP COMPLETE ✅
═══════════════════════════════════════

What was set up automatically:
[List only items where operator said 'yes']
✅ Created missing folders
✅ Installed MCP dependencies (npm install)
✅ Initialized git repository
✅ Created settings.local.json from template

Manual steps remaining:
1. Edit .claude/config/settings.local.json (update Python path)
2. Add MCP config to Claude Desktop (see instructions above)
3. Restart Claude Desktop to load MCP server
4. (Optional) Install winotify: pip install winotify

Your environment is ready for development!

Next step: Start planning with BMAD workflows
Suggested: /brainstorm-project or /product-brief

See docs/README-OPERATOR.md for phase guide.
═══════════════════════════════════════
```

## See Also

- `.system/scripts/checklist.md` - Pre-game ritual items
- `docs/mcp-setup.md` - MCP configuration guide
- `.system/template/README-STRUCTURE.md` - Project structure explanation
- `/next-steps` - End session handoff
