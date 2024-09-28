const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'http://localhost:3100/',
    secure: false,
    logLevel: 'debug',
    pathRewrite: { '^/api': '' }
  }
];

module.exports = PROXY_CONFIG;

//  --proxy-config proxy.conf.js