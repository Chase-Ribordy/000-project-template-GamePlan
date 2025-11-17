# Production Ready Skill

**Autonomy Level:** Fully Autonomous

**Purpose:** Automatically migrate integrated components from `.system/proven/` to `src/` production folder after successful integration.

## Trigger Conditions

### Auto-Triggers
- **Event:** `component_integrated`
- **Condition:** Component has been validated (all 4 levels), proven in sandbox, and successfully integrated into main files
- **Priority:** 5 (after component integration)

### Manual Triggers
- "move {component_name} to production"
- "make {component_name} production ready"
- "migrate {component_name} to src"

## Skill Workflow

When this skill is triggered (automatically after `component_integrated` event):

### 1. Verify Component Integration Status

Check `.system/execution-status.yaml`:
```yaml
stories:
  story-1-user-authentication:
    pass_status:
      second-pass:
        components:
          - name: "login-form"
            status: "integrated"  # ← Must be "integrated" to proceed
            integrated_date: "2025-01-15T11:30:00Z"
```

### 2. Load Component from Proven Directory

```
Location: .system/proven/{component_name}/
Files:
  - {component_name}.html
  - {component_name}.css
  - {component_name}.js (if applicable)
  - {component_name}.test.js
  - contract.md
  - validation-report.md
```

### 3. Create Production Directory Structure

Create directory in `src/`:

```
src/{component_name}/
├── {component_name}.html
├── {component_name}.css
├── {component_name}.js
├── {component_name}.test.js
└── contract.md (reference copy)
```

### 4. Copy Component Files

**Source:** `.system/proven/{component_name}/`
**Destination:** `src/{component_name}/`

**Files to copy:**
- All component files (HTML, CSS, JS, tests)
- Contract (as reference documentation)
- Validation report (as quality proof)

**Files NOT copied:**
- Temporary sandbox files
- Build artifacts
- Internal system metadata

### 5. Add Component Metadata

Create `src/{component_name}/metadata.json`:

```json
{
  "name": "login-form",
  "version": "1.0.0",
  "created_date": "2025-01-15T10:00:00Z",
  "validated_date": "2025-01-15T10:30:00Z",
  "integrated_date": "2025-01-15T11:30:00Z",
  "production_ready_date": "2025-01-15T11:35:00Z",
  "story": "story-1-user-authentication",
  "contract": "contract.md",
  "css_namespace": "login-form-",
  "js_api": "LoginForm",
  "dependencies": ["password-input", "submit-button"],
  "validation_levels_passed": [
    "syntax",
    "unit_tests",
    "contract_compliance",
    "mcp_integration_safety"
  ],
  "test_coverage": {
    "branches": 85.2,
    "functions": 90.1,
    "lines": 87.5,
    "statements": 88.3
  },
  "source_path": ".system/proven/login-form/",
  "integrated_in": ["index.html", "styles/components.css", "scripts/components.js"]
}
```

### 6. Update Component Registry (MCP)

Update MCP server with production path:

```json
{
  "component_name": "login-form",
  "type": "UI component",
  "css_namespace": "login-form-",
  "js_api": "LoginForm",
  "proven_path": ".system/proven/login-form/",
  "production_path": "src/login-form/",  // ← Added
  "status": "production_ready",           // ← Updated
  "integrated_date": "2025-01-15T11:30:00Z",
  "production_ready_date": "2025-01-15T11:35:00Z",
  "dependencies": ["password-input", "submit-button"],
  "contract": ".system/contracts/login-form-contract.md"
}
```

### 7. Create Production Migration Report

Generate: `src/{component_name}/MIGRATION-REPORT.md`

