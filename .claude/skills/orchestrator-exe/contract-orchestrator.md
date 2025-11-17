# Contract Orchestrator

**Isolation Level**: Orchestrator-EXE only
**Invocation**: Direct (not event-driven)
**Purpose**: Generate YAML contracts for autonomous flow validation and second-pass component orchestration with MCP integration

---

## Overview

The Contract Orchestrator skill transforms human-readable markdown component contracts into machine-readable YAML contracts optimized for autonomous validation workflows. It extracts structured data (inputs, outputs, CSS rules, dependencies) from `.system/contracts/*.md` files and generates YAML representations that integrate seamlessly with the MCP contract validation system.

This skill enables the THREE-PASS system to automate contract compliance checking, dependency validation, and conflict detection without human intervention, supporting batch component processing and parallel orchestration workflows.

---

## Invocation Pattern

**Direct Call (single component):**
```
Generate YAML contract for login-form component
```

**Batch Call (multiple components):**
```
Generate YAML contracts for all components in .system/contracts/
```

**Context-aware Call:**
```
Create YAML contract for button component with MCP validation metadata
```

**Integration with Pass Orchestration:**
```
Generate contracts for all second-pass components pending integration
```

---

## Capabilities

### 1. Markdown Contract Parsing

**Extract structured data from markdown contracts:**
- Parse inputs (required and optional props with types)
- Extract outputs (return values, methods, events)
- Identify CSS namespace rules and reserved classes
- Capture DOM requirements and structure
- List dependencies (components and libraries)
- Extract validation checklists and test cases

**Example Input** (from `.system/contracts/example-button-contract.md`):
```markdown
# Component Contract: Example Button

## Inputs
- **label** (string, required): Button text to display
- **onClick** (function, optional): Click handler, defaults to noop

## Outputs
- **element** (HTMLElement): The button DOM element
- **getCount()**: Returns click count
```

**Parsed Output Structure:**
```yaml
inputs:
  required:
    - name: "label"
      type: "string"
      description: "Button text to display"
  optional:
    - name: "onClick"
      type: "function"
      default: "noop"
      description: "Click handler"

outputs:
  return_value:
    type: "object"
    properties:
      - element: "HTMLElement"
      - getCount: "function"
```

### 2. YAML Contract Generation

**Generate machine-readable YAML contracts with:**
- **Contract Metadata**: Component name, source file, generated timestamp, version
- **Input/Output Specifications**: Typed parameters for validation
- **CSS Rules**: Namespace enforcement, reserved classes, allowed classes
- **Dependency Graph**: Required components, libraries, load order
- **Validation Rules**: Automated checks for 4-level validation system
- **MCP Metadata**: Registry data, conflict detection parameters

