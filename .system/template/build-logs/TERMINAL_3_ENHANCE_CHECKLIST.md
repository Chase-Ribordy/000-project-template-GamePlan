# TERMINAL 3: Enhance /checklist to Guide Setup

## Objective
Transform `/checklist` from validator-only to interactive setup guide that asks for permission to fix issues and helps operators through initial setup.

## Background
Current `/checklist` only validates and reports issues. Operators want guided setup where checklist asks "Should I fix this?" and performs setup steps with permission. This makes Phase 0 truly one-command setup.

## Scope
- Enhance `.claude/commands/personal/phase-0-setup/checklist.md`
- Add permission-based auto-fix for common issues
- Keep validation logic, add setup actions
- Maintain --quick mode for fast checks

## Tasks

### 1. Read Current Checklist

First, read the current checklist to understand validation logic:

```bash
Read .claude/commands/personal/phase-0-setup/checklist.md
```

(Note: After Terminal 1 completes, it will be at `phase-0-setup/checklist.md`)

### 2. Enhance Checklist with Guided Setup

Modify `.claude/commands/personal/phase-0-setup/checklist.md` to add interactive setup after each validation phase.

**Enhanced Structure**:

```markdown
# Checklist Command (Enhanced)

Validate project environment and guide through setup with permission-based fixes.

## Usage
- `/checklist` - Full validation + guided setup
- `/checklist --quick` - Fast validation only (no setup)
- `/checklist --auto` - Auto-fix without asking (use with caution)

## Phase 1: Folder Structure Validation

[Keep existing validation checks]

**Auto-Fix**: If folders missing, ask permission:
```
❌ Missing: .system/mcp-servers/
Would you like me to create missing folders? (y/n)
```

If yes: Create missing folders with proper structure

## Phase 2: MCP Server Validation

[Keep existing validation checks]

**Auto-Fix**: If node_modules missing, ask permission:
```
❌ MCP dependencies not installed
Would you like me to run npm install in .system/mcp-servers/? (y/n)
```

If yes:
```bash
cd .system/mcp-servers && npm install
```

**Auto-Fix**: If Claude Desktop config missing, guide setup:
```
⚠️ MCP not configured in Claude Desktop
I can create the configuration for you. This will:
1. Find your Claude Desktop config location
2. Add component-registry MCP server
3. Show you where to paste the config

Proceed? (y/n)
```

If yes: Generate config, show copy-paste instructions

## Phase 3: Git Repository Check

[Keep existing validation checks]

**Auto-Fix**: If .git/ missing, ask permission:
```
❌ Git not initialized
Would you like me to initialize git repository? (y/n)
```

If yes:
```bash
git init
git add .
git commit -m "Initial commit - Project template setup"
```

## Phase 4: Configuration Validation

[Keep existing validation checks]

**Auto-Fix**: If settings.local.json missing, ask permission:
```
❌ .claude/config/settings.local.json not found
Would you like me to create it from the example template? (y/n)
```

If yes:
```bash
cp .claude/config/settings.local.example.json .claude/config/settings.local.json
```

Then guide Python path editing:
```
✓ Created .claude/config/settings.local.json

Next step: Edit the Python path for your system
Current: "python"
Windows example: "C:/Python313/python.exe"
macOS/Linux example: "python3"

Open .claude/config/settings.local.json now? (y/n)
```

**Auto-Fix**: If notify.py test fails, guide setup:
```
❌ Notification system not working
This is optional. Would you like help setting it up? (y/n)
```

If yes: Show winotify installation instructions

## [Keep remaining validation phases]

## Final Report Enhancement

Add setup summary:
```
═══════════════════════════════════════
ENVIRONMENT SETUP COMPLETE ✅
═══════════════════════════════════════

What was set up:
✅ Created missing folders
✅ Installed MCP dependencies (npm install)
✅ Initialized git repository
✅ Created settings.local.json from template
✅ MCP server configured for Claude Desktop

What you need to do manually:
1. Edit .claude/config/settings.local.json (update Python path)
2. Restart Claude Desktop to load MCP server
3. (Optional) Install winotify for notifications: pip install winotify

Your environment is ready for development!

Next step: Run a BMAD planning workflow
Suggested: /brainstorm-project or /product-brief
```

## Permission System

Add permission helper function:
```javascript
function askPermission(message) {
  // In Claude Code, this uses AskUserQuestion tool
  // Returns: true (yes), false (no)
}
```

Each auto-fix should:
1. Detect issue
2. Ask permission with clear explanation
3. If granted: Perform fix and report result
4. If denied: Skip and continue to next check
5. Track what was fixed for final summary
```

### 3. Implementation Notes

**Key Changes**:
- After each validation phase, check for fixable issues
- Use AskUserQuestion tool for permissions
- Perform fixes with clear progress reporting
- Track all fixes for final summary
- Maintain --quick mode (skip all setup, validation only)
- Add --auto mode (auto-fix without asking, for CI/CD)

**Philosophy**:
- Never force fixes (always ask permission)
- Explain what each fix does before doing it
- Show clear success/failure for each fix
- Summarize all changes at end

### 4. Test Enhanced Checklist

After implementation, test three modes:

**Interactive Mode**:
```bash
/checklist
# Should ask permissions for each fix
```

**Quick Mode**:
```bash
/checklist --quick
# Should skip all setup, just validate
```

**Auto Mode** (future):
```bash
/checklist --auto
# Should auto-fix everything without asking
```

## Success Criteria
- [ ] Checklist enhanced with permission-based fixes
- [ ] All validation phases kept intact
- [ ] Auto-fix added for: folders, npm install, git init, settings.local.json
- [ ] Permission system implemented (asks before each fix)
- [ ] Final summary shows what was set up
- [ ] --quick mode still works (validation only)
- [ ] Clear instructions for manual steps (Python path, restart Claude Desktop)

## Example Enhanced Flow

```
Operator: /checklist

═══════════════════════════════════════
PHASE 1: FOLDER STRUCTURE VALIDATION
═══════════════════════════════════════

✅ .bmad/
✅ .claude/
✅ docs/
❌ .system/scripts/ not found

Would you like me to create .system/scripts/? (y/n)
Operator: y

✅ Created .system/scripts/

═══════════════════════════════════════
PHASE 2: MCP SERVER VALIDATION
═══════════════════════════════════════

✅ .system/mcp-servers/ exists
❌ node_modules/ not found

Would you like me to run npm install in .system/mcp-servers/? (y/n)
Operator: y

Running: cd .system/mcp-servers && npm install
...
✅ MCP dependencies installed

[continues through all phases]

═══════════════════════════════════════
ENVIRONMENT SETUP COMPLETE ✅
═══════════════════════════════════════

What was set up:
✅ Created .system/scripts/
✅ Installed MCP dependencies
✅ Initialized git repository
✅ Created settings.local.json

Manual steps remaining:
1. Edit .claude/config/settings.local.json (update Python path)
2. Restart Claude Desktop to load MCP server

Your environment is ready! Next: /brainstorm-project
```

## Notes
- Keep existing validation logic intact
- Add setup actions as opt-in (permission-based)
- Maintain backward compatibility (--quick mode)
- Guide operators through complex steps (MCP config, Python paths)
- Final summary should be encouraging and clear about next steps
