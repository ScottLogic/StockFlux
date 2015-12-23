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

            return {
                get: get
            };
        }]);
}());
