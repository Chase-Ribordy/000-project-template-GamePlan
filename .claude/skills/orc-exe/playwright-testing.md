# Playwright Testing Skill

> Autonomous browser testing via Playwright MCP for orc-exe coordination.

## Purpose

This skill enables orc-exe to coordinate autonomous browser testing using Playwright MCP. Agents can open browsers, run tests, capture screenshots, read console output, and validate visual output - all without operator intervention.

## Key Principle

**Operators do NOT need to manually relay console information.** Playwright MCP provides direct browser access to agents.

---

## Test Commands

### *test-skeleton [story]

Run first-pass skeleton validation for a specific story.

**Workflow:**
1. Identify story target URL/file
2. Use `browser_navigate` to open target
3. Use `browser_snapshot` to verify DOM structure
4. Use `browser_console_messages` to check for errors
5. Use `browser_take_screenshot` to document state
6. Report PASS/FAIL with details

**Example Usage:**
```
*test-skeleton story-001

Orc-EXE: Running skeleton validation for story-001...
- Opening file:///[project]/index.html
- Checking DOM structure: PASS (all elements present)
- Console errors: NONE
- Screenshot captured: skeleton-story-001.png
Result: PASS - Skeleton complete for story-001
```

---

### *test-component [name]

Run component integration test (second-pass).

**Workflow:**
1. Locate component sandbox test at `.system/sandbox/[name]-test.html`
2. Use `browser_navigate` to open sandbox
3. Use `browser_snapshot` to verify component renders
4. Use `browser_click` / `browser_type` to test interactions
5. Use `browser_console_messages` for runtime errors
6. Use `browser_take_screenshot` for visual validation
7. Compare against contract requirements
8. Report PASS/FAIL with visual evidence

**Example Usage:**
```
*test-component header

Orc-EXE: Running component integration test for header...
- Opening .system/sandbox/header-test.html
- Component renders: PASS
- Click interactions: PASS (3/3 buttons respond)
- Console errors: NONE
- Screenshot captured: component-header.png
- Contract compliance: PASS
Result: PASS - Component header ready for integration
```

---

### *test-milestone

Run milestone checkpoint tests for all stories in current chunk.

**Workflow:**
1. Load current chunk from parallel-boundaries.yaml
2. For each story in chunk:
   a. Run skeleton validation
   b. Collect results
3. Aggregate results
4. Report milestone readiness

**Example Usage:**
```
*test-milestone

Orc-EXE: Running milestone checkpoint for Chunk 1...
- story-001: PASS
- story-002: PASS
- story-003: FAIL (console error in navigation.js)

Milestone Status: NOT READY
Issues to resolve:
1. story-003: ReferenceError in navigation.js line 42

Recommendation: Fix story-003 or use *test-fix-loop
```

---

### *test-full

Run complete application test suite.

**Workflow:**
1. Open main application entry point
2. Navigate through all major routes/views
3. Test all interactive elements
4. Capture screenshots at each major state
5. Collect all console output
6. Generate comprehensive report

**Example Usage:**
```
*test-full

Orc-EXE: Running full application test...

Navigation Tests:
- Home page: PASS
- About page: PASS
- Contact page: PASS

Interaction Tests:
- Form submission: PASS
- Button clicks: PASS
- Modal dialogs: PASS

Console Analysis:
- Errors: 0
- Warnings: 2 (deprecation notices)

Screenshots captured: 8
Test duration: 45 seconds

Result: PASS (2 non-critical warnings)
```

---

### *test-fix-loop

Enter autonomous test-fix-verify loop.

**Workflow:**
1. Run tests and collect errors
2. FOR EACH error:
   a. Analyze error message
   b. Identify source file and line
   c. Apply fix
   d. Refresh browser
   e. Verify fix worked
   f. Continue or rollback
3. Report all fixes applied

**Example Usage:**
```
*test-fix-loop

Orc-EXE: Entering autonomous test-fix-verify loop...

Iteration 1:
- Error found: ReferenceError: initNav is not defined
- Source: js/navigation.js:42
- Fix applied: Added import for initNav function
- Verification: PASS

Iteration 2:
- Error found: TypeError: Cannot read property 'classList' of null
- Source: js/theme.js:15
- Fix applied: Added null check before classList access
- Verification: PASS

Iteration 3:
- No errors found

Loop completed: 2 fixes applied
All tests now passing.
```

---

## Playwright MCP Tools Reference

### Navigation
| Tool | Use |
|------|-----|
| `browser_navigate` | Open URL or local file |
| `browser_go_back` | Navigate back |
| `browser_go_forward` | Navigate forward |
| `browser_close` | Release browser resources |

### Interaction
| Tool | Use |
|------|-----|
| `browser_click` | Click elements |
| `browser_type` | Type into inputs |
| `browser_hover` | Hover over elements |
| `browser_select_option` | Select dropdowns |
| `browser_press_key` | Keyboard input |

### Visual
| Tool | Use |
|------|-----|
| `browser_take_screenshot` | Capture page image |
| `browser_snapshot` | Get accessibility tree |
| `browser_pdf_save` | Save as PDF |

### Console & Debug
| Tool | Use |
|------|-----|
| `browser_console_messages` | Get console logs |
| `browser_evaluate` | Execute JavaScript |
| `browser_network_requests` | Get network log |

---

## Error Patterns and Auto-Fixes

### JavaScript Errors

| Pattern | Auto-Fix |
|---------|----------|
| `ReferenceError: X is not defined` | Check imports/exports, add missing definition |
| `TypeError: Cannot read property` | Add null/undefined checks |
| `SyntaxError` | Check for typos, missing brackets |
| `Uncaught Error: Module not found` | Verify import paths |

### CSS Issues

| Pattern | Auto-Fix |
|---------|----------|
| Element not visible | Check display, visibility, z-index |
| Layout broken | Check flexbox/grid properties |
| Colors wrong | Verify CSS variable usage |

### DOM Issues

| Pattern | Auto-Fix |
|---------|----------|
| Element not found | Check selector, verify element exists |
| Multiple elements | Use more specific selector |
| Timing issues | Add appropriate waits |

---

## Integration with Passes

### First Pass (Skeleton)
- Use `*test-skeleton` after each story
- Focus on functional completeness
- Ignore visual polish

### Second Pass (Components)
- Use `*test-component` after each component build
- Focus on contract compliance
- Capture visual evidence

### Third Pass (Polish)
- Use `*test-full` for regression
- Use `*test-fix-loop` for bug fixes
- Focus on production readiness

---

## Related Documentation

- `.system/testing/playwright-config.md` - Full Playwright MCP configuration
- `.mcp.json` - MCP server configuration
- `.system/README.md` - Agent infrastructure overview
