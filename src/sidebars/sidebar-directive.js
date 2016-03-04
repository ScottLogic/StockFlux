(function() {
    'use strict';

    angular.module('stockflux.sidebar')
        .directive('sideBar', [() => {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/sidebar.html',
                controller: 'SidebarCtrl',
                controllerAs: 'sidebarCtrl'
            };
        }]);
}());
