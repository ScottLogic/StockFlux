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
                templateUrl: 'thumbnails.html',
                controller: 'ThumbnailsCtrl',
                controllerAs: 'thumbnailsCtrl'
            })
            .when('/stock/:stock', {
                templateUrl: 'stockData.html',
                controller: 'StockCtrl',
                controllerAs: 'stockCtrl'
            })
            .when('/search/:query', {
                templateUrl: 'search.html',
                controller: 'SearchCtrl',
                controllerAs: 'searchCtrl'
            })
            .otherwise({
                redirectTo: function() {
                    window.location = '404.html';
                }
            });
    }])
}());
