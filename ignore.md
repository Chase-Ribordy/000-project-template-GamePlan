# Files to Remove When Converting to Clean Template

This document lists all temporary build files, diagnostic files, and planning artifacts that should be removed when converting this project into a clean template for distribution.

## Build Logs (17 files)

All files in `.system/template/build-logs/`:

- `BATCH_1_2_COMPLETE.md`
- `CLAUDE_CHAT_REVIEW_ADDRESSED.md`
- `CLEANUP_TERMINAL_1.md`
- `CLEANUP_TERMINAL_2.md`
- `CLEANUP_TERMINAL_3.md`
- `MCP_SERVER_ENHANCED.js`
- `PARALLEL_EXECUTION_MASTER.md`
- `PARALLEL_PROMPTS.md`
- `PARALLEL_PROMPTS_BATCH3.md`
- `PARALLEL_PROMPTS_QUALITY.md`
- `README.md`
- `reorganization/` (directory with contents)
- `SIMPLE_START.md`
- `TERMINAL_1_REORGANIZE_COMMANDS.md`
- `TERMINAL_2_CREATE_SKILLS.md`
- `TERMINAL_3_ENHANCE_CHECKLIST.md`
- `TERMINAL_4_DOCUMENTATION_UPDATES.md`

## MCP Server Diagnostics

- `.system/mcp-servers/DIAGNOSTIC.md`
- `.system/mcp-servers/SUCCESS.md`

## Planning and Validation Files

- `.system/template/planning-notes.md`
- `.system/template/README-VALIDATION.md`

## Runtime Files Pattern

Remove all runtime files matching these patterns in `.system/`:

- `*.json` (except configuration files needed for template)
- `*.log`
- Any execution status files
- Event logs

Specific files to check:
- `.system/execution-status.yaml` (if present)
- `.system/events/event-log.yaml` (if present)
- Any `*.log` files in `.system/` subdirectories

## Clean Template Checklist

Before distribution, ensure:

1. [ ] All 17 build-log files removed
2. [ ] MCP diagnostic files removed (DIAGNOSTIC.md, SUCCESS.md)
3. [ ] Planning artifacts removed (planning-notes.md, README-VALIDATION.md)
4. [ ] Runtime files cleaned (*.json, *.log in .system/)
5. [ ] Execution status files removed
6. [ ] Event logs cleared
7. [ ] Example components remain intact (keep for reference)
8. [ ] Documentation files remain (README-QUICKSTART.md, etc.)
9. [ ] Template structure preserved (.system/boilerplate/, etc.)
10. [ ] Slash commands working (/checklist, /integrate, etc.)

## Files to Keep

These should remain in the template:

- `.system/template/README-QUICKSTART.md`
- `.system/template/mcp-setup.md`
- `.system/template/README-STRUCTURE.md`
- `.system/template/integration-workflow.md`
- `.system/README.md` (main infrastructure documentation)
- `.system/README-AUTONOMOUS.md`
- `.system/components/example-button/` (full example)
- All boilerplate templates
- All validation scripts
- MCP server core files (component-registry.js)
- Slash command definitions (.bmad/, .claude/)

## Automation Command (Future)

Consider creating a cleanup script:

```bash
# Remove build logs
rm -rf .system/template/build-logs/

# Remove diagnostics
rm -f .system/mcp-servers/DIAGNOSTIC.md
rm -f .system/mcp-servers/SUCCESS.md

# Remove planning artifacts
rm -f .system/template/planning-notes.md
rm -f .system/template/README-VALIDATION.md

# Remove runtime files
find .system -name "*.log" -type f -delete
find .system -name "execution-status.yaml" -type f -delete
find .system -name "event-log.yaml" -type f -delete

# Verify template integrity
/checklist
```

---

**Note**: This file itself (ignore.md) should also be removed from the final clean template.
