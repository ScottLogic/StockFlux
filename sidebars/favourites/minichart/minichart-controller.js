﻿(function() {
    'use strict';

    angular.module('openfin.minichart', ['openfin.quandl'])
        .controller('MinichartCtrl', ['quandlService', '$timeout', function(quandlService, $timeout) {
            var self = this;

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
        }])
}());