**YAML Contract Structure:**
```yaml
contract_metadata:
  component_name: "login-form"
  source_contract: ".system/contracts/login-form-contract.md"
  generated: "2025-11-15T10:00:00Z"
  version: "1.0"
  contract_type: "component"

inputs:
  required:
    - name: "containerId"
      type: "string"
      description: "DOM element ID for injection"
    - name: "onSubmit"
      type: "function"
      description: "Form submission handler"
  optional:
    - name: "showRememberMe"
      type: "boolean"
      default: true
      description: "Display remember me checkbox"

outputs:
  return_value:
    type: "object"
    properties:
      - element: "HTMLElement"
      - validate: "function"
      - reset: "function"
  events:
    - name: "submit"
      payload: "{username: string, password: string}"
    - name: "error"
      payload: "{field: string, message: string}"

css_rules:
  namespace: "component-login-form"
  reserved_classes: ["form", "input", "button", "label"]
  allowed_classes:
    - "component-login-form"
    - "component-login-form__header"
    - "component-login-form__input"
    - "component-login-form__button"
    - "component-login-form--error"
  namespace_enforcement: "strict"
  prefix_required: true

dom_requirements:
  container:
    selector: "#app-container"
    required: true
  structure: |
    <div class="component-login-form">
      <form>
        <input type="text" class="component-login-form__input">
        <input type="password" class="component-login-form__input">
        <button class="component-login-form__button">Login</button>
      </form>
    </div>

dependencies:
  components:
    - name: "password-input"
      version: "1.0"
      required: true
    - name: "submit-button"
      version: "1.2"
      required: true
  libraries:
    - name: "validator.js"
      version: "^13.0.0"
      source: "npm"
  load_order:
    - "password-input"
    - "submit-button"
    - "login-form"

validation_rules:
  level_1_syntax:
    html_valid: true
    css_valid: true
    js_valid: true

  level_2_unit_tests:
    test_suite_required: true
    coverage_threshold: 80

  level_3_contract:
    css_namespace_enforced: true
    dom_structure_matches: true
    interface_compliant: true
    all_inputs_handled: true
    all_outputs_provided: true

  level_4_integration:
    mcp_css_conflict_check: true
    mcp_js_conflict_check: true
    mcp_dependency_check: true
    integration_plan_required: true

mcp_metadata:
  registry_data:
    component_id: "login-form"
    namespace: "component-login-form"
    exposed_classes: ["component-login-form", "component-login-form__input", "component-login-form__button"]
    exposed_functions: ["createLoginForm", "validateLoginForm"]
    global_variables: []

  conflict_detection:
    css_conflicts:
      check_class_collisions: true
      check_id_conflicts: true
      check_style_bleeding: true
    js_conflicts:
      check_function_collisions: true
      check_global_variables: true
      check_circular_dependencies: true

  integration_safety:
    safe_injection_points: ["#app-container", "#login-section"]
    unsafe_injection_points: ["#global-nav", "#footer"]
    requires_preflight: true

validation_checklist:
  - id: "inputs_handled"
    description: "All required inputs are validated and handled"
    automated: true
  - id: "css_namespaced"
    description: "All CSS classes follow namespace convention"
    automated: true
  - id: "no_conflicts"
    description: "No CSS/JS conflicts detected via MCP"
    automated: true
  - id: "tests_pass"
    description: "All unit and integration tests pass"
    automated: true
  - id: "dependencies_met"
    description: "All component dependencies are available"
    automated: true
```

### 3. MCP Integration Support

**Generate MCP-compatible metadata for:**
- **Component Registry**: Registration data for MCP component-registry server
- **Conflict Detection**: Parameters for CSS/JS conflict checks (Level 4 validation)
- **Dependency Validation**: Version compatibility, load order, circular dependency detection
- **Integration Planning**: Safe injection points, preflight check requirements

**MCP Metadata Example:**
```yaml
mcp_metadata:
  registry_data:
    component_id: "data-table"
    namespace: "component-data-table"
    version: "1.0.0"
    exposed_classes:
      - "component-data-table"
      - "component-data-table__row"
      - "component-data-table__cell"
    exposed_functions: ["createDataTable", "sortTable", "filterTable"]
    global_variables: []

  conflict_detection:
    css_conflicts:
      check_class_collisions: true
      check_id_conflicts: true
      check_style_bleeding: true
      excluded_namespaces: ["global-", "utility-"]
    js_conflicts:
      check_function_collisions: true
      check_global_variables: true
      check_circular_dependencies: true
      safe_global_prefix: "DT_"

  dependency_graph:
    depends_on:
      - component_id: "sort-indicator"
        version: "^1.0.0"
        required: true
      - component_id: "pagination"
        version: "^2.1.0"
        required: false
    provides:
      - interface: "IDataTable"
        methods: ["render", "update", "destroy"]

  integration_safety:
    safe_injection_points: ["#content-area", ".dashboard-panel"]
    unsafe_injection_points: ["#header", "#sidebar"]
    requires_preflight: true
    parallel_safe: true
```

### 4. Companion Markdown Generation

**Create human-context markdown files when needed:**
- Component overview and usage guide
- Integration instructions for developers
- Known issues and workarounds
- Example usage scenarios
- Migration guide from previous versions

