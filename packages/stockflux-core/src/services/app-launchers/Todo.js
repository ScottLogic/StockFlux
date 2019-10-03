import { getStockFluxApp } from '../../openfin-api-utils/openfinApiHelpers';
import { launchChildWindow } from '../ChildWindowLauncher';

const APP_NAME = 'stockflux-todo';

const launchAsChildWindow = async (symbol, name) =>
  launchChildWindow(await getStockFluxApp(APP_NAME), options => {
    options.name = `${APP_NAME}${symbol ? `[${symbol}]` : ''}`;
    if (symbol) {
      options.customData.symbol = symbol;
    }
    if (name) {
      options.customData.name = name;
    }
    return options;
  });

export default (symbol, name, intentsEnabled) =>
  launchAsChildWindow(symbol, name);
