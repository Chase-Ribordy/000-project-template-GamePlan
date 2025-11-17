# Execution Philosophy: Manual vs Autonomous

## Core Principle

**Execution mode is about control and risk, not development phases.**

The choice between manual and autonomous execution isn't dictated by whether you're in first, second, or third pass. It's dictated by:
- How clear your criteria are
- How much risk you're willing to accept
- How much control you need
- How much speed you require

## The Decision Framework

### Manual Mode: Control-First Development

**Use manual mode when:**
- **Criteria are unclear** - You're figuring out what "right" looks like
- **High risk** - Errors would be expensive (architecture, production debugging, critical paths)
- **Novel patterns** - First time implementing something in this codebase
- **Need creative input** - Design decisions, UX exploration, architectural choices
- **Want iterative feedback** - Build, review, adjust, repeat

**Characteristics:**
- Developer drives every decision
- Agent proposes, operator approves
- Short feedback loops
- More operator effort upfront
- Less debugging later
- Higher confidence in results

**Examples:**
- First story in an epic (establishing patterns)
- Complex architecture changes
- Production debugging (high stakes)
- Novel UI components (creative decisions needed)
- Security-critical features
- Integration with unfamiliar APIs

### Autonomous Mode: Speed-First Development

**Use autonomous mode when:**
- **Criteria are clear** - You can write a contract that defines "done"
- **Low risk** - Errors are cheap to fix (tests catch them, isolated components)
- **Need volume** - Many similar tasks (UI components, CRUD operations)
- **Need speed** - Manual iteration feels too slow
- **Proven patterns** - Repeating something that worked before
- **Operator frustrated with slow progress** - "Just build it already" signals readiness

**Characteristics:**
- Agent drives execution autonomously
- Contract defines acceptance criteria
- Batch processing (5 components in parallel)
- Less operator effort upfront
- More debugging later (if contracts unclear)
- Higher throughput

**Examples:**
- UI component integration (after backend works)
- Repetitive CRUD operations
- Test generation
- CSS styling from design contracts
- Data migration scripts
- API endpoint creation (following established patterns)

## The Speed Frustration Signal

**Key insight:** When an operator says "this is taking too long, just build it," it's a signal that the criteria are clearer than initially assessed.

If you're frustrated with manual iteration speed, ask:
- Can I write down what "done" looks like?
- Would I know a correct implementation if I saw one?
- Are the requirements actually clear enough for a contract?

**If yes → Switch to autonomous mode.**

The frustration means you've internalized the requirements. You're just slowing yourself down with unnecessary approval steps.

## Risk Assessment Algorithm

The decision isn't binary. Here's how to calculate risk:

### Base Risk Score

| Action Type | Risk Score |
|-------------|-----------|
| Routine (tests, status updates) | 1 |
| Moderate (new component, first story in sprint) | 3 |
| Complex (architecture, dependency graph, production) | 5 |

### Context Modifiers

| Context | Modifier |
|---------|----------|
| First pass (establishing patterns) | +1 |
| Parallel work (4+ sessions) | +2 |
| First story in epic | +1 |
| Repeated pattern (done before) | -1 |
| Clear contract exists | -2 |
| Operator frustration with speed | -1 |

### Decision Thresholds

- **Score ≤ 2:** Autonomous recommended
- **Score 3-4:** Manual recommended (but autonomous possible with good contract)
- **Score ≥ 5:** Always manual

**Example calculation:**

*"Implementing user authentication (first story in epic, first pass)"*
- Base: 3 (moderate - new component)
- +1 (first pass)
- +1 (first in epic)
- **Total: 5 → Manual mode**

*"Adding login button (5th similar component, clear contract exists)"*
- Base: 3 (moderate - new component)
- -1 (repeated pattern)
- -2 (clear contract)
- **Total: 0 → Autonomous mode**

## Trade-offs Explained

### Manual Mode Trade-offs

**Benefits:**
- Higher confidence (you see everything)
- Fewer surprises (you approve each step)
- Better learning (you understand decisions)
- Easier debugging (you know what was built)

**Costs:**
- Slower throughput (approval overhead)
- More operator fatigue (constant decisions)
- Context switching (break flow for approvals)
- Harder to parallelize (requires attention)

**When worth it:** Foundation work, novel patterns, high-risk changes

### Autonomous Mode Trade-offs

**Benefits:**
- Higher throughput (batch processing)
- Less operator fatigue (set and forget)
- Better parallelization (5 components at once)
- Focus on contracts (clarifies requirements)

