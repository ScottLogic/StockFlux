(function() {
    'use strict';

    angular.module('openfin', [])
        .controller('ShowcaseCtrl', [function() {
            var self = this;

            self.open = function() {
                var child = new fin.desktop.Window({
                    name: 'd3fc-showcase',
                    url: 'd3fc-showcase.html'
                }, function() {
                    child.show();
                });
            };
        }]);
}());
