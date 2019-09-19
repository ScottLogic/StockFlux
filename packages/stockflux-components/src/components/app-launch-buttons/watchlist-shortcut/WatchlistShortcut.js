import React from 'react';
import { Intents, launchChildWindow } from 'stockflux-core';
import WatchlistIcon from '../../icons/watchlist.svg';
import '../AppShortcut.css';

const WatchlistShortcut = ({ symbol, name, intentsEnabled, app }) => {
  const launchAsIntent = () => {
    symbol && name
      ? Intents.addToWatchlist(symbol, name)
      : Intents.viewWatchlist();
  };

  const launchAsChildWindow = () => {
    launchChildWindow(app.manifest, options => {
      options.name = `stockflux-watchlist${symbol ? `[${symbol}]` : ''}`;
      if (symbol) {
        options.customData.symbol = symbol;
      }
      if (name) {
        options.customData.name = name;
      }
      return options;
    });
  };

  return (
    <div
      className="app-shortcut watchlist-shortcut"
      onClick={() => {
        if (intentsEnabled) {
          launchAsIntent();
        } else {
          launchAsChildWindow();
        }
      }}
    >
      <WatchlistIcon />
    </div>
  );
};
export default WatchlistShortcut;
