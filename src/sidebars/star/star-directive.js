(function() {
    'use strict';

    angular.module('stockflux.star')
        .directive('star', [() => {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/star/star.html',
                scope: {
                    starClick: '&',
                    favouriteUrl: '&',
                    mouseLeave: '&',
                    mouseEnter: '&'
                }
            };
        }]);
}());
