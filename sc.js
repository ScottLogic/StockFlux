(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3'), require('d3fc')) :
    typeof define === 'function' && define.amd ? define(['d3', 'd3fc'], factory) :
    (global.sc = factory(global.d3,global.fc));
}(this, function (d3,fc) { 'use strict';

    d3 = 'default' in d3 ? d3['default'] : d3;
    fc = 'default' in fc ? fc['default'] : fc;

    var id = 0;
    function uid() {
        return ++id;
    }

    var renderedOnce = false;

    function layout(containers, charts) {

        function getSecondaryContainer(chartIndex) {
            return containers.secondaries.filter(function(d, index) { return index === chartIndex; });
        }

        var secondaryChartsShown = 0;
        for (var j = 0; j < charts.secondaries.length; j++) {
            if (charts.secondaries[j]) {
                secondaryChartsShown++;
            }
        }
        containers.secondaries
            .filter(function(d, index) { return index < secondaryChartsShown; })
            .style('flex', '1');
        containers.secondaries
            .filter(function(d, index) { return index >= secondaryChartsShown; })
            .style('flex', '0');
        containers.overlaySecondaries
            .filter(function(d, index) { return index < secondaryChartsShown; })
            .style('flex', '1');
        containers.overlaySecondaries
            .filter(function(d, index) { return index >= secondaryChartsShown; })
            .style('flex', '0');

        var headRowHeight = parseInt(containers.app.select('.head-row').style('height'), 10);
        if (!renderedOnce) {
            headRowHeight +=
              parseInt(containers.app.select('.head-row').style('padding-top'), 10) +
              parseInt(containers.app.select('.head-row').style('padding-bottom'), 10) +
              parseInt(containers.app.select('.head-row').style('margin-bottom'), 10);
            renderedOnce = true;
        }

        var useableHeight = fc.util.innerDimensions(containers.app.node()).height - headRowHeight;

        containers.charts
          .style('height', useableHeight + 'px');

        charts.xAxis.dimensionChanged(containers.xAxis);
        charts.navbar.dimensionChanged(containers.navbar);
        charts.primary.dimensionChanged(containers.primary);
        for (var i = 0; i < charts.secondaries.length; i++) {
            charts.secondaries[i].option.dimensionChanged(getSecondaryContainer(i));
        }
    }

    function trackingLatestData(domain, data) {
        var latestViewedTime = d3.max(domain, function(d) { return d.getTime(); });
        var latestDatumTime = d3.max(data, function(d) { return d.date.getTime(); });
        return latestViewedTime === latestDatumTime;
    }

    function padYDomain(yExtent, paddingPercentage) {
        var paddingArray = Array.isArray(paddingPercentage) ?
          paddingPercentage : [paddingPercentage, paddingPercentage];
        var orderedYExtentDifference = yExtent[1] - yExtent[0];

        return [yExtent[0] - orderedYExtentDifference * paddingArray[0],
            yExtent[1] + orderedYExtentDifference * paddingArray[1]];
    }

    function moveToLatest(domain, data, ratio) {
        if (arguments.length < 3) {
            ratio = 1;
        }
        var dataExtent = fc.util.extent()
          .fields('date')(data);
        var dataTimeExtent = (dataExtent[1].getTime() - dataExtent[0].getTime()) / 1000;
        var domainTimes = domain.map(function(d) { return d.getTime(); });
        var scaledDomainTimeDifference = ratio * (d3.max(domainTimes) - d3.min(domainTimes)) / 1000;
        var scaledLiveDataDomain = scaledDomainTimeDifference < dataTimeExtent ?
          [d3.time.second.offset(dataExtent[1], -scaledDomainTimeDifference), dataExtent[1]] : dataExtent;
        return scaledLiveDataDomain;
    }

    function filterDataInDateRange(domain, data) {
        var startDate = d3.min(domain, function(d) { return d.getTime(); });
        var endDate = d3.max(domain, function(d) { return d.getTime(); });

        var dataSortedByDate = data.sort(function(a, b) {
            return a.date - b.date;
        });

        var bisector = d3.bisector(function(d) { return d.date; });
        var filteredData = data.slice(
          // Pad and clamp the bisector values to ensure extents can be calculated
          Math.max(0, bisector.left(dataSortedByDate, startDate) - 1),
          Math.min(bisector.right(dataSortedByDate, endDate) + 1, dataSortedByDate.length)
        );
        return filteredData;
    }

    function centerOnDate(domain, data, centerDate) {
        var dataExtent = fc.util.extent()
          .fields('date')(data);
        var domainTimes = domain.map(function(d) { return d.getTime(); });
        var domainTimeDifference = (d3.max(domainTimes) - d3.min(domainTimes)) / 1000;

        if (centerDate.getTime() < dataExtent[0] || centerDate.getTime() > dataExtent[1]) {
            return [new Date(d3.min(domainTimes)), new Date(d3.max(domainTimes))];
        }

        var centeredDataDomain = [d3.time.second.offset(centerDate, -domainTimeDifference / 2),
            d3.time.second.offset(centerDate, domainTimeDifference / 2)];
        var timeShift = 0;
        if (centeredDataDomain[1].getTime() > dataExtent[1].getTime()) {
            timeShift = (dataExtent[1].getTime() - centeredDataDomain[1].getTime()) / 1000;
        } else if (centeredDataDomain[0].getTime() < dataExtent[0].getTime()) {
            timeShift = (dataExtent[0].getTime() - centeredDataDomain[0].getTime()) / 1000;
        }

        return [d3.time.second.offset(centeredDataDomain[0], timeShift),
            d3.time.second.offset(centeredDataDomain[1], timeShift)];
    }

    var domain = {
        centerOnDate: centerOnDate,
        filterDataInDateRange: filterDataInDateRange,
        moveToLatest: moveToLatest,
        padYDomain: padYDomain,
        trackingLatestData: trackingLatestData
    };

    var util = {
        domain: domain,
        layout: layout,
        uid: uid
    };

    var event = {
        crosshairChange: 'crosshairChange',
        viewChange: 'viewChange',
        newTrade: 'newTrade',
        historicDataLoaded: 'historicDataLoaded',
        historicFeedError: 'historicFeedError',
        streamingFeedError: 'streamingFeedError',
        streamingFeedClose: 'streamingFeedClose',
        dataProductChange: 'dataProductChange',
        dataPeriodChange: 'dataPeriodChange',
        resetToLatest: 'resetToLatest',
        clearAllPrimaryChartIndicatorsAndSecondaryCharts: 'clearAllPrimaryChartIndicatorsAndSecondaryCharts',
        primaryChartSeriesChange: 'primaryChartSeriesChange',
        primaryChartYValueAccessorChange: 'primaryChartYValueAccessorChange',
        primaryChartIndicatorChange: 'primaryChartIndicatorChange',
        secondaryChartChange: 'secondaryChartChange',
        indicatorChange: 'indicatorChange',
        notificationClose: 'notificationClose'
    };

    function zoomBehavior(width) {

        var dispatch = d3.dispatch('zoom');

        var zoomBehavior = d3.behavior.zoom();
        var scale;

        var allowPan = true;
        var allowZoom = true;
        var trackingLatest = true;

        function controlPan(zoomExtent) {
            // Don't pan off sides
            if (zoomExtent[0] >= 0) {
                return -zoomExtent[0];
            } else if (zoomExtent[1] <= 0) {
                return -zoomExtent[1];
            }
            return 0;
        }

        function controlZoom(zoomExtent) {
            // If zooming, and about to pan off screen, do nothing
            return (zoomExtent[0] > 0 && zoomExtent[1] < 0);
        }

        function translateXZoom(translation) {
            var tx = zoomBehavior.translate()[0];
            tx += translation;
            zoomBehavior.translate([tx, 0]);
        }

        function resetBehaviour() {
            zoomBehavior.translate([0, 0]);
            zoomBehavior.scale(1);
        }

        function zoom(selection) {

            var xExtent = fc.util.extent()
              .fields('date')(selection.datum().data);

            zoomBehavior.x(scale)
              .on('zoom', function() {
                  var min = scale(xExtent[0]);
                  var max = scale(xExtent[1]);

                  var maxDomainViewed = controlZoom([min, max - width]);
                  var panningRestriction = controlPan([min, max - width]);
                  translateXZoom(panningRestriction);

                  var panned = (zoomBehavior.scale() === 1);
                  var zoomed = (zoomBehavior.scale() !== 1);

                  if ((panned && allowPan) || (zoomed && allowZoom)) {
                      var domain = scale.domain();
                      if (maxDomainViewed) {
                          domain = xExtent;
                      } else if (zoomed && trackingLatest) {
                          domain = util.domain.moveToLatest(domain, selection.datum().data);
                      }

                      if (domain[0].getTime() !== domain[1].getTime()) {
                          dispatch.zoom(domain);
                      } else {
                          // Ensure the user can't zoom-in infinitely, causing the chart to fail to render
                          // #168, #411
                          resetBehaviour();
                      }
                  } else {
                      resetBehaviour();
                  }
              });

            selection.call(zoomBehavior);
        }

        zoom.allowPan = function(x) {
            if (!arguments.length) {
                return allowPan;
            }
            allowPan = x;
            return zoom;
        };

        zoom.allowZoom = function(x) {
            if (!arguments.length) {
                return allowZoom;
            }
            allowZoom = x;
            return zoom;
        };

        zoom.trackingLatest = function(x) {
            if (!arguments.length) {
                return trackingLatest;
            }
            trackingLatest = x;
            return zoom;
        };

        zoom.scale = function(x) {
            if (!arguments.length) {
                return scale;
            }
            scale = x;
            return zoom;
        };

        d3.rebind(zoom, dispatch, 'on');

        return zoom;
    }

    function base() {
        var dispatch = d3.dispatch(event.viewChange);
        var xScale = fc.scale.dateTime();
        var yScale = d3.scale.linear();
        var trackingLatest = true;
        var yAxisWidth = 60;

        var multi = fc.series.multi();
        var chart = fc.chart.cartesian(xScale, yScale)
          .plotArea(multi)
          .xTicks(0)
          .yOrient('right')
          .margin({
              top: 0,
              left: 0,
              bottom: 0,
              right: yAxisWidth
          });
        var zoomWidth;

        function secondary(selection) {
            selection.each(function(data) {
                var container = d3.select(this)
                  .call(chart);

                var zoom = zoomBehavior(zoomWidth)
                  .scale(xScale)
                  .trackingLatest(trackingLatest)
                  .on('zoom', function(domain) {
                      dispatch[event.viewChange](domain);
                  });

                container.select('.plot-area-container')
                  .datum({data: selection.datum()})
                  .call(zoom);
            });
        }

        secondary.trackingLatest = function(x) {
            if (!arguments.length) {
                return trackingLatest;
            }
            trackingLatest = x;
            return secondary;
        };

        d3.rebind(secondary, dispatch, 'on');
        d3.rebind(secondary, multi, 'series', 'mapping', 'decorate');
        d3.rebind(secondary, chart, 'yTickValues', 'yTickFormat', 'yTicks', 'xDomain', 'yDomain');

        secondary.dimensionChanged = function(container) {
            zoomWidth = parseInt(container.style('width'), 10) - yAxisWidth;
        };

        return secondary;
    }

    function volume() {
        var dispatch = d3.dispatch(event.viewChange);
        var volumeBar = fc.series.bar()
          .yValue(function(d) { return d.volume; });

        var chart = base()
          .series([volumeBar])
          .yTicks(4)
          .on(event.viewChange, function(domain) {
              dispatch[event.viewChange](domain);
          });

        function volume(selection) {
            selection.each(function(model) {
                var paddedYExtent = fc.util.extent()
                    .fields('volume')
                    .pad(0.08)(model.data);
                if (paddedYExtent[0] < 0) {
                    paddedYExtent[0] = 0;
                }
                chart.yTickFormat(model.product.volumeFormat)
                    .trackingLatest(model.trackingLatest)
                    .xDomain(model.viewDomain)
                    .yDomain(paddedYExtent);

                selection.datum(model.data)
                    .call(chart);
            });
        }

        d3.rebind(volume, dispatch, 'on');

        volume.dimensionChanged = function(container) {
            chart.dimensionChanged(container);
        };

        return volume;
    }

    function rsi() {
        var dispatch = d3.dispatch(event.viewChange);
        var renderer = fc.indicator.renderer.relativeStrengthIndex();
        var algorithm = fc.indicator.algorithm.relativeStrengthIndex();
        var tickValues = [renderer.lowerValue(), 50, renderer.upperValue()];

        var chart = base()
          .series([renderer])
          .yTickValues(tickValues)
          .on(event.viewChange, function(domain) {
              dispatch[event.viewChange](domain);
          });

        function rsi(selection) {
            var model = selection.datum();
            algorithm(model.data);

            chart.trackingLatest(model.trackingLatest)
              .xDomain(model.viewDomain)
              .yDomain([0, 100]);

            selection.datum(model.data)
              .call(chart);
        }

        d3.rebind(rsi, dispatch, 'on');

        rsi.dimensionChanged = function(container) {
            chart.dimensionChanged(container);
        };

        return rsi;
    }

    function macd() {
        var dispatch = d3.dispatch(event.viewChange);
        var zeroLine = fc.annotation.line()
          .value(0)
          .label('');
        var renderer = fc.indicator.renderer.macd();
        var algorithm = fc.indicator.algorithm.macd();

        var chart = base()
          .series([zeroLine, renderer])
          .yTicks(5)
          .mapping(function(series) {
              return series === zeroLine ? [0] : this;
          })
          .decorate(function(g) {
              g.enter()
                .attr('class', function(d, i) {
                    return ['multi zero', 'multi'][i];
                });
          })
          .on(event.viewChange, function(domain) {
              dispatch[event.viewChange](domain);
          });

        function macd(selection) {
            var model = selection.datum();
            algorithm(model.data);

            var paddedYExtent = fc.util.extent()
                .fields('macd')
                .symmetricalAbout(0)
                .pad(0.08)(model.data.map(function(d) { return d.macd; }));
            chart.trackingLatest(model.trackingLatest)
              .xDomain(model.viewDomain)
              .yDomain(paddedYExtent);

            selection.datum(model.data)
              .call(chart);
        }

        d3.rebind(macd, dispatch, 'on');

        macd.dimensionChanged = function(container) {
            chart.dimensionChanged(container);
        };

        return macd;
    }

    var secondary = {
        base: base,
        macd: macd,
        rsi: rsi,
        volume: volume
    };

    function xAxis() {
        var xScale = fc.scale.dateTime();
        var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient('bottom');

        function preventTicksMoreFrequentThanPeriod(period) {
            var scaleTickSeconds = (xScale.ticks()[1] - xScale.ticks()[0]) / 1000;
            if (scaleTickSeconds < period.seconds) {
                xAxis.ticks(period.d3TimeInterval.unit, period.d3TimeInterval.value);
            } else {
                xAxis.ticks(6);
            }
        }

        function xAxisChart(selection) {
            var model = selection.datum();
            xScale.domain(model.viewDomain);
            preventTicksMoreFrequentThanPeriod(model.period);
            selection.call(xAxis);
        }

        xAxisChart.dimensionChanged = function(container) {
            xScale.range([0, parseInt(container.style('width'), 10)]);
        };

        return xAxisChart;
    }

    function option(displayString, valueString, option, icon, isPrimary) {
        return {
            displayString: displayString, // TODO: is 'displayName' better?
            valueString: valueString, // TODO: is this an id?
            option: option, // TODO: Ideally, remove.
            isSelected: false,
            icon: icon,
            isPrimary: isPrimary
        };
    }

    function candlestickSeries() {
        var xScale = fc.scale.dateTime();
        var yScale = d3.scale.linear();
        var barWidth = fc.util.fractionalBarWidth(0.75);
        var xValue = function(d, i) { return d.date; };
        var xValueScaled = function(d, i) { return xScale(xValue(d, i)); };
        var yLowValue = function(d) { return d.low; };
        var yHighValue = function(d) { return d.high; };
        var yCloseValue = function(d, i) { return d.close; };

        var candlestickSvg = fc.svg.candlestick()
          .x(function(d) { return xScale(d.date); })
          .open(function(d) { return yScale(d.open); })
          .high(function(d) { return yScale(yHighValue(d)); })
          .low(function(d) { return yScale(yLowValue(d)); })
          .close(function(d) { return yScale(d.close); });

        var upDataJoin = fc.util.dataJoin()
          .selector('path.up')
          .element('path')
          .attr('class', 'up');

        var downDataJoin = fc.util.dataJoin()
          .selector('path.down')
          .element('path')
          .attr('class', 'down');

        var candlestick = function(selection) {
            selection.each(function(data) {
                candlestickSvg.width(barWidth(data.map(xValueScaled)));

                var upData = data.filter(function(d) { return d.open < d.close; });
                var downData = data.filter(function(d) { return d.open >= d.close; });

                upDataJoin(this, [upData])
                  .attr('d', candlestickSvg);

                downDataJoin(this, [downData])
                  .attr('d', candlestickSvg);
            });
        };

        candlestick.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return candlestick;
        };
        candlestick.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return candlestick;
        };
        candlestick.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return candlestick;
        };
        candlestick.yLowValue = function(x) {
            if (!arguments.length) {
                return yLowValue;
            }
            yLowValue = x;
            return candlestick;
        };
        candlestick.yHighValue = function(x) {
            if (!arguments.length) {
                return yHighValue;
            }
            yHighValue = x;
            return candlestick;
        };
        candlestick.yCloseValue = function(x) {
            if (!arguments.length) {
                return yCloseValue;
            }
            yCloseValue = x;
            return candlestick;
        };
        candlestick.width = function(data) {
            return barWidth(data.map(xValueScaled));
        };

        return candlestick;
    }

    function calculateCloseAxisTagPath(width, height) {
        var h2 = height / 2;
        return [
            [0, 0],
            [h2, -h2],
            [width, -h2],
            [width, h2],
            [h2, h2],
            [0, 0]
        ];
    }

    function produceAnnotatedTickValues(scale, annotation) {
        var annotatedTickValues = scale.ticks.apply(scale, []);

        var extent = scale.domain();
        for (var i = 0; i < annotation.length; i++) {
            if (annotation[i] > extent[0] && annotation[i] < extent[1]) {
                annotatedTickValues.push(annotation[i]);
            }
        }
        return annotatedTickValues;
    }

    function findTotalYExtent(visibleData, currentSeries, currentIndicators) {
        var extentAccessor;
        switch (currentSeries.valueString) {
        case 'candlestick':
        case 'ohlc':
            extentAccessor = [currentSeries.option.yLowValue(), currentSeries.option.yHighValue()];
            break;
        case 'line':
        case 'point':
            extentAccessor = currentSeries.option.yValue();
            break;
        case 'area' :
            extentAccessor = currentSeries.option.y1Value();
            break;
        default:
            throw new Error('Main series given to chart does not have expected interface');
        }
        var extent = fc.util.extent()
          .fields(extentAccessor)(visibleData);

        if (currentIndicators.length) {
            var indicators = currentIndicators.map(function(indicator) { return indicator.valueString; });
            var movingAverageShown = (indicators.indexOf('movingAverage') !== -1);
            var bollingerBandsShown = (indicators.indexOf('bollinger') !== -1);
            if (bollingerBandsShown) {
                var bollingerBandsVisibleDataObject = visibleData.map(function(d) { return d.bollingerBands; });
                var bollingerBandsExtent = fc.util.extent()
                  .fields(['lower', 'upper'])(bollingerBandsVisibleDataObject);
                extent[0] = d3.min([bollingerBandsExtent[0], extent[0]]);
                extent[1] = d3.max([bollingerBandsExtent[1], extent[1]]);
            }
            if (movingAverageShown) {
                var movingAverageExtent = fc.util.extent()
                  .fields('movingAverage')(visibleData);
                extent[0] = d3.min([movingAverageExtent[0], extent[0]]);
                extent[1] = d3.max([movingAverageExtent[1], extent[1]]);
            }
            if (!(movingAverageShown || bollingerBandsShown)) {
                throw new Error('Unexpected indicator type');
            }
        }
        return extent;
    }

    function primary() {

        var yAxisWidth = 60;
        var dispatch = d3.dispatch(event.viewChange, event.crosshairChange);

        var currentSeries;
        var currentYValueAccessor = function(d) { return d.close; };
        var currentIndicators = [];
        var zoomWidth;

        var crosshairData = [];
        var crosshair = fc.tool.crosshair()
          .xLabel('')
          .yLabel('')
          .on('trackingmove', function(updatedCrosshairData) {
              if (updatedCrosshairData.length > 0) {
                  dispatch.crosshairChange(updatedCrosshairData[0].datum);
              } else {
                  dispatch.crosshairChange(undefined);
              }
          })
          .on('trackingend', function() {
              dispatch.crosshairChange(undefined);
          });
        crosshair.id = util.uid();

        var gridlines = fc.annotation.gridline()
          .yTicks(5)
          .xTicks(0);
        var closeLine = fc.annotation.line()
          .orient('horizontal')
          .value(currentYValueAccessor)
          .label('');
        closeLine.id = util.uid();

        var multi = fc.series.multi()
            .key(function(series) { return series.id; })
            .mapping(function(series) {
                switch (series) {
                case closeLine:
                    return [this.data[this.data.length - 1]];
                case crosshair:
                    return crosshairData;
                default:
                    return this.data;
                }
            });

        var xScale = fc.scale.dateTime();
        var yScale = d3.scale.linear();

        var primaryChart = fc.chart.cartesian(xScale, yScale)
          .xTicks(0)
          .yOrient('right')
          .margin({
              top: 0,
              left: 0,
              bottom: 0,
              right: yAxisWidth
          });

        // Create and apply the Moving Average
        var movingAverage = fc.indicator.algorithm.movingAverage();
        var bollingerAlgorithm = fc.indicator.algorithm.bollingerBands();

        function updateMultiSeries() {
            var baseChart = [gridlines, currentSeries.option, closeLine];
            var indicators = currentIndicators.map(function(indicator) { return indicator.option; });
            return baseChart.concat(indicators, crosshair);
        }

        function updateYValueAccessorUsed() {
            movingAverage.value(currentYValueAccessor);
            bollingerAlgorithm.value(currentYValueAccessor);
            closeLine.value(currentYValueAccessor);
            switch (currentSeries.valueString) {
            case 'line':
            case 'point':
            case 'area':
                currentSeries.option.yValue(currentYValueAccessor);
                break;
            default:
                break;
            }
        }

        // Call when what to display on the chart is modified (ie series, options)
        function selectorsChanged(model) {
            currentSeries = model.series;
            currentYValueAccessor = model.yValueAccessor.option;
            currentIndicators = model.indicators;
            updateYValueAccessorUsed();
            multi.series(updateMultiSeries());
            primaryChart.yTickFormat(model.product.priceFormat);
            model.selectorsChanged = false;
        }

        function bandCrosshair(data) {
            var width = currentSeries.option.width(data);

            crosshair.decorate(function(selection) {
                selection.classed('band hidden-xs hidden-sm', true);

                selection.selectAll('.vertical > line')
                  .style('stroke-width', width);
            });
        }

        function lineCrosshair(selection) {
            selection.classed('band', false)
                .classed('hidden-xs hidden-sm', true)
                .selectAll('line')
                .style('stroke-width', null);
        }
        function updateCrosshairDecorate(data) {
            if (currentSeries.valueString === 'candlestick' || currentSeries.valueString === 'ohlc') {
                bandCrosshair(data);
            } else {
                crosshair.decorate(lineCrosshair);
            }
        }

        function primary(selection) {
            var model = selection.datum();

            if (model.selectorsChanged) {
                selectorsChanged(model);
            }

            primaryChart.xDomain(model.viewDomain);

            crosshair.snap(fc.util.seriesPointSnapXOnly(currentSeries.option, model.data));
            updateCrosshairDecorate(model.data);

            movingAverage(model.data);
            bollingerAlgorithm(model.data);

            // Scale y axis
            var visibleData = util.domain.filterDataInDateRange(primaryChart.xDomain(), model.data);
            var yExtent = findTotalYExtent(visibleData, currentSeries, currentIndicators);
            // Add percentage padding either side of extreme high/lows
            var paddedYExtent = util.domain.padYDomain(yExtent, 0.04);
            primaryChart.yDomain(paddedYExtent);

            // Find current tick values and add close price to this list, then set it explicitly below
            var latestPrice = currentYValueAccessor(model.data[model.data.length - 1]);
            var tickValues = produceAnnotatedTickValues(yScale, [latestPrice]);
            primaryChart.yTickValues(tickValues)
              .yDecorate(function(s) {
                  s.selectAll('.tick')
                    .filter(function(d) { return d === latestPrice; })
                    .classed('closeLine', true)
                    .select('path')
                    .attr('d', function(d) {
                        return d3.svg.area()(calculateCloseAxisTagPath(yAxisWidth, 14));
                    });
              });

            // Redraw
            primaryChart.plotArea(multi);
            selection.call(primaryChart);

            var zoom = zoomBehavior(zoomWidth)
              .scale(xScale)
              .trackingLatest(model.trackingLatest)
              .on('zoom', function(domain) {
                  dispatch[event.viewChange](domain);
              });

            selection.select('.plot-area')
              .call(zoom);
        }

        d3.rebind(primary, dispatch, 'on');

        // Call when the main layout is modified
        primary.dimensionChanged = function(container) {
            zoomWidth = parseInt(container.style('width'), 10) - yAxisWidth;
        };

        return primary;
    }

    function nav() {
        var navHeight = 100; // Also maintain in variables.less
        var bottomMargin = 40; // Also maintain in variables.less
        var navChartHeight = navHeight - bottomMargin;
        var backgroundStrokeWidth = 2; // Also maintain in variables.less
        // Stroke is half inside half outside, so stroke/2 per border
        var borderWidth = backgroundStrokeWidth / 2;
        // should have been 2 * borderWidth, but for unknown reason it is incorrect in practice.
        var extentHeight = navChartHeight - borderWidth;
        var barHeight = extentHeight;
        var handleCircleCenter = borderWidth + barHeight / 2;
        var handleBarWidth = 2;

        var dispatch = d3.dispatch(event.viewChange);

        var navChart = fc.chart.cartesian(fc.scale.dateTime(), d3.scale.linear())
          .yTicks(0)
          .margin({
              bottom: bottomMargin      // Variable also in navigator.less - should be used once ported to flex
          });

        var viewScale = fc.scale.dateTime();

        var area = fc.series.area()
          .yValue(function(d) { return d.close; });
        var line = fc.series.line()
          .yValue(function(d) { return d.close; });
        var brush = d3.svg.brush();
        var navMulti = fc.series.multi()
          .series([area, line, brush])
          .decorate(function(selection) {
              var enter = selection.enter();

              selection.select('.extent')
                .attr('height', extentHeight)
                .attr('y', backgroundStrokeWidth / 2);

              // overload d3 styling for the brush handles
              // as Firefox does not react properly to setting these through less file.
              enter.selectAll('.resize.w>rect, .resize.e>rect')
                .attr('width', handleBarWidth)
                .attr('x', -handleBarWidth / 2);
              selection.selectAll('.resize.w>rect, .resize.e>rect')
                .attr('height', barHeight)
                .attr('y', borderWidth);

              // Adds the handles to the brush sides
              var handles = enter.selectAll('.e, .w');
              handles.append('circle')
                .attr('cy', handleCircleCenter)
                .attr('r', 7)
                .attr('class', 'outer-handle');
              handles.append('circle')
                .attr('cy', handleCircleCenter)
                .attr('r', 4)
                .attr('class', 'inner-handle');
          })
          .mapping(function(series) {
              if (series === brush) {
                  brush.extent([
                      [viewScale.domain()[0], navChart.yDomain()[0]],
                      [viewScale.domain()[1], navChart.yDomain()[1]]
                  ]);
              } else {
                  // This stops the brush data being overwritten by the point data
                  return this.data;
              }
          });
        var layoutWidth;


        function setHide(selection, brushHide) {
            selection.select('.plot-area')
              .selectAll('.e, .w')
              .classed('hidden', brushHide);
        }

        function xEmpty(navBrush) {
            return ((navBrush.extent()[0][0] - navBrush.extent()[1][0]) === 0);
        }

        function nav(selection) {
            var model = selection.datum();

            viewScale.domain(model.viewDomain);

            var filteredData = util.domain.filterDataInDateRange(
              fc.util.extent().fields('date')(model.data),
              model.data);
            var yExtent = fc.util.extent()
              .fields(['low', 'high'])(filteredData);

            var brushHide = false;

            navChart.xDomain(fc.util.extent().fields('date')(model.data))
              .yDomain(yExtent);

            brush.on('brush', function() {
                var brushExtentIsEmpty = xEmpty(brush);

                // Hide the bar if the extent is empty
                setHide(selection, brushExtentIsEmpty);
                if (!brushExtentIsEmpty) {
                    dispatch[event.viewChange]([brush.extent()[0][0], brush.extent()[1][0]]);
                }
            })
                .on('brushend', function() {
                    var brushExtentIsEmpty = xEmpty(brush);
                    setHide(selection, false);
                    if (brushExtentIsEmpty) {
                        dispatch[event.viewChange](util.domain.centerOnDate(viewScale.domain(),
                            model.data, brush.extent()[0][0]));
                    }
                });

            navChart.plotArea(navMulti);
            selection.call(navChart);

            // Allow to zoom using mouse, but disable panning
            var zoom = zoomBehavior(layoutWidth)
              .scale(viewScale)
              .trackingLatest(model.trackingLatest)
              .allowPan(false)
              .on('zoom', function(domain) {
                  dispatch[event.viewChange](domain);
              });

            selection.select('.plot-area')
              .call(zoom);
        }

        d3.rebind(nav, dispatch, 'on');

        nav.dimensionChanged = function(container) {
            layoutWidth = parseInt(container.style('width'), 10);
            viewScale.range([0, layoutWidth]);
        };

        return nav;
    }

    function legend() {
        var formatPrice;
        var formatVolume;
        var formatTime;
        var lastDataPointDisplayed;

        var legendItems = [
            'T',
            function(d) { return formatTime(d.date); },
            'O',
            function(d) { return formatPrice(d.open); },
            'H',
            function(d) { return formatPrice(d.high); },
            'L',
            function(d) { return formatPrice(d.low); },
            'C',
            function(d) { return formatPrice(d.close); },
            'V',
            function(d) { return formatVolume(d.volume); }
        ];

        function legend(selection) {
            selection.each(function(model) {
                var container = d3.select(this);

                formatPrice = model.product.priceFormat;
                formatVolume = model.product.volumeFormat;
                formatTime = model.period.timeFormat;

                if (model.data == null || model.data !== lastDataPointDisplayed) {
                    lastDataPointDisplayed = model.data;

                    var span = container.selectAll('span')
                      .data(legendItems);

                    span.enter()
                      .append('span')
                      .attr('class', function(d, i) { return i % 2 === 0 ? 'legendLabel' : 'legendValue'; });

                    span.text(function(d, i) {
                        var text = '';
                        if (i % 2 === 0) {
                            return d;
                        } else if (model.data) {
                            return d(model.data);
                        }
                        return text;
                    });
                }
            });
        }

        return legend;
    }

    var chart = {
        legend: legend,
        nav: nav,
        primary: primary,
        xAxis: xAxis,
        secondary: secondary
    };

    function editIndicatorGroup() {
        var dispatch = d3.dispatch(event.indicatorChange);

        function editIndicatorGroup(selection) {
            selection.each(function(model) {
                var sel = d3.select(this);

                var div = sel.selectAll('div')
                    .data(model.selectedIndicators, function(d) {
                        return d.valueString;
                    });

                var containersEnter = div.enter()
                    .append('div')
                    .attr('class', 'edit-indicator');

                containersEnter.append('span')
                    .attr('class', 'icon sc-icon-delete')
                    .on('click', dispatch.indicatorChange);

                containersEnter.append('span')
                    .attr('class', 'indicator-label')
                    .text(function(d) {
                        return d.displayString;
                    });

                div.exit()
                    .remove();
            });
        }

        d3.rebind(editIndicatorGroup, dispatch, 'on');

        return editIndicatorGroup;

    }

    function overlay() {
        var dispatch = d3.dispatch(
            event.primaryChartIndicatorChange,
            event.secondaryChartChange);

        var primaryChartIndicatorToggle = editIndicatorGroup()
            .on(event.indicatorChange, dispatch[event.primaryChartIndicatorChange]);

        var secondaryChartToggle = editIndicatorGroup()
            .on(event.indicatorChange, dispatch[event.secondaryChartChange]);

        var overlay = function(selection) {
            selection.each(function(model) {
                var container = d3.select(this);

                container.select('#overlay-primary-container .edit-indicator-container')
                    .datum({selectedIndicators: model.primaryIndicators})
                    .call(primaryChartIndicatorToggle);

                container.selectAll('.overlay-secondary-container')
                    .each(function(d, i) {
                        var currentSelection = d3.select(this);

                        var selectedIndicators = model.secondaryIndicators[i] ? [model.secondaryIndicators[i]] : [];

                        currentSelection.select('.edit-indicator-container')
                            .datum({selectedIndicators: selectedIndicators})
                            .call(secondaryChartToggle);
                    });
            });
        };

        d3.rebind(overlay, dispatch, 'on');

        return overlay;
    }

    function navigationReset() {

        var dispatch = d3.dispatch(event.resetToLatest);

        function navReset(selection) {
            var model = selection.datum();

            var resetButton = selection.selectAll('g')
              .data([model]);

            resetButton.enter()
              .append('g')
              .attr('class', 'reset-button')
              .on('click', function() { dispatch[event.resetToLatest](); })
              .append('path')
              .attr('d', 'M1.5 1.5h13.438L23 20.218 14.937 38H1.5l9.406-17.782L1.5 1.5z');

            resetButton.classed('active', !model.trackingLatest);
        }

        d3.rebind(navReset, dispatch, 'on');

        return navReset;
    }

    function dropdown() {
        var dispatch = d3.dispatch('optionChange');

        var buttonDataJoin = fc.util.dataJoin()
            .selector('button')
            .element('button')
            .attr({
                'class': 'dropdown-toggle',
                'type': 'button',
                'data-toggle': 'dropdown'
            });

        var caretDataJoin = fc.util.dataJoin()
            .selector('.caret')
            .element('span')
            .attr('class', 'caret');

        var listDataJoin = fc.util.dataJoin()
            .selector('ul')
            .element('ul')
            .attr('class', 'dropdown-menu');

        var listItemsDataJoin = fc.util.dataJoin()
            .selector('li')
            .element('li')
            .key(function(d) { return d.displayString; });

        function dropdown(selection) {
            var model = selection.datum();
            var selectedIndex = model.selectedIndex || 0;
            var config = model.config;

            var button = buttonDataJoin(selection, [model.options]);

            if (config.icon) {
                var dropdownButtonIcon = button.selectAll('.icon')
                    .data([0]);
                dropdownButtonIcon.enter()
                    .append('span');
                dropdownButtonIcon.attr('class', 'icon ' + model.options[selectedIndex].icon);
            } else {
                button.select('.icon').remove();
                button.text(function() {
                    return config.title || model.options[selectedIndex].displayString;
                });
            }

            caretDataJoin(button, config.careted ? [0] : []);

            var list = listDataJoin(selection, [model.options]);

            var listItems = listItemsDataJoin(list, model.options);
            var listItemAnchors = listItems.enter()
                .on('click', dispatch.optionChange)
                .append('a')
                .attr('href', '#');

            listItemAnchors.append('span')
                .attr('class', 'icon');
            listItemAnchors.append('span')
                .attr('class', 'name');

            listItems.selectAll('.icon')
                .attr('class', function(d) { return 'icon ' + d.icon; });
            listItems.selectAll('.name')
                .text(function(d) { return d.displayString; });
        }

        d3.rebind(dropdown, dispatch, 'on');

        return dropdown;
    }

    function selectors() {
        var dispatch = d3.dispatch(
            event.primaryChartSeriesChange,
            event.primaryChartIndicatorChange,
            event.secondaryChartChange);

        var primaryChartSeriesButtons = dropdown()
            .on('optionChange', dispatch[event.primaryChartSeriesChange]);

        var indicatorToggle = dropdown()
            .on('optionChange', function(indicator) {
                if (indicator.isPrimary) {
                    dispatch[event.primaryChartIndicatorChange](indicator);
                } else {
                    dispatch[event.secondaryChartChange](indicator);
                }
            });

        var selectors = function(selection) {
            selection.each(function(model) {
                var container = d3.select(this);

                var selectedSeriesIndex = model.seriesSelector.options.map(function(option) {
                    return option.isSelected;
                }).indexOf(true);

                container.select('#series-dropdown')
                    .datum({
                        config: model.seriesSelector.config,
                        options: model.seriesSelector.options,
                        selectedIndex: selectedSeriesIndex
                    })
                    .call(primaryChartSeriesButtons);

                var options = model.indicatorSelector.options;

                var selectedIndicatorIndexes = options
                    .map(function(option, index) {
                        return option.isSelected ? index : null;
                    })
                    .filter(function(option) {
                        return option;
                    });

                container.select('#indicator-dropdown')
                    .datum({
                        config: model.indicatorSelector.config,
                        options: options,
                        selected: selectedIndicatorIndexes
                    })
                    .call(indicatorToggle);

            });
        };

        d3.rebind(selectors, dispatch, 'on');

        return selectors;
    }

    // Generates a menu option similar to those generated by sc.model.menu.option from a sc.model.data.product object
    function productAdaptor(product) {
        return {
            displayString: product.display,
            option: product
        };
    }

    // Generates a menu option similar to those generated by model.menu.option from a model.data.period object
    function periodAdaptor(period) {
        return {
            displayString: period.display,
            option: period
        };
    }

    function tabGroup() {
        var dispatch = d3.dispatch('tabClick');
        var dataJoin = fc.util.dataJoin()
          .selector('ul')
          .element('ul');

        function tabGroup(selection) {
            var selectedIndex = selection.datum().selectedIndex || 0;

            var ul = dataJoin(selection, [selection.datum().options]);

            ul.enter()
                .append('ul');

            var li = ul.selectAll('li')
                .data(fc.util.fn.identity);

            li.enter()
                .append('li')
                .append('a')
                .attr('href', '#')
                .on('click', dispatch.tabClick);

            li.classed('active', function(d, i) { return i === selectedIndex; })
                .select('a')
                .text(function(option) { return option.displayString; });

            li.exit()
                .remove();
        }

        d3.rebind(tabGroup, dispatch, 'on');
        return tabGroup;
    }

    function head() {

        var dispatch = d3.dispatch(
            event.dataProductChange,
            event.dataPeriodChange,
            event.clearAllPrimaryChartIndicatorsAndSecondaryCharts);

        var dataProductDropdown = dropdown()
            .on('optionChange', dispatch[event.dataProductChange]);

        var dataPeriodSelector = tabGroup()
            .on('tabClick', dispatch[event.dataPeriodChange]);

        var dropdownPeriodSelector = dropdown()
            .on('optionChange', dispatch[event.dataPeriodChange]);

        var head = function(selection) {
            selection.each(function(model) {
                var container = d3.select(this);

                var products = model.products;
                container.select('#product-dropdown')
                    .datum({
                        config: model.productConfig,
                        options: products.map(productAdaptor),
                        selectedIndex: products.map(function(p) { return p.id; }).indexOf(model.selectedProduct.id)
                    })
                    .call(dataProductDropdown);

                var periods = model.selectedProduct.periods;
                container.select('#period-selector')
                    .classed('hidden', periods.length <= 1) // TODO: get from model instead?
                    .datum({
                        options: periods.map(periodAdaptor),
                        selectedIndex: periods.indexOf(model.selectedPeriod)
                    })
                    .call(dataPeriodSelector);

                container.select('#mobile-period-selector')
                    .classed('hidden', periods.length <= 1)
                    .datum({
                        config: model.mobilePeriodConfig,
                        options: periods.map(periodAdaptor),
                        selectedIndex: periods.indexOf(model.selectedPeriod)
                    })
                    .call(dropdownPeriodSelector);

                container.select('#clear-indicators')
                    .on('click', dispatch[event.clearAllPrimaryChartIndicatorsAndSecondaryCharts]);
            });
        };

        d3.rebind(head, dispatch, 'on');

        return head;
    }

    var menu = {
        head: head,
        selectors: selectors,
        navigationReset: navigationReset,
        overlay: overlay
    };

    function callbackInvalidator() {
        var n = 0;

        function callbackInvalidator(callback) {
            var id = ++n;
            return function(err, data) {
                if (id < n) { return; }
                callback(err, data);
            };
        }

        callbackInvalidator.invalidateCallback = function() {
            n++;
            return callbackInvalidator;
        };

        return callbackInvalidator;
    }

    function collectOhlc() {

        var date = function(d) { return d.date; };
        var volume = function(d) { return Number(d.volume); };
        var price = function(d) { return Number(d.price); };
        var granularity = 60;

        function getBucketStart(tradeDate) {
            var granularityInMs = granularity * 1000;
            return new Date(Math.floor(tradeDate.getTime() / granularityInMs) * granularityInMs);
        }

        var collectOhlc = function(data, trade) {
            var bucketStart = getBucketStart(date(trade));
            var tradePrice = price(trade);
            var tradeVolume = volume(trade);
            var bisectDate = d3.bisector(function(d) { return d.date; }).left;
            var existing = data.filter(function(d) {
                return d.date.getTime() === bucketStart.getTime();
            })[0];
            if (existing) {
                existing.high = Math.max(tradePrice, existing.high);
                existing.low = Math.min(tradePrice, existing.low);
                existing.close = tradePrice;
                existing.volume += tradeVolume;
            } else {
                data.splice(bisectDate(data, bucketStart), 0, {
                    date: bucketStart,
                    open: tradePrice,
                    high: tradePrice,
                    low: tradePrice,
                    close: tradePrice,
                    volume: tradeVolume
                });
            }
        };

        collectOhlc.granularity = function(x) {
            if (!arguments.length) {
                return granularity;
            }
            granularity = x;
            return collectOhlc;
        };

        collectOhlc.price = function(x) {
            if (!arguments.length) {
                return price;
            }
            price = x;
            return collectOhlc;
        };

        collectOhlc.volume = function(x) {
            if (!arguments.length) {
                return volume;
            }
            volume = x;
            return collectOhlc;
        };

        collectOhlc.date = function(x) {
            if (!arguments.length) {
                return date;
            }
            date = x;
            return collectOhlc;
        };

        return collectOhlc;
    }

    function dataInterface() {
        var dispatch = d3.dispatch(
            event.newTrade,
            event.historicDataLoaded,
            event.historicFeedError,
            event.streamingFeedError,
            event.streamingFeedClose);

        var _collectOhlc = collectOhlc()
            .date(function(d) {return new Date(d.time); })
            .volume(function(d) {return Number(d.size); });

        var source,
            callbackGenerator = callbackInvalidator(),
            candlesOfData = 200,
            data = [];

        function invalidate() {
            if (source && source.streamingFeed) {
                source.streamingFeed.close();
            }
            data = [];
            callbackGenerator.invalidateCallback();
        }

        function dateSortAscending(dataToSort) {
            return dataToSort.sort(function(a, b) {
                return a.date - b.date;
            });
        }

        function handleStreamingFeedEvents() {
            if (source.streamingFeed != null) {
                source.streamingFeed.on('message', function(trade) {
                    _collectOhlc(data, trade);
                    dispatch[event.newTrade](data, source);
                })
                .on('error', function(streamingFeedError) {
                    dispatch[event.streamingFeedError](streamingFeedError, source);
                })
                .on('close', function(closeEvent) {
                    dispatch[event.streamingFeedClose](closeEvent, source);
                });
                source.streamingFeed();
            }
        }

        function dataInterface(granularity, product) {
            invalidate();

            if (arguments.length === 2) {
                source = product.source;
                source.historicFeed.product(product.id);

                if (source.streamingFeed != null) {
                    source.streamingFeed.product(product.id);
                }
            }

            var now = new Date();

            source.historicFeed.end(now)
                .candles(candlesOfData)
                .granularity(granularity);

            _collectOhlc.granularity(granularity);

            source.historicFeed(callbackGenerator(function(historicFeedError, newData) {
                if (!historicFeedError) {
                    data = dateSortAscending(newData);
                    dispatch[event.historicDataLoaded](data, source);
                    handleStreamingFeedEvents();
                } else {
                    dispatch[event.historicFeedError](historicFeedError, source);
                }
            }));
        }

        d3.rebind(dataInterface, dispatch, 'on');

        return dataInterface;
    }

    function toast() {

        var dispatch = d3.dispatch(event.notificationClose);

        var panelDataJoin = fc.util.dataJoin()
            .selector('div.alert-content')
            .element('div')
            .attr('class', 'alert-content');

        var toastDataJoin = fc.util.dataJoin()
            .selector('div.alert')
            .element('div')
            .attr({'class': 'alert alert-info alert-dismissible', 'role': 'alert'})
            .key(function(d) { return d.id; });

        var toast = function(selection) {
            selection.each(function(model) {
                var container = d3.select(this);

                var panel = panelDataJoin(container, [model]);
                panel.enter().html('<div class="messages"></div>');

                var toasts = toastDataJoin(panel.select('.messages'), model.messages);

                var toastsEnter = toasts.enter();
                toastsEnter.html(
                    '<button type="button" class="close" aria-label="Close"> \
                    <span aria-hidden="true">&times;</span> \
                </button> \
                <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> \
                <span class="sr-only">Error:</span> \
                <span class="message"></span>');

                toastsEnter.select('.close')
                    .on('click', function(d) { dispatch[event.notificationClose](d.id); });

                toasts.select('.message')
                    .text(function(d) { return d.message; });
            });
        };

        d3.rebind(toast, dispatch, 'on');

        return toast;
    }

    var notification = {
        toast: toast
    };

    function message(message) {
        return {
            id: util.uid(),
            message: message
        };
    }

    function source(historicFeed, historicNotificationFormatter, streamingFeed, streamingNotificationFormatter) {
        return {
            historicFeed: historicFeed,
            historicNotificationFormatter: historicNotificationFormatter,
            streamingFeed: streamingFeed,
            streamingNotificationFormatter: streamingNotificationFormatter
        };
    }

    function product(id, display, periods, source, volumeFormat, priceFormat) {
        return {
            id: id,
            display: display || 'Unspecified Product',
            priceFormat: d3.format(priceFormat || '.2f'),
            volumeFormat: d3.format(volumeFormat || '.2f'),
            periods: periods || [],
            source: source
        };
    }

    function period(display, seconds, d3TimeInterval, timeFormat) {
        return {
            display: display || '1 day',
            seconds: seconds || 60 * 60 * 24,
            d3TimeInterval: d3TimeInterval || {unit: d3.time.day, value: 1},
            timeFormat: d3.time.format(timeFormat || '%b %d')
        };
    }

    var data = {
        period: period,
        product: product,
        source: source
    };

    function webSocketCloseEventFormatter(event) {
        var message;
        if (event.wasClean === false && event.code !== 1000 && event.code !== 1006) {
            var reason = event.reason || 'Unkown reason.';
            message = 'Disconnected from live stream: ' + event.code + ' ' + reason;
        }
        return message;
    }

    function coinbaseStreamingErrorResponseFormatter(event) {
        var message;
        if (event.type === 'error' && event.message) {
            message = 'Live stream error: ' + event.message;
        } else if (event.type === 'close') {
            // The WebSocket's error event doesn't contain much useful information,
            // so the close event is used to report errors instead
            message = webSocketCloseEventFormatter(event);
        }
        return message;
    }

    function messages() {
        return {
            messages: []
        };
    }

    var notification$1 = {
        message: message,
        messages: messages
    };

    function xAxis$1(initialPeriod) {
        return {
            viewDomain: [],
            period: initialPeriod
        };
    }

    function secondary$1(initialProduct) {
        return {
            data: [],
            viewDomain: [],
            trackingLatest: true,
            product: initialProduct
        };
    }

    function primary$1(initialProduct) {
        var model = {
            data: [],
            trackingLatest: true,
            viewDomain: [],
            selectorsChanged: true
        };

        var _product = initialProduct;
        Object.defineProperty(model, 'product', {
            get: function() { return _product; },
            set: function(newValue) {
                _product = newValue;
                model.selectorsChanged = true;
            }
        });

        var candlestick = candlestickSeries();
        candlestick.id = util.uid();
        var _series = option('Candlestick', 'candlestick', candlestick);
        Object.defineProperty(model, 'series', {
            get: function() { return _series; },
            set: function(newValue) {
                _series = newValue;
                model.selectorsChanged = true;
            }
        });

        var _yValueAccessor = {option: function(d) { return d.close; }};
        Object.defineProperty(model, 'yValueAccessor', {
            get: function() { return _yValueAccessor; },
            set: function(newValue) {
                _yValueAccessor = newValue;
                model.selectorsChanged = true;
            }
        });

        var _indicators = [];
        Object.defineProperty(model, 'indicators', {
            get: function() { return _indicators; },
            set: function(newValue) {
                _indicators = newValue;
                model.selectorsChanged = true;
            }
        });

        return model;
    }

    function navigationReset$1() {
        return {
            trackingLatest: true
        };
    }

    function nav$1() {
        return {
            data: [],
            viewDomain: [],
            trackingLatest: true
        };
    }

    function legend$1(initialProduct, initialPeriod) {
        return {
            data: undefined,
            product: initialProduct,
            period: initialPeriod
        };
    }

    var chart$1 = {
        legend: legend$1,
        nav: nav$1,
        navigationReset: navigationReset$1,
        primary: primary$1,
        secondary: secondary$1,
        xAxis: xAxis$1
    };

    function selector(config, options) {
        return {
            config: config,
            options: options
        };
    }

    function dropdownConfig(title, careted, listIcons, icon) {
        return {
            title: title || null,
            careted: careted || false,
            listIcons: listIcons || false,
            icon: icon || false
        };
    }

    function overlay$1() {
        return {
            primaryIndicators: [],
            secondaryIndicators: []
        };
    }

    function head$1(initialProducts, initialSelectedProduct, initialSelectedPeriod) {
        return {
            productConfig: dropdownConfig(null, true),
            mobilePeriodConfig: dropdownConfig(),
            products: initialProducts,
            selectedProduct: initialSelectedProduct,
            selectedPeriod: initialSelectedPeriod,
            alertMessages: []
        };
    }

    var menu$1 = {
        head: head$1,
        periodAdaptor: periodAdaptor,
        productAdaptor: productAdaptor,
        overlay: overlay$1,
        dropdownConfig: dropdownConfig,
        option: option,
        selector: selector
    };

    var model = {
        menu: menu$1,
        chart: chart$1,
        data: data,
        notification: notification$1
    };

    function dataGeneratorAdaptor() {

        var dataGenerator = fc.data.random.financial(),
            allowedPeriods = [60 * 60 * 24],
            candles,
            end,
            granularity,
            product = null;

        var dataGeneratorAdaptor = function(cb) {
            end.setHours(0, 0, 0, 0);
            var millisecondsPerDay = 24 * 60 * 60 * 1000;
            dataGenerator.startDate(new Date(end - (candles - 1) * millisecondsPerDay));

            var data = dataGenerator(candles);
            cb(null, data);
        };

        dataGeneratorAdaptor.candles = function(x) {
            if (!arguments.length) {
                return candles;
            }
            candles = x;
            return dataGeneratorAdaptor;
        };

        dataGeneratorAdaptor.end = function(x) {
            if (!arguments.length) {
                return end;
            }
            end = x;
            return dataGeneratorAdaptor;
        };

        dataGeneratorAdaptor.granularity = function(x) {
            if (!arguments.length) {
                return granularity;
            }
            if (allowedPeriods.indexOf(x) === -1) {
                throw new Error('Granularity of ' + x + ' is not supported. '
                 + 'Random Financial Data Generator only supports daily data.');
            }
            granularity = x;
            return dataGeneratorAdaptor;
        };

        dataGeneratorAdaptor.product = function(x) {
            if (!arguments.length) {
                return dataGeneratorAdaptor;
            }
            if (x !== null) {
                throw new Error('Random Financial Data Generator does not support products.');
            }
            product = x;
            return dataGeneratorAdaptor;
        };

        return dataGeneratorAdaptor;
    }

    // Inspired by underscore library implementation of debounce

    function debounce(func, wait, immediate) {
        var timeout;
        var args;
        var timestamp;
        var result;

        var later = function() {
            var last = new Date().getTime() - timestamp;

            if (last < wait && last >= 0) {
                timeout = setTimeout(later.bind(this), wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(this, args);
                    args = null;
                }
            }
        };

        return function() {
            args = arguments;
            timestamp = new Date().getTime();
            var callNow = immediate && !timeout;

            if (!timeout) {
                timeout = setTimeout(later.bind(this), wait);
            }
            if (callNow) {
                result = func.apply(this, args);
                args = null;
            }

            return result;
        };
    }

    function coinbaseAdaptor() {
        var rateLimit = 1000;       // The coinbase API has a limit of 1 request per second

        var historicFeed = fc.data.feed.coinbase(),
            candles;

        var coinbaseAdaptor = debounce(function coinbaseAdaptor(cb) {
            var startDate = d3.time.second.offset(historicFeed.end(), -candles * historicFeed.granularity());
            historicFeed.start(startDate);
            historicFeed(cb);
        }, rateLimit);

        coinbaseAdaptor.candles = function(x) {
            if (!arguments.length) {
                return candles;
            }
            candles = x;
            return coinbaseAdaptor;
        };

        d3.rebind(coinbaseAdaptor, historicFeed, 'end', 'granularity', 'product');

        return coinbaseAdaptor;
    }

    function coinbaseHistoricErrorResponseFormatter(responseObject) {
        var message;
        if (responseObject) {
            message = responseObject.message;
        }
        return message;
    }

    // https://docs.exchange.coinbase.com/#websocket-feed

    function coinbaseWebSocket() {

        var product = 'BTC-USD';
        var dispatch = d3.dispatch('open', 'close', 'error', 'message');
        var messageType = 'match';
        var socket;

        var webSocket = function(url, subscribe) {
            url = url || 'wss://ws-feed.exchange.coinbase.com';
            subscribe = subscribe || {
                'type': 'subscribe',
                'product_id': product
            };

            socket = new WebSocket(url);

            socket.onopen = function(event) {
                socket.send(JSON.stringify(subscribe));
                dispatch.open(event);
            };
            socket.onerror = function(event) {
                dispatch.error(event);
            };
            socket.onclose = function(event) {
                dispatch.close(event);
            };
            socket.onmessage = function(event) {
                var msg = JSON.parse(event.data);
                if (msg.type === messageType) {
                    dispatch.message(msg);
                } else if (msg.type === 'error') {
                    dispatch.error(msg);
                }
            };
        };

        d3.rebind(webSocket, dispatch, 'on');

        webSocket.close = function() {
            // Only close the WebSocket if it is opening or open
            if (socket && (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN)) {
                socket.close();
            }
        };

        webSocket.messageType = function(x) {
            if (!arguments.length) {
                return messageType;
            }
            messageType = x;
            return webSocket;
        };

        webSocket.product = function(x) {
            if (!arguments.length) {
                return product;
            }
            product = x;
            return webSocket;
        };

        return webSocket;
    }

    function quandlAdaptor() {

        var historicFeed = fc.data.feed.quandl(),
            granularity,
            candles;

        // More options are allowed through the API; for now, only support daily and weekly
        var allowedPeriods = d3.map();
        allowedPeriods.set(60 * 60 * 24, 'daily');
        allowedPeriods.set(60 * 60 * 24 * 7, 'weekly');

        function quandlAdaptor(cb) {
            var startDate = d3.time.second.offset(historicFeed.end(), -candles * granularity);
            historicFeed.start(startDate)
                .collapse(allowedPeriods.get(granularity));
            historicFeed(cb);
        }

        quandlAdaptor.candles = function(x) {
            if (!arguments.length) {
                return candles;
            }
            candles = x;
            return quandlAdaptor;
        };

        quandlAdaptor.granularity = function(x) {
            if (!arguments.length) {
                return granularity;
            }
            if (!allowedPeriods.has(x)) {
                throw new Error('Granularity of ' + x + ' is not supported.');
            }
            granularity = x;
            return quandlAdaptor;
        };

        fc.util.rebind(quandlAdaptor, historicFeed, {
            end: 'end',
            product: 'dataset'
        });

        return quandlAdaptor;
    }

    function quandlHistoricErrorResponseFormatter(responseObject) {
        var message;
        if (responseObject && responseObject.quandl_error) {
            message = responseObject.quandl_error.message;
        }
        return message;
    }

    function coinbaseGetProducts(callback) {
        d3.json('https://api.exchange.coinbase.com/products', function(error, response) {
            if (error) {
                callback(error);
                return;
            }
            callback(error, response);
        });
    }

    function coninbaseFormatProducts(products, source, defaultPeriods, productPeriodOverrides) {
        return products.map(function(product) {
            return model.data.product(product.id, product.id,
                productPeriodOverrides.get(product.id) || defaultPeriods, source);
        });
    }

    function initialiseModel(app) {
        var initialModel = {};

        function initPeriods() {
            return {
                week1: model.data.period('Weekly', 60 * 60 * 24 * 7, {unit: d3.time.week, value: 1}, '%b %d'),
                day1: model.data.period('Daily', 60 * 60 * 24, {unit: d3.time.day, value: 1}, '%b %d'),
                hour1: model.data.period('1 Hr', 60 * 60, {unit: d3.time.hour, value: 1}, '%b %d %Hh'),
                minute5: model.data.period('5 Min', 60 * 5, {unit: d3.time.minute, value: 5}, '%H:%M'),
                minute1: model.data.period('1 Min', 60, {unit: d3.time.minute, value: 1}, '%H:%M')
            };
        }

        function initSources() {
            return {
                generated: model.data.source(dataGeneratorAdaptor(), null, null),
                bitcoin: model.data.source(coinbaseAdaptor(), coinbaseHistoricErrorResponseFormatter, coinbaseWebSocket(),
                    coinbaseStreamingErrorResponseFormatter),
                quandl: model.data.source(quandlAdaptor(), quandlHistoricErrorResponseFormatter, null, null)
            };
        }

        function initProducts() {
            return {
                generated: model.data.product(null, 'Data Generator', [periods.day1], sources.generated, '.3s'),
                quandl: model.data.product('GOOG', 'GOOG', [periods.day1, periods.week1], sources.quandl, '.3s')
            };
        }

        function initSeriesSelector() {
            var candlestick = candlestickSeries();
            candlestick.id = util.uid();

            var candlestickOption = model.menu.option('Candlestick', 'candlestick',
                candlestick, 'sc-icon-candlestick-series');
            candlestickOption.isSelected = true;

            var ohlc = fc.series.ohlc();
            ohlc.id = util.uid();

            var line = fc.series.line();
            line.id = util.uid();

            var point = fc.series.point();
            point.id = util.uid();

            var area = fc.series.area();
            area.id = util.uid();

            var config = model.menu.dropdownConfig(null, false, true, true);

            var options = [
                candlestickOption,
                model.menu.option('OHLC', 'ohlc', ohlc, 'sc-icon-ohlc-series'),
                model.menu.option('Line', 'line', line, 'sc-icon-line-series'),
                model.menu.option('Point', 'point', point, 'sc-icon-point-series'),
                model.menu.option('Area', 'area', area, 'sc-icon-area-series')
            ];

            return model.menu.selector(config, options);
        }

        function initIndicatorOptions() {
            var secondary = chart.secondary;

            var movingAverage = fc.series.line()
                .decorate(function(select) {
                    select.enter()
                        .classed('movingAverage', true);
                })
                .yValue(function(d) { return d.movingAverage; });
            movingAverage.id = util.uid();

            var bollingerBands = fc.indicator.renderer.bollingerBands();
            bollingerBands.id = util.uid();

            var indicators = [
                model.menu.option('Moving Average', 'movingAverage',
                    movingAverage, 'sc-icon-moving-average-indicator', true),
                model.menu.option('Bollinger Bands', 'bollinger',
                    bollingerBands, 'sc-icon-bollinger-bands-indicator', true),
                model.menu.option('Relative Strength Index', 'secondary-rsi',
                    secondary.rsi(), 'sc-icon-rsi-indicator', false),
                model.menu.option('MACD', 'secondary-macd',
                    secondary.macd(), 'sc-icon-macd-indicator', false),
                model.menu.option('Volume', 'secondary-volume',
                    secondary.volume(), 'sc-icon-bar-series', false)
            ];

            return indicators;
        }

        function initIndicatorSelector() {
            var config = model.menu.dropdownConfig('Add Indicator', false, true);

            return model.menu.selector(config, initIndicatorOptions());
        }

        function initSelectors() {
            return {
                seriesSelector: initSeriesSelector(),
                indicatorSelector: initIndicatorSelector()
            };
        }

        var periods = initPeriods();
        var sources = initSources();
        var products = initProducts();

        coinbaseGetProducts(function(error, bitcoinProducts) {
            if (error) {
                var statusText = error.statusText || 'Unknown reason.';
                var message$$ = 'Error retrieving Coinbase products: ' + statusText;
                app.updateModel(function(appModel) {
                    appModel.notificationMessages.messages.unshift(message(message$$));
                });
            } else {
                var defaultPeriods = [periods.hour1, periods.day1];
                var productPeriodOverrides = d3.map();
                productPeriodOverrides.set('BTC-USD', [periods.minute1, periods.minute5, periods.hour1, periods.day1]);
                var formattedProducts = coninbaseFormatProducts(bitcoinProducts, sources.bitcoin, defaultPeriods, productPeriodOverrides);

                app.updateModel(function(appModel) {
                    appModel.headMenu.products = appModel.headMenu.products.concat(formattedProducts);
                });
            }
        });

        initialModel.periods = periods; // TODO: remove if unused
        initialModel.sources = sources; // TODO: remove if unused
        initialModel.primaryChart = model.chart.primary(products.generated);
        initialModel.secondaryChart = model.chart.secondary(products.generated);
        initialModel.selectors = initSelectors();
        initialModel.xAxis = model.chart.xAxis(periods.day1);
        initialModel.nav = model.chart.nav();
        initialModel.navReset = model.chart.navigationReset();
        initialModel.headMenu = model.menu.head([products.generated, products.quandl], products.generated, periods.day1);
        initialModel.legend = model.chart.legend(products.generated, periods.day1);
        initialModel.overlay = model.menu.overlay();
        initialModel.notificationMessages = model.notification.messages();

        return initialModel;
    }

    function app(initialModel) {

        var appTemplate = '<div class="container-fluid"> \
        <div id="notifications"></div> \
        <div class="row head-menu head-row"> \
            <div class="col-md-12 head-sub-row"> \
                <div id="product-dropdown" class="dropdown product-dropdown"></div> \
                <div id="period-selector" class="hidden-xs hidden-sm"></div> \
                <div id="mobile-period-selector" class="hidden-md hidden-lg dropdown"></div> \
                <span id="clear-indicators" class="icon sc-icon-delete delete-button hidden-md hidden-lg"></span> \
            </div> \
        </div> \
        <div class="row primary-row"> \
            <div class="col-md-12" id="loading-status-message"> \
                <p class="content">Loading...</p> \
            </div> \
            <div id="charts" class="col-md-12 hidden"> \
                <div id="charts-container"> \
                    <svg id="primary-container"></svg> \
                    <svg class="secondary-container"></svg> \
                    <svg class="secondary-container"></svg> \
                    <svg class="secondary-container"></svg> \
                    <div class="x-axis-row"> \
                        <svg id="x-axis-container"></svg> \
                    </div> \
                    <div id="navbar-row" class="hidden-xs hidden-sm"> \
                        <svg id="navbar-container"></svg> \
                        <svg id="navbar-reset"></svg> \
                    </div> \
                </div> \
                <div id="overlay"> \
                    <div id="overlay-primary-container"> \
                        <div id="overlay-primary-head"> \
                            <div id="selectors"> \
                                <div id="series-dropdown" class="dropdown selector-dropdown"></div> \
                                <div id="indicator-dropdown" class="dropdown selector-dropdown"></div> \
                            </div> \
                            <div id="legend" class="hidden-xs hidden-sm"></div> \
                        </div> \
                        <div id="overlay-primary-bottom"> \
                            <div class="edit-indicator-container"></div> \
                        </div> \
                    </div> \
                    <div class="overlay-secondary-container"> \
                        <div class="edit-indicator-container"></div> \
                    </div> \
                    <div class="overlay-secondary-container"> \
                        <div class="edit-indicator-container"></div> \
                    </div> \
                    <div class="overlay-secondary-container"> \
                        <div class="edit-indicator-container"></div> \
                    </div> \
                    <div class="x-axis-row"></div> \
                    <div id="overlay-navbar-row" class="hidden-xs hidden-sm"></div> \
                </div> \
            </div> \
        </div> \
    </div>';

        var app = {};

        var containers;

        var model = initialModel || initialiseModel(app);

        var _dataInterface;

        var charts = {
            primary: undefined,
            secondaries: [],
            xAxis: chart.xAxis(),
            navbar: undefined,
            legend: chart.legend()
        };

        var overlay;
        var headMenu;
        var navReset;
        var selectors;
        var toastNotifications;

        var rendered = false;
        function renderInternal() {
            if (!rendered) {
                rendered = true;
            }
            if (layoutRedrawnInNextRender) {
                containers.suspendLayout(false);
            }

            containers.primary.datum(model.primaryChart)
                .call(charts.primary);

            containers.legend.datum(model.legend)
                .call(charts.legend);

            containers.secondaries.datum(model.secondaryChart)
                // TODO: Add component: group of secondary charts.
                // Then also move method layout.getSecondaryContainer into the group.
                .filter(function(d, i) { return i < charts.secondaries.length; })
                .each(function(d, i) {
                    d3.select(this)
                        .attr('class', 'secondary-container ' + charts.secondaries[i].valueString)
                        .call(charts.secondaries[i].option);
                });

            containers.xAxis.datum(model.xAxis)
                .call(charts.xAxis);

            containers.navbar.datum(model.nav)
                .call(charts.navbar);

            containers.app.select('#navbar-reset')
                .datum(model.navReset)
                .call(navReset);

            containers.app.select('.head-menu')
                .datum(model.headMenu)
                .call(headMenu);

            containers.app.select('#selectors')
                .datum(model.selectors)
                .call(selectors);

            containers.app.select('#notifications')
                .datum(model.notificationMessages)
                .call(toastNotifications);

            containers.overlay.datum(model.overlay)
                .call(overlay);

            if (layoutRedrawnInNextRender) {
                containers.suspendLayout(true);
                layoutRedrawnInNextRender = false;
            }
        }

        var render = fc.util.render(renderInternal);

        var layoutRedrawnInNextRender = true;

        function updateLayout() {
            layoutRedrawnInNextRender = true;
            util.layout(containers, charts);
        }

        function initialiseResize() {
            d3.select(window).on('resize', function() {
                updateLayout();
                render();
            });
        }

        function addNotification(message$$) {
            model.notificationMessages.messages.unshift(message(message$$));
        }

        function onViewChange(domain) {
            var viewDomain = [domain[0], domain[1]];
            model.primaryChart.viewDomain = viewDomain;
            model.secondaryChart.viewDomain = viewDomain;
            model.xAxis.viewDomain = viewDomain;
            model.nav.viewDomain = viewDomain;

            var trackingLatest = util.domain.trackingLatestData(
                model.primaryChart.viewDomain,
                model.primaryChart.data);
            model.primaryChart.trackingLatest = trackingLatest;
            model.secondaryChart.trackingLatest = trackingLatest;
            model.nav.trackingLatest = trackingLatest;
            model.navReset.trackingLatest = trackingLatest;
            render();
        }

        function onPrimaryIndicatorChange(indicator) {
            indicator.isSelected = !indicator.isSelected;
            updatePrimaryChartIndicators();
            render();
        }

        function onSecondaryChartChange(_chart) {
            _chart.isSelected = !_chart.isSelected;
            updateSecondaryCharts();
            render();
        }

        function onCrosshairChange(dataPoint) {
            model.legend.data = dataPoint;
            render();
        }

        function onStreamingFeedCloseOrError(streamingEvent, source) {
            var message$$;
            if (source.streamingNotificationFormatter) {
                message$$ = source.streamingNotificationFormatter(streamingEvent);
            } else {
                // #515 (https://github.com/ScottLogic/d3fc-showcase/issues/515)
                // (TODO) prevents errors when formatting streaming close/error messages when product changes.
                // As we only have a coinbase streaming source at the moment, this is a suitable fix for now
                message$$ = coinbaseStreamingErrorResponseFormatter(streamingEvent);
            }
            if (message$$) {
                addNotification(message$$);
                render();
            }
        }

        function resetToLatest() {
            var data = model.primaryChart.data;
            var dataDomain = fc.util.extent()
                .fields('date')(data);
            var navTimeDomain = util.domain.moveToLatest(dataDomain, data, 0.2);
            onViewChange(navTimeDomain);
        }

        function loading(isLoading, error) {
            containers.app.select('#loading-status-message')
                .classed('hidden', !(isLoading || error))
                .select('.content')
                .text(error || 'Loading...');
            containers.app.select('#charts')
                .classed('hidden', isLoading || error);
        }

        function updateModelData(data) {
            model.primaryChart.data = data;
            model.secondaryChart.data = data;
            model.nav.data = data;
        }

        function updateModelSelectedProduct(product) {
            model.headMenu.selectedProduct = product;
            model.primaryChart.product = product;
            model.secondaryChart.product = product;
            model.legend.product = product;
        }

        function updateModelSelectedPeriod(period) {
            model.headMenu.selectedPeriod = period;
            model.xAxis.period = period;
            model.legend.period = period;
        }

        function changeProduct(product) {
            loading(true);
            updateModelSelectedProduct(product);
            updateModelSelectedPeriod(product.periods[0]);
            _dataInterface(product.periods[0].seconds, product);
        }

        function initialisePrimaryChart() {
            return chart.primary()
                .on(event.crosshairChange, onCrosshairChange)
                .on(event.viewChange, onViewChange);
        }

        function initialiseNav() {
            return chart.nav()
                .on(event.viewChange, onViewChange);
        }

        function initialiseNavReset() {
            return menu.navigationReset()
                .on(event.resetToLatest, resetToLatest);
        }

        function initialiseDataInterface() {
            return dataInterface()
                .on(event.newTrade, function(data, source) {
                    updateModelData(data);
                    if (model.primaryChart.trackingLatest) {
                        var newDomain = util.domain.moveToLatest(
                            model.primaryChart.viewDomain,
                            model.primaryChart.data);
                        onViewChange(newDomain);
                    }
                })
                .on(event.historicDataLoaded, function(data, source) {
                    loading(false);
                    updateModelData(data);
                    model.legend.data = null;
                    resetToLatest();
                    updateLayout();
                })
                .on(event.historicFeedError, function(err, source) {
                    loading(false, 'Error loading data. Please make your selection again, or refresh the page.');
                    var responseText = '';
                    try {
                        var responseObject = JSON.parse(err.responseText);
                        var formattedMessage = source.historicNotificationFormatter(responseObject);
                        if (formattedMessage) {
                            responseText = '. ' + formattedMessage;
                        }
                    } catch (e) {
                        responseText = '';
                    }
                    var statusText = err.statusText || 'Unknown reason.';
                    var message$$ = 'Error getting historic data: ' + statusText + responseText;

                    addNotification(message$$);
                    render();
                })
                .on(event.streamingFeedError, onStreamingFeedCloseOrError)
                .on(event.streamingFeedClose, onStreamingFeedCloseOrError);
        }

        function initialiseHeadMenu() {
            return menu.head()
                .on(event.dataProductChange, function(product) {
                    changeProduct(product.option);
                    render();
                })
                .on(event.dataPeriodChange, function(period) {
                    loading(true);
                    updateModelSelectedPeriod(period.option);
                    _dataInterface(period.option.seconds);
                    render();
                })
                .on(event.clearAllPrimaryChartIndicatorsAndSecondaryCharts, function() {
                    model.primaryChart.indicators.forEach(deselectOption);
                    charts.secondaries.forEach(deselectOption);

                    updatePrimaryChartIndicators();
                    updateSecondaryCharts();
                    render();
                });
        }

        function selectOption(option, options) {
            options.forEach(function(_option) {
                _option.isSelected = false;
            });
            option.isSelected = true;
        }

        function deselectOption(option) { option.isSelected = false; }

        function initialiseSelectors() {
            return menu.selectors()
                .on(event.primaryChartSeriesChange, function(series) {
                    model.primaryChart.series = series;
                    selectOption(series, model.selectors.seriesSelector.options);
                    render();
                })
                .on(event.primaryChartIndicatorChange, onPrimaryIndicatorChange)
                .on(event.secondaryChartChange, onSecondaryChartChange);
        }

        function updatePrimaryChartIndicators() {
            model.primaryChart.indicators =
                model.selectors.indicatorSelector.options.filter(function(option) {
                    return option.isSelected && option.isPrimary;
                });

            model.overlay.primaryIndicators = model.primaryChart.indicators;
        }

        function updateSecondaryCharts() {
            charts.secondaries =
                model.selectors.indicatorSelector.options.filter(function(option) {
                    return option.isSelected && !option.isPrimary;
                });
            // TODO: This doesn't seem to be a concern of menu.
            charts.secondaries.forEach(function(chartOption) {
                chartOption.option.on(event.viewChange, onViewChange);
            });

            model.overlay.secondaryIndicators = charts.secondaries;
            // TODO: Remove .remove! (could a secondary chart group component manage this?).
            containers.secondaries.selectAll('*').remove();
            updateLayout();
        }

        function initialiseOverlay() {
            return menu.overlay()
                .on(event.primaryChartIndicatorChange, onPrimaryIndicatorChange)
                .on(event.secondaryChartChange, onSecondaryChartChange);
        }

        function onNotificationClose(id) {
            model.notificationMessages.messages = model.notificationMessages.messages.filter(function(message$$) { return message$$.id !== id; });
            render();
        }

        function initialiseNotifications() {
            return notification.toast()
                .on(event.notificationClose, onNotificationClose);
        }

        app.updateModel = function(callback) {
            callback.call(this, model);
            if (rendered) {
                render();
            }
        };

        app.changeQuandlProduct = function(productString) {
            var product = data.product(productString, productString, [model.periods.day1], model.sources.quandl, '.3s');
            var existsInHeadMenuProducts = model.headMenu.products.some(function(p) { return p.id === product.id; });

            if (!existsInHeadMenuProducts) {
                model.headMenu.products.push(product);
            }

            changeProduct(product);

            if (rendered) {
                render();
            }
        };

        app.run = function(element) {
            var appContainer = d3.select(element);
            // TODO: Could potentially use d3.html() to load the html from an external file
            appContainer.html(appTemplate);

            var chartsContainer = appContainer.select('#charts-container');
            var overlayContainer = appContainer.select('#overlay');
            containers = {
                app: appContainer,
                charts: chartsContainer,
                primary: chartsContainer.select('#primary-container'),
                secondaries: chartsContainer.selectAll('.secondary-container'),
                xAxis: chartsContainer.select('#x-axis-container'),
                navbar: chartsContainer.select('#navbar-container'),
                overlay: overlayContainer,
                overlaySecondaries: overlayContainer.selectAll('.overlay-secondary-container'),
                legend: appContainer.select('#legend'),
                suspendLayout: function(value) {
                    var self = this;
                    Object.keys(self).forEach(function(key) {
                        if (typeof self[key] !== 'function') {
                            self[key].layoutSuspended(value);
                        }
                    });
                }
            };

            charts.primary = initialisePrimaryChart();
            charts.navbar = initialiseNav();

            _dataInterface = initialiseDataInterface();
            headMenu = initialiseHeadMenu();
            navReset = initialiseNavReset();
            selectors = initialiseSelectors();
            overlay = initialiseOverlay();
            toastNotifications = initialiseNotifications();

            updateLayout();
            initialiseResize();
            _dataInterface(model.headMenu.selectedPeriod.seconds, model.headMenu.selectedProduct);
        };

        return app;
    }

    var sc = {
        app: app
    };

    return sc;

}));
//# sourceMappingURL=sc.js.map