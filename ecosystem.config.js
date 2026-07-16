// PM2 Process Manager Configuration
// Usage:
//   Start production:  pm2 start ecosystem.config.js --env production
//   Save startup:      pm2 save && pm2 startup
//   Monitor:           pm2 monit
//   Logs:              pm2 logs guiding-stars

module.exports = {
  apps: [
    {
      name: 'guiding-stars',
      script: 'server.js',
      cwd: '/var/www/guidingstarszm/backend',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      node_args: '--max-old-space-size=256',
      max_memory_restart: '300M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      out_file: '/var/log/pm2/guiding-stars-out.log',
      error_file: '/var/log/pm2/guiding-stars-error.log',
      merge_logs: true,
      time: true,
    },
  ],
};
