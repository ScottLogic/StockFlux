(function() {
    'use strict';

    angular.module('openfin.favourites', ['openfin.store', 'openfin.quandl'])
        .controller('FavouritesCtrl', ['storeService', 'quandlService', '$scope', function(storeService, quandlService, $scope) {
            var self = this;
            self.stocks = [];
            var icons = {
                up: 'glyphicon-triangle-top',
                down: 'glyphicon-triangle-bottom'
            };

            self.icon = function(stock) {
                return stock.delta < 0 ? icons.down : icons.up;
            };

            self.update = function() {
                self.favourites = storeService.get();
                var i,
                    max,
                    min;

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
                                    favourite: true
                                });
                            }
                        });
                    }
                })
            };

            self.update();

            $scope.$on('updateFavourites', function(event, data) {
                self.update();
            })
        }]);
}());
