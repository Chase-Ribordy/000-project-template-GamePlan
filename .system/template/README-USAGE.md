# Project Template - Quick Start Guide

## What This Template Is

A **production-ready project template** combining:
- **BMAD Methodology** (v6.0.0-alpha.9) - Full SDLC workflow
- **Component-Driven Architecture** - Modular development system
- **MCP Integration** - Safe component integration with conflict detection
- **Custom Integration Tools** - Slash commands for rapid development
- **Pre-Configured Everything** - Copy and start coding immediately

## ⚡ Quick Start (2 Minutes)

### 1. Copy Template to New Project
```bash
# Copy entire template
cp -r project-template my-new-project
cd my-new-project

# Optional: Initialize git
git init
git add .
git commit -m "Initial commit from template"
```

### 2. Run Validation
```bash
# Open in Claude Code
claude-code .

# Run checklist to validate setup
/checklist
```

### 3. Configure MCP (One-Time)
Follow `/integrate-mcp` command or see `docs/mcp-setup.md`

Add to Claude Desktop config:
```json
{
  "mcpServers": {
    "component-registry": {
      "command": "node",
      "args": ["/absolute/path/to/my-new-project/.system/mcp-servers/component-registry.js"]
    }
  }
}
```

Restart Claude Desktop.

### 4. Start Building
```bash
# Create PRD
/pm "Build [your idea]"

# Or jump straight to development
/dev "Implement [feature]"
```

## 📂 What's Included

### BMAD Methodology (40+ Slash Commands)
- **/pm** - Product manager (create PRD)
- **/architect** - Architecture design
- **/sm** - Scrum master (epics/stories)
- **/dev** - Development agent
- **/tea** - Test automation engineer
- **/code-review** - Review completed work
- ...and 34 more workflows

### Custom Integration Tools (7 Commands)
- **/integrate** - Shard large files into components
- **/integrate-mcp** - Setup component registry MCP server
- **/next-steps** - Session handoff generator
- **/checklist** - Environment validator
- **/debug-css** - Self-checking CSS debugger
- **/quick-fix** - Rapid narrow-scope fixes
- **/improve** - Creative problem-solving

