# Push to GitHub Command

Quick checkpoint save without full handoff documentation.

## Instructions

When this command is invoked:

### 1. Check Current State

```bash
git status
git diff --stat
```

### 2. Generate Descriptive Commit Message

Based on changes, create a meaningful commit message:

**Format**: `[type]: [brief description]`

**Types**:
- `feat` - New feature or functionality
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - CSS/styling changes
- `refactor` - Code restructuring
- `chore` - Maintenance, config changes
- `wip` - Work in progress checkpoint

**Examples**:
- `feat: add user authentication flow`
- `fix: resolve header overlap on mobile`
- `wip: skeleton build progress - stories 1-3 complete`
- `docs: update architecture with caching layer`

### 3. Commit and Push

```bash
git add -A
git commit -m "[generated message]"
git push
```

### 4. Confirm to Operator

Display:
- Files changed count
- Commit message used
- Push confirmation
- Reminder: "Use `/handoff` for full documentation at session end"

## Output

- Git commit with descriptive message
- Push to remote repository
- No `next-steps.md` creation

## Usage

```
/push-to-github
```

Best used for:
- Quick checkpoint during work
- Before risky changes
- Periodic saves during long sessions
- After completing a story or milestone

## Difference from /handoff

| Aspect | /push-to-github | /handoff |
|--------|-----------------|----------|
| Speed | Fast | Thorough |
| Documentation | None | Full next-steps.md |
| Use Case | Mid-session checkpoint | End of session |
| AI Context | Not preserved | Preserved for continuation |
