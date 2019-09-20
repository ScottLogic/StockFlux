import React from 'react';
import { Launchers } from 'stockflux-core';
import WatchlistIcon from '../icons/watchlist.svg';
import RoundButton from '../round-button/RoundButton';
import './AppShortcut.css';

export default ({ symbol, name, intentsEnabled }) => {
  return (
    <RoundButton
      className="app-shortcut watchlist"
      onClick={() => Launchers.launchWatchlist(symbol, name, intentsEnabled)}
    >
      <WatchlistIcon />
    </RoundButton>
  );
};
