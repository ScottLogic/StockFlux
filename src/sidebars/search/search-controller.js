(function() {
    'use strict';

    angular.module('openfin.search', ['openfin.quandl', 'openfin.store'])
        .controller('SearchCtrl', ['$scope', 'quandlService', 'storeService',
            function($scope, quandlService, storeService) {
                var self = this;
                self.query = '';
                self.noResults = false;
                self.stocks = [];

                function submit() {
                    self.stocks = [];
                    self.noResults = false;
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

                            // Due to the asynchronicity of the search, if multiple searches
                            // are fired off in a small amount of time, with an intermediate one
                            // returning no results it's possible to have both the noResults flag
                            // set to true, while some stocks have been retrieved by a later search.
                            //
                            // Here we re-set the flag to keep it up-to-date.
                            self.noResults = false;

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
                        },
                        function() {
                            self.noResults = true;
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

                $scope.$watch(
                    // Can't watch `self.query` as the subscribers to this controller
                    // may alias it (e.g. `searchCtrl.query`), so instead define a
                    // function to decouple scoping.
                    function watchQuery() {
                        return self.query;
                    },
                    function() {
                        submit();
                    });

                $scope.$on('updateFavourites', function(event, data) {
                    var index = self.stocks.map(function(stock) { return stock.code; }).indexOf(data.code);
                    if (index > -1) {
                        if (!self.query) {
                            // There are no search results, so remove the favourite.
                            self.stocks.splice(index, 1);
                        } else {
                            // Update the stock's favourite
                            self.stocks[index].favourite = data.favourite;
                        }
                    }
                });
            }
        ]);
}());
