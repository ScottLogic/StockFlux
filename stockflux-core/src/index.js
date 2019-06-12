import { stockFluxSearch, getStockFluxData, getMiniChartData, getSymbolNews } from './services/StockFluxService';
import { truncate } from './utils/formatters';
import useLocalStorage from './custom-hooks/LocalStorageHook';
import { addWatchlist, viewChart, viewNews, viewWatchlist } from './intents';

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
  addWatchlist,
  viewWatchlist
};

export const StockFluxHooks = {
  useLocalStorage
};
