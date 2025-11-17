#!/bin/bash

###############################################################################
# Terminal 2: MCP Integration Tests
# Copy-paste this entire file content into your second terminal
###############################################################################

echo "╔════════════════════════════════════════════════════════╗"
echo "║  Terminal 2: MCP Integration Tests (12 tests)         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

cd "C:\Users\chase\Downloads\project-template"

echo "🚀 Starting MCP integration tests..."
echo "📋 Testing: Component Registry & Conflict Detection"
echo "⏱️  Expected time: 8-10 seconds"
echo "ℹ️  Note: Tests gracefully skip if MCP server not running"
echo ""

npm run test:mcp

echo ""
echo "✅ Terminal 2 complete!"
