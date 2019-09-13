import d3 from 'd3';
import fc from 'd3fc';
import event from '../event';
import editIndicatorGroup from './generator/editIndicatorGroup';
import dropdown from './generator/dropdown';
import productAdaptor from '../model/menu/productAdaptor';

export default function() {
    var dispatch = d3.dispatch(
        event.primaryChartIndicatorChange,
        event.secondaryChartChange,
        event.dataProductChange);

    var primaryChartIndicatorToggle = editIndicatorGroup()
        .on(event.indicatorChange, dispatch[event.primaryChartIndicatorChange]);

    var secondaryChartToggle = editIndicatorGroup()
        .on(event.indicatorChange, dispatch[event.secondaryChartChange]);

    var dataProductDropdown = dropdown()
        .on('optionChange', dispatch[event.dataProductChange]);

    var secondariesDataJoin = fc.util.dataJoin()
        .selector('.overlay-secondary-container')
        .element('div')
        .attr('class', 'overlay-secondary-container')
        .key(function(d) { return d.displayString;});

    var overlay = function(selection) {
        selection.each(function(model) {
            var container = d3.select(this);

            var products = model.products;

            container.select('#mobile-product-dropdown')
                .datum({
                    config: model.productConfig,
                    options: products.map(productAdaptor),
                    selectedIndex: products.map(function(p) { return p.id; }).indexOf(model.selectedProduct.id)
                })
                .call(dataProductDropdown);

            container.select('#overlay-primary-container .edit-indicator-container')
                .datum({selectedIndicators: model.primaryIndicators})
                .call(primaryChartIndicatorToggle);

            var secondariesContainer = container.select('#overlay-secondaries-container');

            var secondaries = secondariesDataJoin(secondariesContainer, model.secondaryIndicators);

            var editIndicatorContainer = secondaries.enter()
                .append('div')
                .attr('class', 'edit-indicator-container');

            editIndicatorContainer.each(function(d) {
                d3.select(this).datum({selectedIndicators: [d]}).call(secondaryChartToggle);
            });
        });
    };

    d3.rebind(overlay, dispatch, 'on');

    return overlay;
}
