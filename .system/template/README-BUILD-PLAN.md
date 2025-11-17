# README-BUILD-PLAN.md - Project Template Consolidation

## Overview
Transform project-template into a universal template with integrated BMAD methodology, custom slash commands, MCP servers, and component-driven architecture support.

## Current State

### Existing Structure
```
project-template/
├── .bmad/                    # Complete BMAD v6.0.0-alpha.9 (227 files)
├── .claude/                  # Claude Code config (NEEDS ORGANIZATION)
│   ├── commands/
│   │   ├── bmad/            # 37 BMAD command wrappers
│   │   ├── debug-css.md     # Custom command (MOVE TO personal/)
│   │   ├── improve.md       # Custom command (MOVE TO personal/)
│   │   └── quick-fix.md     # Custom command (MOVE TO personal/)
│   ├── CLAUDE.md            # Primary instructions (MOVE TO config/)
│   ├── settings.json        # Permissions config (MOVE TO config/)
│   ├── settings.local.json  # Local overrides (MOVE TO config/)
│   └── SETUP_SUMMARY.md     # Documentation (MOVE TO config/)
├── assets/                   # Logo files
├── output/                   # AI workspace (EMPTY - ready)
├── references/               # Component library (EMPTY - ready)
├── templates/                # Templates (EMPTY - needs files)
├── tests/                    # Test suite (EMPTY - ready)
├── notify.py                 # Notification script
├── prompt.md                 # Planning notes (MOVE TO docs/)
└── README-STRUCTURE.md              # Documentation
```

### Missing Critical Components
- ❌ `docs/` folder for project knowledge base
- ❌ `.system/mcp-servers/` for component registry
- ❌ `scripts/` for automation
- ❌ `.system/components/` for modular architecture
- ❌ `/integrate` commands (MCP + workflow versions)
- ❌ `/next-steps` session manager
- ❌ `/checklist` pre-game ritual
- ❌ Enhanced `/debug-css` with self-checking

---

## Parallel Build Tasks

### 🔵 TASK 1: Reorganize .claude/ Folder
**Agent**: Any
**Dependencies**: None
**Estimated Time**: 5 minutes

#### Actions
1. Create new folder structure:
```
.claude/
├── commands/
│   ├── bmad/              # Keep as-is (37 commands)
│   └── personal/          # NEW - Move custom commands here
│       ├── debug-css.md
│       ├── improve.md
│       ├── quick-fix.md
│       ├── integrate.md       # To be created
│       ├── integrate-mcp.md   # To be created
│       ├── next-steps.md      # To be created
│       └── checklist.md       # To be created
├── config/                # NEW - Move config files here
│   ├── CLAUDE.md
│   ├── settings.json
│   ├── settings.local.json
│   └── SETUP_SUMMARY.md
```

2. Move files to new locations
3. Update any references if needed

#### Commands Needed
```bash
mkdir .claude/commands/personal
mkdir .claude/config
mv .claude/commands/debug-css.md .claude/commands/personal/
mv .claude/commands/improve.md .claude/commands/personal/
mv .claude/commands/quick-fix.md .claude/commands/personal/
mv .claude/CLAUDE.md .claude/config/
mv .claude/settings.json .claude/config/
mv .claude/settings.local.json .claude/config/
mv .claude/SETUP_SUMMARY.md .claude/config/
```

---

### 🟢 TASK 2: Create Folder Structure
**Agent**: Any
**Dependencies**: None
**Estimated Time**: 2 minutes

#### Actions
Create missing root-level folders:
```bash
mkdir docs
mkdir mcp-servers
mkdir scripts
mkdir components
```

Create subfolder structure:
```
docs/
├── planning-notes.md        # From prompt.md
├── mcp-setup.md            # MCP documentation
├── integration-workflow.md  # Integration guide
└── README.md               # Docs overview

.system/components/
└── .gitkeep               # Preserve in git

scripts/
├── build-components.sh    # To be created
└── checklist.md           # To be created

templates/
└── component-spec.md      # To be created
```

#### Commands Needed
```bash
mkdir docs
mkdir -p .system/mcp-servers
mkdir scripts
mkdir -p .system/components
touch .system/components/.gitkeep
```

---

