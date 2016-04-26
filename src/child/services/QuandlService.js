import fetch from 'isomorphic-fetch';
import moment from 'moment';
// Be very careful changing the line below. It is replaced with a string.replace in the grunt build
// to swap out the API key for release.
const API_KEY = 'kM9Z9aEULVDD7svZ4A8B';
const API_KEY_VALUE = `api_key=${API_KEY}`;
const DATE_INDEX = 0;
const OPEN_INDEX = 8;
const HIGH_INDEX = 9;
const LOW_INDEX = 10;
const CLOSE_INDEX = 11;
const VOLUME_INDEX = 12;
const QUANDL_URL = 'https://www.quandl.com/api/v3/';
const QUANDL_WIKI = 'datasets/WIKI/';

// Helper functions outside of Class scope
function period() {
    return moment().subtract(28, 'days');
}

function processDataset(dataset, query) {
    return {
        name: dataset.name,
        code: dataset.dataset_code,
        favourite: false,
        query
    };
}

function isValidResponse(json) {
    return json && !json.quandl_error;
}

function filterByDate(json) {
    const datasets = json.datasets;
    const result = [];

    for (let i = 0, max = datasets.length; i < max; i++) {
        if (moment(datasets[i].newest_available_date) > period()) {
            result.push(datasets[i]);
        }
    }

    return {
        datasets: result
    };
}


function extract(data) {
    return {
        date: data[DATE_INDEX],
        open: data[OPEN_INDEX],
        high: data[HIGH_INDEX],
        low: data[LOW_INDEX],
        close: data[CLOSE_INDEX],
        volume: data[VOLUME_INDEX]
    };
}

function processResponse(json) {
    const datasetData = json.dataset;
    const financialData = datasetData.data;
    const results = [];
    let i = 0;
    const max = financialData.length;

    for (i; i < max; i++) {
        results.push(extract(financialData[i]));
    }

    json.stockData = { //eslint-disable-line
        success: true,
        startDate: datasetData.start_date,
        endDate: datasetData.end_date,
        data: results
    };
}


class QuandlService {

    search(query, cb, noResultsCb, errorCb, usefallback = false) {
        this.stockSearch(query, usefallback).then(
        (result) => {
            const processedDataset = result.datasets.map(
                (dataset) => processDataset(dataset, query)
            );

            cb(processedDataset);
        }).catch((result) => {
            if (!usefallback) {
                this.search(query, cb, noResultsCb, errorCb, true);
            } else if (errorCb) {
                errorCb({
                    success: false,
                    code: result.status,
                    message: result.statusText
                });
            }
        });
    }

    getMeta(stockCode, cb) {
        this.stockMetadata().get({ stock_code: stockCode }, (result) => {
            cb(processDataset(result.dataset, stockCode));
        });
    }

    /**
    * @todo use alternative API key instead of defaulting anonymous requests
    * anonymous requests have a limit of 50 /day whereas the limit for
    * a registered acc is 50k
    */
    stockData(usefallback = false) {
        const startDate = period().format('YYYY-MM-DD');
        const apiKeyParam = (usefallback ? '' : API_KEY_VALUE);

        return fetch(`${QUANDL_URL}${QUANDL_WIKI}:code.json?${apiKeyParam}&start_date=${startDate}`, {
            method: 'GET',
            cache: true
        })
        .then(response => response.json())
        .then(json => {
            if (isValidResponse(json)) {
                processResponse(json);
            }
            return json;
        });
    }

    /**
    * @param stockCode {String} Stock code to query
    * @param cb {Function} callback to be called on success and error
    * @todo use alternative API key instead of defaulting to No key
    * @todo should we show a warning to the user when we swap to anonymous?
    */
    getData(stockCode, cb, errorCb, usefallback = false) {
        return this.stockData(usefallback).get({ code: stockCode }, (result) => {
            cb({
                success: true,
                code: stockCode,
                name: result.dataset.name,
                data: result.stockData.data
            });
        }, (result) => {
            // only use the failsafe once per call
            if (!usefallback) {
                this.getData(stockCode, cb, errorCb, true);
            } else if (errorCb) {
                // pass data on so an error message can be shown
                errorCb({
                    success: false,
                    code: result.status,
                    message: result.statusText
                });
            }
        });
    }

    // Queries Quandl for the specific stock code
    // stockMetadata() {
    //     return this.$resource(QUANDL_URL + QUANDL_WIKI + ':stock_code/metadata.json?' + API_KEY_VALUE, {}, {
    //         get: { method: 'GET', cache: true }
    //     });
    // }

    // Queries Quandl for all stocks matching the input query
    stockSearch(query, usefallback = false) {

        const apiKeyParam = (usefallback ? '' : API_KEY_VALUE);
        console.log(`${QUANDL_URL}datasets.json?${apiKeyParam}&query=${query}&database_code=WIKI`); // eslint-disable-line no-console

        return fetch(`${QUANDL_URL}datasets.json?${apiKeyParam}&query=${query}&database_code=WIKI`, {
            method: 'GET',
            cache: true,
        })
        .then(response => response.json())
        .then(json => (isValidResponse(json) ? filterByDate(json) : {}));
    }

    apiKey() {
        return API_KEY;
    }
}

export default QuandlService;
