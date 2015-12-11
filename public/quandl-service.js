(function() {
    'use strict';

    angular.module('openfin.quandl', ['ngResource'])
        .factory('quandlService', ['$resource', function($resource) {
            var apiKey = 'api_key=kM9Z9aEULVDD7svZ4A8B';

            function stock() {
                return $resource('https://www.quandl.com/api/v3/datasets.json?' + apiKey + '&query=:query&database_code=WIKI', {}, {
                    get: { method: 'GET', cache: true }
                });
            }

            function stockData() {
                var startDate = moment().subtract(1, 'weeks').format('YYYY-MM-DD'),
                    json;

                return $resource('https://www.quandl.com/api/v3/datasets/WIKI/:code/data.json?' + apiKey + '&start_date=' + startDate, {}, {
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
                    date: data[0],
                    open: data[1],
                    high: data[2],
                    low: data[3],
                    close: data[4],
                    volume: data[5]
                };
            }

            return {
                stock: stock,
                stockData: stockData
            };
        }]);
}());