### 🟡 TASK 3: Build /integrate-mcp Command
**Agent**: Dev or Architect
**Dependencies**: TASK 2 complete (folders exist)
**Estimated Time**: 15 minutes

#### Actions
Create `.claude/commands/personal/integrate-mcp.md`:

**Purpose**: Guide user through building and configuring the component registry MCP server

**Workflow Steps**:
1. Explain MCP server architecture
2. Guide npm package installation
3. Create mcp-servers/component-registry.js
4. Configure Claude Desktop config
5. Test MCP server connection
6. Provide troubleshooting steps

**Key Features**:
- Interactive setup wizard
- Validation at each step
- Clear error messages
- Fallback options

#### File to Create
Location: `.claude/commands/personal/integrate-mcp.md`
Reference: `prompt.md` lines 213-534 for MCP server code

---

### 🟡 TASK 4: Build /integrate Command
**Agent**: Dev
**Dependencies**: TASK 2 complete
**Estimated Time**: 20 minutes

#### Actions
Create `.claude/commands/personal/integrate.md`:

**Purpose**: Shard large files and create injection architecture for component-driven development

**Workflow Steps**:
1. **Analyze File** - Detect size/complexity, identify logical boundaries
2. **Create Manifest** - Map components to be extracted
3. **Shard Components** - Extract to individual files (max 200 lines each)
4. **Generate Placeholders** - Create injection markers in source
5. **Build Integration Pipeline** - Validate and inject components
6. **Test Integration** - Verify combined output

**Example Flow**:
```
Input: src/main.html (2000 lines)
Output:
  - src/main.html (50 lines with placeholders)
  - .system/components/header.html (150 lines)
  - .system/components/bio-mechanics.html (180 lines)
  - .system/components/animations/donut.js (120 lines)
  - .system/components/styles/donut.css (100 lines)
```

**Integration with MCP**:
- Call component registry for validation
- Check CSS namespace conflicts
- Verify dependencies
- Safe rollback on errors

#### File to Create
Location: `.claude/commands/personal/integrate.md`
Reference: `prompt.md` lines 88-196

---

### 🟣 TASK 5: Build /next-steps Command
**Agent**: PM or Tech-Writer
**Dependencies**: TASK 2 complete
**Estimated Time**: 15 minutes

#### Actions
Create `.claude/commands/personal/next-steps.md`:

**Purpose**: Generate session-end documentation for seamless context switching

**Auto-Generated Content**:
```markdown
# Next Steps - [Project Name]
Generated: [Timestamp]

## Last Completed Task
- [Task description]
- Completed at: [Time]
- Status: [Success/Partial/Blocked]

## Current Blockers
- [ ] [Blocker 1 with details]
- [ ] [Blocker 2 with details]

## Ready Queue (Parallelizable Work)
- [ ] [Task 1 - can run independently]
- [ ] [Task 2 - can run independently]
- [ ] [Task 3 - can run independently]

## Context Crumbs
- Files modified: [List]
- Commands run: [Recent commands]
- Dependencies added: [Packages]
- Tests status: [Pass/Fail counts]

## Next Session Priorities
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

## Notes
[Any additional context for next session]
```

**Workflow**:
1. Scan git status for recent changes
2. Read todo list if exists
3. Check test results
4. Analyze conversation history for context
5. Generate next-steps.md in docs/
6. Offer to commit changes

#### File to Create
Location: `.claude/commands/personal/next-steps.md`
Reference: `prompt.md` lines 35-40, 607-608

---

### 🟣 TASK 6: Build /checklist Command
**Agent**: SM or PM
**Dependencies**: TASK 2 complete, TASK 10 complete (needs scripts/checklist.md)
**Estimated Time**: 15 minutes

#### Actions
Create `.claude/commands/personal/checklist.md`:

**Purpose**: Pre-game ritual to ensure perfect project setup before starting work

**Workflow**:
1. Load checklist from `scripts/checklist.md`
2. Interactive walkthrough of each item
3. Validate completion (check folders exist, MCP connected, etc.)
4. Show terminal arrangement suggestions
5. Review workflow notes from docs/
6. Final "GO HARD" confirmation

