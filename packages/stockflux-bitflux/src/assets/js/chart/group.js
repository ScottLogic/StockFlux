import d3 from 'd3';
import event from '../event';
import legendChart from './legend';
import navChart from './nav';
import primaryChart from './primary';
import multiChart from './multiChart';
import xAxisChart from './xAxis';

export default function() {
  var dispatch = d3.dispatch(event.viewChange, event.crosshairChange);

  var legend = legendChart();

  var nav = navChart().on(event.viewChange, dispatch[event.viewChange]);

  var primary = primaryChart()
    .on(event.viewChange, dispatch[event.viewChange])
    .on(event.crosshairChange, dispatch[event.crosshairChange]);

  var secondaryCharts = multiChart().on(
    event.viewChange,
    dispatch[event.viewChange]
  );

  var xAxis = xAxisChart();

  function group(selection) {
    selection.each(function(model) {
      selection
        .select('#legend')
        .datum(model.legend)
        .call(legend);

      selection
        .select('#navbar-container')
        .datum(model.nav)
        .call(nav);

      selection
        .select('#primary-container')
        .datum(model.primary)
        .call(primary);

      selection
        .select('#secondaries-container')
        .datum(model.secondary)
        .call(secondaryCharts);

      selection
        .select('#x-axis-container')
        .datum(model.xAxis)
        .call(xAxis);
    });
  }

  group.legend = function() {
    return legend;
  };

  group.nav = function() {
    return nav;
  };

  group.primary = function() {
    return primary;
  };

  group.secondaries = function() {
    return secondaryCharts;
  };

  group.xAxis = function() {
    return xAxis;
  };

  d3.rebind(group, dispatch, 'on');

  return group;
}
