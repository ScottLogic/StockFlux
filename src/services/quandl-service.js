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
                VOLUME_INDEX = 5;

            function stock() {
                return $resource('https://www.quandl.com/api/v3/datasets.json?' + API_KEY + '&query=:query&database_code=WIKI', {}, {
                    get: { method: 'GET', cache: true }
                });
            }

            function stockData() {
                var startDate = moment().subtract(1, 'days').format('YYYY-MM-DD'),
                    json;

                return $resource('https://www.quandl.com/api/v3/datasets/WIKI/:code/data.json?' + API_KEY + '&start_date=' + startDate, {}, {
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

            function getMeta(query, cb) {
                stock().get({ query: query }, function(result) {
                    result.datasets.map(function(dataset) {
                        var code = dataset.dataset_code;
                        var stock = {
                            name: dataset.name,
                            code: code,
                            favourite: false
                        };

                        cb(stock);
                    });
                });
            }

            function getData(query, cb) {
                return getMeta(query, function(stock) {
                    stockData().get({ code: stock.code }, function(result) {
                        stock.data = result.stockData.data;

                        cb(stock);
                    });
                });
            }

            function processResponse(json) {
                var datasetData = json.dataset_data,
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
                getMeta: getMeta
            };
        }]);
}());
