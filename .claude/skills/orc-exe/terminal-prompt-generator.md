# Terminal Prompt Generator

**Isolation Level**: ORC-EXE only
**Invocation**: Direct (not event-driven)
**Purpose**: Generate copy-paste ready terminal prompts for parallel story execution with pass-specific guidance and BMAD agent context

---

## Overview

The Terminal Prompt Generator skill transforms sprint batch analysis into actionable, copy-paste ready prompts for multiple terminal sessions. It generates chat-based prompts optimized for easy operator copy-paste, including story context, execution commands, pass-specific guidance, and BMAD agent invocations.

This skill emphasizes **clean, readable output** that operators can quickly copy into terminals without modification, enabling rapid parallel execution orchestration.

---

## Invocation Pattern

**Direct Call (after batch analysis):**
```
Generate terminal prompts for the batched stories
```

**Context-aware Call:**
```
Create copy-paste prompts for 3 terminals executing stories 1-1, 1-3, and 1-2
```

**Advanced Call:**
```
Generate first-pass terminal prompts with minimal markup guidance for ready-for-dev stories
```

**Integration with Batch Analyzer:**
```
Analyze sprint and generate terminal prompts for parallel execution
```

---

## Capabilities

### 1. Chat-Based Prompt Generation

**Generate prompts that:**
- Are optimized for direct copy-paste into Claude chat terminals
- Include story IDs and descriptions
- Specify BMAD agent to invoke (usually `/dev` or `/dev-story`)
- Provide pass-specific context and constraints
- Avoid unnecessary file creation commands (for simple batches)

**Example Output:**
```
TERMINAL 1 - Stories: 1-1-user-authentication
Run: /dev-story 1-1-user-authentication
Context: First pass - implement core authentication logic only. Minimal error handling. No UI polish. Focus on basic login/logout functionality.
```

### 2. Pass-Specific Guidance

**First Pass:**
- Minimal markup and styling
- Core functionality only
- Basic validation
- Skip edge cases
- Quick iteration focus

**Second Pass:**
- Error handling and validation
- Edge case coverage
- UI polish and refinement
- Integration testing
- Code quality improvements

**Example First-Pass Prompt:**
```
TERMINAL 2 - Stories: 1-3-plant-data-model
Run: /dev-story 1-3-plant-data-model
Context: FIRST PASS - Create basic schema and CRUD operations only. Skip validation rules, relationships can be stubbed, no complex queries. Get it working quickly.
```

**Example Second-Pass Prompt:**
```
TERMINAL 2 - Stories: 1-3-plant-data-model
Run: /dev-story 1-3-plant-data-model
Context: SECOND PASS - Add validation rules, foreign key relationships, indexes, and complex query methods. Implement error handling and edge cases.
```

### 3. BMAD Agent Context

**Include appropriate agent invocation:**
- `/dev-story {story-id}` - Primary development workflow
- `/dev` - General development agent (for multi-story or custom work)
- `/code-review` - After story completion
- `/story-done` - Mark story complete after DoD validation

**Example with Agent Context:**
```
TERMINAL 1 - Stories: 1-1-user-authentication
Agent: Amelia (Developer Agent)
Run: /dev-story 1-1-user-authentication
Context: Implement authentication per epic tech spec. Story file has acceptance criteria and dependencies.
```

### 3a. Specialized Agent Specification (NEW)

**When agent-selector recommends a specialized agent, include agent loading instructions:**

**Format:**
```
TERMINAL [N]: [AGENT-NAME]
─────────────────────────────────────
Load Agent: Read and embody .system/agents/[layer]/[agent-name].md
Task: [task description]
Mode: [manual/autonomous/supervised]
Story: [story-id, if applicable]

Context: [task-specific context and guidance]

Expected Deliverables:
- [deliverable 1]
- [deliverable 2]

On Completion: Update .system/agents/active-agents.yaml status to completed
```