**Costs:**
- Lower confidence (didn't see details)
- More surprises (unexpected implementations)
- Harder debugging (need to understand generated code)
- Requires clear contracts (garbage in, garbage out)

**When worth it:** Repetitive work, clear patterns, volume requirements

## Pass Awareness + Decision Support Integration

The system combines **WHERE** (pass awareness) with **HOW** (decision support):

### Pass Awareness: WHERE you are

- **First pass:** Backend-first, get it working
- **Second pass:** UI integration, make it beautiful
- **Third pass:** Debug and polish, production ready

### Decision Support: HOW to execute

- **Manual:** Control-first, iterative
- **Autonomous:** Speed-first, contract-based

### Combined Guidance

| Pass | Default Mode | Reason | Autonomous OK When |
|------|-------------|--------|-------------------|
| First | Manual | Establishing patterns, foundation | Contract crystal clear, repeated pattern |
| Second | Autonomous | UI components, proven patterns | Most of the time (UI follows contracts) |
| Third | Manual | Production debugging, edge cases | Routine fixes, test generation |

**The key:** Pass suggests a default, but decision support can override based on clarity and risk.

## Mixed-Mode Examples

Most real development uses **both modes** in the same sprint:

### Example 1: User Authentication Epic

**Story 1: Backend Authentication (First Pass)**
- Manual mode: Novel pattern, architecture decisions
- Build auth service, session management, middleware
- Establish patterns for future stories

**Story 2: Login/Signup UI (Second Pass)**
- Autonomous mode: UI components, backend works
- Contract: Form fields, validation rules, API endpoints
- Generate 5 components in parallel

**Story 3: Social OAuth Integration (First Pass)**
- Manual mode: New integration, unfamiliar API
- Iterate on OAuth flow, error handling
- High risk (security implications)

**Story 4: Password Reset Flow (Second Pass)**
- Autonomous mode: Repeating auth pattern
- Contract: Email templates, reset token flow
- Pattern established in Story 1

### Example 2: E-commerce Catalog

**First Pass (Manual):**
- Product model and database schema
- Basic API endpoints (GET /products)
- Establish data access patterns

**Second Pass (Autonomous):**
- Product card component (contract-based)
- Category filter component
- Search bar component
- Pagination component
- Sort dropdown component
- *All 5 components in parallel*

**Third Pass (Mixed):**
- Manual: Debug layout issues (creative decisions)
- Autonomous: Generate missing tests
- Manual: Performance optimization (profiling needed)
- Autonomous: Add loading states (pattern clear)

## Mode Switching Triggers

### Switch Manual → Autonomous

**Triggers:**
- "I'm tired of approving every step"
- "Can we just batch this?"
- "This pattern is established now"
- You've built 2-3 similar components manually
- You can write a clear contract

**Action:** Write contract, delegate to autonomous flow

### Switch Autonomous → Manual

**Triggers:**
- "Why did it generate this?"
- "This doesn't match what I expected"
- "The contract was too vague"
- Repeated failures in autonomous chain
- Output quality lower than expected

**Action:** Stop autonomous, review contracts, iterate manually to clarify requirements

## Decision Tree

```
START
  ↓
Can you write a contract that defines "done"?
  ↓
  ├─ NO → Manual mode
  │        (criteria unclear, iterate to clarify)
  │
  ├─ YES → Would errors be expensive to fix?
            ↓
            ├─ YES → Manual mode
            │        (high risk, need control)
            │
            ├─ NO → Have you done this before successfully?
                     ↓
                     ├─ YES → Autonomous mode
                     │        (proven pattern, low risk)
                     │
                     ├─ NO → Is this your first story in this epic?
                              ↓
                              ├─ YES → Manual mode
                              │        (establishing patterns)
                              │
                              ├─ NO → Autonomous mode
                                       (pattern exists, just replicate)
```

## Recommendations by Operator Skill

### Junior Operators
- **Default to manual mode** - Build understanding
- Use autonomous only for proven patterns
- Focus on learning through iteration
- Contract quality improves with experience

### Senior Operators
- **Default to autonomous mode** - Leverage experience
- Use manual only for novel/high-risk work
- Trust contract-writing ability
- Optimize for throughput

### Mixed Teams
- Junior operators: Manual first pass (learn patterns)
- Senior operators: Write contracts from junior learnings
- Junior operators: Execute autonomous second pass (see contracts in action)
- **Knowledge transfer built into workflow**

## Summary: Choosing Your Mode

**Choose Manual when:**
- You need to figure something out
- Errors would be expensive
- You're establishing a pattern
- You want creative control

**Choose Autonomous when:**
- You know what "done" looks like
- Errors are cheap
- You're repeating a pattern
- You want speed and volume

**The golden rule:** If you can write a clear contract, autonomous mode will save you time. If you can't, manual mode will save you debugging.

**The speed signal:** Frustration with manual iteration means you're ready for autonomous execution. Listen to it.
