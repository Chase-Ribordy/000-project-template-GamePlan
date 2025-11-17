# Parallel Execution Prompts

Copy each prompt below into a separate Claude Code terminal. All tasks are isolated and can run simultaneously.

---

## 🔵 TERMINAL 1: Infrastructure & Organization

```
I'm working on BATCH 1 of the project-template build. My tasks are:

**TASK 1: Reorganize .claude/ Folder**
1. Create new folder structure in .claude/:
   - .claude/commands/personal/ (for custom commands)
   - .claude/config/ (for config files)

2. Move existing files:
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

3. Verify the reorganization with ls commands

**TASK 2: Create Missing Folders**
Create missing root-level folder structure:
```bash
mkdir docs
mkdir mcp-servers
mkdir scripts
mkdir components
touch components/.gitkeep
```

**TASK 11: Organize Documentation**
1. Move prompt.md to docs/:
   ```bash
   mv prompt.md docs/planning-notes.md
   ```

2. Create docs/README.md with this content:
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

3. Create docs/mcp-setup.md with MCP server setup instructions (extract from planning-notes.md lines 213-405)

4. Create docs/integration-workflow.md explaining how to use /integrate command (extract from planning-notes.md lines 88-196)

**Success Criteria:**
- .claude/ folder is organized (personal/ and config/ subfolders)
- All new folders exist (docs/, mcp-servers/, scripts/, components/)
- Documentation is organized in docs/
- Verified with ls commands

Start with TASK 1, then TASK 2, then TASK 11. Report completion when done.
```

---

## 🟢 TERMINAL 2: Templates & Scripts

```
I'm working on BATCH 1 of the project-template build. My tasks are:

**TASK 9: Create Component Templates**

Create standardized templates in templates/ folder:

**1. templates/component-spec.md**
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
\```
components/[name]/
├── [name].js
├── [name].css
├── [name].test.js
└── README.md
\```

## Integration Points
- Injection marker: `<!-- INJECT:[name] -->`
- Target file: [path]

## Test Cases
- [ ] [Test 1]
- [ ] [Test 2]
```

**2. templates/component.js**
```javascript
/**
 * Component: [ComponentName]
 * Description: [Brief description]
 * CSS Namespace: .component-[name]
 */

class ComponentName {
  constructor(options = {}) {
    this.element = options.element;
    this.config = options.config || {};
    this.init();
  }

  init() {
    // Initialization logic
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Event binding
  }

  render() {
    // Rendering logic
  }

  destroy() {
    // Cleanup
  }
}

export default ComponentName;
```

**3. templates/component.test.js**
```javascript
/**
 * Tests for [ComponentName]
 */

import ComponentName from './[component].js';

describe('ComponentName', () => {
  let component;

  beforeEach(() => {
    // Setup
    component = new ComponentName();
  });

  afterEach(() => {
    // Teardown
    component.destroy();
  });

  test('should initialize correctly', () => {
    expect(component).toBeDefined();
  });

  test('should render without errors', () => {
    expect(() => component.render()).not.toThrow();
  });

  // Add more tests as needed
});
```

**4. templates/component.css**
```css
/**
 * Styles for [ComponentName]
 * Namespace: .component-[name]
 */

.component-[name] {
  /* Container styles */
}

.component-[name]__element {
  /* BEM element styles */
}

.component-[name]__element--modifier {
  /* BEM modifier styles */
}

.component-[name]:hover {
  /* Interactive states */
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .component-[name] {
    /* Mobile adjustments */
  }
}
```

**TASK 10: Create Automation Scripts**

