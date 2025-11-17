# References

**What goes here**: Complete prototypes built in Claude Chat (500-2000 lines).

## What Are References?

Large, self-contained features built in isolation:
- Complete UI pages
- Full feature implementations
- Working prototypes
- Proof-of-concept code

Built in **Claude Chat** (full context), then saved here for:
1. Reference during development
2. Sharding into components via `/integrate`
3. Reuse across projects

## Why Build in Claude Chat?

**Claude Chat advantages**:
- Full context window (no file limits)
- Build complete features in one go
- Iterate rapidly with visual feedback
- No component boundaries

**Then migrate to project**:
- Copy working code to `references/`
- Use `/integrate` to shard into components
- Integrate components into project structure

## Structure

```
references/
├── dashboard-prototype.html      # Complete dashboard UI
├── auth-flow-v1.html            # Full authentication flow
├── data-visualization.html      # Charts and graphs
└── README.md                    # This file
```

Typically:
- Single-file prototypes (HTML + CSS + JS in one file)
- Complete, working features
- 500-2000 lines
- Ready to run standalone

## Workflow

### 1. Build in Claude Chat

```
Prompt: "Build a complete user dashboard with:
- User profile card
- Activity feed
- Statistics widgets
- Settings panel

Make it fully functional, single HTML file."
```

Claude Chat builds it with full context.

### 2. Save to References

Copy the complete file to `references/dashboard-prototype.html`

### 3. Test Standalone

```bash
open references/dashboard-prototype.html
# Verify it works as expected
```

### 4. Integrate into Project

```bash
# Shard into components
/integrate references/dashboard-prototype.html

# This creates:
# - components/user-profile/
# - components/activity-feed/
# - components/stats-widget/
# - components/settings-panel/

# And updates main file with injection markers
```

## When to Use References

**Use references for**:
- Rapid prototyping
- Complex UIs with many pieces
- Initial proof-of-concept
- Learning new libraries/patterns

**Build as components for**:
- Small, focused features
- Iterative development
- Team collaboration
- Long-term maintenance

## Example

```html
<!-- references/login-page.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Login Page</title>
  <style>
    /* Complete styles */
  </style>
</head>
<body>
  <!-- Complete UI -->
  <script>
    // Complete logic
  </script>
</body>
</html>
```

Then:
```bash
/integrate references/login-page.html
```

Creates modular components from the prototype.

## Backup Files

When you run `/integrate`, the original is backed up:
```
references/
├── login-page.html                    # Original
└── login-page-backup-2025-01-15.html  # Auto-backup
```

So you never lose your work.

## Tips

1. **Single file prototypes** work best (HTML + CSS + JS)
2. **Make them complete** (fully functional, ready to run)
3. **Test before integrating** (verify it works standalone)
4. **Name clearly** (`feature-name-v1.html`, not `test.html`)
5. **Version if iterating** (`dashboard-v1.html`, `dashboard-v2.html`)

---

**This is where you put complete prototypes from Claude Chat.** Then shard them into components with `/integrate`.
