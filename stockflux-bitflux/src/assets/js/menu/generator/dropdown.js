import d3 from 'd3';
import fc from 'd3fc';

export default function() {
    var dispatch = d3.dispatch('optionChange');

    var buttonDataJoin = fc.util.dataJoin()
        .selector('button')
        .element('button')
        .attr({
            'class': 'dropdown-toggle',
            'type': 'button',
            'data-toggle': 'dropdown'
        });

    var caretDataJoin = fc.util.dataJoin()
        .selector('.caret')
        .element('span')
        .attr('class', 'caret');

    var listDataJoin = fc.util.dataJoin()
        .selector('ul')
        .element('ul')
        .attr('class', 'dropdown-menu');

    var listItemsDataJoin = fc.util.dataJoin()
        .selector('li')
        .element('li')
        .key(function(d) { return d.displayString; });

    function dropdown(selection) {
        var model = selection.datum();
        var selectedIndex = model.selectedIndex || 0;
        var config = model.config;

        var button = buttonDataJoin(selection, [model.options]);

        if (config.icon) {
            var dropdownButtonIcon = button.selectAll('.icon')
                .data([0]);
            dropdownButtonIcon.enter()
                .append('span');
            dropdownButtonIcon.attr('class', 'icon ' + model.options[selectedIndex].icon);
        } else {
            button.select('.icon').remove();
            button.text(function() {
                return config.title || model.options[selectedIndex].displayString;
            });
        }

        caretDataJoin(button, config.careted ? [0] : []);

        var list = listDataJoin(selection, [model.options]);

        var listItems = listItemsDataJoin(list, model.options);
        var listItemAnchors = listItems.enter()
            .on('click', dispatch.optionChange)
            .append('a')
            .attr('href', '#');

        listItemAnchors.append('span')
            .attr('class', 'icon');
        listItemAnchors.append('span')
            .attr('class', 'name');

        listItems.classed('selected', function(d, i) {
            return model.selectedIndexes ? model.selectedIndexes.indexOf(i) > -1 : i === selectedIndex;
        });

        listItems.selectAll('.icon')
            .attr('class', function(d) { return 'icon ' + d.icon; });
        listItems.selectAll('.name')
            .text(function(d) { return d.displayString; });
    }

    d3.rebind(dropdown, dispatch, 'on');

    return dropdown;
}
