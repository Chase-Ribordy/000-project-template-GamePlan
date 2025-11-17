# Contract Creation Skill

**Autonomy Level:** Fully Autonomous

**Purpose:** Automatically generate component contracts when components are extracted or created, defining inputs, outputs, validation criteria, and CSS namespaces.

## Trigger Conditions

### Auto-Triggers
- **Event:** `component_extracted`
  - **Condition:** `contract_exists == false`
  - **Priority:** 1 (runs first in the chain)
  - **Emitted by:** `/integrate` command after sharding prototypes

### Manual Triggers
- "create contract for {component_name}"
- "define contract {component_name}"
- "{component_name} needs a contract"
- "Create new component {name}"

## Skill Workflow

When this skill is triggered (automatically after `component_extracted` event):

### 1. Analyze Component Files

Read component files from `.system/components/{component_name}/`:
- `{component_name}.html` - Extract DOM structure, IDs, classes
- `{component_name}.css` - Extract CSS classes, animations, media queries
- `{component_name}.js` - Extract functions, classes, event handlers, dependencies

### 2. Extract Component Metadata

**From HTML:**
- Required props/attributes
- DOM structure requirements
- Container element needs
- Accessibility attributes

**From CSS:**
- Class naming patterns
- Namespace prefix (auto-generate if missing)
- Media query breakpoints
- Animation names

**From JS:**
- Public methods/API
- Event handlers
- Required dependencies (libraries, other components)
- Data inputs/outputs

### 3. Generate Contract Document

Create `.system/contracts/{component_name}-contract.md`:

```markdown
# Component Contract: {component_name}

**Created:** {timestamp}
**Source:** {original_prototype_file}
**Type:** UI Component

## Overview

**Purpose:** {auto-generated description based on component analysis}

**Complexity:** {Simple|Medium|Complex} ({total_lines} lines)

## Interface Definition

### Inputs

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| {prop} | {type} | {yes/no} | {value} | {description} |

### Outputs

| Event | Payload | Description |
|-------|---------|-------------|
| {event_name} | {data} | {when emitted} |

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| {method} | {params} | {type} | {what it does} |

## DOM Requirements

**Container:** `{container_id or class}`

**Required Attributes:**
- `{attribute}`: {description}

**Structure:**
```html
{minimal DOM structure example}
```

## CSS Namespace

**Prefix:** `.{component_name}-`

**All CSS classes must use this prefix to prevent conflicts.**

**Core Classes:**
- `.{component_name}-container`
- `.{component_name}-{element}`

## Dependencies

**External Libraries:**
- {library_name} (version {version})

**Other Components:**
- {component_name} (from .system/proven/)

**Browser APIs:**
- {API name}

## Validation Checklist

Used by `component-validation` skill (4 levels):

### Level 1: Syntax
- [ ] HTML is valid
- [ ] CSS is valid
- [ ] JS has no syntax errors

### Level 2: Unit Tests
- [ ] All public methods have tests
- [ ] Edge cases covered
- [ ] Tests pass

### Level 3: Contract Compliance
- [ ] All CSS classes use namespace prefix
- [ ] DOM structure matches requirements
- [ ] All required props supported
- [ ] All events emitted as specified

### Level 4: Integration Safety
- [ ] No CSS conflicts (via MCP)
- [ ] No JS conflicts (via MCP)
- [ ] No HTML ID conflicts
- [ ] Dependencies available

## Usage Example

```html
{code example showing how to use this component}
```

## Acceptance Criteria

- [ ] Component renders correctly in all target browsers
- [ ] All interactive features work
- [ ] Responsive design functions at all breakpoints
- [ ] Accessibility requirements met
- [ ] Performance acceptable (load time, animation smoothness)

## Notes

{Any special considerations, known limitations, future improvements}

---

**Contract Version:** 1.0
**Last Updated:** {timestamp}
```

### 4. Emit Events

**Event:** `contract_created`

**Payload:**
```yaml
component_name: "{component_name}"
contract_path: ".system/contracts/{component_name}-contract.md"
story: "{story_id}"
```

**Triggers:**
- `component-validation` skill (automatically starts validation)
- `progress-reporter` skill (updates execution status)

### 5. Update Execution Status

Via `progress-reporter` skill:

```yaml
stories:
  {story_id}:
    pass_status:
      second-pass:
        components:
          - name: "{component_name}"
            status: "contract_defined"  # ← Updated from "draft"
            contract: ".system/contracts/{component_name}-contract.md"
```

## Output Files

### Created
- `.system/contracts/{component_name}-contract.md` - Complete contract specification

### Modified
- `.system/execution-status.yaml` - Component status updated (via progress-reporter)

## Operator Visibility

### Autonomous Operation (No Interaction Required)

**Operator runs:** `/integrate references/login-prototype.html`

**Operator sees:**
```
Sharding prototype...
✓ Extracted 3 components

Creating contracts... (autonomous)
✓ login-form contract created
✓ password-input contract created
✓ submit-button contract created

Contracts: .system/contracts/
```

**What happened automatically:**
- 3 components extracted
- 3 contracts auto-generated by analyzing component code
- Contracts ready for validation (next skill in chain)

## Error Handling

### Component Files Not Found

```
Error: Cannot create contract for {component_name}

Reason: Component files not found at .system/components/{component_name}/

Action: Verify component extraction completed successfully
```

### Ambiguous Interface

```
Warning: Could not auto-detect all interface details for {component_name}

Created basic contract template. Manual review recommended:
- Review .system/contracts/{component_name}-contract.md
- Fill in missing interface details
- Validation may flag incomplete contract
```

### Namespace Conflict

```
Warning: Component uses class ".btn" without namespace prefix

Auto-resolution:
- Generated namespace: ".{component_name}-"
- Contract specifies all classes must use prefix
- Validation will enforce this requirement
```

## Integration with Validation

The contract created by this skill is used by `component-validation` skill:

**Validation Flow:**
```
contract-creation
  ↓ (emits contract_created)
component-validation
  ↓ (reads contract)
Level 3: Contract Compliance Check
  - Verify all CSS classes use namespace
  - Verify DOM structure matches contract
  - Verify all required props supported
  - Verify all events emitted correctly
```

## Configuration

Settings in `.claude/skills/trigger-matrix.yaml`:

```yaml
skills:
  contract-creation:
    autonomy_level: "fully_autonomous"
    auto_triggers:
      - event: "component_extracted"
        conditions:
          - "contract_exists == false"
        priority: 1
```

## Related Files

- **Trigger Matrix:** `.claude/skills/trigger-matrix.yaml`
- **Event System:** `.claude/skills/event-system.md`
- **Component Validation:** `.claude/skills/component-validation.md`
- **Contracts:** `.system/contracts/{component_name}-contract.md`
- **Execution Status:** `.system/execution-status.yaml`

## Old Command Replaced

This skill replaces: `/define-contract` (manual command)

**Key improvement:** Now runs automatically after component extraction, no manual coordination needed.
