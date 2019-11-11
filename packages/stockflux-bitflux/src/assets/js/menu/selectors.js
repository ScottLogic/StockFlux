import d3 from 'd3';
import event from '../event';
import dropdown from './generator/dropdown';

export default function() {
  var dispatch = d3.dispatch(
    event.primaryChartSeriesChange,
    event.primaryChartIndicatorChange,
    event.secondaryChartChange
  );

  var primaryChartSeriesButtons = dropdown().on(
    'optionChange',
    dispatch[event.primaryChartSeriesChange]
  );

  var indicatorToggle = dropdown().on('optionChange', function(indicator) {
    if (indicator.isPrimary) {
      dispatch[event.primaryChartIndicatorChange](indicator);
    } else {
      dispatch[event.secondaryChartChange](indicator);
    }
  });

  var selectors = function(selection) {
    selection.each(function(model) {
      var container = d3.select(this);

      var selectedSeriesIndex = model.seriesSelector.options
        .map(function(option) {
          return option.isSelected;
        })
        .indexOf(true);

      container
        .select('.series-dropdown')
        .datum({
          config: model.seriesSelector.config,
          options: model.seriesSelector.options,
          selectedIndex: selectedSeriesIndex
        })
        .call(primaryChartSeriesButtons);

      var options = model.indicatorSelector.options;

      var selectedIndicatorIndexes = options.reduce(function(
        selectedIndexes,
        option,
        index
      ) {
        return option.isSelected
          ? selectedIndexes.concat(index)
          : selectedIndexes;
      },
      []);

      container
        .select('.indicator-dropdown')
        .datum({
          config: model.indicatorSelector.config,
          options: options,
          selectedIndexes: selectedIndicatorIndexes
        })
        .call(indicatorToggle);
    });
  };

  d3.rebind(selectors, dispatch, 'on');

  return selectors;
}
