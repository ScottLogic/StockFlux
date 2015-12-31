(function() {
    'use strict';

    angular.module('openfin.favourites', ['openfin.store', 'openfin.quandl'])
        .controller('FavouritesCtrl', ['storeService', 'quandlService', function(storeService, quandlService) {
            var self = this;

            var icons = {
                up: 'glyphicon-triangle-top',
                down: 'glyphicon-triangle-bottom'
            };

            var bellColours = {
                on: '#42D8BD',
                off: '#1A1F26',
                offhover: "#263337"
            };

            self.icon = function(stock) {
                return stock.delta < 0 ? icons.down : icons.up;
            };

            self.bellStyle = function(stock) {
                if (stock.notification){
                    return bellColours.on;
                } else if (stock.isHovered){
                    return bellColours.offhover;
                }  else {
                    return bellColours.off;
                }
            };

            self.bellClick = function(stock) {
                stock.notification = !stock.notification;
            };

            //Render the mini chart on the stock card
            self.renderChart = function(stock) {
                //fix temp id
                var chartElement = document.getElementById('tempChartId');
                chartElement.id = stock.code + 'chart';

                quandlService.getData(stock.code, function(stock) {
                    var extent = fc.util.innerDimensions(document.getElementById(stock.code + 'chart'));
                    var width = extent.width,
                        height = extent.height;
                    var data = stock.data;
                    data = data.map(function (d){
                        var str1 = d.date;
                        var dt1   = parseInt(str1.substring(8,10));
                        var mon1  = parseInt(str1.substring(5,7));
                        var yr1   = parseInt(str1.substring(0,4));
                        var date1 = new Date(yr1, mon1-1, dt1);
                        d.date= date1;
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
                });
            };

            self.updateFavourites = function() {
                self.stocks = [];
                self.favourites = storeService.get();
                self.favourites.map(function (favourite) {
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
                link: function(scope, element, attrs) {
                    var tearElement = element[0].getElementsByClassName('tear')[0];

                    fin.desktop.main(function() {
                        function createConfig() {
                            return {
                                'name': 'duplicate-demo' + Math.random(),
                                'maxWidth': 226,
                                'maxHeight': 119,
                                'defaultWidth': 226,
                                'defaultHeight': 119,
                                'width': 226,
                                'height': 119,
                                'autoShow': false,
                                'url': 'tearout/tearout.html',
                                'frame': false,
                                'resizable': false,
                                'maximizable': false
                            }
                        }

                        tearout.initialise({
                            element: tearElement,
                            tearoutWindow: new fin.desktop.Window(createConfig()),
                            dropTarget: tearElement.parentNode
                        });
                    });
                },
                scope: {
                    stock: '=',
                    icon: '&',
                    bellStyle: '&',
                    bellClick: '&',
                    renderChart: '&'
                }
            }
        }]);
}());
