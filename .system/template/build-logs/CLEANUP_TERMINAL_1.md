# TERMINAL 1: Fix .claude/config Settings & Move notify.py

## Task Summary
Fix broken settings.local.json and move notify.py to .system/notifications/

## Background
- `settings.local.json` has hardcoded paths to wrong project
- notify.py is at root level but should be in .system/
- Need to create example file for users to customize

## Commands

```bash
# 1. Create notifications directory
mkdir -p .system/notifications

# 2. Move notify.py
mv notify.py .system/notifications/notify.py

# 3. Create README for notifications
cat > .system/notifications/README.md << 'EOF'
# Notification System

**Purpose**: Desktop notifications for Claude Code events (agent infrastructure).

## What's Here

### `notify.py`
Python script that shows desktop notifications on Windows when:
- Claude Code completes a response (`Stop` event)
- Claude Code needs permission (`permission_prompt` event)

**Used by**: `.claude/config/settings.local.json` hooks (user-specific configuration)

## Setup (Optional)

Notifications are **optional** and require user-specific setup.

### Step 1: Create settings.local.json

Copy the example:
```bash
cp .claude/config/settings.local.example.json .claude/config/settings.local.json
```

### Step 2: Edit Your Path

Edit `.claude/config/settings.local.json` and update the Python path:
```json
{
  "hooks": {
    "Stop": "python .system/notifications/notify.py 'Response Complete' 'Claude has finished' --zero-lag",
    "permission_prompt": "python .system/notifications/notify.py 'Permission Needed' 'Claude Code needs approval'"
  }
}
```

Adjust `python` to your Python executable:
- Windows: `C:/Python313/python.exe` or `python`
- macOS/Linux: `python3`

### Step 3: Test

```bash
python .system/notifications/notify.py "Test" "Notification working"
```

You should see a desktop notification.

## How It Works

**Event-based notifications** (not polling):
- Claude Code fires events (`Stop`, `permission_prompt`)
- Hooks in `settings.local.json` trigger `notify.py`
- Python script shows Windows toast notification
- Zero lag (<100ms)

## Requirements

- **Windows 10/11**: Uses `winotify` library
- **Python 3.9+**: With `winotify` installed

Install dependencies:
```bash
pip install winotify
```

## Why in .system/?

This is agent infrastructure that operators can optionally configure but don't interact with directly. The hooks run automatically based on events.

**Operators never run notify.py manually** - it's triggered by Claude Code events.

## Troubleshooting

**Notifications not showing?**
1. Check Python path in settings.local.json
2. Verify winotify installed: `pip list | grep winotify`
3. Test manually: `python .system/notifications/notify.py "Test" "Message"`
4. Check Windows notification settings (notifications enabled)

**Want to disable?**
- Delete `.claude/config/settings.local.json`
- Or remove the `hooks` section

---

**TL;DR**: Optional desktop notifications. Set up once in settings.local.json, forget about it.
EOF

# 4. Delete broken settings.local.json
rm .claude/config/settings.local.json

# 5. Create example settings file
cat > .claude/config/settings.local.example.json << 'EOF'
{
  "comment": "Copy this file to settings.local.json and customize for your machine",
  "comment2": "settings.local.json is gitignored - it's your personal config",

  "hooks": {
    "Stop": "python .system/notifications/notify.py 'Response Complete' 'Claude has finished' --zero-lag",
    "permission_prompt": "python .system/notifications/notify.py 'Permission Needed' 'Claude Code needs approval'"
  },

  "comment3": "Adjust 'python' to your Python executable path:",
  "comment4": "Windows: 'C:/Python313/python.exe' or 'python'",
  "comment5": "macOS/Linux: 'python3'",

  "permissions": {
    "comment": "Add machine-specific tool permissions here if needed",
    "allow": []
  }
}
EOF

# 6. Add to .gitignore
echo "" >> .gitignore
echo "# User-specific settings (machine-specific configuration)" >> .gitignore
echo ".claude/config/settings.local.json" >> .gitignore

# 7. Create .claude/config README
cat > .claude/config/README.md << 'EOF'
# Claude Code Configuration

Configuration files for Claude Code behavior, permissions, and hooks.

## Files

### `settings.json` (Committed)
**Purpose**: Project-wide settings shared across all users.

**Contents**:
- Tool permissions (`allow`, `ask`, `deny`)
- Environment variables (`PYTHONPATH`)
- Sandbox configuration
- SlashCommand permissions

**Who edits**: Project maintainers
**Version controlled**: Yes (committed to git)

### `settings.local.json` (User-Specific)
**Purpose**: Machine-specific overrides and personal customization.

**Contents**:
- Notification hooks (desktop alerts)
- Machine-specific paths
- Personal tool permissions
- Local environment overrides

**Who edits**: Individual users
**Version controlled**: No (gitignored)

**Setup**:
```bash
# Copy the example
cp settings.local.example.json settings.local.json