**Checklist Items** (from scripts/checklist.md):
- [ ] Create project folder & git branch
- [ ] Set up knowledge base in docs/
- [ ] Configure MCP servers
- [ ] Open terminal arrangement (4 terminals suggested)
- [ ] Set overnight boundaries
- [ ] Review workflow notes
- [ ] Confirm notification system active
- [ ] GO HARD

#### File to Create
Location: `.claude/commands/personal/checklist.md`
Reference: `prompt.md` lines 26-34

---

### 🔴 TASK 7: Enhanced /debug-css Command
**Agent**: Dev
**Dependencies**: TASK 2 complete
**Estimated Time**: 20 minutes

#### Actions
Enhance existing `.claude/commands/personal/debug-css.md`:

**Add Self-Checking Protocol**:

**Current**: Basic debugging guidance
**Enhanced**: Automated verification before showing to user

**New Workflow**:
1. **Extract to Sandbox** - Create debug/[issue]-test.html with isolated code
2. **Create Reference** - Generate "known good" comparison state
3. **Agent Self-Check Protocol** (BEFORE showing user):
   - Run visual regression test
   - Check computed styles match expected
   - Verify animation frame timing (60fps target)
   - Compare against reference implementation
4. **Proof of Fix**:
   - Side-by-side comparison (before/after)
   - Specific metrics that changed
   - Screenshot or recording of working state
5. **Human Verification** - ONLY THEN request user to verify

**Example Output**:
```
✅ Animation now runs at 60fps (was 30fps)
✅ Transition duration fixed at 2s (was choppy)
✅ Visual regression: 0 differences from reference
✅ Test file ready: debug/donut-test.html

Please verify once in browser.
```

#### File to Update
Location: `.claude/commands/personal/debug-css.md`
Reference: `prompt.md` lines 16-24, 136-171, 553-565

---

### 🟠 TASK 8: Create MCP Component Registry Server
**Agent**: Architect or Dev
**Dependencies**: TASK 2 complete
**Estimated Time**: 25 minutes

#### Actions
Create `mcp-servers/component-registry.js`:

**Features**:
1. **Component Registration**
   - Track name, CSS namespace, dependencies, interfaces
   - Maintain component map
   - Prevent duplicate registrations

2. **Integration Validation**
   - Check CSS namespace conflicts
   - Verify dependencies exist
   - Detect interface mismatches
   - Return safe/unsafe status

3. **Integration Planning**
   - Generate injection points
   - Create safe merge strategy
   - Provide rollback steps

**MCP Tools to Expose**:
- `register_component` - Register before integration
- `validate_integration` - Check safety
- `get_integration_plan` - Get merge strategy
- `list_components` - Show registry

**Complete Code**: Reference `prompt.md` lines 232-390

#### Files to Create
1. `mcp-servers/component-registry.js` - Main server
2. `mcp-servers/package.json` - Dependencies
3. `mcp-servers/README.md` - Setup instructions

---

### 🟠 TASK 9: Create Component Templates
**Agent**: Architect
**Dependencies**: TASK 2 complete
**Estimated Time**: 15 minutes

#### Actions
Create standardized templates in `templates/`:

**1. Component Specification Template**
File: `templates/component-spec.md`

```markdown
# Component: [Name]

## Purpose
[What does this component do?]

## CSS Namespace
`.component-[name]`

## Dependencies
- [Dependency 1]
- [Dependency 2]

## Interfaces
### Inputs
- [Input 1]: [type] - [description]

### Outputs
- [Output 1]: [type] - [description]

## File Structure
```
.system/components/[name]/
├── [name].js
├── [name].css
├── [name].test.js
└── README.md
```

## Integration Points
- Injection marker: `<!-- INJECT:[name] -->`
- Target file: [path]

## Test Cases
- [ ] [Test 1]
- [ ] [Test 2]
```

**2. Component File Template**
File: `templates/component.js`

**3. Component Test Template**
File: `templates/component.test.js`

**4. Component CSS Template**
File: `templates/component.css`

#### Files to Create
Location: `templates/` folder
Reference: `prompt.md` line 80

---

### 🔵 TASK 10: Create Automation Scripts
**Agent**: Dev or SM
**Dependencies**: TASK 2 complete
**Estimated Time**: 20 minutes

