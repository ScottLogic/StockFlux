﻿(function() {
    'use strict';

    angular.module('openfin.favourites', ['openfin.store', 'openfin.quandl'])
        .controller('FavouritesCtrl', ['storeService', 'quandlService', '$timeout', '$scope',
            function(storeService, quandlService, $timeout, $scope) {
                var self = this;
                self.stocks = [];

                var icons = {
                    up: 'glyphicon-triangle-top',
                    down: 'glyphicon-triangle-bottom'
                };

                self.icon = function(stock) {
                    return stock.delta < 0 ? icons.down : icons.up;
                };

                // Render the mini chart on the stock card
                self.renderChart = function(stock) {
                    $timeout(
                        function() {
                            quandlService.getData(stock.code, function(stock) {
                                var extent = fc.util.innerDimensions(document.getElementById(stock.code + 'chart'));
                                var width = extent.width,
                                    height = extent.height;
                                var data = stock.data;
                                data = data.map(function(d) {
                                    var date = moment(d.date);
                                    d.date = date.toDate();;
                                    return d;
                                });
                                var container = d3.select('#' + stock.code + 'chart')
                                    .insert('svg', 'div')
                                    .attr('width', width)
                                    .attr('height', height);

                                // Create scale for x axis
                                var xScale = fc.scale.dateTime()
                                    .domain(fc.util.extent().fields('date')(data))
                                    .discontinuityProvider(fc.scale.discontinuity.skipWeekends())
                                    .range([0, width]);

                                // Create scale for y axis
                                var yScale = d3.scale.linear()
                                    .domain(fc.util.extent().fields(['high', 'low'])(data))
                                    .range([height, 0])
                                    .nice();

                                var area = fc.series.area()
                                    .y1Value(function(d) { return 1000; })
                                    .y0Value(function(d) { return d.close; });

                                var line = fc.series.line();

                                var multi = fc.series.multi()
                                    .series([area, line])
                                    .xScale(xScale)
                                    .yScale(yScale);

                                container.append('g')
                                    .datum(data)
                                    .call(multi);
                            })
                        }
                    );
                };

                self.remove = function(stock) {
                    return confirm('Are you sure you wish to remove this stock (' + stock.code + ') from your favourites?');
                };

                self.update = function() {
                    self.favourites = storeService.get();
                    var i,
                        max,
                        min;

                    // Remove the stocks no longer in the favourites
                    var removedStocksIndices = [];
                    for (i = 0, max = self.stocks.length; i < max; i++) {
                        if (self.favourites.indexOf(self.stocks[i].code) === -1) {
                            removedStocksIndices.push(i);
                        }
                    }

                    // Remove from the end of the array to not change the indices
                    for (i = removedStocksIndices.length - 1, min = 0; i >= min; i--) {
                        self.stocks.splice(removedStocksIndices[i], 1);
                    }

                    // Add new stocks from favourites
                    self.favourites.map(function(favourite) {
                        if (self.stocks.map(function(stock) { return stock.code; }).indexOf(favourite) === -1) {
                            // This is a new stock
                            quandlService.getData(favourite, function(stock) {
                                var data = stock.data[0],
                                    price,
                                    delta,
                                    percentage;

                                if (data) {
                                    price = data.close;
                                    delta = data.close - data.open;
                                    percentage = delta / data.open * 100;

                                    self.stocks.push({
                                        name: stock.name,
                                        code: stock.code,
                                        price: price,
                                        delta: delta,
                                        percentage: Math.abs(percentage),
                                        favourite: true
                                    });
                                }
                            });
                        }
                    })
                };

                self.update();

                $scope.$on('favouriteChanged', function(event, data) {
                    self.update();
                })
            }])
        .directive('favourite', [function() {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/favourites/favourite-preview.html',
                scope: {
                    stock: '=',
                    selection: '=',
                    select: '&',
                    icon: '&',
                    renderChart: '&'
                }
            }
        }]);
}());
