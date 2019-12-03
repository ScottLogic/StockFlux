import React from 'react';
import { Launchers } from 'stockflux-core';
import WatchlistIconSmall from '../../../glyphs/small/watchlist.svg';
import WatchlistIcon from '../../../glyphs/launcher/watchlist.svg';
import RoundButton from '../../round-button/RoundButton';

export default ({ symbol, name, small, disabled, intentsEnabled, title }) => {
  if (small) {
    return (
      <RoundButton
        className="shortcut watchlist"
        onClick={() => Launchers.launchWatchlist(symbol, name, intentsEnabled)}
        disabled={disabled}
        small={small}
      >
        <WatchlistIconSmall />
      </RoundButton>
    );
  } else
    return (
      <RoundButton
        className="shortcut watchlist"
        onClick={() => Launchers.launchWatchlist(symbol, name, intentsEnabled)}
        disabled={disabled}
        small={small}
      >
        <WatchlistIcon />
        {title}
      </RoundButton>
    );
};
