import {
  search,
  getStockData,
  apiKey,
  dataset
} from './services/QuandlService';
import {
  stockFluxSearch,
  getStockFluxData,
  getMiniChartData,
  getSymbolNews
} from './services/StockFluxService';
import { truncate } from './utils/formatters';
import useLocalStorage from './custom-hooks/LocalStorageHook';
import viewChart from './intents/viewChart';
import viewNews from './intents/viewNews';
import addWatchlist from './intents/addWatchlist';

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
  getMiniChartData,
  getSymbolNews
};

export const Intents = {
  viewChart,
  viewNews,
  addWatchlist
};

export const StockFluxHooks = {
  useLocalStorage
};
