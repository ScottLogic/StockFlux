(function() {
    'use strict';

    angular.module('OpenFinD3FC', [
        'ngRoute',
        'openfin.thumbnails',
        'openfin.search',
        'openfin.stock'
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
            .when('/stock/:query', {
                templateUrl: 'search/stockData.html',
                controller: 'StockCtrl',
                controllerAs: 'stockCtrl'
            })
            .otherwise({
                redirectTo: function() {
                    window.location = '404.html';
                }
            });
    }]);
}());
