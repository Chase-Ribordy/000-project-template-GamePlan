# Terminal 2: Folder Reorganization

**Time estimate: 10-15 min**

---

## Task 1: DELETE Confusing Documentation

**FIRST PRIORITY - Remove confusion from knowledge base**

```bash
rm .system/template/COMPONENTS_USAGE_ANALYSIS.md
```

**Why:** This file caused confusion about components/ folder placement and pollutes the knowledge base with outdated guidance.

---

## Task 2: Move components/ to .system/

```bash
# Move entire components folder into .system/
mv components .system/components
```

**Result:**
- `components/` no longer exists at top level
- `.system/components/` now contains all component files

---

## Task 3: Create .system/components/README.md

```bash
cat > .system/components/README.md << 'EOF'
# Components - Agent-Managed Workspace

**Operator:** You don't need to edit files here directly!

This folder is **agent-managed infrastructure**. Components are created, validated, and proven by automated skills.

---

## Operator Workflow

Instead of working in this folder, operators work with:

1. **Create prototypes in `references/`:**
   - Build complete features in Claude Chat
   - Save HTML to `references/dashboard.html`

2. **Run `/integrate` command:**
   - Agent shards prototype into components
   - Auto-creates contracts in `.system/contracts/`
   - Auto-validates each component
   - Auto-proves each component in sandbox
   - Components land here in `.system/components/`

3. **Review results:**
   - Agent reports validation status
   - Operator reviews sandbox tests
   - Agent moves proven components to `.system/proven/`

---

## What's In This Folder

```
.system/components/
├── [component-name]/
│   ├── [component-name].js        - Implementation
│   ├── [component-name].css       - Styles
│   ├── [component-name].test.js   - Tests
│   └── validation-report.md       - Quality report
```

---

## Component Lifecycle

```
Operator creates in references/
         ↓
    /integrate shards
         ↓
   .system/components/  ← YOU ARE HERE
         ↓
   Skills validate (auto)
         ↓
   Skills prove (auto)
         ↓
   .system/proven/  (production-ready archive)
```

---

## Agent Skills That Manage This Folder

1. **contract_creation** - Creates contract before component
2. **component_validation** - 4-level quality checks
3. **sandbox_testing** - Proves component works in isolation
4. **/integrate command** - Shards prototypes into components here

---

## Why Agent-Managed?

**Philosophy:** Abstract complexity from operator

- **Operator focuses on:** Creative work (prototyping in Claude Chat)
- **Agent handles:** Infrastructure (contracts, validation, proving)
- **Result:** Simpler workflow, less cognitive load

---

## If You Need to Debug a Component

Use operator-facing commands:
- `/quick-fix` - Rapid bug fixes
- `/debug-css` - CSS debugging
- `/improve` - Problem solving

These commands work with components without you needing to navigate .system/

---

## Proven Components

Once validated and proven, components move to:
- `.system/proven/[component]/` (read-only archive)

Production code references proven components, not this folder.

---

**Remember:** This folder is infrastructure. Focus on `references/` and let agents handle the rest!
EOF
```

---

## Task 4: Update AGENT-INFRASTRUCTURE.md

```bash
# First, check if it exists
ls AGENT-INFRASTRUCTURE.md

# If it exists, read it to preserve important content
cat AGENT-INFRASTRUCTURE.md
```

**Then update with abstraction note:**

Add this section at the TOP of `AGENT-INFRASTRUCTURE.md`:

```markdown
# .system/ - Agent Infrastructure (Operator: Ignore This Folder!)

**For Operators:** You don't need to understand or navigate this folder!

The `.system/` folder contains **agent-managed infrastructure** that handles quality workflows, validation, and component architecture behind the scenes.

## Operator Simplicity

Instead of managing `.system/` directly:

1. **Create prototypes** in `references/` (Claude Chat)
2. **Run `/integrate`** to shard them
3. **Let agents handle** the rest (contracts, validation, proving)

## When to Look in .system/

**Almost never!** But if you must:

- **Debugging MCP server:** `.system/mcp-servers/`
- **Checking contracts:** `.system/contracts/` (reference only)
- **Viewing proven components:** `.system/proven/` (read-only)

## Agent-Facing Folders

[Rest of existing content...]
```

---

## Task 5: Verify Folder Structure

```bash
# Check complete .system/ structure
tree .system/ -L 2

# Expected output:
# .system/
# ├── components/           [MOVED FROM TOP-LEVEL]
# ├── contracts/
# ├── proven/
# ├── sandbox/
# ├── validation/
# ├── mcp-servers/
# ├── notifications/
# ├── scripts/
# ├── template/
# ├── build-intelligence/
# └── README.md
```

---

## Task 6: Verify Top-Level Structure

```bash
# Check top-level folders
ls -la

# Should show:
# .bmad/
# .claude/
# .system/
# assets/
# docs/
# references/
# tests/
# README.md
#
# Should NOT show:
# components/ (moved to .system/)
```

---

## Validation Commands

```bash
# Verify COMPONENTS_USAGE_ANALYSIS.md deleted
ls .system/template/COMPONENTS_USAGE_ANALYSIS.md
# Should show: No such file or directory

# Verify components/ moved to .system/
ls -la .system/components/
# Should show component files

# Verify components/ NOT at top level
ls -la components/
# Should show: No such file or directory

# Verify .system/components/README.md created
cat .system/components/README.md
# Should show content

# Verify AGENT-INFRASTRUCTURE.md updated
head -20 AGENT-INFRASTRUCTURE.md
# Should show "Operator: Ignore This Folder!" section
```

---

## Completion Checklist

- [ ] `.system/template/COMPONENTS_USAGE_ANALYSIS.md` **DELETED**
- [ ] `components/` moved to `.system/components/`
- [ ] `.system/components/README.md` created
- [ ] `AGENT-INFRASTRUCTURE.md` updated with abstraction note
- [ ] Folder structure verified (components/ NOT at top-level)
- [ ] `.system/` structure verified (components/ INSIDE .system/)

---

## Troubleshooting

### If components/ move fails:
```bash
# Check if components/ exists at top level
ls -la components/

# If it doesn't exist, check if already in .system/
ls -la .system/components/
```

### If README already exists:
- Read existing content first
- Prepend new section to top
- Don't overwrite important content

---

**Report back when complete!**
