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
        }

        open(windowName) {
            function getWindowStore() {
                var windowIndex = this.storage.map((window) => window.id)
                    .indexOf(windowName);

                if (windowIndex > -1) {
                    return this.storage[windowIndex];
                } else {
                    var newStore = {
                        id: windowName,
                        stocks: [],
                        closed: false
                    };

                    // TODO: limit number of saved windows?
                    this.storage.push(newStore);

                    return newStore;
                }

            }

            function save(stock) {
                localStorage.setItem(KEY_NAME, JSON.stringify(this.storage));
                this.$rootScope.$broadcast('updateFavourites', stock);
            }

            function get() {
                var windowStore = this.getWindowStore();
                return windowStore.stocks;
            }

            // Move given item in an array to directly after the to-item
            function reorder(fromItem, toItem) {
                if (fromItem === toItem) {
                    return;
                }

                var windowStore = this.getWindowStore();

                var oldArray = windowStore.stocks;
                var fromIndex = oldArray.indexOf(fromItem);
                var toIndex = oldArray.indexOf(toItem);
                oldArray.splice(toIndex, 0, oldArray.splice(fromIndex, 1)[0]);

                this.save();
            }

            function add(stock) {
                var stockName = stock.code;

                var windowStore = this.getWindowStore();
                if (windowStore.stocks.indexOf(stockName) === -1) {
                    windowStore.stocks.push(stockName);
                    this.save(stock);
                }
            }

            function remove(stock) {
                var stockName = stock.code;
                var windowStore = this.getWindowStore();
                var index = windowStore.stocks.indexOf(stockName);
                if (index > -1) {
                    windowStore.stocks.splice(index, 1);
                }

                this.save(stock);
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
