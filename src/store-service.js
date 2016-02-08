(function() {
    'use strict';

    const KEY_NAME = 'windows';
    const initialStocks = [
        {
            id: 'main',
            stocks: [
                'AAPL', 'MSFT', 'TITN', 'SNDK', 'TSLA'
            ],
            closed: false
        }
    ];

    class StoreService {
        constructor($rootScope) {
            this.$rootScope = $rootScope;

            this.storage = JSON.parse(localStorage.getItem(KEY_NAME)) || initialStocks;
            this.open.bind(this);
        }

        open(windowName) {
            var self = this;
            function getWindowStore() {
                var windowIndex = self.storage.map((window) => window.id)
                    .indexOf(windowName);

                if (windowIndex > -1) {
                    return self.storage[windowIndex];
                } else {
                    var newStore = {
                        id: windowName,
                        stocks: [],
                        closed: false
                    };

                    // TODO: limit number of saved windows?
                    self.storage.push(newStore);

                    return newStore;
                }

            }

            function save(stock) {
                localStorage.setItem(KEY_NAME, JSON.stringify(self.storage));
                self.$rootScope.$broadcast('updateFavourites', stock);
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
                add: add,
                get: get,
                reorder: reorder,
                remove: remove
            };
        }
    }
    StoreService.$inject = ['$rootScope'];

    angular.module('openfin.store')
        .service('storeService', StoreService);
}());
