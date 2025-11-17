# Orchestrator-EXE Command Naming Rationale

## Decision: `*parallel-status` (Skill) vs `/orc-status` (Slash Command)

**Date**: 2025-11-15
**Context**: Creating a status command for parallel execution tracking
**Initial proposal**: `/orc-status` (slash command)
**Final decision**: `*parallel-status` (orchestrator-exe skill)

---

## The Choice

During implementation, we chose to implement the parallel status tracking as:
- **Location**: `.claude/skills/orchestrator-exe/parallel-status.md`
- **Invocation**: `*parallel-status` (skill command, invoked from orchestrator-exe terminal)
- **NOT**: `/orc-status` (slash command, invoked from any terminal)

---

## Rationale

### 1. **Architectural Consistency**

Orchestrator-EXE uses a distinct command pattern:
- **Asterisk (`*`) commands**: Direct orchestrator-exe skills (isolated, non-event-driven)
- **Slash (`/`) commands**: BMAD workflows and general-purpose tools (event-driven, cross-agent)

**Examples**:
- `*status`, `*coordinate`, `*track-session` → Orchestrator-EXE skills
- `/dev-story`, `/integrate`, `/workflow-status` → BMAD workflows

Using `*parallel-status` maintains this architectural boundary and makes it clear that:
- This command is **orchestrator-specific** (not a general-purpose tool)
- It operates in the **orchestrator context** (parallel work tracking)
- It's **isolated from BMAD** (no event emission, top-down coordination)

### 2. **Execution Context**

Parallel work tracking is an **orchestrator-exe concern**:
- Orchestrator-exe manages parallel terminal coordination
- Session files live in `.system/parallel-work/` (orchestrator domain)
- Conflict detection and dependency tracking happen at orchestrator level

**Invoking from orchestrator terminal**:
```
/orchestrator-exe
Orchestrator-EXE> *parallel-status
```

This makes sense because:
- You're already in orchestrator context
- The status is about parallel work **coordinated by orchestrator**
- The output is actionable for orchestrator decisions (which terminal to assign next)

**If it were `/orc-status` (slash command)**:
- Could be invoked from any terminal (not just orchestrator)
- Would create confusion about scope (is this for the current terminal or all terminals?)
- Would break the orchestrator isolation model (skills should be orchestrator-only)

### 3. **Scope Clarity**

The name `parallel-status` is more descriptive than `orc-status`:
- **`parallel-status`**: Immediately clear it's about parallel execution status
- **`orc-status`**: Requires knowing "orc" = orchestrator (less intuitive)

Additionally:
- `*parallel-status` groups naturally with `*track-session`, `*sync-sessions`
- All three commands are about parallel work coordination
- Cohesive mental model: "parallel work commands"

### 4. **Separation from BMAD Status**

We already have a BMAD status command:
- **`/workflow-status`**: Shows BMAD workflow phases (PRD, Architecture, Stories)
- **`*parallel-status`**: Shows orchestrator parallel execution (terminals, conflicts, dependencies)

**Key differences**:

| Aspect | `/workflow-status` (BMAD) | `*parallel-status` (Orchestrator) |
|--------|---------------------------|-----------------------------------|
| **Scope** | BMAD workflow phases | Parallel execution tracking |
| **Purpose** | "What phase am I in?" | "What's happening in parallel?" |
| **Data Source** | `.bmad/status.yaml` | `.system/parallel-work/*.yaml` |
| **User** | Any agent/terminal | Orchestrator-EXE only |
| **Invocation** | Slash command (global) | Skill command (orchestrator-specific) |

Using `*` instead of `/` reinforces this separation and prevents confusion.

### 5. **Discoverability**

When you invoke orchestrator-exe, you see the menu:
```
Orchestrator-EXE> Available commands:
  *status           - Show execution status
  *parallel-status  - Show parallel work across terminals
  *coordinate dev   - Delegate to dev agent
  *track-session    - Register this terminal session
  *sync-sessions    - Synchronize state
```

All orchestrator commands use `*` prefix, making them:
- **Immediately recognizable** as orchestrator commands
- **Grouped mentally** as a cohesive set
- **Easy to remember** (asterisk = orchestrator)

If we used `/orc-status`, it would:
- Not appear in the orchestrator menu (slash commands aren't listed there)
- Require users to remember a separate invocation pattern
- Create inconsistency in command discovery

---

## Why NOT `/orc-status`?

### Problem 1: Context Confusion
Slash commands are globally invokable. If `/orc-status` exists:
- Can it be called from a dev terminal? (Probably not meaningful)
- Can it be called from a BMAD workflow? (Would show different context)
- Does it need to detect which terminal it's in? (Added complexity)

### Problem 2: Architectural Boundary Violation
Slash commands are typically BMAD workflows or cross-agent tools:
- `/dev-story` → BMAD dev workflow
- `/integrate` → Component integration (BMAD + autonomous)
- `/workflow-status` → BMAD phase tracking

Parallel execution tracking is **not a BMAD concern**—it's an orchestrator concern. Mixing them breaks the architectural separation.

### Problem 3: Naming Ambiguity
"orc" is shorthand for "orchestrator," but:
- Not immediately obvious to new users
- Could be confused with other meanings (orc = creature in fantasy?)
- Less descriptive than "parallel" (which describes what it shows)

---

## Conclusion

**`*parallel-status` is the right choice because:**
1. ✅ **Architecturally consistent** with orchestrator command patterns
2. ✅ **Execution context** is clear (orchestrator-only, parallel work)
3. ✅ **Scope clarity** through descriptive naming
4. ✅ **Separation from BMAD** status commands maintained
5. ✅ **Discoverability** in orchestrator menu

**The decision reinforces:**
- Orchestrator-EXE uses `*` prefix for skills
- BMAD and autonomous use `/` prefix for workflows
- Parallel work tracking is orchestrator-specific, not BMAD-specific
- Clear architectural boundaries prevent confusion

---

## Reference

**Implementation files**:
- Skill: `.claude/skills/orchestrator-exe/parallel-status.md`
- Agent menu: `.claude/agents/orchestrator-exe.md`
- Documentation: `docs/orchestrator-exe/USAGE_GUIDE.md`

**Related commands**:
- `*status`: General execution status (sprint, story, pass)
- `*parallel-status`: Detailed parallel work status (terminals, conflicts, dependencies)
- `/workflow-status`: BMAD workflow phase status (PRD, architecture, stories)

**Design principle**:
> "Use `*` for orchestrator-specific skills that operate in orchestrator context. Use `/` for BMAD workflows and cross-agent tools that can be invoked from anywhere."
