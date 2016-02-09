(function() {
    'use strict';

    const icons = {
        up: 'arrow_up',
        down: 'arrow_down'
    };

    class FavouritesCtrl {
        constructor(currentWindowService, quandlService, selectionService, $scope, $timeout) {
            this.currentWindowService = currentWindowService;
            this.quandlService = quandlService;
            this.selectionService = selectionService;
            this.$scope = $scope;
            this.$timeout = $timeout;

            this.store = null;
            this.stocks = [];
            this.update();
            this._watch();
        }

        icon(stock) {
            return stock.delta < 0 ? icons.down : icons.up;
        }

        selection() {
            return this.selectionService.selectedStock().code;
        }

        select(stock) {
            this.selectionService.select(stock);
        }

        single() {
            return this.stocks.length === 1 ? 'single' : '';
        }

        update(updatedStock) {
            this.currentWindowService.ready(() => {
                if (!this.store) {
                    this.store = window.storeService.open(window.name);
                }

                this.favourites = this.store.get();

                var i,
                    max,
                    min;

                // Update indices
                for (i = 0, max = this.stocks.length; i < max; i++) {
                    var thisStock = this.stocks[i];
                    thisStock.index = this.stockSortFunction(thisStock);
                }

                // Remove the stocks no longer in the favourites
                var removedStocksIndices = [];
                for (i = 0, max = this.stocks.length; i < max; i++) {
                    if (this.favourites.indexOf(this.stocks[i].code) === -1) {
                        removedStocksIndices.push(i);
                    }
                }

                // Remove from the end of the array to not change the indices
                for (i = removedStocksIndices.length - 1, min = 0; i >= min; i--) {
                    this.stocks.splice(removedStocksIndices[i], 1);
                }

                if (updatedStock) {
                    if (this.stocks.length === 0 && updatedStock.favourite) {
                        // If there aren't any stocks, we could be adding one...
                        this.selectionService.select(updatedStock);
                    } else {
                        var oldSelectedStock = this.selectionService.selectedStock();
                        if (oldSelectedStock.code === updatedStock.code &&
                            (!updatedStock.favourite || this.favourites.indexOf(oldSelectedStock.code) === -1) &&
                            this.stocks.length > 0) {
                            // The changed favourite was also the selected one!
                            // It was removed, or torn out
                            //
                            // Need to change the selection to the top most
                            var topStockIndex = this.stocks.map((stock) => stock.code).indexOf(this.favourites[0]);

                            this.selectionService.select(this.stocks[topStockIndex]);
                        }
                    }
                }

                // Add new stocks from favourites
                this.favourites.map((favourite) => {
                    if (this.stocks.map(function(stock) { return stock.code; }).indexOf(favourite) === -1) {
                        // This is a new stock
                        this.quandlService.getData(favourite, (stock) => {
                            var data = stock.data[0],
                                price,
                                delta,
                                percentage;

                            if (data) {
                                price = data.close;
                                delta = data.close - data.open;
                                percentage = delta / data.open * 100;

                                this.stocks.push({
                                    name: stock.name,
                                    code: stock.code,
                                    price: price,
                                    delta: delta,
                                    percentage: Math.abs(percentage),
                                    favourite: true,
                                    index: this.stockSortFunction(stock)
                                });
                            }
                        });
                    }
                });
            });
        }

        stockSortFunction(stock) {
            return this.favourites.indexOf(stock.code);
        }

        _watch() {
            this.$scope.$on('updateFavourites', (event, data) => {
                this.$timeout(() => {
                    this.update(data);
                });
            });
        }
    }
    FavouritesCtrl.$inject = ['currentWindowService', 'quandlService', 'selectionService', '$scope', '$timeout'];

    angular.module('openfin.favourites')
        .controller('FavouritesCtrl', FavouritesCtrl);
}());
