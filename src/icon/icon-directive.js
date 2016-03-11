(function() {
    'use strict';

    angular.module('stockflux.icon')
        .directive('icon', [() => {
            return {
                restrict: 'E',
                templateUrl: 'icon/icon.html',
                scope: {
                    name: '@',
                    iconClick: '&',
                    tooltip: '@',
                    override: '@'
                },
                controller: 'IconCtrl',
                controllerAs: 'iconCtrl'
            };
        }]);
}());
