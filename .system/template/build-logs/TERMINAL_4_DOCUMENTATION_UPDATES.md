# TERMINAL 4: Documentation Updates

## Objective
Update documentation to reflect new structure (phase-organized commands, skills, enhanced workflow) and clarify component lifecycle.

## Background
After reorganizing commands, creating skills, and enhancing checklist, documentation needs updates to match new structure and clarify workflows.

## Scope
- Move COMPONENTS_USAGE_ANALYSIS.md to .system/template/
- Update components/README.md with lifecycle clarity
- Update main README.md with workflow diagram
- Create docs/execution-workflow.md for three-pass strategy
- Create .system/scripts/ folder and README
- Update AGENT-INFRASTRUCTURE.md to reference skills

## Tasks

### 1. Move COMPONENTS_USAGE_ANALYSIS.md

```bash
mv COMPONENTS_USAGE_ANALYSIS.md .system/template/COMPONENTS_USAGE_ANALYSIS.md
```

This archives the analysis with other template documentation.

### 2. Create Missing .system/scripts/ Folder

```bash
mkdir -p .system/scripts
```

Create `.system/scripts/README.md`:

```markdown
# Build Automation Scripts

Automation scripts for component building and project setup.

## Purpose

This folder contains build automation and setup scripts that:
- Batch build multiple components
- Automate repetitive tasks
- Provide setup wizards
- Generate boilerplate

## Scripts

### checklist.md (Referenced by /checklist)
Pre-game ritual checklist for starting development sessions.

**Contents**:
- Daily standup questions
- Environment validation reminders
- Focus setting prompts
- Session goal definition

**Usage**: Loaded automatically by `/checklist` command during Phase 6

### build-components.sh (Future)
Batch component builder from component list file.

**Usage**:
```bash
./scripts/build-components.sh components.txt
```

**Input**: Text file with component names (one per line)
**Output**: Generated component folders with boilerplate

### Future Scripts
- `setup-project.sh` - Automated project initialization
- `validate-all.sh` - Batch validation of all components
- `deploy-components.sh` - Deploy proven components
- `cleanup-workspace.sh` - Clean up temp files and artifacts

## Philosophy

**Automate the boring stuff** - Let scripts handle repetition so operators focus on creative work.

Scripts should:
- Be idempotent (safe to run multiple times)
- Report progress clearly
- Handle errors gracefully
- Validate inputs before processing

## Notes
- Scripts are called by agents or operators
- Part of agent infrastructure (`.system/`)
- Operators don't edit scripts directly (use as tools)
```

### 3. Update components/README.md

Read current `components/README.md`, then enhance with lifecycle section:

```bash
Read components/README.md
```

**Add section** (after current content):

```markdown

---

## Component Lifecycle (Work in Progress → Proven)

Components in this folder are **work in progress**. They move through quality gates before integration:

### Lifecycle Flow

```
1. Define Contract (.system/contracts/)
   ↓ Specification created (what component should do)

2. Implement (components/)
   ↓ YOU write code here: .js, .css, tests
   ↓ Iterate until tests pass

3. Validate (.system/validation/)
   ↓ Auto-validated via validate-component skill
   ↓ 4 levels: Syntax → Tests → Contract → Integration

4. Sandbox Test (.system/sandbox/)
   ↓ Auto-created via prove-it-works skill
   ↓ YOU verify in browser

5. Mark as Proven (.system/proven/)
   ↓ Moved automatically after you confirm
   ↓ Production-ready archive

6. Integrate
   ✓ Safe to merge into main files
```

### components/ vs .system/proven/

| Aspect | components/ (here) | .system/proven/ |
|--------|-------------------|-----------------|
| **Status** | Work in progress | Fully validated |
| **Quality** | Mixed (some ready, some not) | 100% passing all gates |
| **Editing** | YOU edit here daily | Read-only reference |
| **Tests** | May be failing | All passing required |
| **Purpose** | Active development workspace | Production-ready archive |
| **Created By** | You write code | Moved by agents after validation |

### Your Workflow as Operator

1. **Agent creates contract** (via define-contract skill)
2. **You implement** in `components/[name]/`:
   - Write `[name].js` (implementation)
   - Write `[name].css` (styles)
   - Fill in `[name].test.js` (tests based on contract)
3. **Agent validates** (via validate-component skill)
   - You see validation report
   - Fix any issues
4. **Agent creates sandbox** (via prove-it-works skill)
5. **You verify** in browser:
   - Open `.system/sandbox/[name]/[name]-test.html`
   - Check visual rendering
   - Test behavior
   - Confirm no errors
6. **Agent marks proven** (moves to `.system/proven/`)
7. **Agent integrates** (safely merges into project)

### Key Principle

**You write code in components/** - This is YOUR workspace
**Agents handle quality gates** - Validation, sandbox, proven status
**You verify functionality** - Browser testing, visual checks

This folder is operator-facing (you edit code here), NOT agent infrastructure.

---
```

