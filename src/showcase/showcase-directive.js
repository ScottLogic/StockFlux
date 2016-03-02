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
                    var chart = bitflux.app().quandlApiKey(quandlService.apiKey()),
                        firstRun = true;

                    chart.periodsOfDataToFetch(configService.getBitfluxStockAmount());
                    chart.proportionOfDataToDisplayByDefault(configService.getInitialBitfluxProportion());

                    // If there's already a selection, run the chart and use that.
                    // This occurs when the user selects a stock in compact view
                    // and it expands.
                    if (scope.selection && scope.selection()) {
                        firstRun = false;
                        chart.run(element[0].children[0]);
                        chart.changeQuandlProduct(scope.selection());
                    }

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
