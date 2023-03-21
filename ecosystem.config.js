module.exports = {
  apps: [{
    name: 'NuxtAppName',
    exec_mode: 'cluster',
    instances: 'max',
    script: '/chatGPT-API/.output/server/index.mjs',
  }]
}