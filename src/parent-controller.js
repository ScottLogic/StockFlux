(function() {
    'use strict';

    function getConfig() {
        return {
            'autoShow': true,
            'minWidth': 918,
            'minHeight': 510,
            'defaultWidth': 1280,
            'defaultHeight': 720,
            'frame': false,
            'url': 'index.html'
        };
    }

    class ParentCtrl {
        constructor($scope, storeService, windowCreationService) {
            windowCreationService.ready(() => {
                var previousWindows = storeService.getPreviousOpenWindowNames(),
                    length = previousWindows.length,
                    i,
                    max;

                if (length !== 0) {
                    // Restoring previously open windows
                    for (i = 0; i < length; i++) {
                        var config = getConfig();
                        config.name = previousWindows[i];
                        windowCreationService.createMainWindow(config);
                    }
                } else {
                    // Creating new window
                    windowCreationService.createMainWindow(getConfig());
                }

                $scope.$on('updateFavourites', (event, data) => {
                    var e = new Event('updateFavourites');
                    e.stock = data;
                    var openWindows = windowCreationService.getWindows();
                    for (i = 0, max = openWindows.length; i < max; i++) {
                        openWindows[i].getNativeWindow().dispatchEvent(e);
                    }
                });
            });
        }
    }
    ParentCtrl.$inject = ['$scope', 'storeService', 'windowCreationService'];

    angular.module('openfin.parent')
        .controller('ParentCtrl', ParentCtrl);
}());
