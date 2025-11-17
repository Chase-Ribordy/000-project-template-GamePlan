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

1. **contract-creation** - Creates contract before component
2. **component-validation** - 4-level quality checks
3. **sandbox-testing** - Proves component works in isolation
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
