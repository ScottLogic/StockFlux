(function(bitflux) {
    'use strict';

    angular.module('openfin.showcase')
        .directive('showcase', ['quandlService', 'configService', (quandlService, configService) => {
            return {
                restrict: 'E',
                templateUrl: 'showcase/showcase.html',
                scope: {
                    selection: '&'
                },
                link: (scope, element) => {
                    var chart = bitflux.app().periodsOfDataToFetch(1200).quandlApiKey(quandlService.apiKey()),
                        firstRun = true;

                    chart.proportionOfDataToDisplayByDefault(configService.getInitialBitfluxProportion());

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
