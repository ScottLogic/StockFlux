(function(bitflux) {
    'use strict';

    angular.module('stockflux.showcase')
        .directive('showcase', ['quandlService', 'configService', (quandlService, configService) => {
            return {
                restrict: 'E',
                templateUrl: 'showcase/showcase.html',
                scope: {
                    selection: '&'
                },
                link: (scope, element) => {
                    var chart = bitflux.app().quandlApiKey(quandlService.apiKey()),
                        firstRun = true,
                        store,
                        initStore = () => {
                            if (!store && window.storeService) {
                                store = window.storeService.open(window.name);
                            }
                        };

                    initStore();
                    if (store) {
                        chart.indicators(store.indicators());
                    }

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
                            // The store service may not have been passed through yet.
                            // If it hasn't been, get it for later, where we set the
                            // indicators
                            initStore();

                            if (firstRun) {
                                firstRun = false;
                                chart.run(element[0].children[0]);
                            }

                            if (store) {
                                chart.indicators(store.indicators());
                            }

                            if (newSelection !== previousSelection) {
                                chart.changeQuandlProduct(newSelection);
                            }
                        }
                    });

                    scope.$watchCollection(() => chart.indicators(), (newValues) => {
                        initStore();
                        if (store) {
                            store.indicators(newValues);
                        }
                    });
                }
            };
        }]);
}(bitflux));
