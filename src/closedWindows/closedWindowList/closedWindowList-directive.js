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
                },
                link: (scope, element) => {
                    let onFocus = () => {
                        if (scope.closedWindowListCtrl.closedTabsShow) {
                            window.windowService.seenClosedWindows();
                        }
                    };
                    window.addEventListener('focus', onFocus);

                    scope.$on('$destroy', () => {
                        window.removeEventListener('focus', onFocus);
                    });
                }
            };
        }]);
}());
