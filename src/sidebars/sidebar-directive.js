(function() {
    'use strict';

    angular.module('stockflux.sidebar')
        .directive('sideBar', ['$timeout', ($timeout) => {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/sidebar.html',
                controller: 'SidebarCtrl',
                controllerAs: 'sidebarCtrl',
                link: (scope, element) => {
                    window.addEventListener('dragout', () => {
                        $timeout(() => {
                            scope.sidebarCtrl.isTearoutTarget = false;
                        });
                    });

                    window.addEventListener('dragin', () => {
                        $timeout(() => {
                            scope.sidebarCtrl.isTearoutTarget = true;
                        });
                    });
                }
            };
        }]);
}());
