import d3 from 'd3';
import fcRebind from 'd3fc-rebind';
import getScottStockData from '../../../../../../node_modules/stockflux-core/src/services/ScottStockService';

export default function() {
    var historicFeed = getScottStockData(),
        granularity,
        candles;

    var allowedPeriods = d3.map();
    allowedPeriods.set(60 * 60 * 24, 'daily');
    allowedPeriods.set(60 * 60 * 24 * 7, 'weekly');

    var scottStockAdaptor = function scottStockAdaptor(cb) {
        var startDate = new Date();
        historicFeed.start(startDate);
        historicFeed(cb);
    };

    scottStockAdaptor.candles = function(x) {
        if (!arguments.length) {
            return candles;
        }
        candles = x;
        return scottStockAdaptor;
    };

    scottStockAdaptor.granularity = function(x) {
        if (!arguments.length) {
            return granularity;
        }
        if (!allowedPeriods.has(x)) {
            throw new Error('Granularity of ' + x + ' is not supported.');
        }
        granularity = x;
        return scottStockAdaptor;
    };

    scottStockAdaptor.apiKey = function() {
        throw new Error('Not implemented.');
    };

    scottStockAdaptor.database = function() {
        throw new Error('Not implemented.');
    };

    scottStockAdaptor.columnNameMap = function() {
        throw new Error('Not implemented.');
    };

    fcRebind.rebindAll(scottStockAdaptor, historicFeed);

    return scottStockAdaptor;
}
