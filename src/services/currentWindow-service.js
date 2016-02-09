(function(fin) {
    'use strict';

    angular.module('openfin.currentWindow')
        .factory('currentWindowService', ['$rootScope', function($rootScope) {
            function getCurrentWindow() {
                return fin.desktop.Window.getCurrent();
            }

            function ready(cb) {
                fin.desktop.main(cb);
            }

            window.addEventListener('updateFavourites', function(event) {
                $rootScope.$broadcast('updateFavourites', event.stock);
            });

            return {
                getCurrentWindow: getCurrentWindow,
                ready: ready
            };
        }]);
}(fin));
