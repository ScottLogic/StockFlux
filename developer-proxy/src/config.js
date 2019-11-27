module.exports = {
  baseUrl: 'https://stockflux.scottlogic.com',
  port: 3010,
  overrides: {
    '/api/apps/v1/stockflux-watchlist': {
      manifest: 'http://localhost:3010/__static/watchlist.app.json'
    },
    '/api/apps/v1/stockflux-news': {
      manifest: 'http://localhost:3010/__static/news.app.json'
    },
    '/api/apps/v1/stockflux-chart': {
      manifest: 'http://localhost:3010/__static/chart.app.json'
    },
    '/api/apps/v1': 'http://localhost:3010/__static/apps.json'
  }
};
