# Parallel Execution Master Plan

## Overview

This project template simplification consists of 4 independent, parallelizable tasks:

1. **Terminal 1**: Reorganize personal commands by phase
2. **Terminal 2**: Convert commands to Claude skills
3. **Terminal 3**: Enhance /checklist with guided setup
4. **Terminal 4**: Update documentation

**Estimated Total Time**: 4-5 hours (if done sequentially), **1-2 hours** (if done in parallel)

---

## Task Dependencies

```
Terminal 1 ──┐
             ├──> Can run in parallel (independent)
Terminal 2 ──┤
             │
Terminal 3 ──┤
             │
Terminal 4 ──┘

Note: Terminal 1 moves command files, Terminal 2 references those files
      If running in parallel, Terminal 2 should handle both old and new paths
      Or run Terminal 1 first, then 2-4 in parallel
```

**Recommended Execution**:
- **Option A**: Run all 4 terminals in parallel (fastest, 1-2 hours)
- **Option B**: Run Terminal 1, then 2-4 in parallel (safest, 1.5-2 hours)
- **Option C**: Run sequentially 1→2→3→4 (slowest, 4-5 hours)

---

## Copy-Paste Commands for Parallel Terminals

### Terminal 1: Reorganize Commands
```
Read C:\Users\chase\Downloads\project-template\.system\template\build-logs\TERMINAL_1_REORGANIZE_COMMANDS.md
```

**Scope**: Reorganize `.claude/commands/personal/` into phase folders
**Time**: 30 minutes
**Output**: Phase-organized commands, README.md created

---

### Terminal 2: Create Skills
```
Read C:\Users\chase\Downloads\project-template\.system\template\build-logs\TERMINAL_2_CREATE_SKILLS.md
```

**Scope**: Convert 3 commands to Claude skills
**Time**: 45 minutes
**Output**: `.claude/skills/` created, 3 skill files, skills README.md

---

### Terminal 3: Enhance Checklist
```
Read C:\Users\chase\Downloads\project-template\.system\template\build-logs\TERMINAL_3_ENHANCE_CHECKLIST.md
```

**Scope**: Add permission-based setup to /checklist command
**Time**: 1 hour
**Output**: Enhanced checklist with guided setup

---

### Terminal 4: Documentation Updates
```
Read C:\Users\chase\Downloads\project-template\.system\template\build-logs\TERMINAL_4_DOCUMENTATION_UPDATES.md
```

**Scope**: Update all documentation to reflect new structure
**Time**: 1.5 hours
**Output**: Updated READMEs, new execution-workflow.md, moved COMPONENTS_USAGE_ANALYSIS.md

---

## Execution Instructions

### Option A: Full Parallel (Fastest - 1-2 hours)

Open 4 Claude Code terminals, run one command in each:

**Terminal 1**:
```
Read C:\Users\chase\Downloads\project-template\.system\template\build-logs\TERMINAL_1_REORGANIZE_COMMANDS.md
```

**Terminal 2**:
```
Read C:\Users\chase\Downloads\project-template\.system\template\build-logs\TERMINAL_2_CREATE_SKILLS.md
```

**Terminal 3**:
```
Read C:\Users\chase\Downloads\project-template\.system\template\build-logs\TERMINAL_3_ENHANCE_CHECKLIST.md
```

**Terminal 4**:
```
Read C:\Users\chase\Downloads\project-template\.system\template\build-logs\TERMINAL_4_DOCUMENTATION_UPDATES.md
```

Wait for all 4 to complete. Verify results, then proceed to final verification (see below).

---

### Option B: Sequential Phase (Safest - 1.5-2 hours)

**Step 1**: Run Terminal 1 first (reorganize commands)
```
Read C:\Users\chase\Downloads\project-template\.system\template\build-logs\TERMINAL_1_REORGANIZE_COMMANDS.md
```

**Step 2**: After Terminal 1 completes, run 2-4 in parallel

**Terminal 2**:
```
Read C:\Users\chase\Downloads\project-template\.system\template\build-logs\TERMINAL_2_CREATE_SKILLS.md
```

**Terminal 3**:
```
Read C:\Users\chase\Downloads\project-template\.system\template\build-logs\TERMINAL_3_ENHANCE_CHECKLIST.md
```

**Terminal 4**:
```
Read C:\Users\chase\Downloads\project-template\.system\template\build-logs\TERMINAL_4_DOCUMENTATION_UPDATES.md
```

---

## Final Verification (Single Terminal)

After all terminals complete, run final verification:

### 1. Verify Command Structure
```bash
ls -la .claude/commands/personal/
ls -la .claude/commands/personal/phase-0-setup/
ls -la .claude/commands/personal/phase-2-execution/
ls -la .claude/commands/personal/phase-3-wrapup/
cat .claude/commands/personal/README.md
```

Expected:
- 3 phase folders created
- 7 commands distributed across phases
- README.md with quick reference

### 2. Verify Skills Created
```bash
ls -la .claude/skills/
cat .claude/skills/README.md
```

Expected:
- 3 skill files (define-contract, validate-component, prove-it-works)
- Skills README.md

### 3. Verify Checklist Enhanced
```bash
grep -i "permission" .claude/commands/personal/phase-0-setup/checklist.md | head -5
```

Expected: References to permission-based setup

### 4. Verify Documentation Updated
```bash
ls .system/template/COMPONENTS_USAGE_ANALYSIS.md
ls .system/scripts/README.md
ls docs/execution-workflow.md
grep -i "lifecycle" components/README.md
grep -i "Phase 0" README.md
```

