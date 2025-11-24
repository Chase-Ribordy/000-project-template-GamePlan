# UI/UX Standards Guide

> Standardized patterns for consistent development across all passes.

## Purpose

This guide ensures:
- Consistent look and feel across components
- Predictable patterns for dev agents to follow
- Reduced decision-making during implementation
- Easier review during second pass

---

## Design Principles

### 1. Mobile-First
- Design for 375px width first
- Enhance for larger screens
- Touch targets: minimum 44x44px

### 2. Accessibility
- WCAG 2.1 AA compliance minimum
- Keyboard navigation for all interactions
- Sufficient color contrast (4.5:1 for text)
- Screen reader compatible

### 3. Performance
- No layout shift (CLS < 0.1)
- Interactive within 100ms
- Lazy load off-screen content

---

## Component Patterns

### Buttons

```css
/* Primary Action */
.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  min-height: 44px;
}

/* Secondary Action */
.btn-secondary {
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
}

/* Destructive Action */
.btn-danger {
  background: var(--color-danger);
  color: white;
}
```

**Usage:**
- One primary button per view
- Secondary for alternative actions
- Danger for destructive actions (delete, cancel)

### Forms

```css
.form-field {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 16px; /* Prevents iOS zoom */
}

.form-input:focus {
  outline: 2px solid var(--color-primary);
  border-color: var(--color-primary);
}

.form-error {
  color: var(--color-danger);
  font-size: 14px;
  margin-top: 4px;
}
```

**Validation:**
- Show errors inline below field
- Validate on blur, re-validate on change
- Clear error when field becomes valid

### Cards

```css
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 16px;
}

.card-header {
  font-weight: 600;
  margin-bottom: 12px;
}

.card-body {
  color: var(--color-text-secondary);
}

.card-actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}
```

### Navigation

```css
.nav {
  display: flex;
  gap: 8px;
  padding: 8px;
}

.nav-item {
  padding: 8px 16px;
  border-radius: 4px;
}

.nav-item.active {
  background: var(--color-primary);
  color: white;
}

/* Mobile: Bottom navigation */
@media (max-width: 768px) {
  .nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    justify-content: space-around;
    background: white;
    border-top: 1px solid var(--color-border);
  }
}
```

---

## Color System

```css
:root {
  /* Primary */
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-primary-light: #3b82f6;

  /* Semantic */
  --color-success: #16a34a;
  --color-warning: #ca8a04;
  --color-danger: #dc2626;
  --color-info: #0891b2;

  /* Neutral */
  --color-text: #1f2937;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
  --color-background: #f9fafb;

  /* Surface */
  --color-surface: #ffffff;
  --color-surface-elevated: #ffffff;
}
```

---

## Spacing System

Use consistent spacing multiples:

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-8: 48px;
}
```

**Usage:**
- `space-2`: Tight grouping (icon + text)
- `space-3`: Related items
- `space-4`: Section padding
- `space-5`: Between sections
- `space-6`: Page margins

---

## Typography

```css
:root {
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 30px;
}

h1 { font-size: var(--text-3xl); font-weight: 700; }
h2 { font-size: var(--text-2xl); font-weight: 600; }
h3 { font-size: var(--text-xl); font-weight: 600; }
body { font-size: var(--text-base); line-height: 1.5; }
.text-small { font-size: var(--text-sm); }
```

---

## Loading States

```css
/* Skeleton loader */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Spinner */
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

**Usage:**
- Skeleton for content loading
- Spinner for actions in progress
- Always show loading state after 200ms delay

---

## Error States

```css
.error-container {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 16px;
  color: var(--color-danger);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--color-text-secondary);
}
```

---

## Responsive Breakpoints

```css
/* Mobile first */
.container { padding: 16px; }

/* Tablet */
@media (min-width: 768px) {
  .container { padding: 24px; max-width: 720px; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { max-width: 960px; }
}

/* Large desktop */
@media (min-width: 1280px) {
  .container { max-width: 1200px; }
}
```

---

## For Dev Agents

### First Pass
- Use basic HTML structure
- Apply minimal inline styles if needed
- Focus on functionality, not appearance
- Skip this guide entirely

### Second Pass
- Reference this guide for all styling
- Use CSS variables from color/spacing system
- Follow component patterns exactly
- Ensure responsive behavior

### Third Pass
- Fix any visual bugs reported
- Ensure consistency with this guide
- Add missing loading/error states
- Polish animations and transitions

---

*Customize this guide for your specific project's design system.*