**Example: Integration-Manager Assignment**
```
═══════════════════════════════════════════════════════════
TERMINAL 2: INTEGRATION-MANAGER
═══════════════════════════════════════════════════════════

Load Agent: Read and embody .system/agents/tactical/integration-manager.md

Task: Integrate login-form component into production
Mode: Autonomous
Story: 1-2-user-authentication

Context:
- Component validated and in .system/proven/login-form/
- All 4 validation levels passed
- MCP pre-check required before injection
- Create injection markers in production files

Expected Deliverables:
- Component integrated at marked injection points
- MCP registry updated
- Level 4 validation re-run and passing
- Integration status updated in execution-status.yaml

On Completion: Report to orc-exe and update active-agents.yaml
```

**Example: Development-Executor Assignment**
```
═══════════════════════════════════════════════════════════
TERMINAL 1: DEVELOPMENT-EXECUTOR
═══════════════════════════════════════════════════════════

Load Agent: Read and embody .system/agents/tactical/development-executor.md

Task: Implement user authentication backend story
Mode: Manual (foundation work, high complexity)
Story: 1-1-user-authentication-backend

Context:
- First pass - core functionality only
- Wrap BMAD /dev-story workflow
- Acceptance criteria in docs/stories/1-1-user-authentication-backend.md
- All tests must pass before completion

Expected Deliverables:
- User authentication logic implemented
- Tests written and passing
- Story status updated to done
- DoD checklist complete

On Completion: Invoke /story-done 1-1-user-authentication-backend
```

**Agent Selection Integration:**
When generating prompts, if orc-exe has called agent-selector skill:
1. Include agent name in terminal header (e.g., "TERMINAL 2: INTEGRATION-MANAGER")
2. Add "Load Agent:" instruction with path to agent persona
3. Specify execution mode recommended by agent-selector
4. Include reasoning from agent-selector in context (optional)
5. List deliverables specific to that agent's responsibilities

### 4. Dependency & Sequencing Guidance

**For sequential stories in same terminal:**
```
TERMINAL 1 - Stories: 1-1-user-authentication → 1-2-account-management

Story 1: 1-1-user-authentication
Run: /dev-story 1-1-user-authentication
Context: First pass - core auth only. No UI polish.
Wait: Complete story 1-1 before starting 1-2

Story 2: 1-2-account-management
Run: /dev-story 1-2-account-management
Context: Depends on 1-1 completion. Builds on auth infrastructure from 1-1.
Note: Start only after 1-1 is done and tested
```

**For parallel stories:**
```
TERMINAL 1 - Stories: 1-1-user-authentication
Run: /dev-story 1-1-user-authentication
Context: Parallel-safe. No dependencies. Can run concurrently with Terminal 2.

TERMINAL 2 - Stories: 1-3-plant-data-model
Run: /dev-story 1-3-plant-data-model
Context: Parallel-safe. No dependencies. Can run concurrently with Terminal 1.
```

### 5. Clean, Operator-Friendly Formatting

**Design principles:**
- One-line terminal headers for quick scanning
- Clear run commands with no ambiguity
- Concise context (1-2 sentences max)
- Visual separators for multi-story terminals
- Copy-paste blocks for each terminal
- No extraneous formatting or decoration

**Clean Output Example:**
```
═══════════════════════════════════════════════════════════
TERMINAL 1
═══════════════════════════════════════════════════════════
Stories: 1-1-user-authentication
Run: /dev-story 1-1-user-authentication
Context: First pass - core auth logic only, minimal error handling

═══════════════════════════════════════════════════════════
TERMINAL 2
═══════════════════════════════════════════════════════════
Stories: 1-3-plant-data-model
Run: /dev-story 1-3-plant-data-model
Context: First pass - basic schema + CRUD, skip validation
```

---

## Usage Examples

### Example 1: Basic 3-Terminal Prompt Generation