#### Actions
Create automation scripts in `scripts/`:

**1. Build Components Script**
File: `scripts/build-components.sh`

```bash
#!/bin/bash
# Batch TDD component builder
# Usage: ./scripts/build-components.sh components.txt

COMPONENT_LIST=$1
LOG_FILE="progress.log"

while IFS= read -r component; do
  echo "Building: $component" | tee -a $LOG_FILE

  # Create component structure
  mkdir -p ".system/components/$component"

  # Generate from template
  cp templates/component.js ".system/components/$component/$component.js"
  cp templates/component.test.js ".system/components/$component/$component.test.js"
  cp templates/component.css ".system/components/$component/$component.css"

  # Run tests
  npm test ".system/components/$component/$component.test.js" 2>&1 | tee -a $LOG_FILE

  echo "---" >> $LOG_FILE
done < "$COMPONENT_LIST"

echo "Build complete. Check progress.log for results."
```

**2. Pre-Game Checklist**
File: `scripts/checklist.md`

```markdown
# Pre-Game Ritual Checklist

## Project Setup
- [ ] Create project folder
- [ ] Initialize git repository
- [ ] Create feature branch: `git checkout -b feature/[name]`

## Knowledge Base
- [ ] Create docs/ folder structure
- [ ] Add planning-notes.md with project overview
- [ ] Document key decisions

## MCP Configuration
- [ ] Verify MCP servers configured in Claude Desktop
- [ ] Test component-registry connection
- [ ] Check MCP server logs for errors

## Terminal Arrangement (4 recommended)
- [ ] Terminal 1: Primary development (main focus)
- [ ] Terminal 2: Testing/validation
- [ ] Terminal 3: Documentation/planning
- [ ] Terminal 4: Git operations/deployment

## Workflow Preparation
- [ ] Set overnight boundaries (if applicable)
- [ ] Review BMAD workflow status
- [ ] Check notification system active
- [ ] Review last session's next-steps.md

## Final Check
- [ ] All dependencies installed
- [ ] Environment variables set
- [ ] Tests passing (if existing project)

## 🚀 GO HARD
Ready to build? Let's go!
```

#### Files to Create
1. `scripts/build-components.sh`
2. `scripts/checklist.md`

Reference: `prompt.md` lines 76-81

---

### 🟢 TASK 11: Organize Documentation
**Agent**: Tech-Writer or PM
**Dependencies**: TASK 2 complete
**Estimated Time**: 15 minutes

#### Actions

**1. Move and reorganize existing docs**
- Move `prompt.md` → `docs/planning-notes.md`
- Keep `README-STRUCTURE.md` at root (project overview)

**2. Create docs/README.md**
```markdown
# Project Documentation

## Purpose
This folder contains project-specific documentation, planning notes, and reference materials.

## Structure
- `planning-notes.md` - Original planning and ideation
- `mcp-setup.md` - MCP server setup guide
- `integration-workflow.md` - Component integration process
- `next-steps.md` - Current session status (auto-generated)

## BMAD Documentation
See `.bmad/bmm/docs/` for BMAD methodology documentation.

## Usage
- Use `/next-steps` to generate session summaries
- Update planning-notes.md as project evolves
- Keep architectural decisions documented
```

**3. Create docs/mcp-setup.md** (MCP configuration guide)

**4. Create docs/integration-workflow.md** (How to use /integrate)

#### Files to Create/Modify
1. Move: `prompt.md` → `docs/planning-notes.md`
2. Create: `docs/README.md`
3. Create: `docs/mcp-setup.md`
4. Create: `docs/integration-workflow.md`

---

### 🟠 TASK 12: Update Settings & Permissions
**Agent**: Any
**Dependencies**: TASK 1 complete (folder reorganization)
**Estimated Time**: 10 minutes

#### Actions

**1. Update `.claude/config/settings.json`** with expanded allowed tools:

Add to existing allowed_tools array:
```json
{
  "allowed_tools": [
    "Write(*)",
    "Edit(*)",
    "Read(*)",
    "Bash(npm:*)",
    "Bash(node:*)",
    "Bash(chmod:*)",
    "Bash(mkdir:*)",
    "Bash(cp:*)",
    "Bash(mv:*)",
    "Bash(touch:*)"
  ]
}
```

