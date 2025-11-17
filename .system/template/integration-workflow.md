# Component Integration Workflow

## Overview
This guide explains the `/integrate` workflow for managing component integration through sharding and injection architecture.

## The Problem
- Large files (2000+ lines) cause context window blowout
- Integration often breaks existing code with CSS conflicts
- Debugging single components is difficult when everything is in one file
- Manual integration is error-prone and time-consuming

## The Solution: Sharding & Injection System

### 1. Build `/integrate` - The Sharding & Injection System

**Why This Matters Most:**
- Directly solves your biggest bottleneck: "this step has the BIGGEST room for improvement"
- Prevents context window blowout (your 2000+ line HTML generator problem)
- Makes complex components manageable without losing quality

**Concrete Implementation Plan:**
```markdown
/integrate [component-file] [target-file]

Step 1: Analyze & Split
- Detect file size/complexity
- Auto-identify logical boundaries (functions, sections, components)
- Create manifest of parts

Step 2: Create Injection Architecture
- Generate placeholder tokens: <!-- INJECT:header --> <!-- INJECT:donut-animation -->
- Each piece gets own file: /.system/components/header.html, /.system/components/donut.js
- Maximum 200 lines per shard

Step 3: Build Integration Pipeline
- Load target file with placeholders
- Inject components in sequence
- Validate each injection
- Output combined file

Example Structure:
/src/main.html (50 lines with placeholders)
/.system/components/
  - header.html (150 lines)
  - bio-mechanics.html (180 lines)
  - animations/donut.js (120 lines)
  - styles/donut.css (100 lines)
```

**Immediate Value:**
- Can handle your PhysiqueCheck HTML generator TODAY
- Prevents future projects from hitting context limits
- Makes debugging single components possible without breaking others

### 2. Build `/debug-css` - The Self-Checking Debug Workflow

**Why This Matters:**
- Eliminates repetitive manual testing cycles
- Forces agents to verify fixes before showing you
- Targets the painful "last 20%" debugging phase

**Concrete Implementation Plan:**
```markdown
/debug-css [symptom] [file] [line-range]

Step 1: Isolated Test Environment
- Extract problematic code to sandbox.html
- Include only relevant CSS/JS
- Create "known good" reference state

Step 2: Agent Self-Check Protocol
BEFORE showing you anything, agent must:
- Run visual regression test
- Check computed styles match expected
- Verify animation frame timing
- Compare against reference implementation

Step 3: Proof of Fix
- Side-by-side comparison (before/after)
- Specific metrics that changed
- Screenshot or recording of working animation
- ONLY THEN request human verification

Example:
/debug-css "donut animation chunks instead of smooth" /src/report.html 1200-1400
→ Agent creates /debug/donut-test.html
→ Runs animation performance check
→ Shows: "Animation now runs at 60fps, transition duration fixed at 2s"
→ Provides test file you can verify once
```

**Immediate Value:**
- Stops the "try this... nope... try this..." cycle
- Each debug attempt is higher quality
- Reduces your manual testing burden by 80%

## What NOT to Build Yet

You're correct to avoid:
- More planning commands (current BMAD is sufficient)
- Parallel optimization (get quality first, speed second)
- Scrum Master tweaks (use as-is until you identify specific failures)
- Abstract "workflow improvements" without clear ROI

## Next Steps Priority Order

1. **Today:** Implement `/integrate` for your PhysiqueCheck HTML generator problem
2. **Tomorrow:** Implement `/debug-css` with the donut animation as test case
3. **Only After Success:** Consider parallel module development

These two commands directly address your most painful, time-consuming problems. They're concrete, buildable today, and will immediately improve your next project. Everything else is optimization that can wait until these foundations are solid.

Start with `/integrate` - it's your biggest bottleneck and clearest win.

## Integration Best Practices

1. **Use CSS Namespaces**: Every component should have a unique CSS namespace (e.g., `.auth-module`, `.header-component`)
2. **Register Components**: Use the component-registry MCP server to track components before integration
3. **Validate Before Integration**: Always check for conflicts using `validate_integration` tool
4. **Keep Components Small**: Maximum 200 lines per component file
5. **Use Injection Markers**: Standardize on `<!-- INJECT:component-name:TYPE -->` format
6. **Test in Isolation**: Each component should work standalone before integration

## Workflow Example

```bash
# 1. Build component in Claude chat (references folder)
# Create /references/auth-module.html with CSS namespace .auth-module

# 2. Register component
/dev "Register auth-module with component-registry MCP"

# 3. Integrate into main file
/integrate "Integrate auth-module from /references/ into /src/main.html"

# 4. If issues occur, use debug workflow
/debug-css "login button not responding" /src/main.html 450-500

# 5. Verify integration
# Open /src/main.html and test manually
```

## See Also
- [MCP Setup Guide](mcp-setup.md) - Setting up the component registry
- [Planning Notes](planning-notes.md) - Original workflow concepts and ideas