**Contents:**
```markdown
# Production Migration Report: login-form

**Migration Date:** 2025-01-15T11:35:00Z
**Component:** login-form
**Story:** story-1-user-authentication
**Pass:** second-pass → production

## Migration Summary

Component successfully migrated from development to production:
- **Source:** `.system/proven/login-form/`
- **Destination:** `src/login-form/`
- **Status:** Production Ready

## Files Migrated

1. **login-form.html** (152 lines)
   - Main component template
   - CSS namespace: `.login-form-`

2. **login-form.css** (203 lines)
   - Styles with namespace
   - Responsive breakpoints included

3. **login-form.js** (124 lines)
   - Public API: `LoginForm.*`
   - Dependencies: PasswordInput, SubmitButton

4. **login-form.test.js** (89 lines)
   - Coverage: 87.5% lines, 85.2% branches
   - All tests passing

5. **contract.md** (reference copy)
   - Component specification
   - API documentation

## Validation History

### Level 1: Syntax Check ✓
- Passed: 2025-01-15T10:15:00Z

### Level 2: Unit Tests ✓
- Passed: 2025-01-15T10:20:00Z
- Coverage: 87.5% (exceeds 80% requirement)

### Level 3: Contract Compliance ✓
- Passed: 2025-01-15T10:25:00Z
- All API methods present
- CSS namespace compliant

### Level 4: MCP Integration Safety ✓
- Passed: 2025-01-15T10:30:00Z
- No conflicts detected
- Dependency graph valid

## Integration Points

Component is integrated in:
1. **index.html:42** - Main form container
2. **styles/components.css:150** - Component styles
3. **scripts/components.js:89** - Component logic

## Production Readiness Checklist

- ✓ All 4 validation levels passed
- ✓ Sandbox tested successfully
- ✓ Integrated into main files
- ✓ MCP registry updated
- ✓ Dependencies resolved
- ✓ Test coverage ≥ 80%
- ✓ Contract compliant
- ✓ No namespace conflicts

## Version Control

This component is now in `src/` and should be committed to version control:

```bash
git add src/login-form/
git commit -m "Add login-form component to production

- Migrated from .system/proven/
- All validation levels passed
- Coverage: 87.5%
- Story: story-1-user-authentication"
```

## Next Steps

1. **Commit to version control** - Component is production-ready
2. **Build for deployment** - Run build script to bundle to `public/`
3. **Deploy** - Push to production environment
4. **Monitor** - Track performance and user feedback

## Source Reference

Original development files remain in `.system/proven/login-form/` for reference.
Contract source: `.system/contracts/login-form-contract.md`
```

### 8. Update Execution Status

Via `progress-reporter` skill (auto-triggered):

```yaml
stories:
  story-1-user-authentication:
    pass_status:
      second-pass:
        components:
          - name: "login-form"
            status: "production_ready"  # ← Updated from "integrated"
            integrated_date: "2025-01-15T11:30:00Z"
            production_ready_date: "2025-01-15T11:35:00Z"
            production_path: "src/login-form/"
            migration_report: "src/login-form/MIGRATION-REPORT.md"
```

### 9. Update src/ README (if first component)

If this is the first component migrated to `src/`, update `src/README.md` with component list:

```markdown
# src/ - Production Source Code

## Components

### login-form
- **Status:** Production Ready
- **Version:** 1.0.0
- **Story:** story-1-user-authentication
- **Path:** `src/login-form/`
- **Dependencies:** password-input, submit-button
- **Coverage:** 87.5%
- **Migration Date:** 2025-01-15

[View Contract](login-form/contract.md) | [Migration Report](login-form/MIGRATION-REPORT.md)
```

### 10. Emit Events

**Event:** `component_production_ready`

**Payload:**
```yaml
component_name: "login-form"
production_path: "src/login-form/"
source_path: ".system/proven/login-form/"
story: "story-1-user-authentication"
version: "1.0.0"
```

**Triggers:**
- `pass-orchestration` skill (checks if all story components are production ready)
- `progress-reporter` skill (updates metrics)
- Optional: Build automation skill (future)

## Output Files

### Created
1. **Production directory:** `src/{component_name}/`
2. **Component files:** HTML, CSS, JS, tests, contract
3. **Metadata:** `src/{component_name}/metadata.json`
4. **Migration report:** `src/{component_name}/MIGRATION-REPORT.md`
5. **Updated README:** `src/README.md` (with component list)

### Modified
1. **MCP registry:** `.system/mcp-servers/component-registry/components.json`
2. **Execution status:** `.system/execution-status.yaml` (via progress-reporter)

## Error Handling

### Directory Already Exists

```
Error: src/login-form/ already exists

Actions:
1. Check if it's the same component version
2. If version differs: Auto-increment version (1.0.0 → 1.0.1)
3. If identical: Skip migration, update status only
4. If different: Notify operator for manual resolution
```

### Copy Failure

```
Error: Cannot copy files to src/login-form/

Actions:
1. Check write permissions for src/ directory
2. Check disk space
3. If permission denied: Halt and notify operator
4. If disk full: Halt and notify operator
5. Log error in `.system/logs/production-ready-errors.log`
```

### Missing Source Files

```
Error: .system/proven/login-form/ not found

Actions:
1. Check if component was moved or deleted
2. Search for component in .system/components/
3. If found but not proven: Notify "Component not validated yet"
4. If not found anywhere: Notify "Component does not exist"
```

## Operator Visibility

