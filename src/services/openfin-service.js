(function() {
    'use strict';

    angular.module('openfin.openfin', [])
        .factory('openfinService', [function() {
            var self = this;

            function open(title) {
                var child = new fin.desktop.Window({
                    name: title + ' Stock Data',
                    url: 'd3fc-showcase.html?stockcode=' + title
                }, function() {
                    child.show();
                });
            }

            return {
                open: open
            };
        }]);
}());
