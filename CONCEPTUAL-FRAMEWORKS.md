# Conceptual Frameworks

The core ideas that make this system work. Keep these, everything else is implementation detail.

---

## 1. Two Pipelines: Idea → Execution

### The Problem
AI agents are good at execution but need clear direction. Humans have ideas but struggle to structure them for AI consumption.

### The Solution
**Pipeline 1: /refine (Idea Pipeline)**
- Human has rough idea
- Structured discovery questions extract context
- AI generates PRD + Architecture
- Output: Clear, actionable planning docs

**Pipeline 2: /orc-exe (Execution Pipeline)**
- Takes planning docs as input
- Orchestrates multi-agent development
- Output: Working software

```
Human Idea → /refine → Planning Docs → /orc-exe → Working Software
```

### Why This Matters
- Clean separation of concerns
- Human stays in "vision" mode during planning
- AI handles structured execution
- No context switching between planning and coding

---

## 2. Three-Pass Development

### The Problem
Trying to build "perfect" code in one pass leads to:
- Over-engineering early
- Bikeshedding on UI before logic works
- Paralysis from trying to do everything at once

### The Solution
**First Pass: "Make It Work"**
- Backend-first development
- Functional but ugly UI
- All tests passing
- Focus: Does the feature actually work?

**Second Pass: "Make It Beautiful"**
- Component polish
- UI/UX refinement
- Visual validation
- Focus: Does it look and feel right?

**Third Pass: "Make It Bulletproof"**
- Bug fixes
- Edge cases
- Performance optimization
- Focus: Is it production-ready?

### Why This Matters
- Prevents premature optimization
- Each pass has clear, limited scope
- Easy to parallelize (different stories in same pass)
- Natural QA gates between passes
- Matches how experienced developers actually work

### Key Insight
"Ugly but working" is valuable. "Beautiful but broken" is worthless. The order matters.

---

## 3. ORC-EXE: Supreme Orchestrator

### The Problem
Without coordination, parallel AI agents:
- Step on each other's work
- Lose context between sessions
- Require constant human supervision
- Don't know what to do next

### The Solution
**ORC-EXE** is the supreme coordinator that:
1. Spawns sub-agents via Task()
2. Tracks progress via contract files
3. Manages parallel execution
4. Packages questions for operator
5. Handles pass transitions

### The Key Innovation: Task() Spawning
```javascript
// OLD WAY: Generate terminal prompts for human to copy-paste
"Copy this to Terminal 1: ..."

// NEW WAY: Spawn sub-agents programmatically
Task({
  description: "Story 1-1: User Auth",
  subagent_type: "general-purpose",
  prompt: "[agent persona + context]"
})
```

### Why This Matters
- Operator focuses on CONTENT decisions, not coordination
- Parallel execution happens automatically
- Progress tracked via contracts (survives /clear)
- Single entry point for all execution

---

## 4. Contract-Based Coordination

### The Problem
Sub-agents are stateless. They can't talk to each other directly. How do they coordinate?

### The Solution
**Contract Files** - YAML files that sub-agents read/write:
```yaml
# .system/contracts/story-1-1-completion.yaml
story_id: "1-1"
status: completed
pass: first
files_modified: [src/auth/user.js]
tests: {passed: 12, failed: 0}
ready_for_dependent_stories: true
```

### How It Works
1. ORC-EXE spawns Story 1-1 agent
2. Agent implements story
3. Agent writes completion contract
4. ORC-EXE reads contract, knows 1-1 is done
5. ORC-EXE spawns Story 1-2 (which depended on 1-1)

### Why This Matters
- Survives context window clears
- No shared memory needed
- Auditable coordination history
- Dependencies enforced via contract checks
- Operator can inspect progress anytime

---

## 5. Parallel Execution via Chunks

### The Problem
Some stories depend on others. You can't just run everything in parallel.

### The Solution
**Parallel Boundaries** - Group stories into "chunks":
```yaml
chunks:
  - id: chunk-01
    name: "Authentication"
    stories: ["1-1", "1-3"]  # No deps, run parallel

  - id: chunk-02
    name: "Account Management"
    depends_on: [chunk-01]
    stories: ["1-2", "1-4"]  # Wait for chunk-01
```

