(function() {
    'use strict';

    angular.module('openfin.parent', ['openfin.window', 'openfin.store'])
        .controller('ParentCtrl', ['$scope', 'windowCreationService', 'storeService', function($scope, windowCreationService, storeService) {
            windowCreationService.ready(function() {
                var config = {
                    'autoShow': true,
                    'minWidth': 918,
                    'minHeight': 510,
                    'defaultWidth': 1280,
                    'defaultHeight': 720,
                    'frame': false,
                    'name': 'main',
                    'url': 'index.html'
                };

                var main;
                main = windowCreationService.createWindow(config, function() {
                    // Begin super hack
                    main.getNativeWindow().windowService = windowCreationService;
                    main.getNativeWindow().storeService = storeService;
                    // End super hack

                    main.show();
                });

                $scope.$on('updateFavourites', function(event, data) {
                    var e = new Event('updateFavourites');
                    e.stock = data;
                    main.getNativeWindow().dispatchEvent(e);
                });
            });
        }]);
}());
