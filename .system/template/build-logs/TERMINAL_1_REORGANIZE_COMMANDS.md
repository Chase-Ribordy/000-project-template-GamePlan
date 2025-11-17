# TERMINAL 1: Reorganize Personal Slash Commands by Phase

## Objective
Reorganize `.claude/commands/personal/` into phase-based folders to simplify command discovery and reduce cognitive load.

## Background
Currently all 10 personal commands are in a flat structure. Operators need to know which commands are relevant for which phase of development. Organizing by phase makes the workflow clearer.

## Scope
- Reorganize personal commands into phase folders
- Do NOT touch `.bmad/` folder (BMAD commands stay as-is)
- Create README.md for quick reference
- Update any references if needed

## Tasks

### 1. Create Phase Folder Structure

```bash
cd .claude/commands/personal
mkdir -p phase-0-setup
mkdir -p phase-2-execution
mkdir -p phase-3-wrapup
```

### 2. Move Commands to Phase Folders

**Phase 0 (Setup)**:
```bash
mv checklist.md phase-0-setup/
mv integrate-mcp.md phase-0-setup/
```

**Phase 2 (Execution)**:
```bash
mv integrate.md phase-2-execution/
mv debug-css.md phase-2-execution/
mv quick-fix.md phase-2-execution/
mv improve.md phase-2-execution/
```

**Phase 3 (Wrap-up)**:
```bash
mv next-steps.md phase-3-wrapup/
```

**Note**: The following commands will be converted to skills (handled in Terminal 2):
- `define-contract.md` - Will become skill
- `validate-component.md` - Will become skill
- `prove-it-works.md` - Will be partially converted

### 3. Create Personal Commands README

Create `.claude/commands/personal/README.md`:

```markdown
# Personal Quality Commands

Quick reference for quality-first development commands organized by phase.

## Phase 0: Setup & Validation

**Goal**: Validate environment ready for development

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/checklist` | Validate project environment, guide through setup | First command on new project; daily validation |
| `/integrate-mcp` | Setup MCP server (one-time) | First project setup only |

## Phase 1: Planning

**Use BMAD Commands** (located in `.claude/commands/bmad/`)

Start with: `/brainstorm-project` or `/product-brief`
Then: `/prd` → `/architecture` → `/create-epics-and-stories`

## Phase 2: Execution

**Goal**: Build with quality-first, component-driven workflow

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/integrate` | Shard large files into modular components | When you have large prototype files (>200 lines) |
| `/debug-css` | Systematic CSS debugging with isolated tests | CSS issues, visual bugs, layout problems |
| `/quick-fix` | Rapid bug fixes (narrow scope) | Small bugs, quick fixes, specific issues |
| `/improve` | Creative problem-solving (exploratory) | Need fresh approach, stuck, want alternatives |

**Note**: `/define-contract`, `/validate-component`, `/prove-it-works` are now Claude skills (agents call automatically)

## Phase 3: Wrap-up

**Goal**: Document and prepare for handoff

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/next-steps` | Session handoff documentation | End of session, before stopping work |

---

## Command Philosophy

**Personal Commands** = Quality-first utilities for operators
**BMAD Commands** = Full SDLC workflows (planning, agents, retrospectives)
**Claude Skills** = Agent-autonomous quality gates (validation, contracts)

## Quick Workflow

1. **Start**: `/checklist` (validate environment)
2. **Plan**: Use BMAD workflows to create PRD, architecture, epics
3. **Build**: Write code, use `/integrate` for large files, agents use skills for validation
4. **Debug**: `/debug-css` for styling, `/quick-fix` for bugs, `/improve` for creative solutions
5. **Finish**: `/next-steps` for handoff, use BMAD `/retrospective` for sprint review

---

**Total Personal Commands**: 7 commands + 3 skills (auto-called by agents)
**Total BMAD Commands**: 37 commands (organized in `.claude/commands/bmad/`)
**Total**: 44 commands + 3 skills = 47 tools
```

### 4. Verify Structure

After moving, verify with:
```bash
ls -la phase-0-setup/
ls -la phase-2-execution/
ls -la phase-3-wrapup/
cat README.md
```

Expected structure:
```
.claude/commands/personal/
├── phase-0-setup/
│   ├── checklist.md
│   └── integrate-mcp.md
├── phase-2-execution/
│   ├── integrate.md
│   ├── debug-css.md
│   ├── quick-fix.md
│   └── improve.md
├── phase-3-wrapup/
│   └── next-steps.md
└── README.md
```

## Success Criteria
- [ ] Phase folders created
- [ ] All 7 commands moved to appropriate phase folders
- [ ] README.md created with quick reference
- [ ] Verified structure with ls commands
- [ ] No broken references (Claude Code reads commands from subfolders automatically)

## Verification

Test that commands still work:
```bash
# In Claude Code, try running:
# /checklist
# /integrate
# /next-steps
```

Commands should load from new locations without issues (Claude Code scans subdirectories).

## Notes
- Do NOT move BMAD commands (they stay in `.claude/commands/bmad/`)
- Do NOT create phase-1-planning folder (planning uses BMAD workflows)
- Commands being converted to skills will be removed by Terminal 2
