(function() {
    'use strict';

    angular.module('openfin.desktop', [])
        .factory('desktopService', [function() {
            function createWindow(config) {
                return new fin.desktop.Window(config);
            }

            function ready(cb) {
                fin.desktop.main(cb);
            }

            function getCurrentWindow() {
                return fin.desktop.Window.getCurrent();
            }

            return {
                createWindow: createWindow,
                ready: ready,
                getCurrentWindow: getCurrentWindow
            };
        }]);
}());
