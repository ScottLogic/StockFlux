(function() {
    'use strict';

    angular.module('stockflux.closedWindows')
        .directive('closedWindowList', [() => {
            return {
                restrict: 'E',
                templateUrl: 'closedWindows/closedWindowList/closedWindowList.html',
                controller: 'ClosedWindowListCtrl',
                controllerAs: 'closedWindowListCtrl',
                scope: {
                    icon: '='
                }
            };
        }]);
}());
