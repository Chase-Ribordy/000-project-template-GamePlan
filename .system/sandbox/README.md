# Sandbox Testing

## Purpose
Test components in complete isolation before integration

## What Goes Here
- Isolated test environments
- Component sandboxes
- Visual regression tests
- Performance tests

## Workflow
1. Component built in components/
2. Copy to sandbox/ for isolated testing
3. Run in minimal HTML environment
4. Verify: rendering, behavior, performance
5. Only if passes: Mark as proven

## Why Sandbox?
- No interference from other components
- Clean environment = reliable tests
- Catch integration issues early
- Prove it works before integrating

## See Also
- `test-template.html` - Minimal test environment
- `/prove-it-works` command - Sandbox testing workflow
