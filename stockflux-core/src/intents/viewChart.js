import * as fdc3 from 'openfin-fdc3';

export default async (symbol, stockName) => {
    const availableApps = await fdc3.findIntent(fdc3.Intents.VIEW_CHART);
    if (availableApps && availableApps.apps) {
        const chart = availableApps.apps.find(app => app.appId === 'stockflux-chart-container');
        if (chart) {
            await fdc3.raiseIntent(
                fdc3.Intents.VIEW_CHART,
                {
                    type: 'security',
                    name: symbol,
                    id: {
                        default: stockName
                    }
                },
                chart.name
            );
        }
    }
};
