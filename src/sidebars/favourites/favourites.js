(function() {
    'use strict';

    angular.module('openfin.favourites', ['openfin.store', 'openfin.quandl'])
        .controller('FavouritesCtrl', ['storeService', 'quandlService', '$timeout', function(storeService, quandlService, $timeout) {
            var self = this;

            self.selection = '';

            var icons = {
                up: 'glyphicon-triangle-top',
                down: 'glyphicon-triangle-bottom'
            };

            self.icon = function(stock) {
                return stock.delta < 0 ? icons.down : icons.up;
            };

            //Render the mini chart on the stock card
            self.renderChart = function(stock) {
                $timeout(
                    function() {
                        quandlService.getData(stock.code, function(stock) {
                            var extent = fc.util.innerDimensions(document.getElementById(stock.code + 'chart'));
                            var width = extent.width,
                                height = extent.height;
                            var data = stock.data;
                            data = data.map(function(d) {
                                var str1 = d.date;
                                var dt1 = parseInt(str1.substring(8, 10));
                                var mon1 = parseInt(str1.substring(5, 7));
                                var yr1 = parseInt(str1.substring(0, 4));
                                var date1 = new Date(yr1, mon1 - 1, dt1);
                                d.date = date1;
                                return d;
                            });
                            var container = d3.select('#' + stock.code + 'chart')
                                .insert('svg', 'div')
                                .attr('width', width)
                                .attr('height', height);

                            // Create scale for x axis
                            var xScale = fc.scale.dateTime()
                                .domain(fc.util.extent().fields('date')(data))
                                .range([0, width]);

                            // Create scale for y axis
                            var yScale = d3.scale.linear()
                                .domain(fc.util.extent().fields(['high', 'low'])(data))
                                .range([height, 0])
                                .nice();

                            var area = fc.series.area()
                                .xScale(xScale)
                                .yScale(yScale);

                            container.append('g')
                                .datum(data)
                                .call(area);
                        })
                    }
                );
            };

            self.updateFavourites = function() {
                self.stocks = [];
                self.favourites = storeService.get();
                self.favourites.map(function(favourite) {
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
                                notification: false
                            });
                        }
                    });
                });
            };

            self.updateFavourites();
        }])
        .directive('favourite', [function() {
            return {
                restrict: 'E',
                templateUrl: 'sidebars/favourites/favourite-preview.html',
                scope: {
                    stock: '=',
                    selection: '=',
                    icon: '&',
                    renderChart: '&'
                }
            }
        }]);
}());
