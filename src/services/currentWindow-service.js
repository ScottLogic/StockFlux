(function(fin) {
    'use strict';

    /**
     * Abstraction layer for the OpenFin API.
     * Also catches events dispatched from the parent window.
     */
    angular.module('stockflux.currentWindow')
        .factory('currentWindowService', ['$rootScope', ($rootScope) => {
            function getCurrentWindow() {
                return fin.desktop.Window.getCurrent();
            }

            function ready(cb) {
                fin.desktop.main(cb);
            }

            function openUrlWithBrowser(url) {
                ready(() => {
                    fin.desktop.System.openUrlWithBrowser(url);
                });
            }

            window.addEventListener('updateFavourites', (event) => {
                $rootScope.$broadcast('updateFavourites', event.stock);
            });

            return {
                getCurrentWindow: getCurrentWindow,
                openUrlWithBrowser: openUrlWithBrowser,
                ready: ready
            };
        }]);
}(fin));
