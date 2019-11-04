import React from 'react';
import { Launchers } from 'stockflux-core';
import WatchlistIcon from '../../../glyphs/small/watchlist.svg';
import BorderlessButton from '../../borderless-button/BorderlessButton';

export default ({ symbol, name, small, disabled, intentsEnabled }) => {
  return (
    <BorderlessButton
      className="shortcut watchlist"
      onClick={() => Launchers.launchWatchlist(symbol, name, intentsEnabled)}
      disabled={disabled}
      small={small}
    >
      <WatchlistIcon />
    </BorderlessButton>
  );
};