### 4. Update Main README.md

Read current `README.md`, then add workflow diagram:

```bash
Read README.md
```

**Add section** (after "How It Works" section, before "Example Component"):

```markdown

## Development Workflow

### Phase 0: Setup & Validation

**Goal**: Environment ready for development

1. Run `/checklist` - Validates environment, guides setup
   - Creates missing folders
   - Installs MCP dependencies
   - Initializes git
   - Creates settings.local.json
2. Restart Claude Desktop (load MCP server)

**Time**: 5-10 minutes (first project only)

---

### Phase 1: Planning (BMAD-Driven)

**Goal**: Requirements, architecture, backlog

**BMAD Workflows** (located in `.claude/commands/bmad/`):
1. `/brainstorm-project` or `/product-brief` - Define vision
2. `/prd` - Product Requirements Document
3. `/architecture` - System design
4. `/create-epics-and-stories` - Sprint backlog

**Output**:
- `docs/prd.md` - Requirements
- `docs/architecture.md` - Design
- `.bmad/bmm/epics/` - Epic files
- `.bmad/bmm/stories/` - Story files

**Time**: 2-4 hours (depends on project scope)

---

### Phase 2: Execution (Quality-First, Component-Driven)

**Goal**: Build with contracts, validate, integrate

**Workflow** (per component):

```
1. Agent defines contract → .system/contracts/[name]-contract.md
2. You implement → components/[name]/ (.js, .css, tests)
3. Agent validates → validate-component skill (4 levels)
4. Agent creates sandbox → prove-it-works skill
5. You verify in browser → .system/sandbox/[name]/[name]-test.html
6. Agent marks proven → .system/proven/[name]/
7. Agent integrates → Safe merge into project
```

**Personal Commands** (located in `.claude/commands/personal/phase-2-execution/`):
- `/integrate` - Shard large prototype files into components
- `/debug-css` - Systematic CSS debugging
- `/quick-fix` - Rapid bug fixes (narrow scope)
- `/improve` - Creative problem-solving

**Quality Gates** (auto-run by agents via skills):
- ✅ Syntax valid
- ✅ Unit tests pass
- ✅ Contract compliant
- ✅ Integration safe

**Time**: Varies (depends on component complexity)

---

### Phase 3: Wrap-Up (Document & Reflect)

**Goal**: Final polish, documentation, handoff

1. Final bug fixes (`/quick-fix`, `/improve`)
2. Session handoff (`/next-steps`) - Documents progress for next session
3. Sprint retrospective (`/retrospective`) - Reflect and improve
4. Git commit and push

**Time**: 30 minutes - 1 hour

---

### Three-Pass Execution Strategy

For complex projects, use three-pass approach:

**Pass 1: Backend-First (Skeleton)**
- Build backend API/logic
- Minimal frontend (basic HTML structure)
- Minimal CSS (functional layout only)
- **Goal**: Functionality working, not pretty

**Pass 2: Component Integration (Aesthetic)**
- Build components with contracts
- Integrate Claude Chat prototypes
- Add full styling and UX polish
- **Goal**: Beautiful, user-friendly interface

**Pass 3: Debug & Polish (Production-Ready)**
- Fix integration bugs
- Performance optimization
- Final visual polish
- Documentation updates
- **Goal**: Production-ready code

See `docs/execution-workflow.md` for detailed three-pass guide.

---
```

### 5. Create docs/execution-workflow.md

Create new file with three-pass strategy:

