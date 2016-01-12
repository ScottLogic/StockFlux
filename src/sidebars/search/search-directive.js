(function() {
    'use strict';

    angular.module('openfin.search')
        .directive('search', [function() {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/search/search.html',
                scope: {
                    stock: '=',
                    selection: '=',
                    select: '&'
                }
            }
        }]);
}());
