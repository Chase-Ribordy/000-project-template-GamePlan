#!/bin/bash

###############################################################################
# Terminal 3: 4-Level Validation Tests
# Copy-paste this entire file content into your third terminal
###############################################################################

echo "╔════════════════════════════════════════════════════════╗"
echo "║  Terminal 3: 4-Level Validation Tests (17 tests)      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

cd "C:\Users\chase\Downloads\project-template"

echo "🚀 Starting 4-level validation tests..."
echo "📋 Testing: Syntax → Unit → Contract → Integration"
echo "⏱️  Expected time: 3-5 seconds"
echo ""

npm run test:validation

echo ""
echo "✅ Terminal 3 complete!"
