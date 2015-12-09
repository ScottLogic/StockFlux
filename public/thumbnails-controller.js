(function() {
    'use strict';

    angular.module('openfin.thumbnails', [])
        .controller('ThumbnailsCtrl', [function() {
            var self = this;

            self.stocks = [
                'AAPL',
                'MSFT',
                'TITN',
                'SNDK'
            ];

            self.open = function(stock) {
                var child = new fin.desktop.Window({
                    name: stock + ' Stock Data',
                    url: 'd3fc-showcase.html'
                }, function() {
                    child.show();
                });
            };
        }]);
}());