```markdown
# Three-Pass Execution Workflow

A systematic approach to building complex features with quality-first, component-driven development.

## Overview

The three-pass strategy separates backend functionality, component integration, and final polish into distinct phases. This prevents:
- Frontend/backend conflicts (build backend first)
- Premature optimization (get functionality working first)
- Integration nightmares (components tested in isolation)

## Pass 1: Backend-First (Skeleton)

### Goal
Get functionality working with minimal frontend. Focus on:
- Backend API/logic
- Data models
- Business rules
- Basic user flow

### Acceptance Criteria
- All backend endpoints work
- Data flows correctly
- User can complete core actions
- Minimal CSS (functional layout only)
- Basic HTML structure (divs and forms, no styling)

### Example: E-commerce Checkout
**Pass 1 builds**:
- ✅ Cart API (add/remove items)
- ✅ Checkout endpoint (process payment)
- ✅ Order confirmation
- ✅ Basic HTML form (input fields, submit button)
- ✅ Minimal CSS (form readable, buttons clickable)

**Pass 1 skips**:
- ❌ Beautiful product cards
- ❌ Animated transitions
- ❌ Responsive design
- ❌ Brand styling

### Commands for Pass 1
- `/dev-story` (BMAD) - Build backend features
- `/quick-fix` - Fix backend bugs
- Manual testing - Verify functionality

---

## Pass 2: Component Integration (Aesthetic)

### Goal
Build beautiful, modular frontend with contract-driven components. Focus on:
- Component architecture
- Visual design
- User experience
- Integration with skeleton

### Workflow (Per Component)
1. Define contract (agent skill)
2. Implement component in `components/`
3. Validate (agent skill - 4 levels)
4. Sandbox test (agent skill + your browser verification)
5. Mark as proven (agent after your confirmation)
6. Integrate into skeleton

### Acceptance Criteria
- All components proven (passed validation + sandbox)
- Visual design matches mockups
- Responsive on all screen sizes
- Smooth animations and transitions
- Professional, polished appearance

### Example: E-commerce Checkout
**Pass 2 builds**:
- ✅ ProductCard component (image, price, add-to-cart)
- ✅ CartSummary component (item list, totals)
- ✅ CheckoutForm component (payment fields, validation)
- ✅ ConfirmationModal component (order success message)
- ✅ Full responsive CSS
- ✅ Brand styling (colors, fonts, spacing)

**Pass 2 enhances**:
- Replace basic form → Beautiful CheckoutForm component
- Replace text list → Animated CartSummary component
- Add loading states, error messages, success animations

### Commands for Pass 2
- `/integrate` - Shard prototypes into components
- `/debug-css` - Fix styling issues
- `/improve` - Enhance UX and visuals
- Agent skills - Auto-validate and test

---

## Pass 3: Debug & Polish (Production-Ready)

### Goal
Fix all integration bugs, optimize performance, finalize for production. Focus on:
- Bug fixes (especially integration issues)
- Performance optimization
- Cross-browser testing
- Documentation
- Final visual polish

### Activities
1. Integration testing (all components together)
2. Fix conflicts (CSS, JavaScript, DOM)
3. Performance audit (lazy loading, code splitting)
4. Accessibility check (ARIA, keyboard nav)
5. Cross-browser testing
6. Documentation updates
7. Final code review

### Acceptance Criteria
- Zero console errors
- All features working together
- Performance meets targets (Lighthouse scores)
- Accessible (WCAG AA)
- Works in all target browsers
- Documented (README, code comments)

### Example: E-commerce Checkout
**Pass 3 fixes**:
- ✅ CartSummary updates when ProductCard clicked
- ✅ CheckoutForm validation works with backend
- ✅ ConfirmationModal shows correct order details
- ✅ Lazy load product images (performance)
- ✅ Add ARIA labels for screen readers
- ✅ Test in Chrome, Firefox, Safari, Edge
- ✅ Document checkout flow in README

### Commands for Pass 3
- `/quick-fix` - Fix specific bugs
- `/debug-css` - Resolve styling conflicts
- `/improve` - Optimize performance
- `/code-review` (BMAD) - Final review
- `/next-steps` - Document for next session

---

## Why Three Passes?

### Benefits

**1. Faster Iteration**
- Pass 1: Quick functionality proof (1-2 days)
- Pass 2: Component building (3-5 days)
- Pass 3: Polish (1-2 days)
- vs. Building everything perfect first time (10-15 days)

**2. Better Quality**
- Components tested in isolation (sandbox)
- Integration bugs caught in Pass 3
- Contract-driven prevents conflicts

**3. Reduced Risk**
- Backend proven before frontend investment
- Components validated before integration
- Incremental complexity (not all at once)

**4. Clearer Handoffs**
- Pass 1 → Backend developer
- Pass 2 → Frontend/UX developer
- Pass 3 → QA/polish specialist
- (Can be same person, but clear mental shifts)

### When to Skip Passes

**Small projects** (1-3 components):
- Combine Pass 1+2 (build backend + frontend together)
- Pass 3 still useful (final polish)

**Backend-only projects**:
- Pass 1 only (no frontend)

**Frontend-only projects** (existing API):
- Skip Pass 1 (backend exists)
- Pass 2 + Pass 3 (components + polish)

---

## Integration with Quality Workflow

The three passes align with quality gates:

**Pass 1**: Focus on backend contracts
- Define API contracts
- Validate with integration tests

**Pass 2**: Focus on component contracts
- Define component contracts (define-contract skill)
- Validate components (validate-component skill)
- Prove in sandbox (prove-it-works skill)
- Mark as proven

**Pass 3**: Focus on system integration
- All components → proven
- Integration testing (all together)
- Final validation

---

## Example Timeline

**Week 1: Pass 1 (Backend)**
- Day 1-2: Define architecture, create contracts
- Day 3-4: Build backend API
- Day 5: Basic frontend skeleton

**Week 2: Pass 2 (Components)**
- Day 1: Shard prototypes into components (/integrate)
- Day 2-4: Build and validate components (contract-driven)
- Day 5: Integrate components into skeleton

**Week 3: Pass 3 (Polish)**
- Day 1-2: Integration testing and bug fixes
- Day 3: Performance optimization
- Day 4: Cross-browser testing
- Day 5: Documentation and final review

**Total**: 15 days (3 weeks) for complex feature

---

## Summary

**Pass 1**: Get it working (backend-first)
**Pass 2**: Make it beautiful (component-driven)
**Pass 3**: Make it perfect (polish and optimize)

This systematic approach prevents integration nightmares and ensures quality at every stage.
```