Expected:
- COMPONENTS_USAGE_ANALYSIS.md moved to .system/template/
- .system/scripts/README.md created
- docs/execution-workflow.md created
- components/README.md has lifecycle section
- README.md has Phase 0 section

### 5. Test Commands Still Work

```bash
# Test command loading from new locations
# (These commands won't run yet, just checking they load)
```

In Claude Code, try:
- `/checklist` (should load from phase-0-setup/)
- `/integrate` (should load from phase-2-execution/)
- `/next-steps` (should load from phase-3-wrapup/)

---

## Success Criteria Summary

**Terminal 1 Success**:
- [ ] `.claude/commands/personal/phase-0-setup/` created with 2 commands
- [ ] `.claude/commands/personal/phase-2-execution/` created with 4 commands
- [ ] `.claude/commands/personal/phase-3-wrapup/` created with 1 command
- [ ] `.claude/commands/personal/README.md` created with quick reference

**Terminal 2 Success**:
- [ ] `.claude/skills/` created
- [ ] 3 skill files created (define-contract.md, validate-component.md, prove-it-works.md)
- [ ] `.claude/skills/README.md` created
- [ ] Original command files deleted (define-contract, validate-component, prove-it-works)

**Terminal 3 Success**:
- [ ] `/checklist` command enhanced with permission-based setup
- [ ] Auto-fix added for: folders, npm install, git init, settings.local.json
- [ ] --quick mode still works (validation only)
- [ ] Final summary shows what was set up

**Terminal 4 Success**:
- [ ] COMPONENTS_USAGE_ANALYSIS.md moved to `.system/template/`
- [ ] `.system/scripts/` created with README.md
- [ ] `components/README.md` updated with lifecycle section
- [ ] Main `README.md` updated with Phase 0-3 workflow
- [ ] `docs/execution-workflow.md` created with three-pass strategy
- [ ] `AGENT-INFRASTRUCTURE.md` updated with skills section

---

## Rollback Plan (If Needed)

If something goes wrong, rollback steps:

### Rollback Terminal 1 (Commands)
```bash
# Move commands back to flat structure
cd .claude/commands/personal
mv phase-0-setup/* .
mv phase-2-execution/* .
mv phase-3-wrapup/* .
rmdir phase-0-setup phase-2-execution phase-3-wrapup
rm README.md
```

### Rollback Terminal 2 (Skills)
```bash
# Delete skills directory
rm -rf .claude/skills
# Restore original commands from git (if committed before changes)
git checkout .claude/commands/personal/define-contract.md
git checkout .claude/commands/personal/validate-component.md
git checkout .claude/commands/personal/prove-it-works.md
```

### Rollback Terminal 3 (Checklist)
```bash
# Restore original checklist from git
git checkout .claude/commands/personal/checklist.md
# Or manually revert changes
```

### Rollback Terminal 4 (Documentation)
```bash
# Move COMPONENTS_USAGE_ANALYSIS.md back to root
mv .system/template/COMPONENTS_USAGE_ANALYSIS.md .
# Delete new files
rm docs/execution-workflow.md
rm .system/scripts/README.md
rmdir .system/scripts
# Restore original READMEs from git
git checkout README.md
git checkout components/README.md
git checkout AGENT-INFRASTRUCTURE.md
```

---

## Post-Execution Next Steps

After all terminals complete successfully:

1. **Test the enhanced /checklist**:
   ```
   /checklist
   ```
   Verify guided setup works with permission prompts

2. **Verify skills load** (check Claude Code recognizes them):
   Skills should appear in Claude's available tools

3. **Test reorganized commands**:
   - `/integrate` (phase-2-execution)
   - `/debug-css` (phase-2-execution)
   - `/quick-fix` (phase-2-execution)

4. **Update any custom scripts/aliases** you have that reference old command paths

5. **Commit changes**:
   ```bash
   git add .
   git commit -m "Simplify project template: phase-organized commands, skills, enhanced checklist, updated docs"
   ```

6. **Create template release** (optional):
   - Tag version: `v2.0.0-simplified`
   - Document breaking changes (command paths moved)

---

## Estimated Time Savings for Operators

**Before Simplification**:
- Remember 47 slash commands (overwhelming)
- Coordinate validation timing manually
- Run /validate-component, /prove-it-works manually
- Set up project manually (multiple steps)

**After Simplification**:
- Remember 7 personal commands (organized by phase)
- Agents auto-validate (skills handle it)
- Guided setup via /checklist (one command)
- Clear phase progression (0→1→2→3)

**Time Saved Per Project**:
- Setup: 15 minutes → 5 minutes (10 min saved)
- Validation coordination: 5 min/component → 0 min (auto) (5-10 min saved per component)
- Command discovery: 2 min → 30 sec (1.5 min saved per command lookup)

**Total**: ~20-30 minutes saved per project, **significantly reduced cognitive load**

---

## Questions or Issues?

If you encounter issues during parallel execution:

1. Check terminal output for specific errors
2. Verify file paths are correct (Windows vs Linux)
3. Ensure no file conflicts (e.g., Terminal 1 and 2 both editing same file)
4. Run verification commands to identify which step failed
5. Use rollback plan if needed to restore original state

---

**Ready to execute!** Choose your option (A, B, or C) and copy-paste the commands into your terminals.
