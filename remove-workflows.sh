#!/bin/bash

echo "🧹 Removing deployment workflow files from .github/workflows/"

# Remove each file safely
git rm -f .github/workflows/main_brokercopilot-backend.yml 2>/dev/null
git rm -f .github/workflows/staging_brokercopilot-devstaging.yml 2>/dev/null

echo "✅ Done. Deployment workflows removed and staged for commit."
echo "👉 Now run: git commit -m \"Remove deployment workflows from develop\""