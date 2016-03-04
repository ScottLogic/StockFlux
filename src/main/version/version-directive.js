(function() {
    'use strict';

    angular.module('stockflux.version')
        .directive('version', [() => {
            return {
                restrict: 'E',
                templateUrl: 'main/version/version.html',
                controller: 'VersionCtrl',
                controllerAs: 'versionCtrl'
            };
        }]);
}());
