#!/usr/bin/env bash

# This script is used to clean up build artifacts files in apps folder and packages
# Usage: ./scripts/clean.sh

# Remove build directories
rm -rf apps/*/{build,dist,node_modules,dist,coverage,*.log}
rm -rf packages/*/{build,dist,node_modules,dist,coverage,*.log}


echo "Cleaned up build artifacts in apps and packages directories."
