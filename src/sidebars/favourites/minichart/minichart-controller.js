(function() {
    'use strict';

    class MinichartCtrl {
        constructor(quandlService, $timeout) {
            this.quandlService = quandlService;
            this.$timeout = $timeout;
        }

        renderChart(stock) {
            this.$timeout(
                () => {
                    this.quandlService.getData(stock.code, (result) => {

                        var extent = fc.util.innerDimensions(document.getElementById(result.code + 'chart'));
                        var width = extent.width,
                            height = extent.height;
                        var data = result.data;
                        data = data.map((d) => {
                            var date = moment(d.date);
                            d.date = date.toDate();
                            return d;
                        });
                        var container = d3.select('#' + result.code + 'chart')
                            .insert('svg', 'div')
                            .attr('width', width)
                            .attr('height', height);

                        // Create scale for x axis
                        var xScale = fc.scale.dateTime()
                            .domain(fc.util.extent().fields('date')(data))
                            .discontinuityProvider(fc.scale.discontinuity.skipWeekends())
                            .range([0, width]);

                        // Create scale for y axis. We're only showing close, so
                        // only use that extent.
                        var closeExtent = fc.util.extent().fields(['close'])(data);
                        var yScale = d3.scale.linear()
                            .domain(closeExtent)
                            .range([height, 0])
                            .nice();

                        var area = fc.series.area()
                            .y0Value((d) => closeExtent[0])
                            .y1Value((d) => d.close)
                            .decorate((selection) => {
                                selection.attr('fill', 'url(#' + result.code + '-minichart-gradient)');
                            });

                        var line = fc.series.line();

                        var pointData = [].concat(data.slice(0)[0]);
                        var point = fc.series.point();

                        var multi = fc.series.multi()
                            .series([area, line, point])
                            .xScale(xScale)
                            .yScale(yScale)
                            .mapping((series) => {
                                switch (series) {
                                case point:
                                    return pointData;
                                default:
                                    return data;
                                }
                            });

                        container.append('g')
                            .datum(data)
                            .call(multi);
                    });
                }
            );
        }
    }
    MinichartCtrl.$inject = ['quandlService', '$timeout'];

    angular.module('openfin.minichart', ['openfin.quandl'])
        .controller('MinichartCtrl', MinichartCtrl);
}());