**Companion File Structure:**
```markdown
# Login Form Component - Integration Guide

**Generated**: 2025-11-15T10:00:00Z
**Contract**: .system/contracts/login-form-contract.md
**YAML Contract**: .system/parallel-work/contract-login-form-20251115.yaml

## Quick Start

```javascript
import { createLoginForm } from './components/login-form.js';

const loginForm = createLoginForm({
  containerId: 'app-container',
  onSubmit: (data) => console.log('Login:', data)
});
```

## Integration Notes

- **CSS Namespace**: All classes prefixed with `component-login-form-`
- **Dependencies**: Requires `password-input` and `submit-button` components
- **MCP Validation**: Passes all 4 levels (syntax, unit, contract, integration)

## Known Issues

- None at this time

## Migration from v0.9

- `onClick` prop renamed to `onSubmit`
- CSS classes now use BEM convention
```

### 5. Batch Contract Processing

**Process multiple components in a single operation:**
- Scan `.system/contracts/` directory for all markdown contracts
- Generate YAML contracts for each component
- Create dependency graph across all components
- Detect cross-component conflicts
- Generate batch validation report

**Batch Output Structure:**
```yaml
batch_metadata:
  generated: "2025-11-15T10:00:00Z"
  components_processed: 5
  contracts_generated: 5
  conflicts_detected: 1

components:
  - component_name: "login-form"
    yaml_contract: ".system/parallel-work/contract-login-form-20251115.yaml"
    status: "valid"
    conflicts: []

  - component_name: "data-table"
    yaml_contract: ".system/parallel-work/contract-data-table-20251115.yaml"
    status: "valid"
    conflicts: []

  - component_name: "navigation-menu"
    yaml_contract: ".system/parallel-work/contract-navigation-menu-20251115.yaml"
    status: "conflict_detected"
    conflicts:
      - type: "css_class_collision"
        conflict_with: "login-form"
        conflicting_class: "button"
        resolution: "Rename to component-navigation-menu__button"

dependency_graph:
  login-form:
    depends_on: ["password-input", "submit-button"]
    depended_by: []

  data-table:
    depends_on: ["sort-indicator", "pagination"]
    depended_by: ["dashboard"]

  dashboard:
    depends_on: ["data-table", "navigation-menu"]
    depended_by: []

load_order:
  - "password-input"
  - "submit-button"
  - "sort-indicator"
  - "pagination"
  - "login-form"
  - "data-table"
  - "navigation-menu"
  - "dashboard"

validation_summary:
  total_components: 5
  valid_contracts: 4
  conflicts_detected: 1
  warnings: 2
  ready_for_integration: 4
  blocked: 1
```

---

## Usage Examples

### Example 1: Single Component YAML Generation

**Operator Input:**
```
Generate YAML contract for the login-form component
```

**Skill Process:**
1. Read `.system/contracts/login-form-contract.md`
2. Parse all contract sections (inputs, outputs, CSS, dependencies)
3. Generate YAML representation
4. Add MCP metadata for validation
5. Save to `.system/parallel-work/contract-login-form-20251115.yaml`

**Skill Output:**
```
✓ Contract parsed: login-form
✓ YAML generated: .system/parallel-work/contract-login-form-20251115103000.yaml
✓ MCP metadata included
✓ Validation rules defined (4 levels)
✓ Dependencies identified: password-input, submit-button

Contract Summary:
  - Inputs: 3 (1 required, 2 optional)
  - Outputs: 3 methods, 2 events
  - CSS Classes: 4 allowed, 4 reserved
  - Dependencies: 2 components, 1 library
  - MCP Checks: CSS conflicts, JS conflicts, dependency validation

Ready for autonomous validation workflow.
```

### Example 2: Batch Processing All Contracts

**Operator Input:**
```
Generate YAML contracts for all components in .system/contracts/
```

**Skill Process:**
1. Scan `.system/contracts/` for all `*-contract.md` files
2. Parse each contract sequentially
3. Generate YAML for each component
4. Build cross-component dependency graph
5. Detect conflicts across all components
6. Generate batch summary report

