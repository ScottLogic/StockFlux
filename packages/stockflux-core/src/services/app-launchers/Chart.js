import { getStockFluxApp } from '../../openfin-api-utils/openfinApiHelpers';
import { launchChildWindow } from '../ChildWindowLauncher';
import viewChart from '../../intents/viewChart';

const APP_NAME = 'stockflux-chart';

const launchAsIntent = (symbol, name) =>
  symbol && name ? viewChart(symbol, name) : viewChart();

const launchAsChildWindow = async (symbol, name) =>
  launchChildWindow(await getStockFluxApp(APP_NAME), options => {
    options.name = `${APP_NAME}${symbol ? `[${symbol}]` : ''}`;
    options.allowMultiple = true;
    if (symbol) {
      options.customData.symbol = symbol;
    }
    if (name) {
      options.customData.name = name;
    }
    return options;
  });

export default (symbol, name, intentsEnabled) =>
  intentsEnabled
    ? launchAsIntent(symbol, name)
    : launchAsChildWindow(symbol, name);
