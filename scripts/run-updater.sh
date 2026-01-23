#!/bin/bash

# Autonomous Market Updater Runner
# This script runs the market updater for a specific commodity

COMMODITY=$1
COUNT=$2

if [ -z "$COMMODITY" ] || [ -z "$COUNT" ]; then
  echo "Usage: $0 <commodity> <count>"
  echo "Example: $0 gold 50"
  exit 1
fi

echo "Running updater for $COMMODITY (target: $COUNT companies)"
node --no-warnings scripts/populate-market.mjs --commodity "$COMMODITY" --count "$COUNT"
