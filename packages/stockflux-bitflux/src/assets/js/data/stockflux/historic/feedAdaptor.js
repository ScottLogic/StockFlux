import d3 from 'd3';
import fcRebind from 'd3fc-rebind';
import { StockFlux } from 'stockflux-core';

export default function() {
  var historicFeed = StockFlux.getStockFluxData(),
    granularity,
    candles;

  var allowedPeriods = d3.map();
  allowedPeriods.set(60 * 60 * 24, 'daily');
  allowedPeriods.set(60 * 60 * 24 * 7, 'weekly');

  var stockFluxAdaptor = function stockFluxAdaptor(cb) {
    var startDate = new Date();
    historicFeed.start(startDate);
    historicFeed(cb);
  };

  stockFluxAdaptor.candles = function(x) {
    if (!arguments.length) {
      return candles;
    }
    candles = x;
    return stockFluxAdaptor;
  };

  stockFluxAdaptor.granularity = function(x) {
    if (!arguments.length) {
      return granularity;
    }
    if (!allowedPeriods.has(x)) {
      throw new Error('Granularity of ' + x + ' is not supported.');
    }
    granularity = x;
    return stockFluxAdaptor;
  };

  stockFluxAdaptor.apiKey = function() {
    throw new Error('Not implemented.');
  };

  stockFluxAdaptor.database = function() {
    throw new Error('Not implemented.');
  };

  stockFluxAdaptor.columnNameMap = function() {
    throw new Error('Not implemented.');
  };

  fcRebind.rebindAll(stockFluxAdaptor, historicFeed);

  return stockFluxAdaptor;
}
