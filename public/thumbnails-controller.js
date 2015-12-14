(function() {
    'use strict';

    angular.module('openfin.thumbnails', ['openfin.store'])
        .controller('ThumbnailsCtrl', ['storeService', function(store) {
            var self = this;
            var visitedNumber = 9;

            self.stocks = store.getStocks().slice(0, visitedNumber);

            self.open = function(stockName) {
                store.incrementStock(stockName);
                var child = new fin.desktop.Window({
                    name: stockName + ' Stock Data',
                    url: 'd3fc-showcase.html'
                }, function() {
                    child.show();
                });
            };
        }]);
}());