### Execution Pattern
1. Spawn all chunk-01 stories in parallel (multiple Task() calls)
2. Wait for all chunk-01 contracts to show "completed"
3. QA gate: Operator approves milestone
4. Spawn chunk-02 stories
5. Repeat

### Why This Matters
- Maximizes throughput (parallel where safe)
- Respects dependencies (sequential where needed)
- Clear milestones for QA review
- Prevents "everything depends on everything" chaos

---

## 6. Specialized Dev Agents

### The Problem
A general-purpose "dev agent" doesn't know:
- What quality level is appropriate now
- Whether to polish or just make it work
- When to skip edge cases vs handle them

### The Solution
**Pass-Specific Agents** with different behaviors:

| Agent | Pass | Mantra | Behavior |
|-------|------|--------|----------|
| dev-first-pass | 1st | "Make it work" | Backend-first, ugly UI OK, skip polish |
| dev-second-pass | 2nd | "Make it beautiful" | Component polish, visual validation |
| dev-third-pass | 3rd | "Make it bulletproof" | Bug fixes, edge cases, production hardening |

### Why This Matters
- Each agent has FOCUSED behavior
- No confusion about quality expectations
- Easy to give appropriate instructions per pass
- Prevents over-engineering in early passes

---

## 7. Playwright MCP Integration

### The Problem
Without browser access, agents:
- Can't verify their work visually
- Rely on operator to report console errors
- Miss obvious bugs a browser would catch

### The Solution
**Playwright MCP** gives agents direct browser access:
```javascript
// Agent can autonomously:
mcp__playwright__browser_navigate({ url: "localhost:3000" })
mcp__playwright__browser_console_messages()  // Check for errors
mcp__playwright__browser_take_screenshot()   // Visual record
```

### Why This Matters
- Autonomous validation (no human relay)
- Visual regression detection
- Console error catching
- Self-correction loops possible

---

## 8. Session Continuity (/resume, /handoff)

### The Problem
- Work spans multiple sessions
- Context gets lost between devices
- Starting fresh loses momentum

### The Solution
**State Files** that persist:
- `next-steps.md` - What was done, what's next
- `.system/execution-status.yaml` - Current pass/progress
- `.system/contracts/` - Sub-agent completion status

**Commands**:
- `/handoff` - Save state, push to GitHub
- `/resume` - Load state, continue where you left off

### Why This Matters
- Work from desktop → push → continue on phone
- Multiple developers can hand off
- Context survives /clear and session boundaries

---

## Summary: The Mental Model

```
OPERATOR HAS IDEA
      │
      ▼
   /refine
      │ (Discovery questions)
      ▼
  PRD + Architecture
      │
      ▼
   /orc-exe
      │ (Story generation via SM)
      ▼
  Stories + Chunks
      │
      ▼
  ┌─────────────────────────────────────┐
  │  THREE-PASS EXECUTION               │
  │                                     │
  │  Pass 1: dev-first-pass agents      │
  │    → Functional skeletons           │
  │    → Contracts written              │
  │    → Milestone QA gate              │
  │                                     │
  │  Pass 2: dev-second-pass agents     │
  │    → Polished components            │
  │    → Playwright validated           │
  │    → Checkpoint                     │
  │                                     │
  │  Pass 3: dev-third-pass agents      │
  │    → Bugs fixed                     │
  │    → Production ready               │
  │                                     │
  └─────────────────────────────────────┘
      │
      ▼
 WORKING SOFTWARE
```

---

## What Makes This Different

1. **Two clear pipelines** (not one fuzzy "help me build" conversation)
2. **Structured progression** (passes, not chaos)
3. **Automated coordination** (Task() spawning, not copy-paste prompts)
4. **Contract-based state** (survives sessions)
5. **Parallel-aware** (chunks, dependencies)
6. **Browser-integrated** (Playwright MCP)

These are the ideas worth keeping. Everything else is implementation detail.
