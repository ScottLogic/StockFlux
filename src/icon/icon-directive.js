(function() {
    'use strict';

    angular.module('openfin.icon')
        .directive('icon', [function() {
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
