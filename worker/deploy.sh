#!/bin/bash
#
# Deploy sync worker to DigitalOcean droplet
#
# Usage:
#   ./worker/deploy.sh          # Deploy and set up crontab
#   ./worker/deploy.sh --run    # Deploy and run sync immediately
#

set -e

DO_HOST="137.184.82.172"
DO_USER="root"
REMOTE_DIR="/opt/iqautodeals-sync"
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "═══════════════════════════════════════════════"
echo "Deploying IQ Auto Deals Sync Worker"
echo "Target: ${DO_USER}@${DO_HOST}:${REMOTE_DIR}"
echo "═══════════════════════════════════════════════"
echo ""

# 1. Create remote directory
echo "→ Creating remote directory..."
ssh ${DO_USER}@${DO_HOST} "mkdir -p ${REMOTE_DIR}"

# 2. Sync required files
echo "→ Syncing project files..."
rsync -avz --delete \
  --include='worker/***' \
  --include='lib/***' \
  --include='prisma/***' \
  --include='package.json' \
  --include='package-lock.json' \
  --include='tsconfig.json' \
  --include='.env' \
  --include='.env.local' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='app' \
  --exclude='components' \
  --exclude='public' \
  --exclude='scripts' \
  --exclude='docs' \
  --exclude='legal' \
  --exclude='*.md' \
  --exclude='.git' \
  --exclude='hooks' \
  --exclude='types' \
  "${PROJECT_ROOT}/" "${DO_USER}@${DO_HOST}:${REMOTE_DIR}/"

# 3. Install Node.js if needed and set up
echo "→ Setting up remote environment..."
ssh ${DO_USER}@${DO_HOST} << 'REMOTE_SETUP'
set -e

# Install Node.js 20 if not present
if ! command -v node &> /dev/null; then
  echo "Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Install tsx globally if not present
if ! command -v tsx &> /dev/null; then
  echo "Installing tsx..."
  npm install -g tsx
fi

cd /opt/iqautodeals-sync

# Install dependencies (production only, skip devDeps we don't need)
echo "Installing dependencies..."
npm install --omit=dev 2>&1 | tail -3

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate 2>&1 | tail -2

# Create logs directory
mkdir -p /var/log/iqautodeals-sync

echo "Setup complete!"
REMOTE_SETUP

# 4. Set up crontab
echo "→ Setting up crontab..."
ssh ${DO_USER}@${DO_HOST} << 'CRONTAB_SETUP'
# Create the sync runner script
cat > /opt/iqautodeals-sync/run-sync.sh << 'RUNNER'
#!/bin/bash
cd /opt/iqautodeals-sync
LOGFILE="/var/log/iqautodeals-sync/sync-$(date +%Y-%m-%d_%H%M).log"
echo "Starting sync at $(date)" >> "$LOGFILE"
npx tsx worker/sync-all.ts >> "$LOGFILE" 2>&1
EXIT_CODE=$?
echo "Finished at $(date) with exit code $EXIT_CODE" >> "$LOGFILE"

# Keep only last 30 days of logs
find /var/log/iqautodeals-sync -name "*.log" -mtime +30 -delete 2>/dev/null
RUNNER
chmod +x /opt/iqautodeals-sync/run-sync.sh

# Add crontab entry (every 12 hours at 6 AM and 6 PM UTC)
# Remove old entry if exists, then add new one
(crontab -l 2>/dev/null | grep -v 'iqautodeals-sync') | crontab -
(crontab -l 2>/dev/null; echo "0 6,18 * * * /opt/iqautodeals-sync/run-sync.sh") | crontab -

echo "Crontab updated:"
crontab -l | grep iqautodeals
CRONTAB_SETUP

echo ""
echo "═══════════════════════════════════════════════"
echo "Deployment complete!"
echo ""
echo "Sync runs automatically at 6 AM and 6 PM UTC"
echo ""
echo "Manual commands:"
echo "  ssh ${DO_USER}@${DO_HOST}"
echo "  cd ${REMOTE_DIR}"
echo "  npx tsx worker/sync-all.ts                    # Run all"
echo "  npx tsx worker/sync-all.ts --dealer=turpin     # One dealer"
echo "  npx tsx worker/sync-all.ts --type=lexus_sftp   # One type"
echo "  tail -f /var/log/iqautodeals-sync/sync-*.log   # Watch logs"
echo "═══════════════════════════════════════════════"

# Optionally run sync now
if [[ "$1" == "--run" ]]; then
  echo ""
  echo "→ Running sync now..."
  ssh ${DO_USER}@${DO_HOST} "cd ${REMOTE_DIR} && npx tsx worker/sync-all.ts"
fi
