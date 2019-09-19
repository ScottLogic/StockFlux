import React from 'react';
import { Launchers } from 'stockflux-core';
import WatchlistIcon from '../../icons/watchlist.svg';
import '../AppShortcut.css';

export default ({ symbol, name, intentsEnabled }) => {
  return (
    <div
      className="app-shortcut watchlist-shortcut"
      onClick={() => Launchers.launchWatchlist(symbol, name, intentsEnabled)}
    >
      <WatchlistIcon />
    </div>
  );
};
