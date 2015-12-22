(function() {
    'use strict';

    angular.module('openfin.store', ['angular-storage'])
        .factory('storeService', ['store', function(store) {
            var initialStocks = {
                'AAPL': 0,
                'MSFT': 0,
                'TITN': 0,
                'SNDK': 0,
                'TSLA': 0
            };

            var favouriteStocks = store.get('stocks') || initialStocks;

            function order(obj) {
                var tuples = [];

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        tuples.push([key, obj[key]]);
                    }
                }

                tuples = tuples.sort(function(a, b) {
                    return b[1] - a[1];
                });

                return tuples.map(function(x) {
                    return x[0];
                });
            }

            function get() {
                return order(favouriteStocks);
            }

            function increment(stockName) {
                if (favouriteStocks[stockName] !== undefined) {
                    favouriteStocks[stockName]++;
                } else {
                    favouriteStocks[stockName] = 1;
                }

                store.set('stocks', favouriteStocks);
            }

            return {
                getStocks: get,
                incrementStock: increment
            };
        }]);
}());