**2. Update path references** if .claude/ reorganization affects hooks or settings

**3. Test notification system** still works after reorganization

#### Files to Modify
Location: `.claude/config/settings.json`

---

### 🟢 TASK 13: Create Template README
**Agent**: Tech-Writer
**Dependencies**: All tasks complete
**Estimated Time**: 10 minutes

#### Actions

Update root `README.md` or create `README-USAGE.md`:

```markdown
# Project Template - Quick Start

## What This Template Includes

### BMAD Methodology (v6.0.0-alpha.9)
- 40 slash commands for full SDLC
- 8 specialized agents (PM, Architect, Dev, etc.)
- 34 workflows across 4 phases

### Custom Integration Tools
- `/integrate` - Shard large files into components
- `/integrate-mcp` - Set up component registry MCP server
- `/debug-css` - Self-checking CSS/animation debugger
- `/next-steps` - Session management & handoff
- `/checklist` - Pre-game project setup
- `/quick-fix` - Rapid bug fixes
- `/improve` - Creative problem-solving

### Component-Driven Architecture
- MCP server for safe integration
- Component registry with conflict detection
- Injection-based assembly (prevent context blowout)
- TDD-ready component templates

## Quick Start

1. **Copy template to new project**
   ```bash
   cp -r project-template my-new-project
   cd my-new-project
   ```

2. **Run pre-game checklist**
   ```bash
   /checklist
   ```

3. **Configure MCP server** (if using components)
   ```bash
   /integrate-mcp
   ```

4. **Start development**
   ```bash
   /pm "Build [your idea]"
   ```

5. **End session with context**
   ```bash
   /next-steps
   ```

## Folder Structure
```
project/
├── .bmad/          # BMAD methodology (don't modify)
├── .claude/        # Claude Code config
│   ├── commands/   # All slash commands
│   └── config/     # Settings & permissions
├── docs/           # Project documentation
├── components/     # Modular components
├── references/     # Reusable code library
├── templates/      # Component templates
├── scripts/        # Automation scripts
├── mcp-servers/    # MCP server(s)
└── src/            # Main source code
```

## Recommended Workflow

**Planning Phase:**
1. `/pm` - Create PRD
2. `/architect` - Design architecture
3. `/sm` - Break into epics/stories

**Building Phase:**
4. `/dev` - Implement stories
5. Build components in parallel
6. `/integrate` - Assemble components

**Finishing Phase:**
7. `/debug-css` - Fix tricky UI issues
8. `/code-review` - Review completed work
9. `/next-steps` - Document for next session

## Advanced Features

### Parallel Development
Open 4 terminals, assign one agent per terminal:
- Terminal 1: Main feature development
- Terminal 2: Component building
- Terminal 3: Testing & validation
- Terminal 4: Documentation

### Component-Driven Development
1. Build components in `references/`
2. Register with MCP: `register_component(...)`
3. Validate: `/integrate [component] [target]`
4. Inject safely with automatic conflict detection

### Overnight Automation (Coming Soon)
- Batch component generation
- Automated epic/story creation
- Documentation generation

## Support
- BMAD docs: `.bmad/bmm/docs/`
- Integration guide: `docs/integration-workflow.md`
- MCP setup: `docs/mcp-setup.md`
```

#### Files to Create
Location: `README-USAGE.md` at root

---

### 🔵 TASK 14: Final Validation & Testing
**Agent**: SM or QA
**Dependencies**: ALL tasks complete
**Estimated Time**: 15 minutes

#### Actions

**1. Validate folder structure**
```bash
# Check all folders exist
ls -la docs/ mcp-servers/ scripts/ components/ templates/

# Verify .claude reorganization
ls -la .claude/commands/personal/
ls -la .claude/config/
```

**2. Validate all slash commands loadable**
```bash
# Test each new command accessible
/integrate --help
/integrate-mcp --help
/next-steps --help
/checklist --help
```

**3. Test MCP server**
```bash
cd mcp-servers
npm install
node component-registry.js
# Should start without errors
```

**4. Run checklist**
```bash
/checklist
# Walk through interactively
```

**5. Create test component**
```bash
# Use template
cp templates/component-spec.md components/test-component.md
# Validate structure
```

