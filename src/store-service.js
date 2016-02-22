(function() {
    'use strict';

    const KEY_NAME = 'windows',
        defaultStocks = ['AAPL', 'MSFT', 'TITN', 'SNDK', 'TSLA'],
        closedCacheSize = 5;

    class StoreWrapper {
        constructor($rootScope, storage, store) {
            this.$rootScope = $rootScope;
            this.storage = storage;
            this.store = store;
        }

        save() {
            localStorage.setItem(KEY_NAME, JSON.stringify(this.storage));
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
            this.store.compact = isCompact;
            this.save();
        }

        isCompact() {
            return this.store.compact;
        }

        closeWindow() {
            this.store.closed = Date.now();
            this.save();

            // Trim the oldest closed store
            //
            // TODO: This doesn't really belong here -- modifying the global storage object in a wrapper for
            // a specific store doesn't seem correct
            var closedArray = this.storage.filter((store) => store.closed !== 0);
            if (closedArray.length > closedCacheSize) {
                closedArray.sort((a, b) => {
                    return b.closed - a.closed;
                });

                for (var i = closedCacheSize, max = closedArray.length; i < max; i++) {
                    var storageIndex = this.storage.indexOf(closedArray[i]);
                    this.storage.splice(storageIndex, 1);
                }
            }

            this.save();
        }
    }

    class StoreService {
        constructor($rootScope) {
            this.$rootScope = $rootScope;
            this.refreshStore();
        }

        refreshStore() {
            this.storage = JSON.parse(localStorage.getItem(KEY_NAME));
        }

        getPreviousOpenWindowNames() {
            return (this.storage || [])
                .filter((store) => store.closed === 0)
                .map((store) => store);
        }

        getPreviousClosedWindows() {
            return (this.storage || [])
                .filter((store) => store.closed > 0);
        }

        open(windowName) {
            var windowIndex = (this.storage || []).map((window) => window.id)
                    .indexOf(windowName),
                store;

            if (windowIndex > -1) {
                store = this.storage[windowIndex];
            } else {
                var stocks = [];
                if (!this.storage) {
                    stocks = defaultStocks;
                    this.storage = [];
                }

                var newStore = {
                    id: windowName,
                    stocks: stocks,
                    closed: 0,
                    compact: false
                };

                this.storage.push(newStore);

                store = newStore;
            }

            return new StoreWrapper(this.$rootScope, this.storage, store);
        }
    }
    StoreService.$inject = ['$rootScope'];

    angular.module('openfin.store')
        .service('storeService', StoreService);
}());
