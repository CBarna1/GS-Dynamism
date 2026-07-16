#!/bin/bash
# setup-vps.sh — Full VPS setup for Guiding Stars (Ubuntu 24.04, 1GB RAM)
# Run as root on a FRESH server:
#   bash <(curl -s https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/setup-vps.sh)
# OR upload this file and run:
#   bash /root/setup-vps.sh

set -e  # Stop on any error

# ── Colours ───────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✓ $1${NC}"; }
info() { echo -e "${YELLOW}➜ $1${NC}"; }
err()  { echo -e "${RED}✗ $1${NC}"; exit 1; }

echo ""
echo "════════════════════════════════════════════════"
echo "   Guiding Stars — VPS Setup (Ubuntu 24.04)"
echo "════════════════════════════════════════════════"
echo ""

# ── Collect config up front ───────────────────────────────────────────────────
read -rp "GitHub repo URL (e.g. https://github.com/you/gs-dynamism.git): " GIT_REPO
read -rp "MariaDB app password (choose a strong one): " DB_PASSWORD
read -rp "Email address (for SSL cert + Let's Encrypt notices): " SSL_EMAIL
echo ""

# ── 1. System update ──────────────────────────────────────────────────────────
info "Updating system packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -q
apt-get upgrade -yq
ok "System updated"

# ── 2. Swap file (2 GB) ───────────────────────────────────────────────────────
info "Creating 2 GB swap file..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo 'vm.swappiness=10' >> /etc/sysctl.conf
    sysctl -p > /dev/null
fi
ok "Swap ready ($(free -h | awk '/Swap/{print $2}'))"

# ── 3. Install packages ───────────────────────────────────────────────────────
info "Installing Nginx, MariaDB, Git, Certbot..."
apt-get install -yq nginx mariadb-server certbot python3-certbot-nginx git ufw curl
ok "Packages installed"

# ── 4. Tune MariaDB for 1 GB RAM ─────────────────────────────────────────────
info "Tuning MariaDB memory settings..."
cat >> /etc/mysql/mariadb.conf.d/50-server.cnf << 'EOF'

# ── Memory tuning for 1 GB VPS ──────────────────────────────────────────────
innodb_buffer_pool_size = 128M
innodb_log_file_size    = 32M
max_connections         = 50
query_cache_type        = 0
query_cache_size        = 0
tmp_table_size          = 16M
max_heap_table_size     = 16M
key_buffer_size         = 16M
EOF
systemctl restart mariadb
ok "MariaDB tuned and restarted"

# ── 5. Create database and user ───────────────────────────────────────────────
info "Creating database and app user..."
mariadb -e "CREATE DATABASE IF NOT EXISTS guiding_stars CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mariadb -e "CREATE USER IF NOT EXISTS 'guidingstars_user'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
mariadb -e "GRANT ALL PRIVILEGES ON guiding_stars.* TO 'guidingstars_user'@'localhost';"
mariadb -e "FLUSH PRIVILEGES;"
ok "Database 'guiding_stars' and user 'guidingstars_user' created"

# ── 6. Install Node.js via NVM ────────────────────────────────────────────────
info "Installing Node.js 20 via NVM..."
export NVM_DIR="/root/.nvm"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source "$NVM_DIR/nvm.sh"
nvm install 20 --silent
nvm alias default 20
ok "Node.js $(node -v) installed"

# ── 7. Install PM2 ───────────────────────────────────────────────────────────
info "Installing PM2..."
npm install -g pm2 --silent
ok "PM2 installed"

# ── 8. Configure Nginx ────────────────────────────────────────────────────────
info "Configuring Nginx (HTTP only — SSL comes after DNS)..."
cat > /etc/nginx/sites-available/guidingstarszm << 'NGINXEOF'
server {
    listen 80;
    listen [::]:80;
    server_name guidingstarszm.com www.guidingstarszm.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass         http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout    60s;
        proxy_read_timeout    60s;
        client_max_body_size  20M;
    }
}
NGINXEOF

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/guidingstarszm /etc/nginx/sites-enabled/guidingstarszm
nginx -t && systemctl reload nginx
ok "Nginx configured"

