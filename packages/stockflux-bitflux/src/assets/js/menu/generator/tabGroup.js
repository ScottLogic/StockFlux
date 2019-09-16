import d3 from 'd3';
import fc from 'd3fc';

export default function() {
  var dispatch = d3.dispatch('tabClick');
  var dataJoin = fc.util
    .dataJoin()
    .selector('ul')
    .element('ul');

  function tabGroup(selection) {
    var selectedIndex = selection.datum().selectedIndex || 0;

    var ul = dataJoin(selection, [selection.datum().options]);

    ul.enter().append('ul');

    var li = ul.selectAll('li').data(fc.util.fn.identity);

    li.enter()
      .append('li')
      .append('a')
      .attr('href', '#')
      .on('click', dispatch.tabClick);

    li.classed('active', function(d, i) {
      return i === selectedIndex;
    })
      .select('a')
      .text(function(option) {
        return option.displayString;
      });

    li.exit().remove();
  }

  d3.rebind(tabGroup, dispatch, 'on');
  return tabGroup;
}
