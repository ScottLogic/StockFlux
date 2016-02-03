(function() {
    'use strict';

    angular.module('openfin.star', ['openfin.selection', 'openfin.currentWindow'])
        .controller('StarCtrl', ['$scope', 'selectionService', 'currentWindowService',
            function($scope, selectionService, currentWindowService) {
                var self = this,
                    store,
                    starHovered = false;
                self.check = false;

                var starUrls = {
                    off: 'favourite_OFF',
                    on: 'favourite_ON',
                    offHover: 'favourite_OFF_hover',
                    onHover: 'favourite_hover'
                };

                self.favouriteUrl = function(stock) {
                    if (stock.favourite) {
                        return starUrls.on;
                    } else if (starHovered) {
                        return starUrls.onHover;
                    } else if (stock.isHovered || selectionService.selectedStock() === stock) {
                        return starUrls.offHover;
                    } else {
                        return starUrls.off;
                    }
                };

                self.click = function(stock) {
                    if (!self.check || confirm('Are you sure you wish to remove this stock (' + stock.code + ') from your favourites?')) {
                        if (!store) {
                            store = window.storeService.open(window.name);
                        }

                        if (stock.favourite) {
                            stock.favourite = false;
                            store.remove(stock);
                        } else {
                            stock.favourite = true;
                            store.add(stock);
                        }
                    }
                };

                self.mouseEnter = function() {
                    starHovered = true;
                };

                self.mouseLeave = function() {
                    starHovered = false;
                };
            }]);
}());
