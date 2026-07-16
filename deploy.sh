#!/bin/bash
# deploy.sh — Pull latest code, rebuild frontend, restart app
# Run from the server: bash /var/www/guidingstarszm/deploy.sh

set -e  # Exit immediately on any error

APP_DIR="/var/www/guidingstarszm"
echo "──────────────────────────────────────────"
echo "  Deploying Guiding Stars..."
echo "──────────────────────────────────────────"

# 1. Pull latest code from Git
cd "$APP_DIR"
echo "[1/5] Pulling latest code..."
git pull origin main

# 2. Install/update backend dependencies
echo "[2/5] Installing backend dependencies..."
cd "$APP_DIR/backend"
npm install --omit=dev

# 3. Install frontend dependencies and build
echo "[3/5] Building frontend..."
cd "$APP_DIR/frontend"
npm install
npm run build

# 4. Run any pending database scripts (safe to re-run)
echo "[4/5] Running database migrations..."
cd "$APP_DIR/backend"
# Uncomment any migration scripts you need to run:
# node scripts/migrateVideoSupport.js
# node scripts/seedMissingContentFields.js

# 5. Restart the app via PM2
echo "[5/5] Restarting app with PM2..."
pm2 restart guiding-stars --update-env

echo ""
echo "✓ Deployment complete!"
echo "  App status: pm2 status"
echo "  Live logs:  pm2 logs guiding-stars"