# ── 9. Firewall ───────────────────────────────────────────────────────────────
info "Configuring firewall..."
ufw --force reset > /dev/null
ufw default deny incoming > /dev/null
ufw default allow outgoing > /dev/null
ufw allow OpenSSH > /dev/null
ufw allow 80/tcp > /dev/null
ufw allow 443/tcp > /dev/null
ufw --force enable > /dev/null
ok "Firewall enabled (SSH, HTTP, HTTPS)"

# ── 10. Clone the repository ──────────────────────────────────────────────────
info "Cloning repository..."
mkdir -p /var/www/guidingstarszm
cd /var/www/guidingstarszm
if [ -z "$(ls -A .)" ]; then
    git clone "$GIT_REPO" .
else
    git pull origin main
fi
ok "Code cloned to /var/www/guidingstarszm"

# ── 11. Install backend dependencies ─────────────────────────────────────────
info "Installing backend dependencies..."
source "$NVM_DIR/nvm.sh"
cd /var/www/guidingstarszm/backend
npm install --omit=dev --silent
ok "Backend dependencies installed"

# ── 12. Build frontend ────────────────────────────────────────────────────────
info "Building frontend (this may take a minute)..."
cd /var/www/guidingstarszm/frontend
npm install --silent
NODE_OPTIONS="--max-old-space-size=512" npm run build
ok "Frontend built"

# ── 13. Generate JWT secret and write .env ────────────────────────────────────
info "Generating JWT secret..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

info "Writing .env file..."
cat > /var/www/guidingstarszm/backend/.env << ENVEOF
DB_HOST=localhost
DB_USER=guidingstars_user
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=guiding_stars

PORT=5000
NODE_ENV=production

JWT_SECRET=${JWT_SECRET}

SITE_URL=https://www.guidingstarszm.com
FRONTEND_URL=https://www.guidingstarszm.com

EMAIL_USER=no-reply@guidingstarszm.com
EMAIL_PASSWORD=CHANGE_THIS_TO_YOUR_EMAIL_PASSWORD
ENVEOF
chmod 600 /var/www/guidingstarszm/backend/.env
ok ".env file created (remember to set EMAIL_PASSWORD!)"

# ── 14. Start app with PM2 ────────────────────────────────────────────────────
info "Starting app with PM2..."
source "$NVM_DIR/nvm.sh"
mkdir -p /var/log/pm2
cd /var/www/guidingstarszm
pm2 start ecosystem.config.js --env production
pm2 save

# Configure PM2 to start on reboot
PM2_STARTUP=$(pm2 startup systemd -u root --hp /root | tail -1)
eval "$PM2_STARTUP" > /dev/null 2>&1 || true
ok "App started with PM2"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════"
echo -e "${GREEN}   Setup complete!${NC}"
echo "════════════════════════════════════════════════"
echo ""
echo "  Next steps:"
echo ""
echo "  1. Set your email password in .env:"
echo "     nano /var/www/guidingstarszm/backend/.env"
echo "     (change EMAIL_PASSWORD line)"
echo "     pm2 restart guiding-stars"
echo ""
echo "  2. Make sure your domain DNS A records point to this server:"
echo "     guidingstarszm.com    → $(curl -s ifconfig.me)"
echo "     www.guidingstarszm.com → $(curl -s ifconfig.me)"
echo ""
echo "  3. Once DNS is live, get SSL certificate:"
echo "     certbot --nginx -d guidingstarszm.com -d www.guidingstarszm.com --email ${SSL_EMAIL} --agree-tos --non-interactive"
echo ""
echo "  4. After SSL, update Nginx to the full config:"
echo "     cp /var/www/guidingstarszm/nginx/guidingstarszm.conf /etc/nginx/sites-available/guidingstarszm"
echo "     nginx -t && systemctl reload nginx"
echo ""
echo "  Check app status:  pm2 status"
echo "  View logs:         pm2 logs guiding-stars"
echo ""
