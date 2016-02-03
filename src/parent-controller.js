(function() {
    'use strict';

    angular.module('openfin.parent', ['openfin.window'])
        .controller('ParentCtrl', ['windowCreationService', function(windowCreationService) {
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
                    // End super hack

                    main.show();
                });
            });
        }]);
}());
