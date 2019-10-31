import React from 'react';
import { Launchers } from 'stockflux-core';
import Components from 'stockflux-components';
import { ReactComponent as WatchlistIcon } from '../icons/watchlist.svg';

export default ({ symbol, name, small, disabled, intentsEnabled }) => {
  return (
    <Components.Buttons.Round
      className="shortcut watchlist"
      onClick={() => Launchers.launchWatchlist(symbol, name, intentsEnabled)}
      disabled={disabled}
      small={small}
    >
      <WatchlistIcon />
    </Components.Buttons.Round>
  );
};
