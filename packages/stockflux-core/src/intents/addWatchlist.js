import * as fdc3 from 'openfin-fdc3';

const defaultName = 'Apple Inc.';
const defaultSymbol = 'AAPL';

export default async (symbol, stockName) =>
  fdc3.raiseIntent('WatchlistAdd', {
    type: 'security',
    name: stockName || defaultName,
    id: {
      default: symbol || defaultSymbol
    }
  });
