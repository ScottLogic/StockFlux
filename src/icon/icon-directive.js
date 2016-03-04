(function() {
    'use strict';

    angular.module('stockflux.icon')
        .directive('icon', [() => {
            return {
                restrict: 'E',
                templateUrl: 'icon/icon.html',
                scope: {
                    name: '@',
                    iconClick: '&'
                },
                controller: 'IconCtrl',
                controllerAs: 'iconCtrl'
            };
        }]);
}());
