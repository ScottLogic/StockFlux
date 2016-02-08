(function() {
    'use strict';

    const KEY_NAME = 'windows';
    const initialStocks = [
        {
            id: 'OpenFinD3FC',
            stocks: [
                'AAPL', 'MSFT', 'TITN', 'SNDK', 'TSLA'
            ],
            closed: false
        }
    ];

    class StoreService {
        constructor(store, desktopService, $rootScope) {
            this.store = store;
            this.desktopService = desktopService;
            this.$rootScope = $rootScope;

            this.storage = JSON.parse(store.get(KEY_NAME)) || initialStocks;
        }

        getWindowStore() {
            var windowIndex = this.storage.map((window) => window.id)
                .indexOf(this.desktopService.getCurrentWindow().name);

            return windowIndex > -1 ? this.storage[windowIndex] : undefined; // TODO: undefined?
        }

        save(stock) {
            this.store.set(KEY_NAME, JSON.stringify(this.storage));
            this.$rootScope.$broadcast('updateFavourites', stock);
        }

        get() {
            var windowStore = this.getWindowStore();
            return windowStore ? windowStore.stocks : [];
        }

        // Move given item in an array to directly after the to-item
        reorder(fromItem, toItem) {
            if (fromItem === toItem) {
                return;
            }

            var windowStore = this.getWindowStore();

            if (windowStore) {
                var oldArray = windowStore.stocks;
                var fromIndex = oldArray.indexOf(fromItem);
                var toIndex = oldArray.indexOf(toItem);
                oldArray.splice(toIndex, 0, oldArray.splice(fromIndex, 1)[0]);

                this.save();
            }
        }

        add(stock) {
            var stockName = stock.code;

            var window = this.getWindowStore();
            if (window && window.stocks.indexOf(stockName) === -1) {
                window.stocks.push(stockName);
                this.save(stock);
            }
        }

        remove(stock) {
            var stockName = stock.code;
            var window = this.getWindowStore();
            if (window) {
                var index = window.stocks.indexOf(stockName);
                if (index > -1) {
                    window.stocks.splice(index, 1);
                }
            }

            this.save(stock);
        }
    }
    StoreService.$inject = ['store', 'desktopService', '$rootScope'];

    angular.module('openfin.store', ['angular-storage', 'openfin.desktop'])
        .service('storeService', StoreService);
}());
