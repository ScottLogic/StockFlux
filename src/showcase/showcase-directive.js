(function() {
    'use strict';

    angular.module('openfin.showcase', [])
        .directive('showcase', [function() {
            return {
                restrict: 'E',
                templateUrl: 'showcase/showcase.html',
                scope: {
                    selection: '='
                }
            }
        }]);
}());