**6. Generate next-steps**
```bash
/next-steps
# Should create docs/next-steps.md
cat docs/next-steps.md
```

**7. Create validation report**
File: `README-VALIDATION.md`

```markdown
# Template Validation Report

## Date: [timestamp]

## Folder Structure
- [x] docs/
- [x] mcp-servers/
- [x] scripts/
- [x] components/
- [x] templates/
- [x] .claude/commands/personal/
- [x] .claude/config/

## Slash Commands
- [x] /integrate
- [x] /integrate-mcp
- [x] /next-steps
- [x] /checklist
- [x] /debug-css (enhanced)
- [x] /quick-fix
- [x] /improve

## MCP Server
- [x] component-registry.js exists
- [x] npm packages installed
- [x] Server starts without errors
- [x] Tools exposed correctly

## Templates
- [x] component-spec.md
- [x] component.js
- [x] component.test.js
- [x] component.css

## Scripts
- [x] build-components.sh
- [x] checklist.md

## Documentation
- [x] docs/README.md
- [x] docs/planning-notes.md
- [x] docs/mcp-setup.md
- [x] docs/integration-workflow.md
- [x] README-USAGE.md

## Status: READY FOR USE ✅
```

#### Files to Create
Location: `README-VALIDATION.md` at root

---

## Parallel Execution Plan

### Batch 1 (No dependencies - START IMMEDIATELY)
- **Terminal 1**: TASK 1 (Reorganize .claude/)
- **Terminal 2**: TASK 2 (Create folders)
- **Terminal 3**: TASK 9 (Component templates)
- **Terminal 4**: TASK 10 (Scripts)

### Batch 2 (After Batch 1 completes)
- **Terminal 1**: TASK 3 (/integrate-mcp command)
- **Terminal 2**: TASK 4 (/integrate command)
- **Terminal 3**: TASK 5 (/next-steps command)
- **Terminal 4**: TASK 8 (MCP server)

### Batch 3 (After Batch 2 completes)
- **Terminal 1**: TASK 6 (/checklist command) - needs TASK 10
- **Terminal 2**: TASK 7 (Enhanced /debug-css)
- **Terminal 3**: TASK 11 (Documentation)
- **Terminal 4**: TASK 12 (Settings update)

### Batch 4 (Final)
- **Terminal 1**: TASK 13 (README)
- **Terminal 2**: TASK 14 (Validation)

**Total Estimated Time**:
- Batch 1: ~20 min
- Batch 2: ~25 min
- Batch 3: ~20 min
- Batch 4: ~15 min
- **Total: ~80 minutes with full parallelization**

---

## Success Criteria

### Template Structure
- ✅ All 14 tasks completed
- ✅ No duplicate files
- ✅ Clean folder organization
- ✅ All documentation in place

### Functionality
- ✅ All 7 custom slash commands working
- ✅ MCP server operational
- ✅ Component templates ready
- ✅ Scripts executable
- ✅ Permissions configured

### Usability
- ✅ Clear README/usage guide
- ✅ Checklist validates setup
- ✅ next-steps generates properly
- ✅ Integration workflow documented
- ✅ Ready to copy for new projects

---

## Notes for Execution

### Permission Strategy
Most tasks use standard file operations already in allowed_tools. Additional permissions needed:
- `npm install` (MCP setup)
- `chmod +x` (script permissions)
- `node` (testing MCP server)

### Error Handling
- Each task is isolated - failures don't cascade
- Validation task (TASK 14) will catch any issues
- MCP server can fail gracefully - integration still works without it

### Priority Focus
Per prompt.md, highest value tasks:
1. **TASK 4** (/integrate) - Solves biggest bottleneck
2. **TASK 8** (MCP server) - Enables safe integration
3. **TASK 7** (Enhanced /debug-css) - Improves last 20% of projects

All other tasks support these three core features.

---

## Ready for Parallel Execution

This plan is now ready to distribute across multiple terminals. Each task is:
- ✅ Clearly specified
- ✅ Isolated (no conflicts)
- ✅ Dependencies identified
- ✅ Time-boxed
- ✅ Testable

Copy this file to each terminal and assign tasks accordingly!
