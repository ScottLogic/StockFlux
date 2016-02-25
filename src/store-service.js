(function() {
    'use strict';

    const KEY_NAME = 'windows',
        defaultStocks = ['AAPL', 'MSFT', 'TITN', 'SNDK', 'TSLA'],
        closedCacheSize = 5;

    var storage;

    class StoreWrapper {
        constructor($rootScope, store) {
            this.$rootScope = $rootScope;
            this.store = store;
        }

        save() {
            localStorage.setItem(KEY_NAME, JSON.stringify(storage));
        }

        update(stock) {
            this.save();
            this.$rootScope.$broadcast('updateFavourites', stock);
        }

        get() {
            return this.store.stocks;
        }

        // Move given item in an array to directly after the to-item
        reorder(fromItem, toItem) {
            if (fromItem === toItem) {
                return;
            }

            var oldArray = this.store.stocks;
            var fromIndex = oldArray.indexOf(fromItem);
            var toIndex = oldArray.indexOf(toItem);
            oldArray.splice(toIndex, 0, oldArray.splice(fromIndex, 1)[0]);

            this.update();
        }

        add(stock) {
            var stockName = stock.code;

            if (this.store.stocks.indexOf(stockName) === -1) {
                this.store.stocks.push(stockName);
                this.update(stock);
            }
        }

        remove(stock) {
            var stockName = stock.code;
            var index = this.store.stocks.indexOf(stockName);
            if (index > -1) {
                this.store.stocks.splice(index, 1);
            }

            this.update(stock);
        }

        toggleCompact(isCompact) {
            this.store.compact = arguments.length ? isCompact : !this.store.compact;

            this.save();
        }

        isCompact() {
            return this.store.compact;
        }

        openWindow() {
            this.store.closed = 0;
            this.save();
        }

        closeWindow() {
            this.store.closed = Date.now();
            this.save();

            // Trim the oldest closed store
            var closedArray = storage.filter((store) => store.closed !== 0);
            if (closedArray.length > closedCacheSize) {
                closedArray.sort((a, b) => {
                    return b.closed - a.closed;
                });

                for (var i = closedCacheSize, max = closedArray.length; i < max; i++) {
                    var storageIndex = storage.indexOf(closedArray[i]);
                    storage.splice(storageIndex, 1);
                }
            }

            this.save();
        }
    }

    class StoreService {
        constructor($rootScope) {
            this.$rootScope = $rootScope;
            storage = JSON.parse(localStorage.getItem(KEY_NAME));
        }

        getPreviousOpenWindowNames() {
            return (storage || [])
                .filter((store) => store.closed === 0)
                .map((store) => store.id);
        }

        getPreviousClosedWindows() {
            return (storage || [])
                .filter((store) => store.closed > 0);
        }

        open(windowName) {
            var windowIndex = (storage || []).map((window) => window.id)
                    .indexOf(windowName),
                store;

            if (windowIndex > -1) {
                store = storage[windowIndex];
            } else {
                var stocks = [];
                if (!storage) {
                    stocks = defaultStocks;
                    storage = [];
                }

                var newStore = {
                    id: windowName,
                    stocks: stocks,
                    closed: 0,
                    compact: false
                };

                storage.push(newStore);

                store = newStore;
            }

            return new StoreWrapper(this.$rootScope, store);
        }
    }
    StoreService.$inject = ['$rootScope'];

    angular.module('openfin.store')
        .service('storeService', StoreService);
}());
