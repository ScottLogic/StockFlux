(function() {
    'use strict';

    angular.module('openfin.search', ['openfin.quandl', 'openfin.store'])
        .controller('SearchCtrl', ['$scope', 'quandlService', 'storeService',
            function($scope, quandlService, storeService) {
                var self = this;
                self.query = '';
                self.stocks = [];

                self.submit = function() {
                    self.stocks = [];
                    var favourites = storeService.get();
                    if (self.query) {
                        var length = favourites.length;
                        quandlService.search(self.query, function(stock) {
                            var i;

                            // removing stocks found with old query
                            self.stocks = self.stocks.filter(function(stock, i) {
                                return stock.query === self.query;
                            });

                            // not adding old stocks
                            if (stock.query !== self.query) {
                                return;
                            }

                            var stockAdded = false;
                            for (i = 0; i < length; i++) {
                                if (stock.code === favourites[i]) {
                                    stock.favourite = true;
                                    self.stocks.unshift(stock);
                                    stockAdded = true;
                                }
                            }

                            if (!stockAdded) {
                                self.stocks.push(stock);
                            }
                        });
                    } else {
                        favourites.map(function(favourite) {
                            quandlService.getMeta(favourite, function(stock) {
                                stock.favourite = true;
                                self.stocks.push(stock);
                            });
                        });
                    }
                };

                self.clear = function() {
                    self.query = '';
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

                $scope.$on('favouriteChanged', function(event, data) {
                    var index = self.stocks.map(function(stock) { return stock.code; }).indexOf(data.code);
                    if (index > -1 && !self.query) {
                        self.stocks.splice(index, 1);
                    }
                });
            }
        ])
        .directive('search', [function() {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/search/search-preview.html',
                scope: {
                    stock: '='
                }
            }
        }]);
}());