**Skill Output:**
```
Batch Contract Generation
═══════════════════════════════════════════════════════════

Found 5 component contracts:
  ✓ login-form-contract.md
  ✓ data-table-contract.md
  ✓ navigation-menu-contract.md
  ✓ password-input-contract.md
  ✓ submit-button-contract.md

Processing...
  ✓ login-form → contract-login-form-20251115103000.yaml
  ✓ data-table → contract-data-table-20251115103001.yaml
  ⚠ navigation-menu → contract-navigation-menu-20251115103002.yaml (conflict detected)
  ✓ password-input → contract-password-input-20251115103003.yaml
  ✓ submit-button → contract-submit-button-20251115103004.yaml

Dependency Graph Generated:
  password-input (no dependencies)
    ↓
  submit-button (no dependencies)
    ↓
  login-form (depends on: password-input, submit-button)
    ↓
  navigation-menu (no dependencies)
    ↓
  data-table (no dependencies)

Conflicts Detected:
  ⚠ navigation-menu vs login-form
    - CSS class collision: "button"
    - Resolution: Rename to "component-navigation-menu__button"

Batch Summary:
  - Total components: 5
  - Valid contracts: 4
  - Conflicts: 1
  - Ready for integration: 4
  - Blocked: 1

Batch manifest: .system/parallel-work/batch-contracts-20251115103000.yaml

Next Steps:
  1. Resolve navigation-menu conflict
  2. Run autonomous validation workflow
  3. Proceed with second-pass integration
```

### Example 3: Contract with MCP Validation Metadata

**Operator Input:**
```
Generate YAML contract for data-table with full MCP validation metadata
```

**Skill Output:**
```
✓ Contract parsed: data-table
✓ YAML generated: .system/parallel-work/contract-data-table-20251115103000.yaml

MCP Metadata Summary:
  Component ID: data-table
  Namespace: component-data-table
  Exposed Classes: 8
  Exposed Functions: 3
  Global Variables: 0

Conflict Detection Configuration:
  ✓ CSS class collision check enabled
  ✓ CSS ID conflict check enabled
  ✓ CSS style bleeding check enabled
  ✓ JS function collision check enabled
  ✓ JS global variable check enabled
  ✓ Circular dependency check enabled

Integration Safety:
  ✓ Safe injection points defined: 2
  ✓ Unsafe injection points blocked: 2
  ✓ Preflight checks required: true
  ✓ Parallel-safe: true

Validation Rules:
  Level 1 (Syntax): HTML, CSS, JS validation
  Level 2 (Unit Tests): 80% coverage required
  Level 3 (Contract): Namespace, DOM, interface compliance
  Level 4 (Integration): MCP conflict detection, dependency validation

Ready for Level 4 MCP validation.
```

### Example 4: Dependency Graph Extraction

**Operator Input:**
```
Generate contracts and build dependency graph for all components
```

**Skill Output:**
```
Dependency Graph Analysis
═══════════════════════════════════════════════════════════

Components: 5
Dependency Relationships: 7

Graph Structure:
  password-input (leaf)
    ↓
  submit-button (leaf)
    ↓
  login-form (depends on: password-input, submit-button)
    ↓
  sort-indicator (leaf)
    ↓
  pagination (leaf)
    ↓
  data-table (depends on: sort-indicator, pagination)
    ↓
  navigation-menu (leaf)
    ↓
  dashboard (depends on: data-table, navigation-menu)

Load Order:
  1. password-input (no dependencies)
  2. submit-button (no dependencies)
  3. sort-indicator (no dependencies)
  4. pagination (no dependencies)
  5. navigation-menu (no dependencies)
  6. login-form (after: password-input, submit-button)
  7. data-table (after: sort-indicator, pagination)
  8. dashboard (after: data-table, navigation-menu)

Parallel-Safe Groups:
  Group 1 (parallel): password-input, submit-button, sort-indicator, pagination, navigation-menu
  Group 2 (parallel): login-form, data-table
  Group 3 (sequential): dashboard

Circular Dependencies: None detected

Critical Path: dashboard → data-table → {sort-indicator, pagination}

Dependency graph saved: .system/parallel-work/dependency-graph-20251115103000.yaml
```

