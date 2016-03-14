(function() {
    'use strict';

    angular.module('stockflux.main')
        .directive('main', ['$timeout', ($timeout) => {
            return {
                restrict: 'E',
                templateUrl: 'main/main.html',
                controller: 'MainCtrl',
                controllerAs: 'mainCtrl',
                link: (scope, element) => {
                    scope.$on('compactChanging', () => {
                        element.addClass('disable-transitions');

                        $timeout(() => {
                            element.removeClass('disable-transitions');
                        }, 100);
                    });
                }
            };
        }]);
}());
