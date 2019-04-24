import { search, getStockData, apiKey, dataset } from './services/QuandlService';
import { truncate } from './utils/formatters';

export const Quandl = {
  search,
  getStockData,
  apiKey,
  dataset
};

export const Utils = {
  truncate
};