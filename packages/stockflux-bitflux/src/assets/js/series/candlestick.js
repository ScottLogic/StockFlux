import d3 from 'd3';
import fc from 'd3fc';

export default function() {
  var xScale = fc.scale.dateTime();
  var yScale = d3.scale.linear();
  var barWidth = fc.util.fractionalBarWidth(0.75);
  var xValue = function(d) {
    return d.date;
  };
  var xValueScaled = function(d, i) {
    return xScale(xValue(d, i));
  };
  var yLowValue = function(d) {
    return d.low;
  };
  var yHighValue = function(d) {
    return d.high;
  };
  var yCloseValue = function(d) {
    return d.close;
  };

  var candlestickSvg = fc.svg
    .candlestick()
    .x(function(d) {
      return xScale(d.date);
    })
    .open(function(d) {
      return yScale(d.open);
    })
    .high(function(d) {
      return yScale(yHighValue(d));
    })
    .low(function(d) {
      return yScale(yLowValue(d));
    })
    .close(function(d) {
      return yScale(d.close);
    });

  var upDataJoin = fc.util
    .dataJoin()
    .selector('path.up')
    .element('path')
    .attr('class', 'up');

  var downDataJoin = fc.util
    .dataJoin()
    .selector('path.down')
    .element('path')
    .attr('class', 'down');

  var candlestick = function(selection) {
    selection.each(function(data) {
      candlestickSvg.width(barWidth(data.map(xValueScaled)));

      var upData = data.filter(function(d) {
        return d.open < d.close;
      });
      var downData = data.filter(function(d) {
        return d.open >= d.close;
      });

      upDataJoin(this, [upData]).attr('d', candlestickSvg);

      downDataJoin(this, [downData]).attr('d', candlestickSvg);
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
