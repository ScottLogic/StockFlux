(function() {
    'use strict';

    angular.module('openfin.favourites')
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
