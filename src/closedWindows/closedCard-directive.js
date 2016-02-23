(function() {
    'use strict';

    angular.module('openfin.closedCard')
        .directive('closedCard', [() => {
            return {
                restrict: 'E',
                templateUrl: 'closedWindows/closedCard.html',
                scope: {
                    cardWindow: '='
                },
                controller: 'ClosedCardCtrl',
                controllerAs: 'closedCardCtrl'
            };
        }]);
}());
