# Parallel Execution Guide - 4 Terminal Reorganization

**Total estimated time: 20 minutes (all parallel)**

---

## Overview

This reorganization splits work across 4 terminals to execute in parallel with **zero dependencies** between them.

---

## Terminal Assignment

### Terminal 1: Skills Creation & Command Cleanup
**Lead:** Skills system architect
**Time:** 15-20 min
**File:** `TERMINAL_1_TASKS.md`
**Focus:** Create Claude skills, delete obsolete commands

### Terminal 2: Folder Reorganization
**Lead:** Structure architect
**Time:** 10-15 min
**File:** `TERMINAL_2_TASKS.md`
**Focus:** Move components/ to .system/, delete confusing docs

### Terminal 3: Path Updates & Documentation
**Lead:** Documentation maintainer
**Time:** 15-20 min
**File:** `TERMINAL_3_TASKS.md`
**Focus:** Update all component paths across codebase

### Terminal 4: Operator Workflow Guide
**Lead:** Operator experience designer
**Time:** 10-15 min
**File:** `TERMINAL_4_TASKS.md`
**Focus:** Create operator documentation for simplified workflow

---

## No Conflicts Guarantee

Each terminal works on **completely isolated file sets**:

| Terminal | Folders Touched | Files Created | Files Modified | Files Deleted |
|----------|----------------|---------------|----------------|---------------|
| **T1** | `.claude/skills/`, `.claude/commands/personal/` | 6 skill files | `integrate.md` | 4 command files |
| **T2** | `.system/components/`, `.system/`, `components/` | `components/README.md`, updates to `system/README.md` | `AGENT-INFRASTRUCTURE.md` | `COMPONENTS_USAGE_ANALYSIS.md` |
| **T3** | `.system/mcp-servers/`, `.system/template/`, `.system/sandbox/`, root | None | 10+ doc/config files | None |
| **T4** | `docs/`, `.claude/commands/personal/`, `.claude/skills/` | `README-OPERATOR.md`, 2 READMEs | None | None |

### Potential Minor Overlap:
- **T1 & T4** both create READMEs in different folders (no conflict)
- **T2 & T3** both update different files (no conflict)

---

## Quick Start

### For Each Terminal Lead:

1. **Open your task file:**
   ```bash
   # Terminal 1
   cat TERMINAL_1_TASKS.md

   # Terminal 2
   cat TERMINAL_2_TASKS.md

   # Terminal 3
   cat TERMINAL_3_TASKS.md

   # Terminal 4
   cat TERMINAL_4_TASKS.md
   ```

2. **Execute tasks sequentially within your terminal**
   - Each task file has numbered tasks
   - Complete in order within that terminal
   - Terminals can run in any order relative to each other

3. **Report completion:**
   - Check completion checklist at end of your task file
   - Report which terminal finished
   - Share any issues encountered

---

## Execution Strategy

### Option A: Simultaneous Start (Recommended)
All 4 terminals start at same time (fastest, ~20 minutes total)

### Option B: Staggered Start
Start terminals in order of time estimates (T2 → T4 → T1 → T3)

### Option C: Priority Order
1. **T2 first** (core structure changes)
2. **T1 & T3 & T4 parallel** (everything else)

---

## Progress Tracking

### Terminal Status Board

Copy this and update as terminals complete:

```
[ ] Terminal 1: Skills Creation & Command Cleanup
    Status: Not started
    ETA: 15-20 min

[ ] Terminal 2: Folder Reorganization
    Status: Not started
    ETA: 10-15 min

[ ] Terminal 3: Path Updates & Documentation
    Status: Not started
    ETA: 15-20 min

[ ] Terminal 4: Operator Workflow Guide
    Status: Not started
    ETA: 10-15 min
```

Update to:
- `In progress` when started
- `Completed ✅` when done
- `Blocked ⚠️` if issues

---

## After All Terminals Complete

### Validation Steps (Run from main terminal)

#### 1. Verify Folder Structure
```bash
# Should NOT exist at top level
ls -la components/
# Expected: No such file or directory

# Should exist in .system
ls -la .system/components/
# Expected: Directory exists with component files

# Skills folder should exist
ls -la .claude/skills/
# Expected: 6 markdown files

# Old commands should be deleted
ls .claude/commands/personal/ | grep -E "(define-contract|validate-component|prove-it-works|integrate-mcp)"
# Expected: No output (files deleted)
```

#### 2. Test Command Count
```bash
# Count remaining personal commands
ls .claude/commands/personal/*.md | wc -l
# Expected: 7 files (excluding README)
```

#### 3. Verify Documentation Created
```bash
# Check operator docs
ls -la docs/README-OPERATOR.md
cat docs/README-OPERATOR.md | grep "3-Phase"
# Expected: Section exists

# Check READMEs
ls -la .claude/commands/personal/README.md
ls -la .claude/skills/README.md
ls -la .system/components/README.md
# Expected: All exist
```

#### 4. Check Confusing Doc Deleted
```bash
ls .system/template/COMPONENTS_USAGE_ANALYSIS.md
# Expected: No such file or directory ✅
```

#### 5. Spot Check Path Updates
```bash
# Verify MCP server updated
grep "components/" .system/mcp-servers/component-registry.js
# Expected: Should show .system/components/, not bare components/

# Verify sandbox template updated
grep "components/" .system/sandbox/test-template.html
# Expected: Should show ../components/ (relative path)
```

