(function() {
    'use strict';

    angular.module('openfin.store', [])
        .factory('storeService', ['$rootScope', function($rootScope) {
            var KEY_NAME = 'windows';
            var initialStocks = [
                {
                    id: 'main',
                    stocks: [
                        'AAPL', 'MSFT', 'TITN', 'SNDK', 'TSLA'
                    ],
                    closed: false
                }
            ];

            var storage = JSON.parse(localStorage.getItem(KEY_NAME)) || initialStocks;

            function open(windowName) {
                function getWindowStore() {
                    var windowIndex = storage.map(function(window) {
                        return window.id;
                    }).indexOf(windowName);

                    if (windowIndex > -1) {
                        return storage[windowIndex];
                    } else {
                        var newStore = {
                            id: windowName,
                            stocks: [],
                            closed: false
                        };

                        // TODO: limit number of saved windows?
                        storage.push(newStore);

                        return newStore;
                    }
                }

                function save(stock) {
                    localStorage.setItem(KEY_NAME, JSON.stringify(storage));
                    $rootScope.$broadcast('updateFavourites', stock);
                }

                function get() {
                    var windowStore = getWindowStore();
                    return windowStore.stocks;
                }

                // Move given item in an array to directly after the to-item
                function reorder(fromItem, toItem) {
                    if (fromItem === toItem) {
                        return;
                    }

                    var windowStore = getWindowStore();

                    var oldArray = windowStore.stocks;
                    var fromIndex = oldArray.indexOf(fromItem);
                    var toIndex = oldArray.indexOf(toItem);
                    oldArray.splice(toIndex, 0, oldArray.splice(fromIndex, 1)[0]);

                    save();
                }

                function add(stock) {
                    var stockName = stock.code;

                    var windowStore = getWindowStore();
                    if (windowStore.stocks.indexOf(stockName) === -1) {
                        windowStore.stocks.push(stockName);
                        save(stock);
                    }
                }

                function remove(stock) {
                    var stockName = stock.code;
                    var windowStore = getWindowStore();
                    var index = windowStore.stocks.indexOf(stockName);
                    if (index > -1) {
                        windowStore.stocks.splice(index, 1);
                    }

                    save(stock);
                }

                return {
                    get: get,
                    add: add,
                    remove: remove,
                    reorder: reorder
                };
            }

            return {
                open: open
            };
        }]);
}());