### Example 5: Contract Regeneration for Updated Component

**Operator Input:**
```
Regenerate YAML contract for login-form (contract updated)
```

**Skill Output:**
```
Regenerating contract: login-form
═══════════════════════════════════════════════════════════

Previous Contract: .system/parallel-work/contract-login-form-20251115100000.yaml
Updated Source: .system/contracts/login-form-contract.md

Changes Detected:
  + New optional input: "showForgotPassword" (boolean)
  + New event: "forgotPassword" (payload: {email: string})
  ~ CSS classes updated: +2 new classes
  - Removed deprecated method: "legacyValidate"

New Contract Generated: .system/parallel-work/contract-login-form-20251115103000.yaml

Validation Impact:
  ⚠ Dependent components may need updates:
    - None found (login-form is a leaf component)

  ✓ Backward compatible: Yes
  ✓ Breaking changes: No

MCP Re-validation Required:
  ✓ CSS conflicts (2 new classes to check)
  ✓ JS conflicts (1 removed method)
  ✓ Integration plan (safe injection points unchanged)

Contract version incremented: 1.0 → 1.1

Ready for autonomous re-validation.
```

---

## Integration Points

### Reads:
- `.system/contracts/*.md` - Human-readable markdown component contracts
- `.system/contracts/component-contract-template.md` - Contract template structure
- `.system/execution-status.yaml` - Current pass mode (first/second/third), component status
- `docs/sprint-artifacts/sprint-status.yaml` - Story statuses (optional, for context)
- `.bmad/bmm/config.yaml` - Project configuration (optional, for versioning)

### Writes:
- `.system/parallel-work/contract-{component}-{timestamp}.yaml` - Generated YAML contracts
- `.system/parallel-work/batch-contracts-{timestamp}.yaml` - Batch processing manifest
- `.system/parallel-work/dependency-graph-{timestamp}.yaml` - Component dependency graph
- `.system/parallel-work/{component}-integration-guide.md` - Companion markdown (optional)

### Invokes:
- None (pure generation skill, no agent invocation)
- Integration with MCP component-registry server occurs during Level 4 validation (by other skills)

---

## Isolation Rules

### Orchestrator-EXE Only
- This skill runs exclusively in the Orchestrator-EXE isolation layer
- Does NOT emit events to BMAD event system
- Does NOT invoke BMAD agents or autonomous skills
- Synchronous operation with direct output

### Top-Down Flow Only
- Orchestrator → Contract Orchestrator (allowed)
- Contract Orchestrator → Orchestrator (return values only)
- Contract Orchestrator → BMAD agents (NOT allowed)
- Contract Orchestrator → MCP servers (indirect, via validation metadata only)

### No Side Effects
- Read-only operations on contract files
- Write YAML contracts to designated parallel-work directory
- No execution-status modifications (read-only)
- No component code modifications

### Integration with Autonomous Workflows
- Generates YAML contracts consumed by autonomous validation workflows
- Output used by `component-validation` skill (Level 4 MCP checks)
- Compatible with `pass-orchestration` skill for second-pass automation
- Does NOT trigger autonomous workflows (operator-initiated only)

---

## YAML Contract Conventions

### Naming Convention
- **Format**: `contract-{component-name}-{timestamp}.yaml`
- **Example**: `contract-login-form-20251115103000.yaml`
- **Timestamp**: `YYYYMMDDHHmmss` (ISO 8601 simplified)

### Required Fields
All generated YAML contracts MUST include:
- `contract_metadata` (component name, source, generated timestamp, version)
- `inputs` (required and optional parameters)
- `outputs` (return values, methods, events)
- `css_rules` (namespace, reserved classes, allowed classes)
- `dependencies` (components, libraries, load order)
- `validation_rules` (4-level validation configuration)
- `mcp_metadata` (registry data, conflict detection config)
- `validation_checklist` (automated checks with IDs)

