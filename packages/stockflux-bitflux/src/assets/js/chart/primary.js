import d3 from 'd3';
import fc from 'd3fc';
import util from '../util/util';
import event from '../event';
import zoomBehavior from '../behavior/zoom';

function calculateCloseAxisTagPath(width, height) {
  var h2 = height / 2;
  return [[0, 0], [h2, -h2], [width, -h2], [width, h2], [h2, h2], [0, 0]];
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

function getExtentAccessors(multiSeries) {
  return multiSeries.reduce(function(extentAccessors, series) {
    if (series.extentAccessor) {
      return extentAccessors.concat(series.extentAccessor);
    } else {
      return extentAccessors;
    }
  }, []);
}

export default function() {
  var yAxisWidth = 60;
  var dispatch = d3.dispatch(event.viewChange, event.crosshairChange);

  var currentSeries;
  var currentYValueAccessor = function(d) {
    return d.close;
  };
  var currentIndicators = [];
  var zoomWidth;

  var crosshairData = [];
  var crosshair = fc.tool
    .crosshair()
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

  var gridlines = fc.annotation.gridline().xTicks(0);
  var closeLine = fc.annotation
    .line()
    .orient('horizontal')
    .value(currentYValueAccessor)
    .label('')
    .decorate(function(g) {
      g.classed('close-line', true);
    });
  closeLine.id = util.uid();

  var multi = fc.series
    .multi()
    .key(function(series) {
      return series.id;
    })
    .mapping(function(series) {
      switch (series) {
        case closeLine:
          return [this.data[this.data.length - 1]];
        case crosshair:
          return crosshairData;
        default:
          return this.visibleData;
      }
    })
    .decorate(function(selection) {
      selection
        .enter()
        .select('.area')
        .attr('fill', 'url("#primary-area-series-gradient")');
    });

  var xScale = fc.scale.dateTime();
  var yScale = d3.scale.linear();

  var primaryChart = fc.chart
    .cartesian(xScale, yScale)
    .xTicks(0)
    .yOrient('right')
    .margin({
      top: 0,
      left: 0,
      bottom: 0,
      right: yAxisWidth
    })
    .decorate(function(selection) {
      selection
        .enter()
        .selectAll('defs')
        .data([0])
        .enter()
        .append('defs')
        .html(
          '<linearGradient id="primary-area-series-gradient" x1="0%" x2="0%" y1="0%" y2="100%"> \
                      <stop offset="0%" class="primary-area-series-gradient-top" /> \
                      <stop offset="100%" class="primary-area-series-gradient-bottom" /> \
                  </linearGradient>'
        );
    });

  // Create and apply the Moving Average
  var movingAverage = fc.indicator.algorithm.movingAverage();
  var bollingerAlgorithm = fc.indicator.algorithm.bollingerBands();

  function updateMultiSeries() {
    var baseChart = [gridlines, currentSeries.option, closeLine];
    var indicators = currentIndicators.map(function(indicator) {
      return indicator.option;
    });
    return baseChart.concat(indicators, crosshair);
  }

  function updateYValueAccessorUsed() {
    movingAverage.value(currentYValueAccessor);
    bollingerAlgorithm.value(currentYValueAccessor);
    closeLine.value(currentYValueAccessor);
    switch (currentSeries.valueString) {
      case 'line':
      case 'point':
        currentSeries.option.yValue(currentYValueAccessor);
        break;
      case 'area':
        currentSeries.option.yValue(currentYValueAccessor);
        currentSeries.option.y0Value(function() {
          return yScale.domain()[0];
        });
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
      selection.classed('band', true);

      selection.selectAll('.vertical > line').style('stroke-width', width);
    });
  }

  function lineCrosshair(selection) {
    selection
      .classed('band', false)
      .selectAll('line')
      .style('stroke-width', null);
  }
  function updateCrosshairDecorate(data) {
    if (
      currentSeries.valueString === 'candlestick' ||
      currentSeries.valueString === 'ohlc'
    ) {
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

    xScale.discontinuityProvider(model.discontinuityProvider);

    crosshair.snap(
      fc.util.seriesPointSnapXOnly(currentSeries.option, model.visibleData)
    );
    updateCrosshairDecorate(model.visibleData);

    movingAverage(model.data);
    bollingerAlgorithm(model.data);

    // Scale y axis
    // Add percentage padding either side of extreme high/lows
    var extentAccessors = getExtentAccessors(multi.series());
    var paddedYExtent = fc.util
      .extent()
      .fields(extentAccessors)
      .pad(0.08)(model.visibleData);
    primaryChart.yDomain(paddedYExtent);

    // Find current tick values and add close price to this list, then set it explicitly below
    var latestPrice = currentYValueAccessor(model.data[model.data.length - 1]);
    var tickValuesWithAnnotations = produceAnnotatedTickValues(yScale, [
      latestPrice
    ]);
    primaryChart.yTickValues(tickValuesWithAnnotations).yDecorate(function(s) {
      var closePriceTick = s
        .filter(function(d) {
          return d === latestPrice;
        })
        .classed('close-line', true);

      var calloutHeight = 18;
      closePriceTick.select('path').attr('d', function() {
        return d3.svg.area()(calculateCloseAxisTagPath(yAxisWidth, calloutHeight));
      });
      closePriceTick
        .select('text')
        .attr('transform', 'translate(' + calloutHeight / 2 + ',1)');
    });

    var tickValuesWithoutAnnotations = yScale.ticks.apply(yScale, []);
    gridlines.yTickValues(tickValuesWithoutAnnotations);

    // Redraw
    primaryChart.plotArea(multi);
    selection.call(primaryChart);

    var zoom = zoomBehavior(zoomWidth)
      .scale(xScale)
      .trackingLatest(model.trackingLatest)
      .discontinuityProvider(model.discontinuityProvider)
      .dataDateExtent(fc.util.extent().fields(['date'])(model.data))
      .on('zoom', function(domain) {
        dispatch[event.viewChange](domain);
      });

    selection.select('.plot-area').call(zoom);
  }

  d3.rebind(primary, dispatch, 'on');

  // Call when the main layout is modified
  primary.dimensionChanged = function(container) {
    zoomWidth = util.width(container.node()) - yAxisWidth;
  };

  return primary;
}
