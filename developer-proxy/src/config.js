module.exports = {
  baseUrl: 'https://stockflux.scottlogic.com',
  port: 3010,
  overrides: {
    '/api/apps/v1/stockflux-launcher/app.json': {},
    '/api/apps/v1/stockflux-launcher': {
      customConfig: {
        showInLauncher: true
      }
    }
  }
};
