import fetch from 'isomorphic-fetch';
import moment from 'moment';
import throat from 'throat';

// eslint-disable-next-line
function exor(a, b) { let r = ''; for (let i = 0; i < a.length; i += 1) { r += String.fromCharCode(a.charCodeAt(i) ^ b.charCodeAt(i)); } return btoa(r); }
// eslint-disable-next-line
function dxor(a, b) { let r = ''; const c = atob(a); for (let i = 0; i < c.length; i += 1) { r += String.fromCharCode(c.charCodeAt(i) ^ b.charCodeAt(i)); } return r; }

const DEPLOY_KEY = Boolean(process.env.TRAVIS === 'true'
    && process.env.TRAVIS_SECURE_ENV_VARS === 'true'
    && process.env.TRAVIS_PULL_REQUEST === 'false'
    && process.env.QUANDL_API_KEY
    && process.env.QUANDL_KEY);

const LOCAL_KEY = Boolean(
    process.env.TRAVIS !== 'true' &&
    process.env.QUANDL_API_KEY
);

const API_KEY = (
    (DEPLOY_KEY && dxor(process.env.QUANDL_API_KEY, process.env.QUANDL_KEY))
    || (LOCAL_KEY && process.env.QUANDL_API_KEY)
    || 'kM9Z9aEULVDD7svZ4A8B'
);
const API_KEY_VALUE = `api_key=${API_KEY}`;
const DATE_INDEX = 0;
const OPEN_INDEX = 8;
const HIGH_INDEX = 9;
const LOW_INDEX = 10;
const CLOSE_INDEX = 11;
const VOLUME_INDEX = 12;
const BASE_URL = 'https://www.quandl.com/api/v3';
const DATASETS_URL = `${BASE_URL}/datasets`;
const DATASET = 'EOD';

// limit concurrency to ensure that we don't have any concurrent Quandl requests
// see: https://blog.quandl.com/change-quandl-api-limits
const concurrency = DEPLOY_KEY ? Infinity : 1;
const throttle = throat(concurrency);

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

    for (let i = 0, max = datasets.length; i < max; i += 1) {
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

    for (i; i < max; i += 1) {
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
    return response.json().then((json) => {
        if (response.ok && !json.quandl_error) {
            return json;
        }
        return Promise.reject(json);
    });
}

// Exported functions
export function search(query, usefallback = false) {
    const apiKeyParam = (usefallback ? '' : API_KEY_VALUE);
    return throttle(() => fetch(`${DATASETS_URL}.json?${apiKeyParam}&query=${query}&database_code=${DATASET}`, {
        method: 'GET',
        cache: true
    }))
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

export function getStockData(code, usefallback = false) {
    const startDate = period().format('YYYY-MM-DD');
    const apiKeyParam = (usefallback ? '' : API_KEY_VALUE);

    return throttle(() => fetch(`${DATASETS_URL}/${DATASET}/${code}.json?${apiKeyParam}&start_date=${startDate}`, {
        method: 'GET',
        cache: true
    }))
    .then(validateResponse)
    .then(processStockData);
}

export function apiKey() {
    return API_KEY;
}

export function dataset() {
    return DATASET;
}
