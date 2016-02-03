(function(fin) {
    'use strict';

    angular.module('openfin.currentWindow', [])
        .factory('currentWindowService', [function() {
            function getCurrentWindow() {
                return fin.desktop.Window.getCurrent();
            }

            function ready(cb) {
                fin.desktop.main(cb);
            }

            return {
                getCurrentWindow: getCurrentWindow,
                ready: ready
            };
        }]);
}(fin));
