(function() {
    'use strict';

    angular.module('openfin.openfin', ['openfin.store'])
        .factory('openfinService', ['storeService', function(storeService) {
            var self = this;

            function open(title) {
                storeService.incrementStock(title);
                var child = new fin.desktop.Window({
                    name: title + ' Stock Data',
                    url: 'd3fc-showcase.html?stockcode='+title
                }, function() {
                    child.show();
                });
            }

            return {
                open: open
            };
        }]);
}());
