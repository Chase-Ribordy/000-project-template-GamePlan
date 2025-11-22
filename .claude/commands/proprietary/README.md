# Proprietary Slash Commands

Your custom workflows for Claude Code (web + CLI). These wrap BMAD agents with your own processes.

## How to Use

From Claude Code (web or CLI):
```
/proprietary:refine-idea     # Quick idea refinement
/proprietary:make-prd        # Create PRD using PM agent
/proprietary:full-plan       # End-to-end planning session
```

## Creating New Commands

### Basic Structure

```markdown
---
description: 'What this command does (shows in Claude UI)'
---

Your prompt/instructions here...
```

### Chaining BMAD Agents

To use a BMAD agent in your workflow:

```markdown
---
description: 'My custom workflow using PM agent'
---

## Step 1: Load the PM Agent
Load the PM agent persona from @.bmad/bmm/agents/pm.md

## Step 2: My Custom Instructions
[Your specific workflow steps here]
```

### Referencing Workflows

```markdown
---
description: 'My workflow using BMAD PRD workflow'
---

Execute the PRD workflow from @.bmad/bmm/workflows/2-plan-workflows/prd/workflow.yaml
but with these modifications:
[Your custom modifications]
```

## Tips for Mobile Use

1. **Keep descriptions short** - Shows nicely on phone
2. **Make workflows conversational** - Good for voice input on mobile
3. **Start with questions** - Agents will prompt you for input
4. **Use step-by-step flows** - Easier to follow on small screens

## Available BMAD Agents to Wrap

| Agent | File | Best For |
|-------|------|----------|
| PM | `.bmad/bmm/agents/pm.md` | PRDs, requirements, product vision |
| Analyst | `.bmad/bmm/agents/analyst.md` | Research, domain analysis |
| Architect | `.bmad/bmm/agents/architect.md` | System design, tech decisions |
| UX Designer | `.bmad/bmm/agents/ux-designer.md` | User flows, interface design |
| Dev | `.bmad/bmm/agents/dev.md` | Implementation, coding |

## Available BMAD Workflows

| Workflow | Best For |
|----------|----------|
| `brainstorm-project` | Initial ideation |
| `product-brief` | Quick product vision |
| `prd` | Full requirements doc |
| `architecture` | System design |
| `create-epics-and-stories` | Sprint planning |

---

**See examples**: Look at the other files in this folder for patterns you can copy.
