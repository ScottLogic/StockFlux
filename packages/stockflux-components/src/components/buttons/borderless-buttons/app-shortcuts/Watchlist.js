import React from 'react';
import { Launchers } from 'stockflux-core';
import WatchlistIcon from '../../../glyphs/small/watchlist.svg';
import BorderlessButton from '../../borderless-button/BorderlessButton';

export default ({ symbol, name, small, disabled, onClick, intentsEnabled }) => {
  return (
    <BorderlessButton
      className="shortcut watchlist"
      onClick={async () => {
        await Launchers.launchWatchlist(symbol, name, intentsEnabled);
        if (onClick) onClick();
      }}
      disabled={disabled}
      small={small}
    >
      <WatchlistIcon />
    </BorderlessButton>
  );
};
