# Component Contract: Example Button

## Overview
**Purpose**: Demonstrates the complete quality-first workflow with a simple, interactive button component that shows click counts.
**Created**: 2025-01-15
**Status**: Implemented

---

## Inputs

### Required Props
- `label`: String - Text displayed on the button
- `containerId`: String - DOM element ID where button will render

### Optional Props
- `onClick`: Function - Callback fired when button clicked (default: noop)
- `variant`: String - Visual style: 'primary', 'secondary', or 'danger' (default: 'primary')
- `disabled`: Boolean - Whether button is disabled (default: false)

### Example
```javascript
{
  label: "Click Me",
  containerId: "button-container",
  onClick: (count) => console.log(`Clicked ${count} times`),
  variant: "primary",
  disabled: false
}
```

---

## Outputs

### Return Value
- Type: Object
- Properties:
  - `element`: HTMLElement - The button DOM element
  - `getCount`: Function - Returns current click count
  - `reset`: Function - Resets count to 0
  - `destroy`: Function - Removes button and cleans up

### Events
- `onClick(count)` - Triggered when button clicked, passes current count

---

## DOM Requirements

### Container
- ID: Must match `containerId` parameter
- Minimum dimensions: Auto (button sizes itself)
- Required attributes: None

### DOM Structure
```html
<div id="button-container">
  <!-- Button renders here -->
  <button class="component-example-button component-example-button--primary">
    <span class="component-example-button__label">Click Me</span>
    <span class="component-example-button__count">0</span>
  </button>
</div>
```

---

## CSS Contract

### Namespace
All classes prefixed with: `.component-example-button`

### Reserved Classes (DO NOT USE)
- `.btn` - Global button class
- `.button` - Common global class
- `.primary` - Global variant class

### Component Classes
- `.component-example-button` - Base button element
- `.component-example-button--primary` - Primary variant
- `.component-example-button--secondary` - Secondary variant
- `.component-example-button--danger` - Danger variant
- `.component-example-button--disabled` - Disabled state
- `.component-example-button__label` - Label text
- `.component-example-button__count` - Count badge

---

## Dependencies

### Required Components
None - This is a standalone component

### External Libraries
None - Pure JavaScript

---

## Integration Points

### Injection Markers
```html
<!-- INJECT:example-button:HTML -->
/* INJECT:example-button:CSS */
// INJECT:example-button:JS
```

### Integration Order
1. This component (no dependencies)

---

## Validation Checklist

Before marking as implemented:
- [x] All required inputs handled (label, containerId)
- [x] All optional inputs with defaults (onClick, variant, disabled)
- [x] All outputs implemented (element, getCount, reset, destroy)
- [x] DOM requirements met (renders in container)
- [x] CSS properly namespaced (component-example-button-*)
- [x] No reserved class conflicts (checked: btn, button, primary)
- [x] Dependencies available (none required)
- [x] Injection markers exist in target (N/A - standalone)
- [x] Unit tests cover all inputs/outputs (3 tests passing)

---

## Test Cases

### Valid Inputs
```javascript
// Test Case 1: Minimal required props
{
  label: "Click Me",
  containerId: "test-container"
}
// Expected: Renders with default primary variant, count starts at 0

// Test Case 2: All props specified
{
  label: "Delete",
  containerId: "test-container",
  onClick: (count) => console.log(count),
  variant: "danger",
  disabled: false
}
// Expected: Renders danger button, fires onClick callback

// Test Case 3: Disabled state
{
  label: "Disabled",
  containerId: "test-container",
  disabled: true
}
// Expected: Renders disabled button, clicks don't increment count
```

### Invalid Inputs
```javascript
// Test Case 1: Missing required prop (label)
{
  containerId: "test-container"
}
// Expected: Throws error "label is required"

// Test Case 2: Missing required prop (containerId)
{
  label: "Click Me"
}
// Expected: Throws error "containerId is required"

// Test Case 3: Invalid variant
{
  label: "Click Me",
  containerId: "test-container",
  variant: "invalid"
}
// Expected: Falls back to 'primary' variant (defensive)
```

---

## Notes

This component demonstrates:
1. **Contract-First Development** - This contract was written BEFORE any code
2. **Clear Interfaces** - Explicit inputs/outputs prevent integration bugs
3. **CSS Namespacing** - Avoids global class conflicts
4. **Test Cases** - Contract defines expected behavior for tests
5. **Validation Checklist** - Self-documenting quality gate

This is a reference example showing the complete quality workflow:
- Contract (this file)
- Implementation (components/example-button/example-button.js)
- Tests (components/example-button/example-button.test.js)
- Sandbox (sandbox/example-button-test.html)
- Proven (proven/example-button/ after validation)

## Related Contracts
None - This is a standalone example component
