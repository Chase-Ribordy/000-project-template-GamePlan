# Agent Quick Reference

Quick reference for all agents in the system, their purposes, and how to invoke them.

## Agent Hierarchy

```
STRATEGIC LAYER
├── orc-exe (Supreme Orchestrator)
│
PLANNING LAYER
├── pm (Product Manager)
├── architect (System Architect)
│
SPRINT SETUP LAYER
├── sm (Scrum Master)
│
EXECUTION LAYER
├── dev-base (Developer Template)
├── dev-first-pass (Skeleton Builder)
├── dev-second-pass (Component Builder)
└── dev-third-pass (Bug Fix Specialist)
```

## Agent Summary

| Agent | Name | Purpose | Pass |
|-------|------|---------|------|
| **orc-exe** | ORC-EXE | Supreme coordinator, spawns sub-agents via Task() | All |
| **pm** | John | Product requirements, PRD creation | Planning |
| **architect** | Winston | Technical design, architecture decisions | Planning |
| **sm** | Bob | Story creation, sprint setup | Sprint Setup |
| **dev-base** | Amelia (Base) | Developer template for story implementation | Execution |
| **dev-first-pass** | Amelia (1st) | Functional skeleton builder | First Pass |
| **dev-second-pass** | Amelia (2nd) | UI polish and component building | Second Pass |
| **dev-third-pass** | Amelia (3rd) | Bug fixes and production hardening | Third Pass |

---

## Orchestration Layer

### ORC-EXE (Supreme Orchestrator)

**File:** `.system/agents/orc-exe.md`

**Purpose:** Top-level sprint coordination. Unlike terminal-prompt orchestrators, ORC-EXE spawns sub-agents programmatically via Task() calls.

**Key Responsibilities:**
- Load and validate PRD and architecture
- Coordinate three-pass development system
- Spawn sub-agents for parallel execution
- Manage contract-based coordination
- Package questions for operator input
- Trigger /clear at strategic checkpoints

**Invocation:** `/orc-exe`

**Key Commands:**
- `*start` - Start/resume autonomous execution
- `*status` - Show execution status
- `*checkpoint` - Save state, recommend /clear
- `*advance` - Move to next pass
- `*queue` - View component review queue

---

## Planning Layer

### PM (Product Manager)

**File:** `.system/agents/pm.md`

**Name:** John

**Purpose:** Product definition and requirements gathering.

**Key Responsibilities:**
- Create and refine Product Requirements Documents (PRD)
- Conduct market research and competitive analysis
- Define product vision and goals
- Ruthless prioritization for MVP
- Risk identification and business alignment

**Invocation:** Spawned by `/refine` command or orc-exe during Planning phase

**Output:** `docs/finalized-plan/prd.md`

---

### Architect

**File:** `.system/agents/architect.md`

**Name:** Winston

**Purpose:** Technical design and architecture decisions.

**Key Responsibilities:**
- Design system architecture based on PRD
- Select appropriate technologies and patterns
- Define component boundaries and interfaces
- Establish technical standards and conventions
- Create component contracts

**Invocation:** Spawned by `/refine` command or orc-exe during Planning phase

**Output:** `docs/finalized-plan/architecture.md`, component contracts

---

## Sprint Setup Layer

### SM (Scrum Master)

**File:** `.system/agents/sm.md`

**Name:** Bob

**Purpose:** Sprint backlog preparation.

**Key Responsibilities:**
- Transform PRD requirements into actionable stories
- Organize stories into logical epics
- Define clear acceptance criteria
- Ensure developer-ready specifications
- Respect parallel boundaries from orchestrator

**Invocation:** Spawned by orc-exe during Sprint Setup phase

**Output:** `docs/epics.md`, `docs/stories/`, `docs/sprint-artifacts/sprint-status.yaml`

---

## Execution Layer

### Dev-Base (Developer Template)

**File:** `.system/agents/dev-base.md`

**Name:** Amelia (Base)

**Purpose:** Base template for all developer agents. Specialized variants extend this.

