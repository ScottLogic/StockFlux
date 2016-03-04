(function() {
    'use strict';

    angular.module('stockflux.toolbar')
        .directive('toolbar', [() => {
            return {
                restrict: 'E',
                templateUrl: 'toolbar/toolbar.html',
                controller: 'ToolbarCtrl',
                controllerAs: 'toolbarCtrl'
            };
        }]);
}());
