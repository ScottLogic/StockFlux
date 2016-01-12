(function() {
    'use strict';

    angular.module('openfin.star')
        .directive('star', [function() {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/star.html',
                scope: {
                    starClasses: '&',
                    starClick: '&',
                    check: '=',
                    selection: '='
                }
            };
        }]);
}());
