(function() {
    'use strict';

    angular.module('openfin.version')
        .directive('version', [() => {
            return {
                restrict: 'E',
                templateUrl: 'main/version/version.html',
                controller: 'VersionCtrl',
                controllerAs: 'versionCtrl'
            };
        }]);
}());
