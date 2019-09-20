import React from 'react';
import { Launchers } from 'stockflux-core';
import WatchlistIcon from '../../../icons/watchlist.svg';
import RoundButton from '../../round-button/RoundButton';

export default ({ symbol, name, small, disabled, intentsEnabled }) => {
  return (
    <RoundButton
      className="app-shortcut watchlist"
      onClick={() => Launchers.launchWatchlist(symbol, name, intentsEnabled)}
      disabled={disabled}
      small={small}
    >
      <WatchlistIcon />
    </RoundButton>
  );
};
