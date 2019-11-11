import d3 from 'd3';
import fc from 'd3fc';
import event from '../../event';
import base from './base';

export default function() {
  var dispatch = d3.dispatch(event.viewChange);
  var renderer = fc.indicator.renderer.relativeStrengthIndex();
  var algorithm = fc.indicator.algorithm
    .relativeStrengthIndex()
    .value(function(d) {
      return d.close;
    });
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

    chart
      .trackingLatest(model.trackingLatest)
      .xDomain(model.viewDomain)
      .yDomain([0, 100]);

    selection.call(chart);
  }

  d3.rebind(rsi, dispatch, 'on');

  rsi.dimensionChanged = function(container) {
    chart.dimensionChanged(container);
  };

  return rsi;
}
