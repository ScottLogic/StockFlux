import d3 from 'd3';
import fc from 'd3fc';
import util from '../util/util';
import dateTimeTickValues from '../scale/dateTime/tickValues';
import responsiveTickCount from '../scale/responsiveTickCount';

export default function() {
    var xScale = fc.scale.dateTime();
    var ticks = dateTimeTickValues();

    var xAxis = fc.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .decorate(function(s) {
          s.selectAll('text')
              .each(function() {
                  var text = d3.select(this);
                  var split = text.text().split(',');
                  text.text(null);
                  text.append('tspan')
                      .attr('class', 'axis-label-main')
                      .attr('x', 0)
                      .text(split[0]);
                  text.append('tspan')
                      .attr('class', 'axis-label-secondary')
                      .attr('dy', '1.42em')
                      .attr('x', 0)
                      .text(split[1]);
              });
      });

    function xAxisChart(selection) {
        var model = selection.datum();

        xScale.domain(model.viewDomain)
            .discontinuityProvider(model.discontinuityProvider);

        var minimumTickCount = 2,
            tickFrequencyPixels = 100,
            tickCount = responsiveTickCount(xScale.range()[1], tickFrequencyPixels, minimumTickCount),
            period = model.period;

        var tickValues = ticks.domain(xScale.domain())
            .discontinuityProvider(model.discontinuityProvider)
            .ticks(tickCount)
            .minimumTickInterval([period.d3TimeInterval.unit, period.d3TimeInterval.value])();

        xAxis.tickValues(fc.scale.dateTime.tickTransformer(tickValues, model.discontinuityProvider, model.viewDomain))
            .tickFormat(d3.time.format(tickValues.format));

        selection.call(xAxis);
    }

    xAxisChart.dimensionChanged = function(container) {
        xScale.range([0, util.width(container.node())]);
    };

    return xAxisChart;
}
