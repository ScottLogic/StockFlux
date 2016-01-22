(function() {
    'use strict';

    angular.module('openfin.toolbar')
        .directive('toolbarIcon', [function() {
            return {
                restrict: 'E',
                templateUrl: 'toolbar/toolbarIcon.html',
                scope: {
                    name: '@',
                    iconClick: '&'
                },
                controller: 'ToolbarIconCtrl',
                controllerAs: 'iconCtrl'
            };
        }]);
}());
