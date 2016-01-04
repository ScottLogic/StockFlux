(function() {
    'use strict';

    angular.module('openfin.quandl', ['ngResource'])
        .factory('quandlService', ['$resource', function($resource) {
            var API_KEY = 'api_key=kM9Z9aEULVDD7svZ4A8B',
                DATE_INDEX = 0,
                OPEN_INDEX = 1,
                HIGH_INDEX = 2,
                LOW_INDEX = 3,
                CLOSE_INDEX = 4,
                VOLUME_INDEX = 5,
                QUANDL_URL = 'https://www.quandl.com/api/v3/',
                QUANDL_WIKI = 'datasets/WIKI/';

            // Queries Quandl for all stocks matching the input query
            function stockSearch() {
                return $resource(QUANDL_URL + 'datasets.json?' + API_KEY + '&query=:query&database_code=WIKI', {}, {
                    get: { method: 'GET', cache: true }
                });
            }

            // Queries Quandl for the specific stock code
            function stockMetadata() {
                return $resource(QUANDL_URL + QUANDL_WIKI + ':stock_code/metadata.json?' + API_KEY, {}, {
                    get: { method: 'GET', cache: true }
                });
            }

            function stockData() {
                var startDate = moment().subtract(14, 'days').format('YYYY-MM-DD'),
                    json;

                return $resource(QUANDL_URL + QUANDL_WIKI + ':code.json?' + API_KEY + '&start_date=' + startDate, {}, {
                    get: {
                        method: 'GET',
                        transformResponse: function(data, headers) {
                            json = angular.fromJson(data);
                            processResponse(json);
                            return json;
                        },
                        cache: true
                    }
                });
            }

            function search(query, cb) {
                stockSearch().get({ query: query }, function(result) {
                    result.datasets.map(function(dataset) {
                        processDataset(dataset, query, cb);
                    })
                });
            }

            function getMeta(stockCode, cb) {
                stockMetadata().get({ stock_code: stockCode }, function(result) {
                    processDataset(result.dataset, stockCode, cb);
                });
            }

            function getData(stockCode, cb) {
                return stockData().get({ code: stockCode }, function(result) {
                    var stock = {
                        name: result.dataset.name,
                        code: stockCode,
                        data: result.stockData.data
                    };

                    cb(stock);
                });
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

            return {
                getData: getData,
                search: search,
                getMeta: getMeta
            };
        }]);
}());
