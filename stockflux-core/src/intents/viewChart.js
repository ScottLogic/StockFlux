import * as fdc3 from 'openfin-fdc3';

const defaultName = 'Apple Inc.';
const defaultSymbol = 'AAPL';

export default async (symbol, stockName) =>
    fdc3.raiseIntent(
        fdc3.Intents.VIEW_CHART,
        {
            type: 'security',
            name: symbol || defaultSymbol,
            appName: 'stockflux-chart',
            id: {
                default: stockName || defaultName,
            }
        }
    );
