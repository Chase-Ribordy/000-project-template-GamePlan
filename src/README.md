# src/ - Production Source Code

This folder contains **production-ready components** that have passed all validation levels and are ready for deployment.

## Component Migration Flow

Components move through this pipeline:

1. **`.system/components/`** - Initial creation and development
2. **`.system/proven/`** - Validated and sandbox-tested
3. **`src/`** - Production-ready (YOU ARE HERE)
4. **`public/`** - Bundled and deployed

## When Components Move Here

Components are automatically migrated to `src/` by the `production-ready` skill when:
- All 4 validation levels pass (syntax → tests → contract → MCP integration)
- Component is integrated successfully
- `component_integrated` event is emitted

## Folder Structure

Components maintain their structure when migrated:

```
src/
├── component-name/
│   ├── component-name.html
│   ├── component-name.css
│   ├── component-name.js
│   ├── component-name.test.js
│   └── contract.md (reference)
```

## Usage

### Manual Migration (Not Recommended)

If you need to manually move a component from `.system/proven/`:

```bash
cp -r .system/proven/component-name src/
```

### Automated Migration (Recommended)

The `production-ready` skill handles this automatically. Just ensure your component:
- Passes all validation levels
- Is integrated via `/integrate` command

## Build Process

Components in `src/` can be bundled for deployment to `public/`:

```bash
# Future: Build script will bundle src/ → public/
npm run build
```

## Best Practices

1. **Do NOT edit components directly in src/** - Make changes in `.system/components/` and re-validate
2. **Version control** - All files in `src/` should be committed to git
3. **Dependencies** - Use contract-defined dependencies only
4. **Namespacing** - Maintain `.component-name-` CSS prefix and `ComponentName.*` JS API
