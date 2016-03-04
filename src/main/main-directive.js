(function() {
    'use strict';

    angular.module('stockflux.main')
        .directive('main', [() => {
            return {
                restrict: 'E',
                templateUrl: 'main/main.html',
                controller: 'MainCtrl',
                controllerAs: 'mainCtrl'
            };
        }]);
}());
