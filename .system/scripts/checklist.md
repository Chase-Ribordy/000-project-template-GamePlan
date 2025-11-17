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
- [ ] **IMPORTANT**: Configure Claude Desktop with absolute path to component-registry.js
  - Location: `%APPDATA%\Claude\claude_desktop_config.json` (Windows) or `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac)
  - Run `/checklist` to get exact config to copy/paste
  - Restart Claude Desktop after updating
- [ ] Test component-registry connection: `node mcp-servers/component-registry.js`
- [ ] Verify in Claude Desktop: Ask "What MCP tools do you have?"
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
