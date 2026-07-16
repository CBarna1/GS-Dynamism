# VPS Migration Guide — guidingstarszm.com

Stack: Node.js + Express + MariaDB + React (Vite) | Server: Ubuntu 24.04 | Domain: guidingstarszm.com

**Server specs: 1 GB RAM · 20 GB disk · Ubuntu 24.04 Blank 64-bit**

> With only 1 GB RAM, every service needs to be lean. This guide uses MariaDB instead of MySQL 8
> (identical SQL compatibility, uses ~80 MB vs ~400 MB) and sets up a 2 GB swap file as a safety net.

---

## Prerequisites

- A fresh Ubuntu 24.04 VPS
- Root or sudo access via SSH
- Your domain DNS `A` record pointing to the VPS IP (both `@` and `www`) — DNS can take up to 24 hours to propagate
- Your code in a Git repository (GitHub, GitLab, etc.)

---

## Step 1 — Initial Server Setup

```bash
# Log in as root
ssh root@YOUR_VPS_IP

# Create a non-root user (replace "deploy" with your preferred username)
adduser deploy
usermod -aG sudo deploy

# Set up SSH key for the new user (run this on your LOCAL machine)
ssh-copy-id deploy@YOUR_VPS_IP

# Back on the server — disable root SSH login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Switch to the new user from now on
su - deploy
```

---

## Step 1b — Add Swap Space (critical for 1 GB RAM)

Without swap, the server can OOM-kill Node.js or MariaDB under load.

```bash
# Create a 2 GB swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make it permanent across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Reduce swap aggressiveness (only use swap when RAM is >90% full)
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Verify
free -h   # Should show 2G swap
```

---

## Step 2 — Configure the Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

---

## Step 3 — Install Node.js (via NVM)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

nvm install 20
nvm use 20
nvm alias default 20
node -v   # Should print v20.x.x
```

---

## Step 4 — Install MariaDB (lightweight MySQL replacement)

MariaDB is a drop-in replacement for MySQL. Your Sequelize + mysql2 driver works with it unchanged.

```bash
sudo apt update
sudo apt install -y mariadb-server

# Secure the installation
sudo mariadb-secure-installation
# Prompts:
#   Switch to unix_socket auth? → N
#   Change root password? → Y  (set a strong one)
#   Remove anonymous users? → Y
#   Disallow root login remotely? → Y
#   Remove test database? → Y
#   Reload privileges? → Y
```

### Tune MariaDB for 1 GB RAM

```bash
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
```

Find the `[mysqld]` section and add these lines at the end of it:

```ini
# ── Memory tuning for 1 GB VPS ───────────────────────────────────────────────
innodb_buffer_pool_size     = 128M   # Most important setting — reduce from default 128M is fine
innodb_log_file_size        = 32M
max_connections             = 50     # Default 151 wastes memory
query_cache_type            = 0
query_cache_size            = 0
tmp_table_size              = 16M
max_heap_table_size         = 16M
key_buffer_size             = 16M
thread_stack                = 192K
```

```bash
sudo systemctl restart mariadb
```

### Create the application database and user

```bash
sudo mariadb
```

Inside the MariaDB prompt:

```sql
CREATE DATABASE guiding_stars CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'guidingstars_user'@'localhost' IDENTIFIED BY 'your_strong_db_password_here';
GRANT ALL PRIVILEGES ON guiding_stars.* TO 'guidingstars_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

> **Note:** Use the same password in your `.env` file as `DB_PASSWORD`.

---

## Step 5 — Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Tune Nginx for 1 GB RAM

```bash
sudo nano /etc/nginx/nginx.conf
```

At the top of the file, set:
```nginx
worker_processes 1;   # 1 CPU core on most budget VPS
```

Inside the `http {}` block, ensure:
```nginx
worker_connections  512;    # Reduce from default 1024
keepalive_timeout   30;     # Reduce from default 65
client_max_body_size 20m;
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## Step 6 — Install PM2

```bash
npm install -g pm2
```

---

## Step 7 — Deploy the Application Code

### Option A — Git Clone (recommended)

```bash
sudo mkdir -p /var/www/guidingstarszm
sudo chown deploy:deploy /var/www/guidingstarszm
cd /var/www/guidingstarszm