**Operator Input:**
```
Generate prompts for terminals 1-3 with stories: 1-1, 1-3, and 1-2 (sequential after 1-1)
```

**Skill Output:**
```
═══════════════════════════════════════════════════════════
PARALLEL EXECUTION - 3 TERMINALS
Generated: 2025-11-15 10:30:00
═══════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
TERMINAL 1 - Critical Path
═══════════════════════════════════════════════════════════

STORY 1: 1-1-user-authentication
──────────────────────────────────────────────────────────
Run: /dev-story 1-1-user-authentication
Context: Implement core authentication (login/logout). First pass - minimal error handling, no UI polish.
Wait: Complete before starting Story 2

STORY 2: 1-2-account-management
──────────────────────────────────────────────────────────
Run: /dev-story 1-2-account-management
Context: Builds on 1-1 auth. Account CRUD operations. Start only after 1-1 is done.
Dependency: Requires 1-1 completion

═══════════════════════════════════════════════════════════
TERMINAL 2 - Independent Track
═══════════════════════════════════════════════════════════

STORY: 1-3-plant-data-model
──────────────────────────────────────────────────────────
Run: /dev-story 1-3-plant-data-model
Context: Create plant data schema and basic CRUD. No dependencies - parallel-safe with Terminal 1.
Status: Can start immediately

═══════════════════════════════════════════════════════════
TERMINAL 3 - Available
═══════════════════════════════════════════════════════════
Status: Ready for next batch
Queue: Empty
```

### Example 2: First-Pass Minimal Markup Mode

**Operator Input:**
```
Generate first-pass prompts for 2 terminals with minimal markup guidance
```

**Skill Output:**
```
═══════════════════════════════════════════════════════════
FIRST-PASS EXECUTION - MINIMAL MARKUP MODE
═══════════════════════════════════════════════════════════

GUIDANCE: First pass = core functionality only. Skip:
  - UI polish and styling
  - Comprehensive error handling
  - Edge case validation
  - Complex integration tests
Focus: Get it working quickly, iterate in second pass.

═══════════════════════════════════════════════════════════
TERMINAL 1
═══════════════════════════════════════════════════════════
Stories: 1-1-user-authentication
Run: /dev-story 1-1-user-authentication
Context: FIRST PASS - Core auth logic only. Basic login/logout. Stub session management. Skip password reset and edge cases.

═══════════════════════════════════════════════════════════
TERMINAL 2
═══════════════════════════════════════════════════════════
Stories: 1-3-plant-data-model
Run: /dev-story 1-3-plant-data-model
Context: FIRST PASS - Schema definition + basic CRUD. Relationships can be stubbed. Skip validation rules and indexes.
```

### Example 3: Simple Chat-Based (No File Commands)

**Operator Input:**
```
Generate simple chat prompts without file creation commands
```

**Skill Output:**
```
Copy-paste these prompts into your terminals:

──────────────────────────────────────────────────────────
TERMINAL 1
──────────────────────────────────────────────────────────

/dev-story 1-1-user-authentication

First pass - implement core authentication. Focus on basic login/logout functionality. Minimal error handling, no UI polish.

──────────────────────────────────────────────────────────
TERMINAL 2
──────────────────────────────────────────────────────────

/dev-story 1-3-plant-data-model

First pass - create schema and basic CRUD operations. Skip validation and complex relationships for now.
```

### Example 4: Advanced with Agent Context

**Operator Input:**
```
Generate prompts with full BMAD agent context and workflow guidance
```

