(function() {
    'use strict';

    angular.module('openfin.store', ['angular-storage', 'openfin.desktop'])
        .factory('storeService', ['store', 'desktopService', '$rootScope', function(store, desktopService, $rootScope) {
            var KEY_NAME = 'windows';
            var initialStocks = [
                {
                    id: 'OpenFinD3FC',
                    stocks: [
                        'AAPL', 'MSFT', 'TITN', 'SNDK', 'TSLA'
                    ],
                    closed: false
                }
            ];

            var storage = JSON.parse(store.get(KEY_NAME)) || initialStocks;

            function getWindowStore() {
                var windowIndex = storage.map(function(window) {
                    return window.id;
                }).indexOf(desktopService.getCurrentWindow().name);

                return windowIndex > -1 ? storage[windowIndex] : undefined; // TODO: undefined?
            }

            function save(stock) {
                store.set(KEY_NAME, JSON.stringify(storage));
                $rootScope.$broadcast('updateFavourites', stock);
            }

            function get() {
                var window = getWindowStore();
                return window ? window.stocks : [];
            }

            // Move given item in an array to directly after the to-item
            function reorder(fromItem, toItem) {
                if (fromItem === toItem) {
                    return;
                }

                var window = getWindowStore();

                if (window) {
                    var oldArray = window.stocks;
                    var fromIndex = oldArray.indexOf(fromItem);
                    var toIndex = oldArray.indexOf(toItem);
                    oldArray.splice(toIndex, 0, oldArray.splice(fromIndex, 1)[0]);

                    save();
                }
            }

            function add(stock) {
                var stockName = stock.code;

                var window = getWindowStore();
                if (window && window.stocks.indexOf(stockName) === -1) {
                    window.stocks.push(stockName);
                    save(stock);
                }
            }

            function remove(stock) {
                var stockName = stock.code;
                var window = getWindowStore();
                if (window) {
                    var index = window.stocks.indexOf(stockName);
                    if (index > -1) {
                        window.stocks.splice(index, 1);
                    }
                }

                save(stock);
            }

            return {
                get: get,
                reorder: reorder,
                add: add,
                remove: remove
            };
        }]);
}());
