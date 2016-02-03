(function() {
    'use strict';

    angular.module('openfin.toolbar', ['openfin.currentWindow'])
        .controller('ToolbarCtrl', ['$timeout', 'currentWindowService', function($timeout, currentWindowService) {
            var self = this;
            var maximised = false;

            currentWindowService.ready(function() {
                var currentWindow = currentWindowService.getCurrentWindow();
                currentWindow.addEventListener('maximized', function(e) {
                    $timeout(function() {
                        maximised = true;
                    });
                });
                currentWindow.addEventListener('restored', function(e) {
                    $timeout(function() {
                        maximised = false;
                    });
                });

                self.maximised = function() {
                    return maximised;
                };

                self.minimiseClick = function() {
                    currentWindow.minimize();
                };

                self.maximiseClick = function() {
                    currentWindow.maximize();
                };

                self.normalSizeClick = function() {
                    currentWindow.restore();
                };

                self.closeClick = function() {
                    currentWindow.close();
                };
            });
        }]);
}());
