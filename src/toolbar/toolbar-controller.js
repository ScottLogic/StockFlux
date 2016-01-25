(function() {
    'use strict';

    angular.module('openfin.toolbar', [])
        .controller('ToolbarCtrl', ['$timeout', function($timeout) {
            var self = this;
            var maximised = false;

            fin.desktop.main(function() {
                var window = fin.desktop.Window.getCurrent();
                window.addEventListener('maximized', function(e) {
                    $timeout(function() {
                        maximised = true;
                    });
                });
                window.addEventListener('restored', function(e) {
                    $timeout(function() {
                        maximised = false;
                    });
                });

                self.maximised = function() {
                    return maximised;
                };

                self.minimiseClick = function() {
                    window.minimize();
                };

                self.maximiseClick = function() {
                    window.maximize();
                };

                self.normalSizeClick = function() {
                    window.restore();
                };

                self.closeClick = function() {
                    window.close();
                };
            });
        }]);
}());