**1. scripts/build-components.sh**
```bash
#!/bin/bash
# Batch TDD component builder
# Usage: ./scripts/build-components.sh components.txt

COMPONENT_LIST=$1
LOG_FILE="progress.log"

if [ -z "$COMPONENT_LIST" ]; then
  echo "Usage: ./build-components.sh <component-list-file>"
  exit 1
fi

echo "Starting component build..." | tee $LOG_FILE
echo "=========================" | tee -a $LOG_FILE

while IFS= read -r component; do
  # Skip empty lines and comments
  if [[ -z "$component" || "$component" =~ ^# ]]; then
    continue
  fi

  echo "Building: $component" | tee -a $LOG_FILE

  # Create component structure
  mkdir -p "components/$component"

  # Generate from templates
  cp templates/component.js "components/$component/$component.js"
  cp templates/component.test.js "components/$component/$component.test.js"
  cp templates/component.css "components/$component/$component.css"

  # Replace placeholders
  sed -i "s/\\[ComponentName\\]/$component/g" "components/$component/$component.js"
  sed -i "s/\\[component\\]/$component/g" "components/$component/$component.test.js"
  sed -i "s/\\[name\\]/$component/g" "components/$component/$component.css"

  echo "  ✓ Structure created" | tee -a $LOG_FILE

  # Run tests if npm available
  if command -v npm &> /dev/null; then
    echo "  Running tests..." | tee -a $LOG_FILE
    npm test "components/$component/$component.test.js" 2>&1 | tee -a $LOG_FILE
  fi

  echo "---" >> $LOG_FILE
done < "$COMPONENT_LIST"

echo "=========================" | tee -a $LOG_FILE
echo "Build complete. Check progress.log for details." | tee -a $LOG_FILE
```

**2. scripts/checklist.md**
```markdown
# Pre-Game Ritual Checklist

## Project Setup
- [ ] Create project folder
- [ ] Initialize git repository: `git init`
- [ ] Create feature branch: `git checkout -b feature/[name]`

## Knowledge Base
- [ ] Create docs/ folder structure (already done in template)
- [ ] Add planning-notes.md with project overview
- [ ] Document key architectural decisions

## MCP Configuration
- [ ] Verify MCP servers configured in Claude Desktop config
- [ ] Test component-registry connection: `node mcp-servers/component-registry.js`
- [ ] Check MCP server logs for errors

## Terminal Arrangement (4 terminals recommended)
- [ ] Terminal 1: Primary development (main agent focus)
- [ ] Terminal 2: Testing & validation
- [ ] Terminal 3: Documentation & planning
- [ ] Terminal 4: Git operations & deployment

## Workflow Preparation
- [ ] Set overnight boundaries if running long sessions
- [ ] Review BMAD workflow status: `/bmad:bmm:workflows:workflow-status`
- [ ] Confirm notification system active (notify.py working)
- [ ] Review last session's next-steps.md (if exists)

## Environment Check
- [ ] All dependencies installed (node, npm, python, etc.)
- [ ] Environment variables set (if needed)
- [ ] Tests passing (if existing project): `npm test`
- [ ] Linters configured (if needed)

## Template Structure Validation
- [ ] Verify folder structure: `ls -la`
- [ ] Check .claude/config/settings.json permissions
- [ ] Confirm BMAD commands accessible: `/help`
- [ ] Validate custom commands in .claude/commands/personal/

## 🚀 GO HARD
- [ ] Clear focus on today's goal
- [ ] Ready to ship working code
- [ ] Let's build!

---

## Documentation References

### Quick Links
- **BMAD Quick Start**: `.bmad/bmm/docs/quick-start.md`
- **Integration Guide**: `docs/integration-workflow.md`
- **MCP Setup**: `docs/mcp-setup.md`
- **Template Structure**: `README-STRUCTURE.md`
- **Build Plan**: `README-BUILD-PLAN.md`

### Slash Commands Summary
- **/pm** - Product manager (create PRD)
- **/architect** - Architecture design
- **/sm** - Scrum master (epics/stories)
- **/dev** - Development implementation
- **/integrate** - Shard & inject components
- **/debug-css** - CSS/animation debugging
- **/next-steps** - End session handoff
```

After creating all files, make build-components.sh executable:
```bash
chmod +x scripts/build-components.sh
```

**Success Criteria:**
- 4 component templates created in templates/
- 2 automation scripts created in scripts/
- build-components.sh is executable
- All files have proper content and formatting

