import d3 from 'd3';
import fc from 'd3fc';
import event from '../../event';
import base from './base';

export default function() {
    var dispatch = d3.dispatch(event.viewChange);
    var volumeBar = fc.series.bar()
      .xValue(function(d) { return d.date; })
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
                .fields(['volume'])
                .pad(0.08)(model.data);
            if (paddedYExtent[0] < 0) {
                paddedYExtent[0] = 0;
            }
            chart.yTickFormat(model.product.volumeFormat)
                .trackingLatest(model.trackingLatest)
                .xDomain(model.viewDomain)
                .yDomain(paddedYExtent);

            selection.call(chart);
        });
    }

    d3.rebind(volume, dispatch, 'on');

    volume.dimensionChanged = function(container) {
        chart.dimensionChanged(container);
    };

    return volume;
}
