(function() {
    'use strict';

    const API_KEY = 'kM9Z9aEULVDD7svZ4A8B',
        API_KEY_VALUE = 'api_key=' + API_KEY,
        DATE_INDEX = 0,
        OPEN_INDEX = 1,
        HIGH_INDEX = 2,
        LOW_INDEX = 3,
        CLOSE_INDEX = 4,
        VOLUME_INDEX = 5,
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
        var datasetData = json.dataset,
            financialData = datasetData.data,
            results = [],
            i = 0,
            max = financialData.length;

        for (i; i < max; i++) {
            results.push(extract(financialData[i]));
        }

        json.stockData = {
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

        stockData() {
            var startDate = period().format('YYYY-MM-DD'),
                json;

            return this.$resource(QUANDL_URL + QUANDL_WIKI + ':code.json?' + API_KEY_VALUE + '&start_date=' + startDate, {}, {
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

        getData(stockCode, cb) {
            return this.stockData().get({ code: stockCode }, (result) => {
                var stock = {
                    name: result.dataset.name,
                    code: stockCode,
                    data: result.stockData.data
                };

                cb(stock);
            });
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

    angular.module('openfin.quandl', ['ngResource'])
        .service('quandlService', QuandlService);
}());
