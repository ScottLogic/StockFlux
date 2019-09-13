import d3 from 'd3';
import fc from 'd3fc';

export default function() {
    var priceFormat;
    var volumeFormat;
    var timeFormat;
    var textYOffset = '0.71em';

    var tooltip = fc.chart.tooltip()
        .items([
            ['T', function(d) { return timeFormat(d.date); }],
            ['O', function(d) { return priceFormat(d.open); }],
            ['H', function(d) { return priceFormat(d.high); }],
            ['L', function(d) { return priceFormat(d.low); }],
            ['C', function(d) { return priceFormat(d.close); }],
            ['V', function(d) { return volumeFormat(d.volume); }]
        ])
        .decorate(function(selection) {
            selection.enter()
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

            tooltipContainer.layout({flexDirection: 'row'})
                .selectAll('.tooltip')
                .layout({marginRight: 40, marginLeft: 15});

            if (model.data) {
                tooltipContainer.datum(model.data)
                    .call(tooltip);
            }
        });
    }

    return legend;
}
