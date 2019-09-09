import d3 from 'd3';
import productAdaptor from '../model/menu/productAdaptor';
import periodAdaptor from '../model/menu/periodAdaptor';
import dropdown from './generator/dropdown';
import tabGroup from './generator/tabGroup';
import event from '../event';

export default function() {

    var dispatch = d3.dispatch(
        event.dataProductChange,
        event.dataPeriodChange,
        event.clearAllPrimaryChartIndicatorsAndSecondaryCharts);

    var dataProductDropdown = dropdown()
        .on('optionChange', dispatch[event.dataProductChange]);

    var dataPeriodSelector = tabGroup()
        .on('tabClick', dispatch[event.dataPeriodChange]);

    var dropdownPeriodSelector = dropdown()
        .on('optionChange', dispatch[event.dataPeriodChange]);

    var head = function(selection) {
        selection.each(function(model) {
            var container = d3.select(this);

            var products = model.products;

            container.select('#product-dropdown')
                .datum({
                    config: model.productConfig,
                    options: products.map(productAdaptor),
                    selectedIndex: products.map(function(p) { return p.id; }).indexOf(model.selectedProduct.id)
                })
                .call(dataProductDropdown);

            var periods = model.selectedProduct.periods;
            container.select('#period-selector')
                .classed('hidden', periods.length <= 1) // TODO: get from model instead?
                .datum({
                    options: periods.map(periodAdaptor),
                    selectedIndex: periods.indexOf(model.selectedPeriod)
                })
                .call(dataPeriodSelector);

            container.select('#mobile-period-selector')
                .classed('hidden', periods.length <= 1)
                .datum({
                    config: model.mobilePeriodConfig,
                    options: periods.map(periodAdaptor),
                    selectedIndex: periods.indexOf(model.selectedPeriod)
                })
                .call(dropdownPeriodSelector);

            container.select('#clear-indicators')
                .on('click', dispatch[event.clearAllPrimaryChartIndicatorsAndSecondaryCharts]);
        });
    };

    d3.rebind(head, dispatch, 'on');

    return head;
}