**Skill Output:**
```
═══════════════════════════════════════════════════════════
BMAD WORKFLOW EXECUTION - 2 TERMINALS
═══════════════════════════════════════════════════════════

Agent: Amelia (Developer Agent - /dev)
Workflow: Development → Review → Done
Project: docs/project.md

═══════════════════════════════════════════════════════════
TERMINAL 1 - Auth Track
═══════════════════════════════════════════════════════════

STORY: 1-1-user-authentication
Location: docs/stories/1-1-user-authentication.md
Epic: docs/epics/epic-1-user-management.md

Run: /dev-story 1-1-user-authentication

Context:
  - Implement authentication per epic tech spec
  - See story file for acceptance criteria
  - First pass: core auth logic only
  - Use /story-context if you need dependencies

After Completion:
  1. Run tests
  2. Self-review against acceptance criteria
  3. Mark ready: /story-ready 1-1-user-authentication
  4. Notify orchestrator for code review

═══════════════════════════════════════════════════════════
TERMINAL 2 - Data Track
═══════════════════════════════════════════════════════════

STORY: 1-3-plant-data-model
Location: docs/stories/1-3-plant-data-model.md
Epic: docs/epics/epic-1-user-management.md

Run: /dev-story 1-3-plant-data-model

Context:
  - Create plant data schema and CRUD
  - No dependencies (parallel-safe)
  - First pass: schema + basic operations
  - Skip validation for now

After Completion:
  1. Run tests
  2. Self-review against acceptance criteria
  3. Mark ready: /story-ready 1-3-plant-data-model
  4. Notify orchestrator for code review
```

### Example 5: Multi-Story Complex Batch

**Operator Input:**
```
Generate prompts for 4 terminals with 6 stories total
```

**Skill Output:**
```
═══════════════════════════════════════════════════════════
COMPLEX BATCH - 4 TERMINALS, 6 STORIES
═══════════════════════════════════════════════════════════

Execution Strategy:
  - Terminals 1-3: Parallel execution (3 stories)
  - Terminal 4: Sequential queue (3 stories)
  - Estimated duration: 4-6 hours total

═══════════════════════════════════════════════════════════
TERMINAL 1 - High Priority
═══════════════════════════════════════════════════════════
Stories: 1-1-user-authentication → 1-2-account-management
Run: /dev-story 1-1-user-authentication
Context: Critical path story. Complete before starting 1-2.
Next: /dev-story 1-2-account-management (after 1-1 done)

═══════════════════════════════════════════════════════════
TERMINAL 2 - Data Layer
═══════════════════════════════════════════════════════════
Stories: 1-3-plant-data-model → 1-5-api-integration
Run: /dev-story 1-3-plant-data-model
Context: Parallel-safe. Complete before starting 1-5.
Next: /dev-story 1-5-api-integration (after 1-3 done)

═══════════════════════════════════════════════════════════
TERMINAL 3 - UI Components
═══════════════════════════════════════════════════════════
Stories: 1-4-ui-components
Run: /dev-story 1-4-ui-components
Context: Independent UI work. No dependencies.

═══════════════════════════════════════════════════════════
TERMINAL 4 - Integration Track
═══════════════════════════════════════════════════════════
Stories: 1-6-end-to-end-integration
Run: /dev-story 1-6-end-to-end-integration
Context: Start after Terminals 1-3 complete. Integrates all components.
Wait: Blocked until 1-1, 1-3, 1-4 are done
```

---

## Integration Points

### Reads:
- Sprint batch analysis (from `sprint-batch-analyzer` skill output)
- `.system/execution-status.yaml` - Current pass mode (first/second/third)
- `docs/sprint-artifacts/sprint-status.yaml` - Story statuses (optional)
- `.bmad/bmm/config.yaml` - Project configuration (for agent context)

### Writes:
- Console output only (copy-paste ready prompts)
- No file creation
- No YAML modifications

### Invokes:
- None (pure generation skill, no agent invocation)
- Prompts include commands for operator to invoke (e.g., `/dev-story`)

---

## Isolation Rules

### ORC-EXE Only
- This skill runs exclusively in the ORC-EXE isolation layer
- Does NOT emit events to BMAD event system
- Does NOT invoke BMAD agents (generates commands for operator)
- Synchronous operation with direct console output

