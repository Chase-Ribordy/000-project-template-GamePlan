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