### Autonomous Operation (No Approval Required)

**Operator sees:**
```
Migrating components to production... (autonomous)
✓ login-form → src/login-form/ (v1.0.0)
✓ password-input → src/password-input/ (v1.0.0)
✓ submit-button → src/submit-button/ (v1.0.0)

All 3 components ready for production.
MCP registry updated.

Migration reports:
- src/login-form/MIGRATION-REPORT.md
- src/password-input/MIGRATION-REPORT.md
- src/submit-button/MIGRATION-REPORT.md

Next: Commit to version control
  git add src/
  git commit -m "Add components to production"
```

### When Issues Occur

**Operator sees:**
```
Migrating components to production... (autonomous)
✓ login-form → src/login-form/
✓ password-input → src/password-input/
⚠ submit-button: Migration failed - directory already exists

Issue details:
- src/submit-button/ exists with version 1.0.0
- New component also version 1.0.0
- Files differ (likely different implementations)

Action required:
1. Review existing: src/submit-button/
2. Review new: .system/proven/submit-button/
3. Choose: Keep existing OR Replace with new OR Rename as v1.0.1
4. Manual: Move files as needed, then update execution-status.yaml
```

## Integration with Build Process

After components are production ready, they can be bundled for deployment:

**Future Build Automation (Optional):**
```
component_production_ready
    ↓
build-automation skill (auto-triggers)
    ↓
Bundle src/ → public/
    - Concatenate CSS
    - Minify JS
    - Optimize HTML
    - Compress assets
    ↓
Emit: build_completed
    ↓
Operator notified: "Build ready for deployment: public/"
```

## Configuration

Settings in `.system/execution-status.yaml`:

```yaml
config:
  production_migration:
    enabled: true
    auto_migrate: true  # Auto-migrate after integration
    create_metadata: true
    create_migration_report: true
    update_src_readme: true
    version_on_conflict: "auto-increment"  # Options: auto-increment, skip, overwrite, ask
```

## Rollback Capability

To roll back a production migration:

```bash
# Remove from src/
rm -rf src/login-form/

# Update execution status
# Change status from "production_ready" back to "integrated"

# Update MCP registry
# Remove production_path field, update status
```

**Note:** Rollback does NOT affect integration in main files (index.html, etc.). Use component-integration rollback for that.

## Integration with Pass Orchestration

After all components for a story are production ready:

**Event Chain:**
```
component_production_ready (last component)
    ↓
pass-orchestration checks: all_story_components_production_ready == true
    ↓
Emits: story_production_ready
    ↓
Operator notified: "All components for story-1 are production ready"
    ↓
Suggested next action: "Commit to git and deploy"
```

## Version Control Best Practices

**When to commit:**
- Commit `src/` after all story components are production ready
- Include migration reports in commit
- Reference story in commit message

**Commit message template:**
```
Add [story-name] components to production

Components:
- login-form (v1.0.0) - 87.5% coverage
- password-input (v1.0.0) - 92.3% coverage
- submit-button (v1.0.0) - 88.1% coverage

All components passed 4-level validation and integration testing.

Story: story-1-user-authentication
Pass: second-pass
```

## Component Versioning

**Semantic Versioning:**
- **Major (1.0.0):** Breaking API changes
- **Minor (1.1.0):** New features, backward compatible
- **Patch (1.0.1):** Bug fixes, backward compatible

**Auto-versioning on conflicts:**
```
Existing: src/login-form/ (v1.0.0)
New:      .system/proven/login-form/ (different implementation)

Auto-resolution:
- Increment patch: v1.0.0 → v1.0.1
- Create: src/login-form-v1.0.1/
- Update metadata with version
- Both versions coexist in src/
```

## Related Files

- **Trigger Matrix:** `.claude/skills/trigger-matrix.yaml`
- **Event System:** `.claude/skills/event-system.md`
- **Execution Status:** `.system/execution-status.yaml`
- **Component Registry:** `.system/mcp-servers/component-registry/components.json`
- **Migration Reports:** `src/{component_name}/MIGRATION-REPORT.md`
- **Source README:** `src/README.md`

## Summary

The production-ready skill provides:

- **Fully autonomous migration** from `.system/proven/` to `src/`
- **Version control ready** with metadata and documentation
- **Clear migration history** with comprehensive reports
- **Automatic status tracking** via progress-reporter
- **Version conflict resolution** with auto-increment
- **Production deployment path** for validated components

This skill completes the full pipeline:
`references/` → `.system/components/` → `.system/proven/` → `src/` → **production ready!**
