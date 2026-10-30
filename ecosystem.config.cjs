module.exports = {
  apps: [
    {
      name: "auralis-api",
      script: "dist/index.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
    {
      name: "auralis-worker",
      script: "worker.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
        WORKER_POLL_INTERVAL_MS: 300000,
        WORKER_ARCHIVE_DIR: "./data/daily",
      },
    },
  ],
};
