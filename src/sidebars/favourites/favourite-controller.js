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
            this.receivedFirstQuandlResponse = false;
            this.stocks = [];
            this.errors = [];
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

        singleClick(stock) {
            reportAction('Select favourite', stock.code);
            if (!window.storeService.open(window.name).isCompact()) {
                this.select(stock);
            }
        }

        doubleClick(stock) {
            reportAction('Select favourite', stock.code);
            var store = window.storeService.open(window.name);
            if (store.isCompact()) {
                this.select(stock);
                store.toggleCompact();
            }
        }

        noFavourites() {
            return this.stocks.length === 0;
        }

        single() {
            return this.stocks.length === 1 ? 'single' : '';
        }

        update(updatedStock) {
            this.currentWindowService.ready(() => {
                if (!window.storeService) {
                    return;
                }

                if (!this.store) {
                    this.store = window.storeService.open(window.name);
                }

                this.favourites = this.store.get();

                if (this.favourites.length === 0) {
                    this.$timeout(() => {
                        this.receivedFirstQuandlResponse = true;
                    });
                }

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

                var oldSelectedStock = this.selectionService.selectedStock();
                if (updatedStock) {
                    if (this.stocks.length === 0) {
                        // If there aren't any stocks, we could be adding one...
                        // But only if there's no selection already
                        if (updatedStock.favourite && this.selection() === '') {
                            this.selectionService.select(updatedStock);
                        } else if (oldSelectedStock.code === updatedStock.code) {
                            // If there's no stocks and it's not a favourite any more, but also
                            // if the selection is on the updated stock, deselect.
                            this.selectionService.deselect();
                        }
                    } else if (oldSelectedStock.code === updatedStock.code &&
                            (!updatedStock.favourite || this.favourites.indexOf(oldSelectedStock.code) === -1) &&
                            this.stocks.length > 0) {
                        // The changed favourite was also the selected one!
                        // It was removed, or torn out
                        //
                        // Need to change the selection to the top most
                        var topStock = this.stocks.filter((stock) => stock.code === this.favourites[0])[0];
                        this.selectionService.select(topStock);
                    }
                }

                this.errors = [];
                // Add new stocks from favourites
                this.favourites.map((favourite) => {
                    if (this.stocks.map((stock) => { return stock.code; }).indexOf(favourite) === -1) {
                        // This is a new stock
                        this.quandlService.getData(favourite, (stock) => {

                            this.receivedFirstQuandlResponse = true;

                            // Repeat the check as in the mean time a stock for this favourite could have been added.
                            if (this.stocks.map((stock1) => { return stock1.code; }).indexOf(favourite) === -1) {
                                var data = stock && stock.data && stock.data[0],
                                    delta = data.close - data.open;
                                if (data) {
                                    this.stocks.push({
                                        favourite: true,
                                        name: stock.name,
                                        code: stock.code,
                                        price: data.close,
                                        delta: delta,
                                        percentage: delta / data.open * 100,
                                        index: this.stockSortFunction(stock)
                                    });
                                }
                            }
                        }, (error) => {
                            this.receivedFirstQuandlResponse = true;
                            this._addError({
                                code: (error && error.code) || 'No code received',
                                message: (error && error.message) || 'No message'
                            });
                        });
                    }
                });
            });
        }

        _addError(newError) {
            var errors = this.errors, max = errors.length;
            var newCode = newError.code;

            for (var i = 0; i < max; i++) {
                if (errors[i] && errors[i].code === newCode) {
                    errors[i].occurences++;
                    return;
                }
            }
            newError.occurences = 1;
            this.errors.push(newError);
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

    angular.module('stockflux.favourites')
        .controller('FavouritesCtrl', FavouritesCtrl);
}());
