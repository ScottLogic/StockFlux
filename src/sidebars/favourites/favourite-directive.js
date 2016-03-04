(function() {
    'use strict';

    angular.module('stockflux.favourites')
        .directive('favourite', [() => {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/favourites/favourite.html',
                scope: {
                    stock: '=',
                    selection: '&',
                    select: '&',
                    singleClick: '&',
                    doubleClick: '&',
                    icon: '&',
                    single: '&'
                }
            };
        }]);
}());
