import { search, getStockData, apiKey, dataset } from './services/QuandlService';
import { stockFluxSearch, getStockFluxData, getMiniChartData } from './services/StockFluxService';
import { truncate } from './utils/formatters';

// remove when Quandl is removed from bitflux
export const Quandl = {
  search,
  getStockData,
  apiKey,
  dataset
};

export const Utils = {
  truncate
};

export const StockFlux = {
  stockFluxSearch,
  getStockFluxData,
  getMiniChartData
};