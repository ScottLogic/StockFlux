import * as fdc3 from 'openfin-fdc3';

const defaultSymbol = 'AAPL';

export default async (symbol) =>
    fdc3.raiseIntent(
        'ViewNews',
        {
            type: 'news',
            name: symbol || defaultSymbol,
            appName: 'stockflux-news'
        }
    );
