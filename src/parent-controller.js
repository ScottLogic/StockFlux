(function() {
    'use strict';

    const config = {
        'autoShow': true,
        'minWidth': 918,
        'minHeight': 510,
        'defaultWidth': 1280,
        'defaultHeight': 720,
        'frame': false,
        'url': 'index.html'
    };
    class ParentCtrl {
        constructor($scope, windowCreationService) {
            windowCreationService.ready(function() {
                // TODO: Restore correct window(s)
                windowCreationService.createWindow(config, function(newWindow) {
                    newWindow.show();
                });

                $scope.$on('updateFavourites', function(event, data) {
                    var e = new Event('updateFavourites');
                    e.stock = data;
                    var openWindows = windowCreationService.getWindows();
                    for (var i = 0, max = openWindows.length; i < max; i++) {
                        openWindows[i].getNativeWindow().dispatchEvent(e);
                    }
                });
            });
        }
    }
    ParentCtrl.$inject = ['$scope', 'windowCreationService'];

    angular.module('openfin.parent')
        .controller('ParentCtrl', ParentCtrl);
}());
