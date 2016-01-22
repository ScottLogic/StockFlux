(function() {
    'use strict';

    angular.module('openfin.toolbar', [])
        .controller('ToolbarCtrl', [function() {
            var self = this;

            self.minimiseClick = function() {
                fin.desktop.Window.getCurrent().minimize();
            };

            self.closeClick = function() {
                fin.desktop.Window.getCurrent().close();
            };
        }]);
}());
