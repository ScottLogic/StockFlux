(function() {
    'use strict';

    const API_KEY = 'kM9Z9aEULVDD7svZ4A8B',
        API_KEY_VALUE = 'api_key=' + API_KEY,
        DATE_INDEX = 0,
        OPEN_INDEX = 8,
        HIGH_INDEX = 9,
        LOW_INDEX = 10,
        CLOSE_INDEX = 11,
        VOLUME_INDEX = 12,
        QUANDL_URL = 'https://www.quandl.com/api/v3/',
        QUANDL_WIKI = 'datasets/WIKI/';

    // Helper functions outside of Class scope
    function period() {
        return moment().subtract(28, 'days');
    }

    function processDataset(dataset, query, cb) {
        var code = dataset.dataset_code;
        var stock = {
            name: dataset.name,
            code: code,
            favourite: false,
            query: query
        };

        cb(stock);
    }

    function filterByDate(json) {
        var datasets = json.datasets,
            result = [];

        for (var i = 0, max = datasets.length; i < max; i++) {
            if (moment(datasets[i].newest_available_date) > period()) {
                result.push(datasets[i]);
            }
        }

        return {
            datasets: result
        };
    }

    function processResponse(json) {
        if (!json || json.quandl_error) {
            return {
                success: false,
                error: {
                    code: json.quandl_error.code,
                    message: json.quandl_error.message
                }
            };
        }

        var datasetData = json.dataset,
            financialData = datasetData.data,
            results = [],
            i = 0,
            max = financialData.length;

        for (i; i < max; i++) {
            results.push(extract(financialData[i]));
        }

        json.stockData = {
            success: true,
            startDate: datasetData.start_date,
            endDate: datasetData.end_date,
            data: results
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

    class QuandlService {
        constructor($resource) {
            this.$resource = $resource;
        }

        search(query, cb, noResultsCb) {
            this.stockSearch().get({ query: query }, (result) => {
                result.datasets.map((dataset) => {
                    processDataset(dataset, query, cb);
                });

                if (result.datasets.length === 0) {
                    noResultsCb();
                }
            });
        }

        getMeta(stockCode, cb) {
            this.stockMetadata().get({ 'stock_code': stockCode }, (result) => {
                processDataset(result.dataset, stockCode, cb);
            });
        }

        /**
        * @param useFailSafe {boolean=}
        * @todo use alternative API key instead of defaulting anonymous requests
        * anonymous requests have a limit of 50 /day whereas the limit for
        * a registered acc is 50k
        */
        stockData(useFailSafe = false) {
            var startDate = period().format('YYYY-MM-DD'),
                json;

            return this.$resource(QUANDL_URL + QUANDL_WIKI + ':code.json?' + (useFailSafe ? '' : API_KEY_VALUE) + '&start_date=' + startDate, {}, {
                get: {
                    method: 'GET',
                    transformResponse: (data, headers) => {
                        json = angular.fromJson(data);
                        processResponse(json);
                        return json;
                    },
                    cache: true
                }
            });
        }

        /**
        * @param stockCode {String} Stock code to query
        * @param cb {Function} callback to be called on success and error
        * @param useFailSafe {boolean=} True to retry request anonymously - used by error callback
        * @todo use alternative API key instead of defaulting to No key
        * @todo should we show a warning to the user when we swap to anonymous?
        */
        getData(stockCode, cb, useFailSafe = false) {
            var startDate = period().format('YYYY-MM-DD');
            return this.stockData(useFailSafe).get({ code: stockCode }, (result) => {
                cb({
                    success: true,
                    code: stockCode,
                    name: result.dataset.name,
                    data: result.stockData.data
                });
            }, (request) => {
                // only use the failsafe once per call
                if (!useFailSafe) {
                    this.getData(stockCode, cb, true);// eslint-disable-line
                } else {
                    // pass data on so an error message can be shown
                    cb({
                        success: false,
                        code: request.status,
                        message: request.statusText,
                        details: {
                            code: request.data.quandl_error.code,
                            message: request.data.quandl_error.message
                        }
                    });
                }
            }
            );
        }

        // Queries Quandl for the specific stock code
        stockMetadata() {
            return this.$resource(QUANDL_URL + QUANDL_WIKI + ':stock_code/metadata.json?' + API_KEY_VALUE, {}, {
                get: { method: 'GET', cache: true }
            });
        }

        // Queries Quandl for all stocks matching the input query
        stockSearch() {
            return this.$resource(QUANDL_URL + 'datasets.json?' + API_KEY_VALUE + '&query=:query&database_code=WIKI', {}, {
                get: {
                    method: 'GET',
                    cache: true,
                    transformResponse: (data, headers) => {
                        var json = angular.fromJson(data);
                        return filterByDate(json);
                    }
                }
            });
        }

        apiKey() {
            return API_KEY;
        }
    }
    QuandlService.$inject = ['$resource'];

    angular.module('stockflux.quandl', ['ngResource'])
        .service('quandlService', QuandlService);
}());
