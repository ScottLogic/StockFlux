import * as fdc3 from 'openfin-fdc3';

export const viewNews = async function(symbol) {
  const availableApps = await fdc3.findIntent('ViewNews');
  if (availableApps && availableApps.apps) {
    const newsApp = availableApps.apps.find(app => app.appId === 'stockflux-news');
    if (newsApp) {
      await fdc3.raiseIntent(
        'ViewNews',
        {
          type: 'news',
          name: symbol
        },
        newsApp.name
      );
    }
  }
};
