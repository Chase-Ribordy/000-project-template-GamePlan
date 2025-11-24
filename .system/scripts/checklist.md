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
- [ ] Configure Claude Desktop/Code with Playwright MCP server
- [ ] Test Playwright connection: Ask "What MCP tools do you have?"
- [ ] Check MCP server logs for errors

## Workflow Preparation
- [ ] Set overnight boundaries if running long sessions
- [ ] Review execution status: `.system/execution-status.yaml`
- [ ] Review last session's next-steps.md (if exists)

## Environment Check
- [ ] All dependencies installed (node, npm, python, etc.)
- [ ] Environment variables set (if needed)
- [ ] Tests passing (if existing project): `npm test`
- [ ] Linters configured (if needed)

## Template Structure Validation
- [ ] Verify folder structure: `ls -la`
- [ ] Check .claude/config/settings.json permissions
- [ ] Validate custom commands in .claude/commands/

## GO HARD
- [ ] Clear focus on today's goal
- [ ] Ready to ship working code
- [ ] Let's build!

---

## Documentation References

### Quick Links
- **Operator Guide**: `README.md`
- **Agents**: `.system/agents/`
- **Commands**: `.claude/commands/`

### Slash Commands Summary
- **/refine** - Idea pipeline (discovery → planning)
- **/orc-exe** - Execution pipeline (three-pass build)
- **/resume** - Pick up where you left off
- **/handoff** - Save and push state
- **/push-to-github** - Quick checkpoint save
