# Terminal 3: Path Updates & Documentation

**Time estimate: 15-20 min**

---

## Overview

Update all references from `components/` → `.system/components/` across codebase and documentation.

---

## Task 1: Update MCP Server

**File:** `.system/mcp-servers/component-registry.js`

```bash
# First, read the file to see current state
cat .system/mcp-servers/component-registry.js
```

**Find and replace:**
- Find: `components/`
- Replace: `.system/components/`

**Common patterns to update:**
```javascript
// Old:
const componentsDir = path.join(__dirname, '../../components');
const componentPath = 'components/' + componentName;

// New:
const componentsDir = path.join(__dirname, '../components');
const componentPath = '.system/components/' + componentName;
```

**How to update:**
```bash
# Use sed or manual editing
# Example sed command (may need adjustment):
sed -i 's|components/|.system/components/|g' .system/mcp-servers/component-registry.js
```

---

## Task 2: Update Template Documentation

### File 1: .system/template/README-STRUCTURE.md

```bash
cat .system/template/README-STRUCTURE.md
```

**Update folder structure diagram:**
```markdown
# Old structure:
project/
├── components/

# New structure:
project/
├── .system/
│   ├── components/
```

**Find and replace:**
- All references to `components/` → `.system/components/`
- Update "Top-Level Folders" section to remove components/
- Update ".system/ Folders" section to include components/

### File 2: .system/template/README-USAGE.md

```bash
cat .system/template/README-USAGE.md
```

**Update usage instructions:**
- Any workflow mentioning `components/` → `.system/components/`
- Update component creation instructions
- Add note about agent-managed folder

### File 3: .system/template/integration-workflow.md

```bash
cat .system/template/integration-workflow.md
```

**Update integration paths:**
- Component source paths: `components/` → `.system/components/`
- Integration examples
- Workflow diagrams

### File 4: .system/template/README-QUICKSTART.md

```bash
cat .system/template/README-QUICKSTART.md
```

**Update quickstart guide:**
- Folder structure references
- Component workflow paths
- Any examples using components/

### File 5: .system/template/README-BUILD-PLAN.md

```bash
cat .system/template/README-BUILD-PLAN.md
```

**Update build references:**
- Component locations
- Build process paths
- Any component examples

### File 6: .system/template/mcp-setup.md

```bash
cat .system/template/mcp-setup.md
```

**Update MCP configuration:**
- Component registry paths
- MCP server component references
- Configuration examples

---

## Task 3: Update Sandbox Template

**File:** `.system/sandbox/test-template.html`

```bash
cat .system/sandbox/test-template.html
```

**Update component loading paths:**
```html
<!-- Old: -->
<script src="../../components/COMPONENT_NAME/COMPONENT_NAME.js"></script>
<link rel="stylesheet" href="../../components/COMPONENT_NAME/COMPONENT_NAME.css">

<!-- New: -->
<script src="../components/COMPONENT_NAME/COMPONENT_NAME.js"></script>
<link rel="stylesheet" href="../components/COMPONENT_NAME/COMPONENT_NAME.css">
```

**Note:** Paths are relative to `.system/sandbox/`, and components are now in `.system/components/`, so it's `../components/` instead of `../../components/`

---

## Task 4: Update Top-Level README.md

**File:** `README.md` (project root)

```bash
cat README.md
```

**Updates needed:**

1. **Folder Structure Section:**
```markdown
# Old:
project/
├── components/      - Built components

# New:
project/
├── .system/         - Agent infrastructure (don't touch)
# (components/ moved inside .system/)
```

2. **Add .system/ Abstraction Philosophy:**
```markdown
## .system/ Folder - Agent Infrastructure

The `.system/` folder contains agent-managed infrastructure. **Operators don't need to navigate or understand this folder.**

What's abstracted:
- Component architecture (.system/components/)
- Contract definitions (.system/contracts/)
- Quality validation (.system/validation/)
- Sandbox testing (.system/sandbox/)
- Proven components archive (.system/proven/)
- MCP server (.system/mcp-servers/)

**Operator workflow:**
1. Create prototypes in `references/` (Claude Chat)
2. Run `/integrate` to shard them
3. Agents handle validation, contracts, and proving automatically
```

3. **Update "Getting Started" Section:**
- Remove references to creating components in `components/`
- Add workflow: `references/` → `/integrate` → agents handle rest

4. **Update any component examples:**
- Change paths from `components/` → `.system/components/`

---

## Task 5: Search for Remaining References

```bash
# Search entire project for "components/" references
grep -r "components/" --include="*.md" --include="*.js" --include="*.html" --exclude-dir=node_modules --exclude-dir=.git .

# Manually review each result and update as needed
```

**Common files that might need updates:**
- Any documentation in `docs/`
- Any scripts in `.system/scripts/`
- Any validation scripts in `.system/validation/`
- Any workflow files

---

## Task 6: Update Package.json (if exists)

```bash
# Check if package.json exists at root
cat package.json
```

**Update any scripts that reference components/:**
```json
{
  "scripts": {
    "test": "jest",
    // Old: "test:components": "jest components/**/*.test.js"
    // New:
    "test:components": "jest .system/components/**/*.test.js"
  }
}
```

---

## Task 7: Update .gitignore (if needed)

```bash
cat .gitignore
```

**Check for component-specific ignores:**
```
# Old:
components/*/node_modules

# New:
.system/components/*/node_modules
```

---

## Validation Commands

```bash
# 1. Search for remaining "components/" references (should be minimal)
grep -r "components/" --include="*.md" --include="*.js" --include="*.html" --exclude-dir=node_modules --exclude-dir=.git . | grep -v ".system/components"

# Should only show:
# - References that are ALREADY .system/components/
# - Comments explaining the old structure
# - This task file itself

# 2. Verify MCP server updated
grep "components/" .system/mcp-servers/component-registry.js
# Should show .system/components/, not bare components/

# 3. Verify sandbox template updated
grep "components/" .system/sandbox/test-template.html
# Should show ../components/ (relative to .system/sandbox/)

# 4. Verify README updated
grep -A 5 "Folder Structure" README.md
# Should NOT show components/ at top level

# 5. Check template docs updated
ls .system/template/*.md | xargs grep -l "components/"
# Then manually verify each is using .system/components/
```

---

## Completion Checklist

- [ ] `.system/mcp-servers/component-registry.js` updated
- [ ] `.system/template/README-STRUCTURE.md` updated
- [ ] `.system/template/README-USAGE.md` updated
- [ ] `.system/template/integration-workflow.md` updated
- [ ] `.system/template/README-QUICKSTART.md` updated
- [ ] `.system/template/README-BUILD-PLAN.md` updated
- [ ] `.system/template/mcp-setup.md` updated
- [ ] `.system/sandbox/test-template.html` updated
- [ ] Root `README.md` updated with abstraction philosophy
- [ ] `package.json` scripts updated (if applicable)
- [ ] `.gitignore` updated (if applicable)
- [ ] Full project search shows no incorrect component paths
- [ ] All documentation reflects new .system/components/ location

---

## Troubleshooting

### If grep finds too many results:
Focus on updating:
1. MCP server (critical)
2. Sandbox template (critical)
3. Documentation (important)
4. Build scripts (if they exist)

### Path confusion:
- **From root:** `.system/components/`
- **From .system/:** `components/`
- **From .system/sandbox/:** `../components/`
- **From .system/mcp-servers/:** `../components/`

---

**Report back when complete!**
