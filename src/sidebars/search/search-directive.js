(function() {
    'use strict';

    angular.module('openfin.search')
        .directive('search', ['$timeout', ($timeout) => {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/search/search.html',
                controller: 'SearchCtrl',
                controllerAs: 'searchCtrl',
                link: (scope, elem) => {
                    elem.on('click', () => {
                        // Wait for the animation to finish,
                        // then focus the search box.
                        $timeout(() => {
                            elem.find('input.sidetab').focus();
                        }, 100);
                    });
                }
            };
        }]);
}());
