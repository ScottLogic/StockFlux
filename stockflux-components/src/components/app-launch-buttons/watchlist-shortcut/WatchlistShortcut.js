import React from 'react';
import { Intents } from 'stockflux-core';
import WatchlistIcon from '../../icons/watchlist.svg';
import '../AppShortcut.css';

const WatchlistShortcut = () => {
  return (
    <div
      className="app-shortcut"
      onClick={() => {
        Intents.viewWatchlist();
      }}
    >
      <WatchlistIcon />
    </div>
  );
};
export default WatchlistShortcut;