### Optional Fields
- `dom_requirements` (container, structure)
- `companion_markdown` (path to integration guide)
- `migration_notes` (version upgrade instructions)
- `known_issues` (documented bugs or limitations)

### Metadata Standards
- **Timestamps**: ISO 8601 format (`2025-11-15T10:00:00Z`)
- **Versions**: Semantic versioning (`1.0.0`, `1.2.3`)
- **Booleans**: Lowercase (`true`, `false`)
- **Namespaces**: Kebab-case with `component-` prefix (`component-login-form`)

---

## Error Handling

### Missing Contract File
```
⚠ Error: Contract file not found
  Path: .system/contracts/login-form-contract.md
  Suggestion: Verify component name or create contract using template
```

### Malformed Contract
```
⚠ Error: Contract parsing failed
  File: .system/contracts/data-table-contract.md
  Issue: Missing required section "Inputs"
  Suggestion: Contract must include: Inputs, Outputs, CSS Contract, Dependencies
```

### Circular Dependencies Detected
```
⚠ Error: Circular dependency detected
  Chain: dashboard → data-table → navigation-menu → dashboard
  Suggestion: Refactor component dependencies to eliminate cycle
```

### CSS Namespace Conflict
```
⚠ Error: CSS namespace conflict
  Component: navigation-menu
  Conflict: Class "button" overlaps with login-form
  Resolution: Rename to "component-navigation-menu__button"
  Action: Update contract and regenerate YAML
```

### MCP Integration Warning
```
⚠ Warning: MCP server not available
  Server: component-registry
  Impact: Level 4 validation metadata generated but not validated
  Suggestion: Ensure MCP server running before autonomous validation
```

---

## Advanced Usage

### Contract Versioning
```
Generate versioned YAML contract for login-form v2.0 with migration notes
```

### Selective Batch Processing
```
Generate contracts for components with status "extracted" in execution-status.yaml
```

### Dependency-First Ordering
```
Generate contracts in dependency order (leaves first, roots last)
```

### MCP Preflight Check
```
Generate contract and validate against MCP registry before saving
```

### Incremental Updates
```
Regenerate contracts only for components modified since last generation
```

---

## Best Practices

### For Contract Authors:
1. **Complete Contracts**: Ensure all required sections present in markdown
2. **Consistent Naming**: Use kebab-case for component names
3. **Namespace Discipline**: Enforce `component-{name}-` prefix for all CSS
4. **Dependency Clarity**: Explicitly list all component and library dependencies
5. **Validation Checklist**: Include automated checks in contract

### For YAML Generation:
1. **Preserve Timestamps**: Keep original generated timestamp for audit trail
2. **Version Incrementing**: Bump version on contract updates
3. **Backward Compatibility**: Flag breaking changes in metadata
4. **MCP Completeness**: Include all registry and conflict detection metadata
5. **Human Context**: Generate companion markdown for complex components

### For Integration:
1. **Batch Processing**: Generate all contracts before starting autonomous validation
2. **Dependency Order**: Process components in dependency order (leaves → roots)
3. **Conflict Resolution**: Fix conflicts before proceeding to integration
4. **MCP Validation**: Ensure MCP server available before Level 4 checks
5. **Incremental Updates**: Regenerate only changed contracts for efficiency

---

## Notes

- YAML contracts are machine-readable representations for autonomous workflows
- Markdown contracts remain the source of truth (human-maintained)
- MCP integration occurs during Level 4 validation (not during generation)
- Companion markdown files optional but recommended for complex components
- Dependency graphs support parallel component processing
- Circular dependencies are detected and flagged as errors
- Contract versioning supports backward compatibility tracking
- Timestamps enable audit trail and incremental updates
- Integration with `component-validation` skill for end-to-end workflow
- Output optimized for consumption by autonomous BMAD skills