Start with TASK 9, then TASK 10. Report completion when done.
```

---

## 🟡 TERMINAL 3: Slash Commands (Integration & Session Management)

```
I'm working on BATCH 2 of the project-template build. My tasks are to create 3 slash commands:

**TASK 3: Build /integrate-mcp Command**

Create .claude/commands/personal/integrate-mcp.md:

```markdown
# /integrate-mcp - MCP Component Registry Setup

Sets up the Model Context Protocol server for safe component integration with automatic conflict detection.

## What This Does

Guides you through building and configuring the component registry MCP server that:
- Tracks all registered components
- Validates CSS namespace conflicts
- Checks dependency chains
- Provides integration safety checks before merging

## Usage

\```bash
/integrate-mcp
\```

## Workflow

### Step 1: Install Dependencies

First, let's set up the MCP server dependencies:

\```bash
cd mcp-servers
npm init -y
npm install @modelcontextprotocol/sdk
\```

### Step 2: Create Component Registry Server

I'll create the MCP server file at `mcp-servers/component-registry.js`.

(Refer to docs/planning-notes.md lines 232-390 for the complete server code)

The server provides these MCP tools:
- `register_component` - Register a component before integration
- `validate_integration` - Check if component can safely integrate
- `get_integration_plan` - Get safe merge strategy
- `list_components` - Show all registered components

### Step 3: Configure Claude Desktop

Add to your Claude Desktop config file:
- **Windows**: `%APPDATA%\\Claude\\claude_desktop_config.json`
- **Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`

\```json
{
  "mcpServers": {
    "component-registry": {
      "command": "node",
      "args": ["C:/full/path/to/mcp-servers/component-registry.js"]
    }
  }
}
\```

### Step 4: Test MCP Server

\```bash
cd mcp-servers
node component-registry.js
\```

Should start without errors. Press Ctrl+C to stop.

### Step 5: Restart Claude Desktop

Restart Claude Desktop to load the new MCP server.

### Step 6: Verify Connection

In Claude Chat (not Code), you should see the component-registry tools available.

## Troubleshooting

**Server won't start:**
- Check that @modelcontextprotocol/sdk is installed
- Verify Node.js version (need 16+)
- Check for syntax errors in component-registry.js

**Claude can't see the server:**
- Verify path in claude_desktop_config.json is absolute
- Restart Claude Desktop completely
- Check Claude Desktop logs for MCP errors

**Integration validation fails:**
- Ensure component is registered first
- Check CSS namespace format
- Verify dependencies exist

## Next Steps

After setup is complete:
1. Use `/integrate` to shard large files
2. Components will auto-register with this MCP server
3. Integration safety checks happen automatically

See `docs/mcp-setup.md` for detailed documentation.
```

**TASK 4: Build /integrate Command**

Create .claude/commands/personal/integrate.md:

