(function() {
    'use strict';

    angular.module('openfin.star', ['openfin.store', 'openfin.selection'])
        .controller('StarCtrl', ['$scope', 'storeService', 'selectionService', function($scope, storeService, selectionService) {
            var self = this;
            self.check = false;

            var starUrls = {
                off: 'favourite_OFF',
                on: 'favourite_ON',
                hover: 'favourite_HOVER'
            };

            self.favouriteUrl = function(stock) {
                if (stock.favourite) {
                    return starUrls.on;
                } else if (stock.isHovered || selectionService.getSelection() === stock.code) {
                    return starUrls.hover;
                } else {
                    return starUrls.off;
                }
            };

            self.click = function(stock) {
                if (!self.check || confirm('Are you sure you wish to remove this stock (' + stock.code + ') from your favourites?')) {
                    if (stock.favourite) {
                        stock.favourite = false;
                        storeService.remove(stock);
                    } else {
                        stock.favourite = true;
                        storeService.add(stock);
                    }
                }
            };

        }]);
}());
