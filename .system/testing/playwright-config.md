# Playwright MCP Configuration for Autonomous Testing

> Agent-facing documentation for autonomous browser testing using Playwright MCP.

## Overview

Playwright MCP enables **fully autonomous browser testing** where agents can open browsers, execute tests, capture screenshots, read console output, and validate visual output - all without operator intervention.

**Key Benefit:** Operators do NOT need to manually relay console information. The Playwright MCP provides direct browser access to agents.

---

## MCP Server Configuration

Located in `.mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### Available Launch Arguments

Add these to the `args` array as needed:

| Argument | Description |
|----------|-------------|
| `--headless` | Run browser in headless mode (default: headed) |
| `--browser <type>` | Browser to use: `chrome`, `firefox`, `webkit`, `msedge` |
| `--device <name>` | Emulate device, e.g., "iPhone 15" |
| `--caps vision,pdf` | Enable additional capabilities |
| `--ignore-https-errors` | Ignore HTTPS certificate errors |

---

## Available MCP Tools

### Navigation Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `browser_navigate` | Navigate to a URL | `url` (string) |
| `browser_go_back` | Navigate back in history | - |
| `browser_go_forward` | Navigate forward in history | - |
| `browser_close` | Close browser and release resources | - |

### Interaction Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `browser_click` | Click an element | `element` (description), `ref` (element reference) |
| `browser_type` | Type text into element | `element`, `ref`, `text` |
| `browser_hover` | Hover over element | `element`, `ref` |
| `browser_select_option` | Select dropdown option | `element`, `ref`, `values` |
| `browser_press_key` | Press keyboard key | `key` |
| `browser_drag` | Drag element to target | `startElement`, `endElement` |

### Screenshot & Visual Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `browser_take_screenshot` | Capture page screenshot | - |
| `browser_snapshot` | Get accessibility tree snapshot | - |
| `browser_pdf_save` | Save page as PDF | `filename` |

### Console & Debugging Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `browser_console_messages` | Get browser console logs | - |
| `browser_evaluate` | Execute JavaScript in browser | `expression` |
| `browser_network_requests` | Get network request log | - |

### Content Retrieval Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `browser_get_visible_text` | Get visible text content | - |
| `browser_get_visible_html` | Get HTML content | - |

---

## Usage Patterns for Agents

### Pattern 1: First Pass - Skeleton Validation

Used during the first pass to validate functional completeness.

```
AGENT WORKFLOW: Skeleton Validation
1. browser_navigate → index.html (or local dev server)
2. browser_snapshot → Verify DOM structure exists
3. browser_evaluate → Run basic functional tests
4. browser_console_messages → Check for JavaScript errors
5. browser_take_screenshot → Document current state
6. Report: PASS/FAIL with details
```

**Example Agent Prompt:**
```
Use Playwright MCP to validate the skeleton:
1. Open browser to file:///path/to/index.html
2. Check console for errors
3. Verify all major elements exist
4. Screenshot current state
5. Report any issues found
```

### Pattern 2: Second Pass - Component Integration Testing

Used during the second pass to validate styled components.

```
AGENT WORKFLOW: Component Integration Test
1. browser_navigate → Component sandbox test page
2. browser_snapshot → Verify component renders
3. browser_click → Test interactive elements
4. browser_console_messages → Check for runtime errors
5. browser_take_screenshot → Capture visual state
6. Compare against contract requirements
7. Report: PASS/FAIL with visual evidence
```

**Example Agent Prompt:**
```
Use Playwright MCP to test [Component-Name]:
1. Open the sandbox test at .system/sandbox/[component]-test.html
2. Verify component renders without console errors
3. Test all interactive behaviors
4. Capture screenshot for visual validation
5. Report compliance with contract
```

### Pattern 3: Full-Auto Mode - Test-Fix-Verify Loop

Agents run tests, identify issues, fix them, and re-verify autonomously.

```
AGENT WORKFLOW: Autonomous Test-Fix Loop
1. browser_navigate → Test target
2. browser_console_messages → Collect errors
3. IF errors:
   a. Analyze error messages
   b. Identify source file and issue
   c. Apply fix
   d. browser_navigate → Refresh
   e. browser_console_messages → Verify fix
   f. REPEAT until clean
4. browser_take_screenshot → Document success
5. Report: All issues resolved
```

**Example Agent Prompt:**
```
Use Playwright MCP in full-auto mode:
1. Open browser to local dev server
2. Check console for any errors
3. For each error found:
   - Identify the source file
   - Fix the issue
   - Refresh and verify fix worked
4. Continue until console is clean
5. Screenshot final state
6. Report all fixes applied
```

---

## Integration with Orc-EXE

ORC-EXE coordinates when and how Playwright tests run.

### Test Triggers

| Trigger | Test Type | Coordinated By |
|---------|-----------|----------------|
| Story completion | Skeleton validation | Orc-EXE → Dev Agent |
| Component build complete | Component integration | Orc-EXE → Review Queue |
| Milestone checkpoint | Full application test | Orc-EXE → QA Gate |
| Bug fix applied | Regression test | Orc-EXE → Debug Agent |

### Orc-EXE Commands for Testing

```
*test-skeleton [story]     - Run first-pass validation for story
*test-component [name]     - Run component integration test
*test-milestone           - Run milestone checkpoint tests
*test-full               - Run complete application test suite
```

### Test Result Handling

1. **PASS**: Update sprint status, proceed to next item
2. **FAIL - Auto-fixable**: Agent attempts fix, re-runs test
3. **FAIL - Needs Review**: Add to review queue with evidence
4. **FAIL - Critical**: Block milestone, notify operator

---

## Console Log Analysis

Agents can autonomously analyze console output:

```javascript
// Use browser_console_messages to get logs, then analyze:

ERROR patterns to auto-fix:
- "ReferenceError: X is not defined" → Check imports/definitions
- "TypeError: Cannot read property" → Check null/undefined handling
- "SyntaxError" → Check file syntax

WARNING patterns to note:
- "Deprecation warning" → Log for future fix
- "Missing resource" → Check file paths

INFO patterns to verify:
- "Component initialized" → Expected behavior
- "Event fired" → Expected behavior
```

---

## Screenshot Documentation

Screenshots captured during testing are stored for:
- Visual regression comparison
- Bug report evidence
- Progress documentation

**Storage Location:** `.system/testing/screenshots/`

**Naming Convention:** `[timestamp]-[test-type]-[target].png`

---

## Headless vs Headed Mode

| Mode | Use Case | Configuration |
|------|----------|---------------|
| **Headed** (default) | Operator wants to watch tests | No additional args |
| **Headless** | CI/CD, background testing | Add `--headless` to args |

For development, **headed mode** is recommended so operators can observe agent behavior.

---

## Error Recovery

If Playwright MCP becomes unresponsive:

1. `browser_close` to release resources
2. Wait 2 seconds
3. `browser_navigate` to restart session

If persistent issues:
1. Restart Claude Code session
2. Verify Playwright installation: `npx playwright install`

---

## Related Documentation

- `.mcp.json` - MCP server configuration
- `.system/README.md` - Agent infrastructure overview
- `docs/orc-exe/README.md` - Orc-EXE coordination guide
- `.system/validation/` - Validation scripts and utilities