```markdown
# /integrate - Component Sharding & Injection Architecture

Shards large files into modular components and creates injection architecture for manageable, conflict-free development.

## Problem This Solves

**Context Window Blowout**: When files exceed 200 lines, Claude struggles with context.
**Integration Conflicts**: Manually merging components causes CSS conflicts and broken dependencies.
**Parallel Development**: Hard to work on different parts of a large file simultaneously.

## What This Does

1. **Analyzes** your large file to find logical boundaries
2. **Shards** into small components (max 200 lines each)
3. **Registers** each component with MCP server for conflict detection
4. **Creates** injection markers in the main file
5. **Validates** integration safety before assembly

## Usage

\```bash
# Shard a large file
/integrate <file-path>

# Example
/integrate src/physiquecheck-report.html
\```

## Workflow

### Phase 1: Analyze & Plan

1. Read the target file
2. Detect logical boundaries:
   - HTML: sections, headers, major divs
   - CSS: class namespaces, media queries
   - JS: functions, classes, modules
3. Calculate complexity and lines per section
4. Create shard manifest

### Phase 2: Component Extraction

For each identified section:
1. Extract to `components/[name]/`
2. Create component files:
   - `[name].html` or `[name].js`
   - `[name].css` (if styles exist)
   - `[name].test.js` (placeholder)
3. Assign CSS namespace: `.component-[name]`
4. Track dependencies

### Phase 3: Register with MCP

For each component:
\```javascript
// Call MCP tool
register_component({
  name: "header",
  cssNamespace: ".component-header",
  filepath: "components/header/header.html",
  dependencies: []
})
\```

### Phase 4: Create Injection Architecture

Reduce main file to injection markers:

\```html
<!-- Original: 2000 lines -->
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
  <!-- INJECT:styles:CSS -->
</head>
<body>
  <!-- INJECT:header:HTML -->
  <!-- INJECT:main-content:HTML -->
  <!-- INJECT:footer:HTML -->

  <!-- INJECT:scripts:JS -->
</body>
</html>
<!-- Now: ~50 lines -->
\```

### Phase 5: Validation

Before finalizing:
1. Check all components registered
2. Validate no CSS namespace conflicts
3. Verify dependency chains
4. Test assembly (optional)

### Phase 6: Backup & Finalize

1. Save original to `references/[name]-original.html`
2. Update main file with injection markers
3. Create integration manifest at `components/manifest.json`

## Example: PhysiqueCheck Report

**Input:**
\```
src/physiquecheck-report.html (2000 lines)
\```

**Output:**
\```
src/physiquecheck-report.html (50 lines with markers)

components/
├── report-header/
│   └── header.html (150 lines)
├── bio-mechanics/
│   └── bio.html (180 lines)
├── donut-animation/
│   ├── donut.js (120 lines)
│   └── donut.css (100 lines)
├── strength-charts/
│   └── charts.html (200 lines)
└── footer/
    └── footer.html (80 lines)

references/
└── physiquecheck-report-original.html (backup)
\```

## Integration with MCP Server

If `/integrate-mcp` is set up, integration validation happens automatically:

1. Component registered → MCP tracks it
2. Before injection → MCP validates safety
3. CSS conflicts → MCP warns and suggests namespace
4. Missing dependencies → MCP identifies gaps

## Rollback

If something goes wrong:
1. Original file is in `references/`
2. Simply copy it back to restore

## Best Practices

- **Shard files >200 lines** - Keeps context manageable
- **Use semantic names** - "header", "nav", not "component1"
- **CSS namespacing** - Prevents style conflicts
- **Test components** - Build unit tests in isolation
- **Document dependencies** - Track what components need

## See Also

- `/integrate-mcp` - Set up MCP server first
- `docs/integration-workflow.md` - Detailed guide
- `README-STRUCTURE.md` - References vs Components explanation
```

**TASK 5: Build /next-steps Command**

Create .claude/commands/personal/next-steps.md:

