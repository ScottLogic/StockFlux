(function() {
    'use strict';

    angular.module('openfin.search')
        .directive('search', [() => {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/search/search.html',
                controller: 'SearchCtrl',
                controllerAs: 'searchCtrl'
            };
        }]);
}());
