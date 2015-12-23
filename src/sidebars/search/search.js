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
                    return stock.favourite ? favouriteColours.on : favouriteColours.off;
                };

                self.favouriteClick = function(stock) {
                    stock.favourite = !stock.favourite;
                };

                self.submit = function() {
                    self.stocks = [];
                    if (self.query) {
                        quandlService.getMeta(self.query, function(stock) {
                            self.stocks.push(stock);
                        });
                    }
                };

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
        }]);
}());
