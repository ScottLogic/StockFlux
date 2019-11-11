import d3 from 'd3';
import fc from 'd3fc';

export default function() {
  var priceFormat;
  var volumeFormat;
  var timeFormat;
  var textYOffset = '0.71em';

  var tooltip = fc.chart
    .tooltip()
    .items([
      ['T', d => timeFormat(d.date)],
      ['O', d => priceFormat(d.open)],
      ['H', d => priceFormat(d.high)],
      ['L', d => priceFormat(d.low)],
      ['C', d => priceFormat(d.close)],
      ['V', d => volumeFormat(d.volume)]
    ])
    .decorate(function(selection) {
      selection
        .enter()
        .selectAll('text')
        .attr('dy', textYOffset);
    });

  function legend(selection) {
    selection.each(function(model) {
      var container = d3.select(this);
      var tooltipContainer = container.select('#tooltip');

      priceFormat = model.product.priceFormat;
      volumeFormat = model.product.volumeFormat;
      timeFormat = model.period.timeFormat;

      container.classed('hidden', !model.data);

      tooltipContainer
        .layout({ flexDirection: 'row' })
        .selectAll('.tooltip')
        .layout({ marginRight: 40, marginLeft: 15 });

      if (model.data) {
        tooltipContainer.datum(model.data).call(tooltip);
      }
    });
  }

  return legend;
}
