(function() {
    'use strict';

    angular.module('stockflux.star')
        .directive('star', [() => {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/star/star.html',
                scope: {
                    stock: '='
                },
                controller: 'StarCtrl',
                controllerAs: 'starCtrl'
            };
        }]);
}());