# Edit for your machine
# Adjust Python path, add hooks, customize permissions
```

### `settings.local.example.json` (Template)
**Purpose**: Example template showing how to set up settings.local.json.

**Who edits**: Project maintainers (when adding new features)
**Version controlled**: Yes (committed as template)

## Two-File Pattern

This follows the standard config pattern:

| File | Purpose | Committed | Who Edits |
|------|---------|-----------|-----------|
| `settings.json` | Shared defaults | Yes | Maintainers |
| `settings.local.example.json` | Template | Yes | Maintainers |
| `settings.local.json` | Personal config | No (gitignored) | Individual users |

**Benefits**:
- Shared settings work for everyone
- Users customize without conflicts
- Example file documents available options
- No accidental commits of personal paths

## Typical Workflow

### For Template Users
1. Copy template to new project
2. Run: `cp .claude/config/settings.local.example.json .claude/config/settings.local.json`
3. Edit `settings.local.json` with your paths (Python, etc.)
4. Git will ignore your personal settings

### For Template Maintainers
1. Edit `settings.json` for project-wide changes
2. Edit `settings.local.example.json` to show new features
3. Commit both
4. Don't commit `settings.local.json` (it's gitignored)

## Common Settings

### Notification Hooks (settings.local.json)
```json
{
  "hooks": {
    "Stop": "python .system/notifications/notify.py 'Done' 'Response complete'",
    "permission_prompt": "python .system/notifications/notify.py 'Permission' 'Approval needed'"
  }
}
```

See `.system/notifications/README.md` for setup.

### Tool Permissions (settings.json)
```json
{
  "permissions": {
    "allow": ["Read", "Grep", "Edit", "Write", "Bash(git:*)"],
    "ask": ["Bash(rm:*)", "Bash(curl:*)"],
    "deny": ["Bash(sudo:*)"]
  }
}
```

### Environment Variables (settings.json)
```json
{
  "env": {
    "PYTHONPATH": "${workspaceFolder}/lib"
  }
}
```

## Troubleshooting

**Hooks not firing?**
- Check `settings.local.json` exists (copy from example)
- Verify Python path is correct
- Test manually: `python .system/notifications/notify.py "Test" "Message"`

**Permission errors?**
- Check `settings.json` `permissions.allow` array
- Tools not in `allow` will require manual approval

**Settings not taking effect?**
- Restart Claude Code
- Check for JSON syntax errors
- Verify file is in `.claude/config/`

---

**Quick Start**: Copy `settings.local.example.json` → `settings.local.json`, edit paths, done.
EOF

echo "✅ Terminal 1 Complete!"
echo ""
echo "Summary:"
echo "- notify.py moved to .system/notifications/"
echo "- Broken settings.local.json deleted"
echo "- Created settings.local.example.json template"
echo "- Added .gitignore entry for settings.local.json"
echo "- Created .claude/config/README.md"
```

## Success Criteria
- [ ] .system/notifications/ folder created
- [ ] notify.py moved to .system/notifications/
- [ ] .system/notifications/README.md created
- [ ] settings.local.json deleted
- [ ] settings.local.example.json created
- [ ] .gitignore updated
- [ ] .claude/config/README.md created

## Verification
```bash
# Should see these files
ls -la .system/notifications/notify.py
ls -la .claude/config/settings.local.example.json
ls -la .claude/config/README.md

# Should NOT exist (deleted)
ls .claude/config/settings.local.json  # Should error

# Check gitignore
grep "settings.local.json" .gitignore
```
