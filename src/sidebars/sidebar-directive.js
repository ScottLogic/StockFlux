(function() {
    'use strict';

    angular.module('openfin.sidebar')
        .directive('sideBar', [function() {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/sidebar.html',
                controller: 'SidebarCtrl',
                controllerAs: 'sidebarCtrl'
            };
        }]);
}());