**Core Principles:**
1. Story Context is Truth
2. Reuse Over Rebuild
3. Every Change Maps to Acceptance Criteria
4. Tests Must Pass (100%)
5. No Hallucination - Ask rather than invent

---

### Dev-First-Pass (Skeleton Builder)

**File:** `.system/agents/dev-first-pass.md`

**Name:** Amelia (First Pass)

**Purpose:** Build functional skeletons rapidly. Backend-first, minimal frontend.

**Philosophy:**
```
UGLY IS OK. FUNCTIONAL IS REQUIRED.

- Backend logic: Complete
- Data models: Complete
- APIs: Complete
- Frontend: Minimal (buttons work, forms submit)
- Styling: None or basic
- Polish: Zero
```

**Key Features:**
- Autonomous execution with minimal operator intervention
- Self-correction via Playwright testing
- Parallel execution awareness
- Contract-based completion reporting

**Invocation:** Spawned by orc-exe during First Pass

**Mantra:** *Make it work. Don't make it pretty. That's second pass.*

---

### Dev-Second-Pass (Component Builder)

**File:** `.system/agents/dev-second-pass.md`

**Name:** Amelia (Second Pass)

**Purpose:** Transform ugly skeletons into polished, production-quality components.

**Philosophy:**
```
SKELETON EXISTS. NOW MAKE IT BEAUTIFUL.

- First pass gave us: Working functionality
- Second pass delivers: Polished components
- Focus: UI/UX, styling, component architecture
- Method: Build -> Integrate -> Operator Review
```

**Key Features:**
- Component queue system for operator review
- CSS namespace conventions
- Contract-compliant component building
- Visual validation with Playwright

**Invocation:** Spawned by orc-exe during Second Pass

**Mantra:** *Make it beautiful. Get operator approval. Move to queue.*

---

### Dev-Third-Pass (Bug Fix Specialist)

**File:** `.system/agents/dev-third-pass.md`

**Name:** Amelia (Third Pass)

**Purpose:** Batch process operator-identified bugs, deliver production-ready code.

**Philosophy:**
```
IT WORKS AND LOOKS GOOD. NOW MAKE IT BULLETPROOF.

- First pass gave us: Functionality
- Second pass gave us: Polish
- Third pass delivers: Production readiness
- Method: Operator lists issues -> Batch fix -> Validate
```

**Key Features:**
- Operator-driven bug list processing
- Batch processing for efficiency
- Regression testing
- Production hardening

**Invocation:** Spawned by orc-exe during Third Pass

**Mantra:** *Fix what the operator found. Don't break what's working. Ship it.*

---

## Three-Pass System Overview

```
FIRST PASS: Skeleton Build
├── Goal: Functional backend, minimal/ugly frontend
├── Execution: Parallel dev-first-pass sub-agents
├── Testing: Playwright MCP runs autonomously
├── Operator Role: Answer questions ONLY
└── QA Gate: Milestone approval per chunk

SECOND PASS: Component Integration
├── Goal: Polished components validated against contracts
├── Execution: Queue-based integration
├── Testing: Operator reviews browser after each integration
├── Operator Role: Visual approval, reference file intervention
└── QA Gate: Component review queue

THIRD PASS: Debug & Polish
├── Goal: Production-ready application
├── Execution: Batch bug fixes
├── Testing: Final validation sweep
├── Operator Role: List bugs/issues for batch processing
└── QA Gate: Final approval
```

---

## File Locations

| Agent | Location |
|-------|----------|
| orc-exe | `.system/agents/orc-exe.md` |
| pm | `.system/agents/pm.md` |
| architect | `.system/agents/architect.md` |
| sm | `.system/agents/sm.md` |
| dev-base | `.system/agents/dev-base.md` |
| dev-first-pass | `.system/agents/dev-first-pass.md` |
| dev-second-pass | `.system/agents/dev-second-pass.md` |
| dev-third-pass | `.system/agents/dev-third-pass.md` |

---

## Related Documentation

- **Agent System Overview:** `.system/agents/README.md`
- **Agent Selection Guide:** `.system/agents/AGENT-SELECTION-GUIDE.md`
