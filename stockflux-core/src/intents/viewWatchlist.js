import * as fdc3 from 'openfin-fdc3';

export default async () => {
    const availableApps = await fdc3.findIntent('WatchlistView');
    if (availableApps && availableApps.apps) {
        const watchlistApp = availableApps.apps.find(app => app.appId === 'stockflux-watchlist');
        if (watchlistApp) {
            await fdc3.raiseIntent('WatchlistView',
                {
                    type: 'security'
                },
                watchlistApp.name
            );
        }
    }
};
