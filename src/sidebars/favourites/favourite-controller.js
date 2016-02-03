(function() {
    'use strict';

    angular.module('openfin.favourites', ['openfin.quandl', 'openfin.selection', 'openfin.currentWindow'])
        .controller('FavouritesCtrl', ['quandlService', 'selectionService', 'currentWindowService', '$scope', '$timeout',
            function(quandlService, selectionService, currentWindowService, $scope, $timeout) {
                var self = this,
                    store;
                self.stocks = [];
                var icons = {
                    up: 'arrow_up',
                    down: 'arrow_down'
                };

                self.icon = function(stock) {
                    return stock.delta < 0 ? icons.down : icons.up;
                };

                self.selection = function() {
                    return selectionService.selectedStock().code;
                };

                self.select = function(stock) {
                    selectionService.select(stock);
                };

                self.update = function() {
                    currentWindowService.ready(function() {
                        if (!store) {
                            store = window.storeService.open(currentWindowService.getCurrentWindow().name);
                        }

                        self.favourites = store.get();

                        var i,
                            max,
                            min;

                        // Update indices
                        for (i = 0, max = self.stocks.length; i < max; i++) {
                            var thisStock = self.stocks[i];
                            thisStock.index = self.stockSortFunction(thisStock);
                        }

                        // Remove the stocks no longer in the favourites
                        var removedStocksIndices = [];
                        for (i = 0, max = self.stocks.length; i < max; i++) {
                            if (self.favourites.indexOf(self.stocks[i].code) === -1) {
                                removedStocksIndices.push(i);
                            }
                        }

                        // Remove from the end of the array to not change the indices
                        for (i = removedStocksIndices.length - 1, min = 0; i >= min; i--) {
                            self.stocks.splice(removedStocksIndices[i], 1);
                        }

                        // Add new stocks from favourites
                        self.favourites.map(function(favourite) {
                            if (self.stocks.map(function(stock) { return stock.code; }).indexOf(favourite) === -1) {
                                // This is a new stock
                                quandlService.getData(favourite, function(stock) {
                                    var data = stock.data[0],
                                        price,
                                        delta,
                                        percentage;

                                    if (data) {
                                        price = data.close;
                                        delta = data.close - data.open;
                                        percentage = delta / data.open * 100;

                                        self.stocks.push({
                                            name: stock.name,
                                            code: stock.code,
                                            price: price,
                                            delta: delta,
                                            percentage: Math.abs(percentage),
                                            favourite: true,
                                            index: self.stockSortFunction(stock)
                                        });
                                    }
                                });
                            }
                        });
                    });
                };

                self.stockSortFunction = function(stock) {
                    return self.favourites.indexOf(stock.code);
                };

                self.update();

                window.addEventListener('updateFavourites', function(event) {
                    $timeout(function() {
                        self.update();
                    });
                });
            }]);
}());
