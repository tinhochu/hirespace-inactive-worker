module.exports = {
  apps : [{
    name      : 'hirespace-worker',
    script    : './index.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }],
};