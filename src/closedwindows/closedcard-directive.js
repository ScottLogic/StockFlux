(function() {
    'use strict';

    angular.module('openfin.closedcard')
        .directive('closedcard', [function() {
            return {
                restrict: 'E',
                templateUrl: 'closedwindows/closedcard.html',
                scope: {
                    cwindow: '='
                }
            };
        }]);
}());
