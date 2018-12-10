import fetch from 'isomorphic-fetch';
import moment from 'moment';
import throat from 'throat';

function dxor(a, b) {
    let r = '';
    const c = atob(a); // decode base64 to plain
    for (let i = 0; i < c.length; i += 1) {
        // eslint-disable-next-line no-bitwise
        r += String.fromCharCode(c.charCodeAt(i) ^ b.charCodeAt(i));
    }
    return r;
}

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
    || 'api_key'
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
function startOfPeriod() {
    return moment().subtract(28, 'days');
}

function processSearchResults(result) {
    return result.datasets.map((dataSet) => ({
        name: dataSet.name,
        code: dataSet.dataset_code
    }));
}

function filterSearchResultsByDate(json) {
    const periodStartDate = startOfPeriod();
    const validDatasets = json.datasets.filter((dataSet) =>
        moment(dataSet.newest_available_date).isAfter(periodStartDate)
    );

    return {
        datasets: validDatasets
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
    const { data, end_date, start_date } = json.dataset;
    const results = data.map(extract);

    const stockData = {
        startDate: start_date,
        endDate: end_date,
        data: results
    };
    return {
        ...json,
        stockData
    };
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
export function search(query, useFallback = false) {
    const apiKeyParam = (useFallback ? '' : API_KEY_VALUE);
    return throttle(() => fetch(`${DATASETS_URL}.json?${apiKeyParam}&query=${query}&database_code=${DATASET}`, {
        method: 'GET',
        cache: true
    }))
    .then(validateResponse)
    .then(filterSearchResultsByDate)
    .then(processSearchResults)
    .catch((error) => {
        if (!useFallback) {
            return search(query, true);
        }
        return Promise.reject(error);
    });
}

export function getStockData(code, useFallback = false) {
    const startDate = startOfPeriod().format('YYYY-MM-DD');
    const apiKeyParam = (useFallback ? '' : API_KEY_VALUE);

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
