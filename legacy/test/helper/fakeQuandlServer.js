import nock from 'nock';

import quandlSearchResponse from '../fixture/quandlSearchResponse.json';
import googMetadataResponse from '../fixture/quandlMetadataResponse.json';
import googStockdataResponse from '../fixture/quandlStockDataResponse.json';
import quandlBadResponse from '../fixture/quandlErrorResponse.json';

module.exports = (apiKey = '') => {
    const apiKeyParam = apiKey !== '' ? `api_key=${apiKey}` : '';
    const routes = {};

    // search
    routes[`/api/v3/datasets.json?${apiKeyParam}&query=GOOG&database_code=EOD`] = [200, quandlSearchResponse];
    routes['/api/v3/datasets.json?&query=GOOG&database_code=EOD'] = [200, quandlSearchResponse];
    routes[`/api/v3/datasets.json?${apiKeyParam}&query=BAD&database_code=EOD`] = [404, quandlBadResponse];
    routes['/api/v3/datasets.json?&query=BAD&database_code=EOD'] = [404, quandlBadResponse];

    // metadata
    routes[`/api/v3/datasets/EOD/GOOG/metadata.json?${apiKeyParam}`] = [200, googMetadataResponse];
    routes[`/api/v3/datasets/EOD/BAD/metadata.json?${apiKeyParam}`] = [404, quandlBadResponse];

    // stock data
    routes[`/api/v3/datasets/EOD/GOOG.json?${apiKeyParam}&start_date=2016-05-04`] = [200, googStockdataResponse];
    routes['/api/v3/datasets/EOD/GOOG.json?&start_date=2016-05-04'] = [200, googStockdataResponse];
    routes['/api/v3/datasets/EOD/BAD.json?&start_date=2016-05-04'] = [404, quandlBadResponse];
    routes[`/api/v3/datasets/EOD/BAD.json?${apiKeyParam}&start_date=2016-05-04`] = [404, quandlBadResponse];

    return nock('https://www.quandl.com')
        .persist()
        .defaultReplyHeaders({ 'Content-Type': 'application/json' })
        .get((uri) => Object.prototype.hasOwnProperty.call(routes, uri))
        .reply((uri) => routes[uri]);
};
