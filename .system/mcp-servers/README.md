# Component Registry MCP Server

Model Context Protocol server for safe component integration with automatic conflict detection.

## Quick Start

This template comes with the MCP server **pre-installed and tested**:
- ✅ Dependencies installed
- ✅ Server implementation complete
- ✅ Package.json configured

**To use it:** Configure Claude Desktop to connect to this server (see [Setup Guide](#setup) below).

## Component Registry Overview

The Component Registry is a quality-first integration system that prevents the common pitfalls of component-based development:

**What It Solves:**
- **CSS Namespace Conflicts**: Automatically detects and prevents style collisions
- **Dependency Hell**: Validates all dependencies exist before integration
- **Integration Breaks**: Provides safe merge strategies with rollback capability
- **Quality Drift**: Enforces contract validation and testing before integration

**How It Works:**
- Components register with metadata (CSS namespace, dependencies, interfaces)
- Validation runs before any integration (preflight checks, contract validation)
- Sandbox testing proves components work in isolation
- Only "proven" components can integrate into production code

**Why MCP?** By running as an MCP server, Claude Desktop can call these tools automatically during your workflow - no manual validation needed.

## Available Tools

### Core Integration Tools (8 tools)

1. **`register_component`** - Register a component with metadata before integration
2. **`validate_integration`** - Check if component can be safely integrated into target
3. **`get_integration_plan`** - Get safe integration strategy with injection points
4. **`list_components`** - List all registered components with status

### Quality Enforcement Tools (4 tools)

5. **`validate_contract`** - Validate component implementation matches its contract
6. **`run_preflight_checks`** - Run all 4 levels of validation (syntax, tests, contract, integration)
7. **`test_in_sandbox`** - Check if component has sandbox test and provide instructions
8. **`mark_as_proven`** - Mark component as proven after passing all validation

## Setup

### When You Copy This Template to a New Project

1. **Find your Claude Desktop config file:**
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. **Add this configuration** (update the path to your project):
   ```json
   {
     "mcpServers": {
       "component-registry": {
         "command": "node",
         "args": ["C:/absolute/path/to/your-project/.system/mcp-servers/component-registry.js"]
       }
     }
   }
   ```

3. **Restart Claude Desktop completely**:
   - Close Claude Desktop (quit from system tray, not just close window)
   - Wait 5 seconds
   - Reopen Claude Desktop

4. **Verify it's working**:
   - Look for the hammer/wrench icon (🔨) in Claude Desktop
   - The component-registry server should appear in the MCP servers list
   - You should see 8 tools available

5. **Test it**:
   In Claude Desktop, try: "List all registered components using the component registry"

## Usage Examples

### Register Component
```javascript
register_component({
  name: "header",
  cssNamespace: ".component-header",
  filepath: "components/header/header.html",
  dependencies: []
})
```

### Validate Integration
```javascript
validate_integration({
  componentName: "header",
  targetFile: "src/main.html"
})
```

### Get Integration Plan
```javascript
get_integration_plan({
  componentName: "header",
  targetFile: "src/main.html"
})
```

## Quality Workflow Integration

The MCP server enforces a quality gate workflow:

1. **Define Contract**: Component registered with contract definition
2. **Validate**: `run_preflight_checks` ensures quality standards
3. **Test**: `test_in_sandbox` proves it works in isolation
4. **Proven**: `mark_as_proven` certifies component is ready
5. **Integrate**: `validate_integration` ensures safety before merge

**Principle**: No component integrates without being proven.

## Architecture

The server maintains an in-memory registry of:
- Component names and file paths
- CSS namespaces (for conflict detection)
- Dependency graphs
- Interface definitions
- Validation status (registered → tested → proven)

## Practical Workflow Patterns

### Sub-Agents in Parallel

**Important:** Claude Code doesn't support spawning multiple sub-agents from a single terminal session. However, here's what works:

#### Option A: Manual Parallel Terminals (Recommended)

```bash
# Terminal 1 - Orchestrator
/sm "Create module breakdown for project"

# Terminal 2 - Auth Module
/dev "Build auth module with requirements from Terminal 1"

# Terminal 3 - UI Module
/dev "Build UI components with CSS namespace .app-ui"

# Terminal 4 - Integration Watcher
/dev "Validate completed modules with component-registry MCP"
```

#### Option B: Batch Processing (Automated Sequential)

```bash
# Step 1: Generate all module specs
/sm "Generate all module specifications for the project"

# Step 2: Create batch processor
/dev "Create batch-module-builder.js that processes all specs"

# Step 3: Run batch (sequential but automated)
node batch-module-builder.js

# Step 4: Integration
/dev "Run integration sequence for all completed modules"
```

## Troubleshooting Quick Links

**Common issues?** See the comprehensive [Troubleshooting Guide](../../docs/TROUBLESHOOTING.md)

**Quick checks:**
- Path in config must be **absolute**, not relative
- Must **restart Claude Desktop** after config changes
- Check logs: `%APPDATA%\Claude\logs\mcp*.log` (Windows)

**Server won't start?**
```bash
cd .system/mcp-servers
npm install  # Re-install dependencies if needed
node component-registry.js  # Test manually (Ctrl+C to stop)
```

## See Also

- [MCP-SERVER-SETUP.md](MCP-SERVER-SETUP.md) - Detailed setup and verification guide
- [HOW-MCP-WORKS.md](HOW-MCP-WORKS.md) - Conceptual explanation of MCP architecture
- [docs/TROUBLESHOOTING.md](../../docs/TROUBLESHOOTING.md) - Comprehensive troubleshooting guide
- `/integrate` - Component sharding workflow command
- `/integrate-mcp` - MCP setup wizard command
