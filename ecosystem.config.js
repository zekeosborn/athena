module.exports = {
  apps: [
    {
      name: 'athena',
      exec_mode: 'cluster',
      instances: 'max',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      exp_backoff_restart_delay: 500,
      max_memory_restart: '1G',
    },
  ],
};