git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git .
```

### Option B — Upload via SCP (if no Git repo)

From your **local machine**:

```bash
# Upload the project folder (exclude node_modules and .env)
scp -r ./backend ./frontend ./ecosystem.config.js ./deploy.sh \
    deploy@YOUR_VPS_IP:/var/www/guidingstarszm/
```

---

## Step 8 — Configure Environment Variables

```bash
cd /var/www/guidingstarszm/backend
cp .env.example .env
nano .env
```

Fill in all values. Generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Your `.env` should look like:**

```
DB_HOST=localhost
DB_USER=guidingstars_user
DB_PASSWORD=your_strong_db_password_here
DB_NAME=guiding_stars

PORT=5000
NODE_ENV=production

JWT_SECRET=<paste the 128-char hex string here>

SITE_URL=https://www.guidingstarszm.com
FRONTEND_URL=https://www.guidingstarszm.com

EMAIL_USER=no-reply@guidingstarszm.com
EMAIL_PASSWORD=your_email_account_password_here
```

Lock down the file permissions:

```bash
chmod 600 /var/www/guidingstarszm/backend/.env
```

---

## Step 9 — Install Dependencies & Build the Frontend

> **RAM warning:** `npm install` on a 1 GB VPS can sometimes OOM. The swap file from Step 1b prevents this.

```bash
# Backend dependencies
cd /var/www/guidingstarszm/backend
npm install --omit=dev

# Frontend — install and build
cd /var/www/guidingstarszm/frontend
npm install
npm run build
# This creates /var/www/guidingstarszm/frontend/dist/
```

If the build runs out of memory, add a Node memory limit:

```bash
NODE_OPTIONS="--max-old-space-size=512" npm run build
```

---

## Step 10 — Run Database Migrations (if applicable)

```bash
cd /var/www/guidingstarszm/backend
# node scripts/migrateVideoSupport.js
# node scripts/seedMissingContentFields.js
```

> Uncomment and run only scripts you haven't run before.

---

## Step 11 — Start the App with PM2

```bash
cd /var/www/guidingstarszm
pm2 start ecosystem.config.js --env production
pm2 save

# Configure PM2 to start on server reboot
pm2 startup
# Copy and run the command it prints, e.g.:
# sudo env PATH=$PATH:/home/deploy/.nvm/versions/node/v20.x.x/bin pm2 startup systemd -u deploy --hp /home/deploy

# Create PM2 log directory
sudo mkdir -p /var/log/pm2
sudo chown deploy:deploy /var/log/pm2
```

Verify the app is running:

```bash
pm2 status
pm2 logs guiding-stars --lines 30
```

You should see:
```
✓ Database initialization complete
✓ MySQL connected successfully and associations initialized
✓ Database tables synced
🚀 Server running on http://localhost:5000
```

Test it directly (before Nginx):

```bash
curl http://localhost:5000/api/content
```

---

## Step 12 — Configure Nginx

```bash
# Copy the Nginx config from the repo
sudo cp /var/www/guidingstarszm/nginx/guidingstarszm.conf \
    /etc/nginx/sites-available/guidingstarszm

# Enable the site
sudo ln -s /etc/nginx/sites-available/guidingstarszm \
    /etc/nginx/sites-enabled/guidingstarszm

# Remove the default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test the config syntax
sudo nginx -t

