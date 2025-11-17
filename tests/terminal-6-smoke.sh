#!/bin/bash

###############################################################################
# Terminal 6: Smoke Tests
# Copy-paste this entire file content into your sixth terminal
###############################################################################

echo "╔════════════════════════════════════════════════════════╗"
echo "║  Terminal 6: End-to-End Smoke Tests (18 tests)        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

cd "C:\Users\chase\Downloads\project-template"

echo "🚀 Starting smoke tests..."
echo "📋 Testing: Component lifecycle, system health, performance"
echo "⏱️  Expected time: 5-6 seconds"
echo ""

npm run test:smoke

echo ""
echo "✅ Terminal 6 complete!"
