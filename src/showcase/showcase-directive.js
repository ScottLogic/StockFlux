(function(sc) {
    'use strict';

    angular.module('openfin.showcase')
        .directive('showcase', ['quandlService', function(quandlService) {
            return {
                restrict: 'E',
                templateUrl: 'showcase/showcase.html',
                scope: {
                    selection: '&'
                },
                link: function(scope, element) {
                    var chart = sc.app().quandlApiKey(quandlService.apiKey()),
                        firstRun = true;

                    scope.$watch('selection()', function(newSelection, previousSelection) {
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
}(sc));
