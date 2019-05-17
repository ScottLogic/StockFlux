import {
  search,
  getStockData,
  apiKey,
  dataset
} from './services/QuandlService';
import {
  stockFluxSearch,
  getStockFluxData,
  getMiniChartData
} from './services/StockFluxService';
import { truncate } from './utils/formatters';
import useLocalStorage from './custom-hooks/LocalStorageHook';
import { viewChart } from './intents/viewChart';

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

export const Intents = {
  viewChart
};

export const StockFluxHooks = {
  useLocalStorage
};
