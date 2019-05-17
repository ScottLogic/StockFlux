import * as fdc3 from 'openfin-fdc3';

export const viewChart = async function(symbol, stockName) {
  await fdc3.raiseIntent(fdc3.Intents.VIEW_CHART, {
    type: 'security',
    name: symbol,
    id: {
      default: stockName
    }
  });
};
