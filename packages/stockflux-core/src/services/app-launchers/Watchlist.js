import {
  getStockFluxApp,
  getCurrentWindowOptions,
  sendInterApplicationMessage
} from '../../openfin-api-utils/openfinApiHelpers';
import { launchChildWindow } from '../ChildWindowLauncher';
import viewWatchlist from '../../intents/viewWatchlist';
import addToWatchlist from '../../intents/addWatchlist';

const APP_NAME = 'stockflux-watchlist';

const launchAsIntent = (symbol, name) =>
  symbol && name ? addToWatchlist(symbol, name) : viewWatchlist();

const launchAsChildWindow = async (symbol, name) => {
  const childWindow = await launchChildWindow(
    await getStockFluxApp(APP_NAME),
    options => {
      options.name = APP_NAME;
      return options;
    }
  );

  try {
    const options = await getCurrentWindowOptions();

    await sendInterApplicationMessage(options ? options.uuid : '*', APP_NAME, {
      symbol,
      name
    });
    // window.fin.InterApplicationBus.publish('stockflux-watchlist', {
    //   symbol,
    //   name
    // });
  } catch (err) {
    console.error(err);
  }

  return childWindow;
};

export default (symbol, name, intentsEnabled) =>
  intentsEnabled
    ? launchAsIntent(symbol, name)
    : launchAsChildWindow(symbol, name);
