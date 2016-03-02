(function() {
    'use strict';

    angular.module('openfin.closedWindows')
        .directive('closedWindowList', [() => {
            return {
                restrict: 'E',
                templateUrl: 'closedWindows/closedWindowList/closedWindowList.html',
                controller: 'ClosedWindowListCtrl',
                controllerAs: 'closedWindowListCtrl'
            };
        }]);
}());
