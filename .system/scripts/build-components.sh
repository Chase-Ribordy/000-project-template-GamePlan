#!/bin/bash
# Batch TDD component builder
# Usage: ./scripts/build-components.sh components.txt

COMPONENT_LIST=$1
LOG_FILE="progress.log"

if [ -z "$COMPONENT_LIST" ]; then
  echo "Usage: ./build-components.sh <component-list-file>"
  exit 1
fi

echo "Starting component build..." | tee $LOG_FILE
echo "=========================" | tee -a $LOG_FILE

while IFS= read -r component; do
  # Skip empty lines and comments
  if [[ -z "$component" || "$component" =~ ^# ]]; then
    continue
  fi

  echo "Building: $component" | tee -a $LOG_FILE

  # Create component structure
  mkdir -p "components/$component"

  # Generate from boilerplate
  cp boilerplate/component.js "components/$component/$component.js"
  cp boilerplate/component.test.js "components/$component/$component.test.js"
  cp boilerplate/component.css "components/$component/$component.css"

  # Replace placeholders
  sed -i "s/\\[ComponentName\\]/$component/g" "components/$component/$component.js"
  sed -i "s/\\[component\\]/$component/g" "components/$component/$component.test.js"
  sed -i "s/\\[name\\]/$component/g" "components/$component/$component.css"

  echo "  ✓ Structure created" | tee -a $LOG_FILE

  # Run tests if npm available
  if command -v npm &> /dev/null; then
    echo "  Running tests..." | tee -a $LOG_FILE
    npm test "components/$component/$component.test.js" 2>&1 | tee -a $LOG_FILE
  fi

  echo "---" >> $LOG_FILE
done < "$COMPONENT_LIST"

echo "=========================" | tee -a $LOG_FILE
echo "Build complete. Check progress.log for details." | tee -a $LOG_FILE
