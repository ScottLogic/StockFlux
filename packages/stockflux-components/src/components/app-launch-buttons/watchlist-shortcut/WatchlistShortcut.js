import React from 'react';
import { Intents } from 'stockflux-core';
import WatchlistIcon from '../../icons/watchlist.svg';
import '../AppShortcut.css';

const WatchlistShortcut = ({ symbol, name }) => {
  return (
    <div
      className="app-shortcut watchlist-shortcut"
      onClick={() => {
        symbol && name
          ? Intents.addToWatchlist(symbol, name)
          : Intents.viewWatchlist();
      }}
    >
      <WatchlistIcon />
    </div>
  );
};
export default WatchlistShortcut;