### 6. Update AGENT-INFRASTRUCTURE.md

Read current `AGENT-INFRASTRUCTURE.md`, then add skills section:

```bash
Read AGENT-INFRASTRUCTURE.md
```

**Add section** (after "Agent Instructions", before "---"):

```markdown

## Claude Skills

Agents have access to quality-first skills that auto-run during development:

**Skills** (located in `.claude/skills/`):
- `define-contract` - Auto-create component contracts before implementation
- `validate-component` - Auto-run 4-level validation on components
- `prove-it-works` - Auto-create sandbox tests for isolation

**Skill vs Command**:
- **Skills**: Agent-callable, auto-triggered, autonomous quality gates
- **Commands**: Operator-invoked, interactive, manual workflows

Agents should use skills automatically when appropriate (component creation, validation, testing). This reduces operator coordination burden.

```

## Success Criteria
- [ ] COMPONENTS_USAGE_ANALYSIS.md moved to .system/template/
- [ ] .system/scripts/ folder created with README.md
- [ ] components/README.md updated with lifecycle clarity
- [ ] Main README.md updated with workflow diagram
- [ ] docs/execution-workflow.md created with three-pass strategy
- [ ] AGENT-INFRASTRUCTURE.md updated with skills section
- [ ] All documentation internally consistent

## Verification

Check documentation consistency:
```bash
# Verify COMPONENTS_USAGE_ANALYSIS.md moved
ls .system/template/COMPONENTS_USAGE_ANALYSIS.md

# Verify new files created
ls .system/scripts/README.md
ls docs/execution-workflow.md

# Verify updates made
grep -i "lifecycle" components/README.md
grep -i "Phase 0" README.md
grep -i "skills" AGENT-INFRASTRUCTURE.md
```

## Notes
- Keep documentation concise and scannable
- Use diagrams and examples where helpful
- Maintain consistent terminology (components vs proven, skills vs commands)
- Link related documents (e.g., README → execution-workflow.md)
