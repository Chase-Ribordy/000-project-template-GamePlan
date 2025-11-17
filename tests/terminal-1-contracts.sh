#!/bin/bash

###############################################################################
# Terminal 1: Contract Compliance Tests
# Copy-paste this entire file content into your first terminal
###############################################################################

echo "╔════════════════════════════════════════════════════════╗"
echo "║  Terminal 1: Contract Compliance Tests (19 tests)     ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

cd "C:\Users\chase\Downloads\project-template"

echo "🚀 Starting contract compliance tests..."
echo "📋 Testing: Example Button Contract"
echo "⏱️  Expected time: 3-5 seconds"
echo ""

npm run test:contracts

echo ""
echo "✅ Terminal 1 complete!"