# At this point, the config will FAIL because SSL certs don't exist yet.
# Temporarily comment out the two HTTPS server blocks in the config
# and only keep the HTTP block that redirects to https — OR skip to Step 13 first.
```

**Temporary HTTP-only config** to get Certbot working:

Edit `/etc/nginx/sites-available/guidingstarszm` and replace all contents with:

```nginx
server {
    listen 80;
    server_name guidingstarszm.com www.guidingstarszm.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass         http://127.0.0.1:5000;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Visit `http://www.guidingstarszm.com` — the site should load.

---

## Step 13 — SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx

sudo certbot --nginx -d guidingstarszm.com -d www.guidingstarszm.com
```

Follow the prompts:
- Enter your email address
- Agree to Terms of Service
- Choose whether to share your email with EFF
- Certbot will obtain and install the certificate automatically

**After Certbot succeeds**, replace the temporary Nginx config with the full one:

```bash
sudo cp /var/www/guidingstarszm/nginx/guidingstarszm.conf \
    /etc/nginx/sites-available/guidingstarszm

sudo nginx -t && sudo systemctl reload nginx
```

Visit `https://www.guidingstarszm.com` — you should see a padlock.

**Auto-renewal test:**

```bash
sudo certbot renew --dry-run
```

---

## Step 14 — Upload Existing User Files

If you have existing uploads from shared hosting, copy them to the VPS:

```bash
# From your local machine (after downloading from shared host)
scp -r ./uploads/* \
    deploy@YOUR_VPS_IP:/var/www/guidingstarszm/backend/public/uploads/
```

---

## Step 15 — Migrate the MySQL Database

### Export from shared hosting

Use phpMyAdmin or SSH on the old host:

```bash
mysqldump -u OLD_DB_USER -p OLD_DB_NAME > guiding_stars_backup.sql
```

### Import on the VPS

```bash
# Upload the SQL dump to the VPS
scp guiding_stars_backup.sql deploy@YOUR_VPS_IP:/tmp/

# Import it (MariaDB is compatible with mysqldump exports)
mariadb -u guidingstars_user -p guiding_stars < /tmp/guiding_stars_backup.sql
rm /tmp/guiding_stars_backup.sql
```

> **Important:** Import the database BEFORE starting the app if you want to preserve existing data. If the app ran and synced the schema first, that's fine — the import will populate the rows.

---

## Post-Migration Checklist

- [ ] `https://www.guidingstarszm.com` loads the site with a valid SSL padlock
- [ ] `http://guidingstarszm.com` redirects to `https://www.guidingstarszm.com`
- [ ] Admin login works
- [ ] Mentee login works
- [ ] File uploads work (test via admin panel)
- [ ] Uploaded images display correctly
- [ ] Contact form submits and sends email
- [ ] Mentee welcome emails send correctly
- [ ] `pm2 status` shows `guiding-stars` as `online`
- [ ] Certbot auto-renewal is enabled: `systemctl status certbot.timer`

---

## Useful Commands

```bash
# App management
pm2 status                          # Check app status
pm2 logs guiding-stars              # Live logs
pm2 restart guiding-stars           # Restart app
pm2 reload guiding-stars            # Zero-downtime reload

# Deploy an update (after git push)
bash /var/www/guidingstarszm/deploy.sh

# Nginx
sudo nginx -t                       # Test config syntax
sudo systemctl reload nginx         # Reload config (no downtime)

# MariaDB
sudo mariadb -u guidingstars_user -p guiding_stars          # Connect to DB
mysqldump -u guidingstars_user -p guiding_stars > backup.sql  # Backup

# System
sudo ufw status                     # Firewall rules
df -h                               # Disk usage  (20 GB total)
free -h                             # RAM + swap usage
htop                                # Live resource monitor (sudo apt install htop)
```

## Memory Budget (1 GB RAM)

| Service | Approx. Usage |
|---------|---------------|
| Ubuntu 24.04 OS | ~150 MB |
| MariaDB (tuned) | ~100 MB |
| Node.js app | ~120-200 MB |
| Nginx | ~15 MB |
| **Total** | **~385-465 MB** |
| **Swap buffer** | 2 GB |

You have comfortable headroom. Monitor with `free -h` after everything is running.

---

## Security Notes

- **CORS**: `server.js` currently uses `app.use(cors())` with no origin restriction. Consider locking it to your domain in production:
  ```js
  app.use(cors({ origin: 'https://www.guidingstarszm.com' }));
  ```
- **MySQL**: Never expose port 3306 externally. The VPS firewall blocks it by default.
- **SSH**: Disable password authentication and use SSH keys only:
  ```bash
  sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
  sudo systemctl restart ssh
  ```
- **Backups**: Set up a daily `mysqldump` cron job and copy dumps off-server.
