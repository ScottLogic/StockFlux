(function() {
    'use strict';

    angular.module('openfin.sidebar')
        .directive('sideBar', [() => {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/sidebar.html',
                controller: 'SidebarCtrl',
                controllerAs: 'sidebarCtrl'
            };
        }]);
}());
