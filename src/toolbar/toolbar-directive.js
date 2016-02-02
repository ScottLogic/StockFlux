(function() {
    'use strict';

    angular.module('openfin.toolbar')
        .directive('toolbar', [function() {
            return {
                restrict: 'E',
                templateUrl: 'toolbar/toolbar.html',
                controller: 'ToolbarCtrl',
                controllerAs: 'toolbarCtrl'
            };
        }]);
}());
