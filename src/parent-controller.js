(function() {
    'use strict';

    angular.module('openfin.parent', ['openfin.window'])
        .controller('ParentCtrl', ['$scope', 'windowCreationService', function($scope, windowCreationService) {
            var config = {
                'autoShow': true,
                'minWidth': 918,
                'minHeight': 510,
                'defaultWidth': 1280,
                'defaultHeight': 720,
                'frame': false,
                'url': 'index.html'
            };

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
        }]);
}());
