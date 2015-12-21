(function() {
    'use strict';

    angular.module('openfin.search', ['openfin.quandl', 'openfin.openfin'])
        .controller('SearchCtrl', ['$scope', '$routeParams', 'quandlService', 'openfinService',
            function($scope, $routeParams, quandlService, openfinService) {
                var self = this;
                self.query = $routeParams.query;
                self.stocks = [];

                var favouriteColours = {
                    on: '#42D8BD',
                    off: '#1A1F26'
                };

                self.favouriteStyle = function(stock) {
                    return stock.favouriteColour;
                };

                self.favouriteClick = function(stock) {
                    if (stock.favouriteColour == favouriteColours.on) {
                        stock.favouriteColour = favouriteColours.off;
                    } else {
                        stock.favouriteColour = favouriteColours.on;
                    }
                };

                self.submit = function() {
                    self.stocks = [];
                    if (self.query) {
                        quandlService.stock().get({ query: self.query }, function(result) {
                            var fetchedStocks = result.datasets,
                                length = fetchedStocks.length,
                                i,
                                fetchedStock,
                                stock;

                            for (i = 0; i < length; i++) {
                                fetchedStock = fetchedStocks[i];
                                self.stocks.push({
                                    name: fetchedStock.name,
                                    code: fetchedStock.dataset_code,
                                    favouriteColour: favouriteColours.off
                                });
                            }

                            // After the stock meta-data has been fetched and displayed the financial data
                            // can be retrieved and displayed
                            for (i = 0; i < length; i++) {
                                stock = self.stocks[i];
                                fetchStockData(stock);
                            }
                        });
                    }
                };

                function fetchStockData(stock) {
                    quandlService.stockData().get({ code: stock.code }, function(result) {
                        var data = result.stockData;
                        stock.data = data.data;
                    });
                }

                self.clear = function() {
                    self.query = '';
                };

                self.open = function(stockName) {
                    openfinService.open(stockName);
                };

                $scope.$watch(
                    // Can't watch `self.query` as the subscribers to this controller
                    // may alias it (e.g. `searchCtrl.query`), so instead define a
                    // function to decouple scoping.
                    function watchQuery() {
                        return self.query;
                    },
                    function() {
                        self.submit();
                    });
            }
        ])
        .directive('search', [function() {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/search/search-preview.html',
                link: function(scope, element, attrs) {

                },
                scope: {
                    stock: '=',
                    favouriteStyle: '&',
                    favouriteClick: '&'
                }
            }
        }])
        .filter('truncate', function() {
            return function(input) {
                var closeBracketIndex = input.indexOf(')');
                return input.slice(0, closeBracketIndex + 1);
            };
        });
}());
