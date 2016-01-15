(function() {
    'use strict';

    angular.module('openfin.favourites')
        .directive('favourite', [function() {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/favourites/favourite.html',
                scope: {
                    stock: '=',
                    selection: '&',
                    select: '&',
                    icon: '&',
                    renderChart: '&'
                }
            };
        }]);
}());
