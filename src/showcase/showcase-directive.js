(function(bitflux) {
    'use strict';

    angular.module('openfin.showcase')
        .directive('showcase', ['quandlService', (quandlService) => {
            return {
                restrict: 'E',
                templateUrl: 'showcase/showcase.html',
                scope: {
                    selection: '&'
                },
                link: (scope, element) => {
                    var chart = bitflux.app().quandlApiKey(quandlService.apiKey()),
                        firstRun = true;

                    scope.$watch('selection()', (newSelection, previousSelection) => {
                        if (newSelection !== '') {
                            if (firstRun) {
                                firstRun = false;
                                chart.run(element[0].children[0]);
                            }

                            if (newSelection !== previousSelection) {
                                chart.changeQuandlProduct(newSelection);
                            }
                        }
                    });
                }
            };
        }]);
}(bitflux));
