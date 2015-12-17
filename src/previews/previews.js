(function() {
    'use strict';

    angular.module('openfin.preview', [])
        .controller('PreviewCtrl', [function() {
            var self = this;
            self.stocks = [];

            var bellColours = {
                on: '#42D8BD',
                off: '#1A1F26'
            };

            self.bellStyle = function(stock) {
                return stock.bellColour;
            };

            self.bellClick = function(stock) {
                if (stock.bellColour == bellColours.on) {
                    stock.bellColour = bellColours.off;
                } else {
                    stock.bellColour = bellColours.on;
                }
            };

            function createStock(name, code, data) {
                self.stocks.push({
                    name: name,
                    code: code,
                    price: data.currentPrice,
                    delta: data.delta,
                    percentage: data.percentage,
                    bellColour: bellColours.off
                });
            }

            function createStockData(currentPrice, delta, percentage) {
                return {
                    currentPrice: currentPrice,
                    delta: delta,
                    percentage: percentage
                };
            }

            createStock('Dow Jones Industrial Average (DIA)', 'DJIA', createStockData(247.17, 102.15, 0.59));
            createStock('Standard & Poor 500 Index (INX)', 'S&P 500', createStockData(346.20, -80.15, 0.67));
            createStock('FTSE 100 Index (UKX)', 'FTSE 100', createStockData(247.17, 102.15, 0.59));
        }])
        .directive('previewTabs', [function() {
            return {
                restrict: 'E',
                templateUrl: 'previews/stock-preview.html',
                link: function(scope, element, attrs) {

                },
                scope: {
                    stock: '=',
                    bellStyle: '&',
                    bellClick: '&'
                }
            }
        }]);;
}());
