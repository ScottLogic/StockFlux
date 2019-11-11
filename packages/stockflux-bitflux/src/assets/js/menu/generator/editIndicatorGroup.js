import d3 from 'd3';
import event from '../../event';

export default function() {
  var dispatch = d3.dispatch(event.indicatorChange);

  function editIndicatorGroup(selection) {
    selection.each(function(model) {
      var sel = d3.select(this);

      var div = sel
        .selectAll('div')
        .data(model.selectedIndicators, function(d) {
          return d.valueString;
        });

      var containersEnter = div
        .enter()
        .append('div')
        .attr('class', 'edit-indicator');

      containersEnter
        .append('span')
        .attr('class', 'icon bf-icon-delete')
        .on('click', dispatch.indicatorChange);

      containersEnter
        .append('span')
        .attr('class', 'indicator-label')
        .text(function(d) {
          return d.displayString;
        });

      div.exit().remove();
    });
  }

  d3.rebind(editIndicatorGroup, dispatch, 'on');

  return editIndicatorGroup;
}
