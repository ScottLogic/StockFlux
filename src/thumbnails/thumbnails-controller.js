(function() {
    'use strict';

    angular.module('openfin.thumbnails', ['openfin.store', 'openfin.openfin'])
        .controller('ThumbnailsCtrl', ['storeService', 'openfinService', function(storeService, openfinService) {
            var self = this;
            var visitedNumber = 9;

            self.stocks = storeService.get().slice(0, visitedNumber);

            self.open = function(stockName) {
                openfinService.open(stockName);
            };
        }]);
}());
