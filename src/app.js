(function() {
    'use strict';

    angular.module('OpenFinD3FC', [
        'ngRoute',
        'openfin.thumbnails',
        'openfin.search',
        'openfin.favourites',
        'openfin.sidebar'
    ])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                redirectTo: 'stocks'
            })
            .when('/stocks/', {
                templateUrl: 'thumbnails/thumbnails.html',
                controller: 'ThumbnailsCtrl',
                controllerAs: 'thumbnailsCtrl'
            })
            .otherwise({
                redirectTo: function() {
                    window.location = '404.html';
                }
            });
    }]);
}());