#### 6. Final Structure Verification
```bash
tree -L 2 -a

# Expected structure:
# .
# ├── .bmad/
# ├── .claude/
# │   ├── commands/
# │   └── skills/          ← NEW
# ├── .system/
# │   ├── components/      ← MOVED
# │   ├── contracts/
# │   ├── proven/
# │   ├── sandbox/
# │   ├── validation/
# │   ├── mcp-servers/
# │   └── template/
# ├── assets/
# ├── docs/
# │   └── README-OPERATOR.md  ← NEW
# ├── references/
# └── tests/
```

---

## Rollback Plan (If Needed)

If something goes catastrophically wrong:

```bash
# 1. Restore components folder (if T2 completed)
mv .system/components components

# 2. Restore deleted commands (if T1 completed)
# Use git to restore if in version control:
git checkout .claude/commands/personal/

# 3. Delete new skills folder (if T1 completed)
rm -rf .claude/skills

# 4. Restore old documentation (if T3 completed)
git checkout .system/template/
git checkout .system/mcp-servers/

# 5. Delete new operator docs (if T4 completed)
rm docs/README-OPERATOR.md
rm .claude/commands/personal/README.md
```

**Note:** This is why having version control is important!

---

## Common Issues & Solutions

### Terminal 1 Issues

**Issue:** Skills folder creation fails
**Solution:** Ensure `.claude/` exists first
```bash
mkdir -p .claude/skills
```

**Issue:** Can't delete old commands (in use)
**Solution:** Close any editors with those files open

### Terminal 2 Issues

**Issue:** `mv components .system/components` fails
**Solution:** Check if components/ exists
```bash
ls -la components/
```

**Issue:** Confusing doc already deleted
**Solution:** Skip that step, continue

### Terminal 3 Issues

**Issue:** Too many path references to update
**Solution:** Focus on critical files first (MCP server, sandbox template)

**Issue:** File doesn't exist for update
**Solution:** Skip that file, note in completion report

### Terminal 4 Issues

**Issue:** docs/ folder doesn't exist
**Solution:**
```bash
mkdir -p docs
```

**Issue:** Content feels incomplete
**Solution:** Use task file content as template, expand with examples

---

## Success Criteria

### Reorganization is complete when:

- ✅ Components folder moved to `.system/components/`
- ✅ 5 Claude skills created in `.claude/skills/`
- ✅ 4 obsolete commands deleted
- ✅ 7 commands remain in personal/
- ✅ Confusing doc deleted (COMPONENTS_USAGE_ANALYSIS.md)
- ✅ All path references updated (components/ → .system/components/)
- ✅ Operator workflow documentation created
- ✅ README files created for context
- ✅ `/integrate` updated to hybrid approach (calls skills)
- ✅ All validation checks pass

---

## Expected Benefits

### For Operators:
- **Simpler interface:** 7 commands (down from 11)
- **Less cognitive load:** Don't need to understand .system/
- **Clearer workflow:** 3 phases, simple decision tree
- **Better documentation:** Comprehensive README-OPERATOR.md

### For Agents:
- **More autonomy:** Skills run automatically
- **Better separation:** Clear operator vs agent boundaries
- **Improved quality:** Automated validation workflow
- **Scalable architecture:** Easy to add more skills

### For Project:
- **Cleaner structure:** Top-level only has operator-facing folders
- **Better abstraction:** .system/ completely hidden
- **Reduced confusion:** Confusing docs removed
- **Professional workflow:** Industry-standard component architecture

---

## Timeline

**Parallel execution: ~20 minutes**

```
0 min  ─────────────────────> All 4 terminals start
5 min  ─────────────────────> T2 might finish (fastest)
10 min ─────────────────────> T4 likely finished
15 min ─────────────────────> T1 likely finished
20 min ─────────────────────> T3 likely finished, all done!
```

**Sequential execution: ~60 minutes** (not recommended)

---

## Questions During Execution?

### Terminal-Specific Questions:
- Refer to your terminal's task file
- Check completion checklist
- Review validation commands

### Cross-Terminal Questions:
- Check this guide's "Common Issues" section
- Verify no file conflicts in "No Conflicts Guarantee" table
- Consider if it's actually a blocker or can be noted for later

### Critical Failures:
- Stop execution
- Document state
- Review rollback plan
- Regroup and decide next steps

---

## After Completion

1. **Run all validation steps** (see "After All Terminals Complete")
2. **Test a workflow:**
   ```bash
   /checklist
   # Should validate new .system/components/ structure
   ```
3. **Review documentation:**
   ```bash
   cat docs/README-OPERATOR.md
   ```
4. **Commit changes:**
   ```bash
   git add .
   git commit -m "refactor: reorganize to operator/agent architecture

   - Move components/ to .system/components/
   - Convert 4 commands to Claude skills
   - Simplify to 7 operator-facing commands
   - Create comprehensive operator documentation
   - Remove confusing COMPONENTS_USAGE_ANALYSIS.md
   - Update all component path references"
   ```

---

## Ready to Execute?

1. **Assign terminals** to team members (or use 4 terminal windows)
2. **Each terminal opens their task file**
3. **Start simultaneously** (or use staggered approach)
4. **Report progress** as tasks complete
5. **Run validation** when all done
6. **Celebrate!** 🎉

---

**Let's ship it! 🚀**