```markdown
# /next-steps - Session Handoff Generator

Generates comprehensive session-end documentation for seamless context switching between work sessions.

## Problem This Solves

**Context Loss**: Returning to a project after hours/days, forgot where you were
**Missed Tasks**: Small bugs or features noted mentally but never tracked
**Parallel Work**: Multiple developers/sessions need to know what's ready to build
**Handoff Pain**: Switching between agents or terminals loses context

## What This Does

Automatically generates `docs/next-steps.md` with:
- Last completed task (with timestamp)
- Current blockers preventing progress
- Ready queue (parallelizable work)
- Context crumbs (files changed, commands run, etc.)
- Next session priorities

## Usage

\```bash
# At end of session
/next-steps

# With project context
/next-steps "Completed auth module, blocked on API keys"
\```

## Workflow

### Phase 1: Gather Context

1. **Git Status**: What files changed?
   \```bash
   git status
   git diff --stat
   git log -5 --oneline
   \```

2. **Todo List**: Check for active TodoWrite tasks

3. **Recent Activity**: Last few commands/operations

4. **Test Status**: Are tests passing?
   \```bash
   npm test --silent
   \```

### Phase 2: Analyze State

1. **Completed Work**: What was finished this session?
2. **Blockers**: What's preventing progress?
3. **Ready Queue**: What can be worked on in parallel?
4. **Dependencies**: What's waiting on what?

### Phase 3: Generate Document

Create `docs/next-steps.md`:

\```markdown
# Next Steps - [Project Name]
Generated: [ISO Timestamp]

## Last Completed Task
- **Task**: [Description]
- **Completed**: [Time]
- **Status**: ✅ Success / ⚠️ Partial / ❌ Blocked
- **Files Changed**: [List]

## Current Blockers
- [ ] **[Blocker 1]**: [Details and what's needed]
- [ ] **[Blocker 2]**: [Details and what's needed]

## Ready Queue (Parallelizable Work)
Tasks that can be worked on independently:
- [ ] **[Task 1]**: [Description] - Est: [time]
- [ ] **[Task 2]**: [Description] - Est: [time]
- [ ] **[Task 3]**: [Description] - Est: [time]

## Context Crumbs
### Files Modified
- [file1] - [brief description of changes]
- [file2] - [brief description of changes]

### Commands Run
- `[command1]` - [what it did]
- `[command2]` - [what it did]

### Dependencies Added
- [package1]@[version] - [purpose]
- [package2]@[version] - [purpose]

### Test Status
- Total: [X] tests
- Passing: [Y]
- Failing: [Z]
- Coverage: [%]

## Next Session Priorities
1. **[Priority 1]**: [Why it's first]
2. **[Priority 2]**: [Why it's second]
3. **[Priority 3]**: [Why it's third]

## Notes for Next Session
[Any additional context, decisions made, things to remember]

## Quick Start Next Session
\```bash
# Resume from here
git checkout [branch]
[command to get started]
\```

---
_Auto-generated by /next-steps command_
\```

### Phase 4: Offer Git Commit

"Would you like me to commit these changes with next-steps.md?"

If yes:
\```bash
git add docs/next-steps.md
git add [modified files]
git commit -m "Session end: [brief summary]

Added next-steps.md for session handoff"
\```

## Example Output

\```markdown
# Next Steps - Project Template Build
Generated: 2025-01-15T14:32:00Z

## Last Completed Task
- **Task**: Created all component templates and automation scripts
- **Completed**: 14:30
- **Status**: ✅ Success
- **Files Changed**: 6 files in templates/, 2 files in scripts/

## Current Blockers
None - ready for integration phase

## Ready Queue (Parallelizable Work)
- [ ] **Build /integrate command**: Est 20min
- [ ] **Build /checklist command**: Est 15min
- [ ] **Create MCP server**: Est 25min
- [ ] **Enhance /debug-css**: Est 20min

## Context Crumbs
### Files Modified
- templates/component-spec.md - Added component specification template
- templates/component.js - JavaScript component boilerplate
- templates/component.test.js - Test template
- templates/component.css - CSS template with BEM
- scripts/build-components.sh - Batch component builder
- scripts/checklist.md - Pre-game ritual content

### Commands Run
- `mkdir templates scripts` - Created folder structure
- `chmod +x scripts/build-components.sh` - Made script executable

### Test Status
- No tests run this session (template creation)

## Next Session Priorities
1. **Integration Commands**: Build /integrate and /integrate-mcp (highest value)
2. **Session Management**: Build /next-steps and /checklist
3. **MCP Server**: Set up component registry
4. **Validation**: Run full template validation

## Notes for Next Session
All templates follow BEM CSS methodology. Scripts use bash for portability.
Ready to build the integration commands - these are highest priority per planning-notes.md.

## Quick Start Next Session
\```bash
# Terminal setup for parallel building
# Open 4 terminals and assign tasks from README-BUILD-PLAN.md
\```
\```

## Configuration

Can be customized in `.claude/config/settings.json`:
\```json
{
  "next_steps": {
    "auto_commit": true,
    "include_git_diff": true,
    "max_recent_commands": 10
  }
}
\```

## See Also

- `/checklist` - Start session preparation
- `README-BUILD-PLAN.md` - Task breakdown for parallel work
- `docs/next-steps.md` - Generated output location
```

**Success Criteria:**
- All 3 slash command files created in .claude/commands/personal/
- Each has complete workflow documentation
- Clear usage examples
- Integration with MCP where applicable

