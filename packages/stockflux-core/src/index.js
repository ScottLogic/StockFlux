import useLocalStorage from './custom-hooks/LocalStorageHook';
import { addWatchlist, viewChart, viewNews, viewWatchlist } from './intents';
import {
  stockFluxSearch,
  getStockFluxData,
  getMiniChartData,
  getSymbolNews
} from './services/StockFluxService';
import { truncate } from './utils/formatters';
import {
  createWindow,
  getCurrentWindow,
  getCurrentWindowSync,
  getChildWindows,
  getCurrentWindowOptions,
  getMonitorInfo,
  getAllApps,
  getStockFluxApps,
  getStockFluxApp,
  getWindow,
  openUrlWithBrowser,
  sendInterApplicationMessage,
  showNotification,
  useMain,
  windowAlreadyExists
} from './openfin-api-utils/openfinApiHelpers';
import { launchChildWindow } from './services/ChildWindowLauncher';
import {
  launchChart,
  launchWatchlist,
  launchNews
} from './services/app-launchers';

export const Utils = {
  truncate
};

export const OpenfinApiHelpers = {
  createWindow,
  getCurrentWindow,
  getCurrentWindowSync,
  getChildWindows,
  getCurrentWindowOptions,
  getMonitorInfo,
  getAllApps,
  getStockFluxApps,
  getStockFluxApp,
  getWindow,
  openUrlWithBrowser,
  sendInterApplicationMessage,
  showNotification,
  useMain,
  windowAlreadyExists
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

export const Launchers = {
  launchChildWindow,
  launchChart,
  launchWatchlist,
  launchNews
};