### Top-Down Flow Only
- Orchestrator → Terminal Prompt Generator (allowed)
- Terminal Prompt Generator → Orchestrator (return values only)
- Terminal Prompt Generator → BMAD agents (NOT allowed, operator invokes)

### No Side Effects
- Read-only operations
- No file writes
- No state modifications
- Pure prompt generation

### Integration with Sprint Batch Analyzer
- Designed to consume output from `sprint-batch-analyzer` skill
- Can operate standalone with manual story list input
- Terminal assignments from analyzer inform prompt structure

---

## Formatting Options

### Minimal Format (Quick Copy-Paste)
```
T1: /dev-story 1-1-user-authentication (first pass, core auth only)
T2: /dev-story 1-3-plant-data-model (first pass, basic schema)
```

### Standard Format (Balanced)
```
TERMINAL 1: 1-1-user-authentication
Run: /dev-story 1-1-user-authentication
Context: First pass - core auth logic only

TERMINAL 2: 1-3-plant-data-model
Run: /dev-story 1-3-plant-data-model
Context: First pass - basic schema + CRUD
```

### Detailed Format (Full Context)
```
Full format shown in examples above with separators, dependencies, agent context
```

### Operator Preference
```
Generate prompts in minimal format for quick execution
Generate prompts in detailed format with full BMAD context
```

---

## Error Handling

### Missing Batch Analysis
```
⚠ Error: No batch analysis provided
  Suggestion: Run 'sprint-batch-analyzer' skill first or provide manual story list
```

### Invalid Story IDs
```
⚠ Error: Story ID '1-1' not found in sprint-status.yaml
  Available stories: 1-2-account-management, 1-3-plant-data-model
  Suggestion: Check story ID format or regenerate sprint status
```

### Terminal Capacity Exceeded
```
⚠ Warning: 8 stories assigned to 3 terminals
  Result: Some terminals will have sequential queues
  Suggestion: Consider adding more terminals or batching across multiple sessions
```

---

## Advanced Usage

### Custom Pass Guidance
```
Generate second-pass prompts with focus on error handling and edge cases
```

### Integration Testing Batch
```
Generate prompts for integration testing stories with dependencies on completed work
```

### Code Review Queue
```
Generate review prompts for stories ready for review (terminal prompts with /code-review)
```

### Mixed Pass Execution
```
Generate prompts where Terminal 1 runs first-pass stories and Terminal 2 runs second-pass refinements
```

---

## Best Practices

### For Operators:

1. **Copy Entire Terminal Block**: Copy the full terminal section including context
2. **Verify Dependencies**: Check "Wait" and "Dependency" notes before starting
3. **Follow Pass Guidance**: Respect first-pass vs second-pass constraints
4. **Monitor Sequential Queues**: Don't start next story in queue until previous completes
5. **Report Blockers**: If dependencies block execution, notify orchestrator

### For Prompt Generation:

1. **Keep Context Concise**: 1-2 sentences max per story
2. **Highlight Dependencies**: Make blocking dependencies obvious
3. **Pass Mode Front and Center**: First pass guidance should be unmissable
4. **Use Visual Separators**: Make terminal boundaries clear
5. **Optimize for Copy-Paste**: No editing should be needed after copying

### For Integration:

1. **Chain with Batch Analyzer**: Run analysis → generation as workflow
2. **Respect Terminal Capacity**: Don't over-assign terminals
3. **Consider Complexity**: Balance story complexity across terminals
4. **Update After Completion**: Regenerate prompts as stories complete

---

## Notes

- Prompts are designed for Claude chat terminals (not bash terminals)
- BMAD agent invocation uses slash commands (e.g., `/dev-story`)
- No file creation commands for simple batches (chat-based execution)
- Pass-specific guidance critical for THREE-PASS system success
- Operator has final discretion on prompt usage and modifications
- Prompts are stateless - regenerate as sprint status changes
- Integration with `sprint-batch-analyzer` for end-to-end workflow
- Output optimized for readability in monospace terminal displays