Create TASK 3, then TASK 4, then TASK 5. Report completion when done.
```

---

## 🔴 TERMINAL 4: MCP Server & Enhanced Debug

```
I'm working on BATCH 2 of the project-template build. My tasks are:

**TASK 8: Create MCP Component Registry Server**

Create the complete MCP server for component integration safety.

**File 1: mcp-servers/package.json**
\```json
{
  "name": "component-registry-mcp",
  "version": "1.0.0",
  "description": "MCP server for safe component integration",
  "main": "component-registry.js",
  "type": "module",
  "scripts": {
    "start": "node component-registry.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0"
  },
  "keywords": ["mcp", "components", "integration"],
  "author": "",
  "license": "MIT"
}
\```

**File 2: mcp-servers/component-registry.js**

(Extract complete code from docs/planning-notes.md lines 232-390 - the full MCP server implementation with ComponentRegistry class, all tools, and server setup)

Key features to implement:
1. ComponentRegistry class with:
   - registerComponent() method
   - validateIntegration() method
   - generateIntegrationPlan() method
   - Component tracking with Map
   - CSS namespace conflict detection
   - Dependency validation

2. MCP Server setup with tools:
   - register_component
   - validate_integration
   - get_integration_plan
   - list_components (bonus)

3. Stdio transport for Claude Desktop integration

**File 3: mcp-servers/README.md**
\```markdown
# Component Registry MCP Server

Model Context Protocol server for safe component integration with automatic conflict detection.

## Features

- **Component Registration**: Track all components with metadata
- **CSS Namespace Validation**: Prevent style conflicts
- **Dependency Checking**: Ensure all dependencies exist
- **Integration Planning**: Generate safe merge strategies

## Setup

1. Install dependencies:
   \```bash
   npm install
   \```

2. Test server:
   \```bash
   node component-registry.js
   \```

3. Configure Claude Desktop:

   Edit `claude_desktop_config.json`:
   \```json
   {
     "mcpServers": {
       "component-registry": {
         "command": "node",
         "args": ["/full/path/to/mcp-servers/component-registry.js"]
       }
     }
   }
   \```

4. Restart Claude Desktop

## Usage

### Register Component
\```javascript
register_component({
  name: "header",
  cssNamespace: ".component-header",
  filepath: "components/header/header.html",
  dependencies: []
})
\```

### Validate Integration
\```javascript
validate_integration({
  componentName: "header",
  targetFile: "src/main.html"
})
\```

### Get Integration Plan
\```javascript
get_integration_plan({
  componentName: "header",
  targetFile: "src/main.html"
})
\```

## Tools Available

- `register_component` - Register before integration
- `validate_integration` - Check safety
- `get_integration_plan` - Get merge strategy

## Architecture

The server maintains an in-memory registry of:
- Component names and file paths
- CSS namespaces (for conflict detection)
- Dependency graphs
- Interface definitions

## See Also

- `/integrate-mcp` - Setup wizard
- `/integrate` - Component sharding workflow
- `docs/mcp-setup.md` - Detailed documentation
\```

**TASK 7: Enhanced /debug-css Command**

Update existing .claude/commands/personal/debug-css.md to add self-checking protocol:

Read the current file first, then enhance it with:

**New Section: Self-Checking Protocol**

Add after the current content:

\```markdown
---

## Enhanced Self-Checking Protocol

Before showing you ANY fix, I will:

### Step 1: Create Isolated Test Environment

Extract problematic code to `debug/[issue-name]-test.html`:
\```html
<!DOCTYPE html>
<html>
<head>
  <title>Debug: [Issue]</title>
  <style>
    /* Isolated CSS for this specific issue */
  </style>
</head>
<body>
  <!-- Minimal HTML to reproduce issue -->

  <script>
    // Minimal JS to reproduce issue
  </script>
</body>
</html>
\```

### Step 2: Create Reference "Known Good" State

Generate reference implementation showing expected behavior.

### Step 3: Agent Self-Check (MANDATORY)

Before showing you, I must verify:

**Visual Regression**:
- Compare rendered output to reference
- Check computed styles match expected values
- Verify no layout shifts or unexpected renders

**Animation Performance**:
- Check frame timing: Target 60fps (16.67ms per frame)
- Verify transition durations match specification
- Confirm no janky animations or stuttering

**CSS Validation**:
- No conflicting styles
- Specificity issues resolved
- Cascade works as intended

### Step 4: Provide Proof of Fix

Show you:
\```
✅ Animation now runs at 60fps (was 30fps)
✅ Transition duration: 2.0s (was choppy/variable)
✅ Visual regression: 0 differences from reference
✅ Computed styles match expected values
✅ Test file ready: debug/[issue]-test.html

Metrics:
- Frame timing: 16.2ms avg (target: 16.67ms)
- Transition smoothness: 100% (no dropped frames)
- CSS specificity: Resolved conflicts in 3 rules

Please verify once in browser: debug/[issue]-test.html
\```

### Step 5: Only Then Request Human Verification

After self-check passes, provide:
1. Test file path for manual verification
2. Specific metrics that improved
3. Side-by-side comparison (before/after)
4. What to look for when testing

## Example: Donut Animation Debug

**Symptom**: "Donut animation chunks instead of smooth rotation"

**Self-Check Process**:

1. **Create test**: `debug/donut-rotation-test.html`
   - Isolated donut SVG
   - Animation CSS only
   - No other page elements

2. **Identify issue**:
   - transition: transform 0.5s (too fast, causing chunking)
   - Missing `will-change: transform`

3. **Apply fix**:
   \```css
   .donut {
     transition: transform 2s ease-in-out;
     will-change: transform;
   }
   \```

4. **Self-check metrics**:
   - Frame rate: 60fps ✅
   - Transition duration: 2000ms ✅
   - Smoothness: No dropped frames ✅

5. **Show proof**:
   \```
   ✅ Fixed rotation smoothness
   ✅ Frame timing: 16.1ms avg (60fps)
   ✅ Transition duration: 2.0s (was 0.5s)

   Test file: debug/donut-rotation-test.html
   Look for: Smooth, continuous rotation over 2 seconds
   \```

## Metrics to Check

### Animation Performance
- **Frame Rate**: Target 60fps (16.67ms/frame)
- **Dropped Frames**: Should be 0%
- **Transition Duration**: Match specification
- **Easing Function**: Verify smooth curves

### CSS Health
- **Specificity Conflicts**: None
- **Cascade Order**: Correct
- **Computed Styles**: Match expected
- **Layout Stability**: No unexpected shifts

### Visual Validation
- **Rendering**: Matches reference
- **Positioning**: Elements in correct places
- **Colors**: Match design spec
- **Responsive**: Works at all breakpoints

## When to Use This vs /quick-fix

**Use /debug-css when**:
- Animation or visual issue
- CSS behavior is confusing
- Need isolated testing environment
- Want performance metrics

**Use /quick-fix when**:
- Simple logic bug
- Known narrow fix needed
- No visual/animation issues
- Fast iteration needed

## Directory Structure

\```
debug/
├── donut-rotation-test.html
├── header-alignment-test.html
├── mobile-nav-test.html
└── [issue-name]-test.html
\```

Keep debug folder for regression testing - don't delete working tests!
\```

**Success Criteria:**
- MCP server created with all 3 files in mcp-servers/
- Server code is complete and functional
- /debug-css enhanced with self-checking protocol
- Clear metrics and validation process documented

Create TASK 8 first (MCP server), then TASK 7 (enhance debug-css). Report completion when done.
```

---

## After All Terminals Complete

Once all 4 terminals report completion, run:

\```bash
# Verify everything is in place
ls -la .claude/commands/personal/
ls -la .claude/config/
ls -la docs/
ls -la mcp-servers/
ls -la scripts/
ls -la templates/
ls -la components/

# Test MCP server
cd mcp-servers && npm install && node component-registry.js
\```

Then proceed to BATCH 3 tasks (TASK 6, TASK 12, TASK 13, TASK 14) as outlined in README-BUILD-PLAN.md.
