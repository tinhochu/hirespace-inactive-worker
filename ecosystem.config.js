module.exports = {
  apps : [{
    name      : 'hirespace-inactive-worker',
    script    : './index.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }],
};