### Component Architecture
- **.system/components/** - Modular components (50-200 lines each)
- **references/** - Complete prototypes (500-2000 lines)
- **templates/** - Component scaffolding
- **.system/mcp-servers/** - Integration safety & conflict detection

### Pre-Installed
- ✅ MCP server dependencies (npm install already run)
- ✅ All slash commands loaded
- ✅ Notification system configured
- ✅ Permissions optimized
- ✅ Documentation complete

## 🎯 Recommended Workflow

### Starting a New Project

1. **Copy template** (see Quick Start above)
2. **Run /checklist** - Validate environment
3. **Plan**: `/pm` or `/architect` or jump to development
4. **Build**: Use `/dev` for implementation
5. **Integrate**: Use `/integrate` for component assembly
6. **Debug**: Use `/debug-css` for tricky UI issues
7. **End Session**: Run `/next-steps` for handoff

### Component-Driven Development

**Scenario 1: Build in Claude Chat → Integrate**
1. Build complete feature in Claude Chat
2. Save to `references/`
3. Run `/integrate [file]` to shard into components
4. Components auto-registered with MCP
5. Integration happens with safety checks

**Scenario 2: Component-First Development**
1. Build small components in `.system/components/`
2. Test in isolation
3. Register with MCP
4. Inject into main file with `<!-- INJECT:name -->`

## 📁 Folder Structure

```
project/
├── .bmad/              # BMAD methodology (don't modify)
├── .claude/
│   ├── commands/       # All slash commands
│   │   ├── bmad/      # 37 BMAD commands
│   │   └── personal/  # 7 custom commands
│   └── config/        # Settings & permissions
├── .system/           # Agent infrastructure (don't touch)
│   ├── components/    # Modular components (sharded files)
│   ├── contracts/     # Component contracts
│   ├── mcp-servers/   # Component registry (pre-installed)
│   │   ├── component-registry.js
│   │   ├── package.json
│   │   └── node_modules/  # Dependencies already installed
│   ├── proven/        # Validated components
│   ├── sandbox/       # Testing environment
│   ├── template/      # Template documentation
│   └── validation/    # Quality gates
├── docs/              # Project documentation
│   ├── README.md
│   ├── planning-notes.md
│   ├── mcp-setup.md
│   ├── integration-workflow.md
│   └── next-steps.md (auto-generated)
├── scripts/           # Automation
│   ├── build-components.sh
│   └── checklist.md
├── references/        # Complete prototypes
├── templates/         # Component scaffolding
├── output/           # AI test workspace
└── tests/            # Test suite
```

## 🔧 Common Tasks

### Shard a Large File
```bash
/integrate src/large-file.html
```

### Generate Session Summary
```bash
/next-steps
```

### Validate Environment
```bash
/checklist
```

### Debug CSS/Animation Issue
```bash
/debug-css "Describe the visual issue"
```

### Create Component from Template
```bash
# Manual
cp templates/component.js .system/components/my-component/my-component.js

# Batch (multiple components)
echo "header\nfooter\nnav" > components.txt
./scripts/build-components.sh components.txt
```

## 🎓 Key Concepts

### References vs Components

**References** (Large, Complete):
- Built in Claude Chat
- 500-2000 lines
- Complete features
- Reusable across projects
- Example: Full auth system

**Components** (Small, Modular):
- Built here or sharded
- 50-200 lines
- Part of larger whole
- Project-specific
- Example: Header, navigation

### Integration Workflow

1. Large file → `/integrate` → Components
2. Components → Register with MCP → Safety checks
3. Main file → Injection markers → Assembly
4. Validation → No conflicts → Ship

## 📚 Documentation

- **Quick Start**: This file
- **Structure**: `README-STRUCTURE.md` - Folder explanations
- **Build Plan**: `README-BUILD-PLAN.md` - How template was built
- **MCP Setup**: `docs/mcp-setup.md` - MCP configuration
- **Integration**: `docs/integration-workflow.md` - Component workflow
- **BMAD Docs**: `.bmad/bmm/docs/` - Methodology guides

## 🚀 Advanced Features

### Parallel Development
Open 4 terminals:
- Terminal 1: Main feature (/dev)
- Terminal 2: Component building
- Terminal 3: Testing (/tea)
- Terminal 4: Documentation

### Batch Component Generation
```bash
./scripts/build-components.sh components.txt
```

### Automated Safety Checks
MCP server prevents:
- CSS namespace conflicts
- Missing dependencies
- Breaking integrations

## ⚠️ Important Notes

### MCP Server is Optional
The template works without MCP server, but you lose:
- Automatic CSS conflict detection
- Dependency validation
- Integration safety checks

### Notification System
Template includes automatic sound notifications when:
- Agent needs input
- Permission required

Configure in `.claude/config/settings.json`

### Customization
Feel free to:
- Add your own slash commands to `.claude/commands/personal/`
- Modify templates in `templates/`
- Adjust permissions in `.claude/config/settings.json`
- Add project-specific docs to `docs/`

Do NOT modify:
- `.bmad/` folder (BMAD methodology core)
- `.claude/commands/bmad/` (BMAD command wrappers)

## 🆘 Troubleshooting

### /checklist shows errors
Run the suggested fix commands from the output

### MCP server won't start
```bash
cd .system/mcp-servers
npm install
node component-registry.js  # Should start without errors
```

### Slash commands not loading
Restart Claude Code or run `/help` to refresh

### Notifications not working
Check `notify.py` exists and Python is installed

## 📞 Support

- Template issues: See `README-BUILD-PLAN.md` for architecture
- BMAD questions: `.bmad/bmm/docs/faq.md`
- Claude Code: https://github.com/anthropics/claude-code/issues

## ✨ What Makes This Template Special

1. **Pre-Configured** - Everything installed and ready
2. **Validated** - /checklist ensures consistency
3. **Modular** - Component-driven architecture
4. **Safe** - MCP prevents integration conflicts
5. **Complete** - BMAD methodology + custom tools
6. **Fast** - Copy and start coding in 2 minutes

---

**Ready to build? Copy this template and run /checklist to get started!**
