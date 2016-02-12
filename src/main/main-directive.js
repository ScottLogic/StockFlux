(function() {
    'use strict';

    angular.module('openfin.main')
        .directive('main', [function() {
            return {
                restrict: 'E',
                templateUrl: 'main/main.html',
                controller: 'MainCtrl',
                controllerAs: 'mainCtrl'
            };
        }]);
}());
