import * as fdc3 from 'openfin-fdc3';

const defaultSymbol = 'AAPL';
const defaultCompany = 'Apple Inc.';

export default async (symbol, company) =>
  fdc3.raiseIntent('ViewNews', {
    type: 'news',
    name: symbol || defaultSymbol,
    companyName: company || defaultCompany,
    appName: 'stockflux-news'
  });
