(function() {
    'use strict';

    angular.module('openfin.store', ['angular-storage'])
        .factory('storeService', ['store', function(store) {
            var initialStocks = {
                'AAPL': 0,
                'MSFT': 1,
                'TITN': 2,
                'SNDK': 3,
                'TSLA': 4
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
                    return a[1] - b[1];
                });

                return tuples.map(function(x) {
                    return x[0];
                });
            }

            function save() {
                store.set('stocks', favouriteStocks);
            }

            function get() {
                return order(favouriteStocks);
            }

            function add(stock) {
                var stockName = stock.code;
                if (!favouriteStocks[stockName]) {
                    favouriteStocks[stockName] = Object.keys(favouriteStocks).length;
                    save();
                }
            }

            function remove(stock) {
                var stockName = stock.code;
                var stockOrder = favouriteStocks[stockName];
                if (stockOrder) {
                    delete favouriteStocks[stockName];
                    var keys = Object.keys(favouriteStocks),
                        newLength = keys.length;

                    for (var i = 0; i < newLength; i++) {
                        if (favouriteStocks[keys[i]] > stockOrder) {
                            favouriteStocks[keys[i]]--;
                        }
                    }
                    save();
                }
            }

            return {
                get: get,
                add: add,
                remove: remove
            };
        }]);
}());
