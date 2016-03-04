(function() {
    'use strict';

    angular.module('stockflux.closedCard')
        .directive('closedCard', [() => {
            return {
                restrict: 'E',
                templateUrl: 'closedWindows/closedCard/closedCard.html',
                scope: {
                    cardWindow: '='
                },
                controller: 'ClosedCardCtrl',
                controllerAs: 'closedCardCtrl'
            };
        }]);
}());
