# Component Contract: [ComponentName]

## Overview
**Purpose**: [What does this component do?]
**Created**: [Date]
**Status**: [Draft/Approved/Implemented]

---

## Inputs

### Required Props
- `data`: [Type] - [Description]
- `config`: [Type] - [Description]

### Optional Props
- `onComplete`: [Type] - [Description] (default: noop)

### Example
```javascript
{
  data: [1, 2, 3, 4, 5],
  config: { width: 400, height: 400 },
  onComplete: (result) => console.log(result)
}
```

---

## Outputs

### Return Value
- Type: [Type]
- Description: [What it returns]

### Events
- `onSegmentClick(segment)` - Triggered when: [condition]
- `onAnimationComplete()` - Triggered when: [condition]

---

## DOM Requirements

### Container
- ID: `#[component-name]-container`
- Minimum dimensions: [width] x [height]
- Required attributes: [list]

### DOM Structure
```html
<div id="component-container">
  <!-- Component renders here -->
</div>
```

---

## CSS Contract

### Namespace
All classes prefixed with: `.component-[name]-`

### Reserved Classes (DO NOT USE)
- `.btn` - Global button class
- `.container` - Global container
- `.header` - Global header

### Example Classes
- `.component-name-wrapper`
- `.component-name-title`
- `.component-name-content`

---

## Dependencies

### Required Components
- [component-1] - Why needed
- [component-2] - Why needed

### External Libraries
- [library-name]@[version] - Why needed

---

## Integration Points

### Injection Markers
```html
<!-- INJECT:component-name:HTML -->
/* INJECT:component-name:CSS */
// INJECT:component-name:JS
```

### Integration Order
1. [First dependency]
2. [Second dependency]
3. This component

---

## Validation Checklist

Before marking as implemented:
- [ ] All required inputs handled
- [ ] All outputs implemented
- [ ] DOM requirements met
- [ ] CSS properly namespaced
- [ ] No reserved class conflicts
- [ ] Dependencies available
- [ ] Injection markers exist in target
- [ ] Unit tests cover all inputs/outputs

---

## Test Cases

### Valid Inputs
```javascript
// Test Case 1: Normal data
{ data: [1, 2, 3], config: { width: 400 } }
// Expected: Renders correctly

// Test Case 2: Edge case
{ data: [], config: { width: 100 } }
// Expected: Shows empty state
```

### Invalid Inputs
```javascript
// Test Case 1: Missing required prop
{ config: { width: 400 } }
// Expected: Throws error "data is required"
```

---

## Notes
[Any additional implementation notes]

## Related Contracts
- [Related component 1]
- [Related component 2]
