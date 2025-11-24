# Resume Command

Pick up where you left off - works from any device.

## Instructions

When this command is invoked:

### 1. Read Current State

Load these files in order:
```
1. next-steps.md                           # Primary context
2. .system/execution-status.yaml           # Phase tracking
3. docs/sprint-artifacts/sprint-status.yaml # Story progress (if exists)
```

### 2. Determine Phase

Check the "For AI Continuation" section of next-steps.md for:
- Current phase (Planning / Sprint Setup / 1st Pass / 2nd Pass / 3rd Pass)
- Immediate next actions
- Known issues

### 3. Display Status to Operator

Show a clear, mobile-friendly status:

```
═══════════════════════════════════════════
RESUME - Project Status
═══════════════════════════════════════════

PHASE: [Current phase from next-steps.md]
STATUS: [Brief status]

LAST SESSION:
• [Key items from "What Changed This Session"]

NEXT ACTIONS:
1. [First immediate action]
2. [Second immediate action]

KNOWN ISSUES:
• [Any blockers or issues]

───────────────────────────────────────────
SUGGESTED COMMAND: [/orc-exe or specific action]
───────────────────────────────────────────
Continue? (Y to proceed, or type different command)
```

### 4. Offer Next Action

Based on phase, suggest:

| Phase | Suggested Action |
|-------|-----------------|
| Planning incomplete | `/refine` |
| PRD + Architecture exist, no stories | `/orc-exe` (will trigger SM) |
| Stories exist, execution in progress | `/orc-exe` then `*start` |
| Session complete | Display summary only |

### 5. If Operator Confirms

- Execute the suggested command OR
- Wait for operator's chosen command

## Mobile-Optimized Design

This command is designed for Claude Code on web (phone):
- Single command entry point
- Clear, scannable output
- Minimal scrolling needed
- Suggests exact next step
- No complex navigation

## Output

Displays:
- Current project phase
- What was done last session
- What needs to be done next
- Suggested command to continue

## Usage

```
/resume
```

Best used when:
- Starting a new session
- Switching devices (desktop → phone)
- Returning after a break
- Picking up someone else's work
