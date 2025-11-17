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
