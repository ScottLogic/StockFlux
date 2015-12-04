(function() {
    'use strict';

    angular.module('openfin', [])
        .controller('HomeCtrl', [function() {
            var self = this;

            self.openShowcase = function() {
                var child = new fin.desktop.Window({
                    name: 'd3fc-showcase',
                    url: 'd3fc-showcase.html'
                }, function() {
                    child.show();
                });
            };
        }]);
}());
