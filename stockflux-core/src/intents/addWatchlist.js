import * as fdc3 from 'openfin-fdc3';

export default async (symbol, stockName) => {
    const availableApps = await fdc3.findIntent('WatchlistAdd');
    if (availableApps && availableApps.apps) {
        const watchlistApp = availableApps.apps.find(app => app.appId === 'stockflux-watchlist');
        if (watchlistApp) {
            await fdc3.raiseIntent('WatchlistAdd',
                {
                    type: 'security',
                    name: stockName,
                    id: {
                        default: symbol
                    }
                },
                watchlistApp.name
            );
        }
    }
};
