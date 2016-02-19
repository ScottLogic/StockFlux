(function() {
    'use strict';

    angular.module('openfin.minichart')
        .directive('minichart', [() => {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/favourites/minichart/minichart.html',
                scope: {
                    renderChart: '&',
                    stock: '='
                }
            };
        }]);
}());
