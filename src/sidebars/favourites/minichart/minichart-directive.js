(function() {
    'use strict';

    angular.module('stockflux.minichart')
        .directive('minichart', [() => {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/favourites/minichart/minichart.html',
                scope: {
                    stock: '='
                },
                controller: 'MinichartCtrl',
                controllerAs: 'minichartCtrl'
            };
        }]);
}());
