import React from 'react';
import { Launchers } from 'stockflux-core';
import Components from 'stockflux-components';

export default ({ symbol, name, small, disabled, intentsEnabled }) => {
  return (
    <Components.Buttons.Round
      className="shortcut watchlist"
      onClick={() => Launchers.launchWatchlist(symbol, name, intentsEnabled)}
      disabled={disabled}
      small={small}
    >
      <Components.Icons.Launcher.WatchlistIcon />
    </Components.Buttons.Round>
  );
};
