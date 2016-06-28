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

// Helper functions
function period() {
    return moment().subtract(28, 'days');
}

function processSearchResults(result) {
    return result.datasets.map(
        dataset => { //eslint-disable-line
            return {
                name: dataset.name,
                code: dataset.dataset_code
            };
        }
    );
}

function filterSearchResultsByDate(json) {
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

function processStockData(json) {
    const datasetData = json.dataset;
    const financialData = datasetData.data;
    const results = [];
    let i = 0;
    const max = financialData.length;

    for (i; i < max; i++) {
        results.push(extract(financialData[i]));
    }

    json.stockData = { // eslint-disable-line no-param-reassign
        startDate: datasetData.start_date,
        endDate: datasetData.end_date,
        data: results
    };
    return json;
}

function validateResponse(response) {
    return response.json().then(json => {
        if (response.ok && !json.quandl_error) {
            return json;
        }
        return Promise.reject(json);
    });
}


// Exported functions
export function search(query, usefallback = false) {
    const apiKeyParam = (usefallback ? '' : API_KEY_VALUE);
    return fetch(`${QUANDL_URL}datasets.json?${apiKeyParam}&query=${query}&database_code=WIKI`, {
        method: 'GET',
        cache: true
    })
    .then(validateResponse)
    .then(filterSearchResultsByDate)
    .then(processSearchResults)
    .catch((error) => {
        if (!usefallback) {
            return search(query, true);
        }
        return Promise.reject(error);
    });
}

// Queries Quandl for the specific stock code
export function getStockMetadata(code) {
    return fetch(`${QUANDL_URL}${QUANDL_WIKI}${code}/metadata.json?${API_KEY_VALUE}`)
    .then(validateResponse);
}

export function getStockData(code, usefallback = false) {
    const startDate = period().format('YYYY-MM-DD');
    const apiKeyParam = (usefallback ? '' : API_KEY_VALUE);

    return fetch(`${QUANDL_URL}${QUANDL_WIKI}${code}.json?${apiKeyParam}&start_date=${startDate}`, {
        method: 'GET',
        cache: true
    })
    .then(validateResponse)
    .then(processStockData);
}

export function apiKey() {
    return API_KEY;
}
