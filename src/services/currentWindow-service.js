(function(fin) {
    'use strict';

    /**
     * Abstraction layer for the OpenFin API.
     * Also catches events dispatched from the parent window.
     */
    angular.module('openfin.currentWindow')
        .factory('currentWindowService', ['$rootScope', ($rootScope) => {
            function getCurrentWindow() {
                return fin.desktop.Window.getCurrent();
            }

            function ready(cb) {
                fin.desktop.main(cb);
            }

            window.addEventListener('updateFavourites', (event) => {
                $rootScope.$broadcast('updateFavourites', event.stock);
            });

            return {
                getCurrentWindow: getCurrentWindow,
                ready: ready
            };
        }]);
}(fin));
