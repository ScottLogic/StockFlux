import React from 'react';
import { Launchers } from 'stockflux-core';
import NewsIconSmall from '../../../glyphs/small/news.svg';
import NewsIcon from '../../../glyphs/launcher/news.svg';
import RoundButton from '../../round-button/RoundButton';

export default ({ symbol, name, small, disabled, intentsEnabled }) => {
  if (small) {
    return <RoundButton
      className="shortcut news"
      onClick={() => Launchers.launchWatchlist(symbol, name, intentsEnabled)}
      disabled={disabled}
      small={small}
    >
      <NewsIconSmall />
    </RoundButton>
  }
  else return (
    <RoundButton
      className="shortcut news"
      onClick={() => Launchers.launchWatchlist(symbol, name, intentsEnabled)}
      disabled={disabled}
      small={small}
    >
      <NewsIcon />
    </RoundButton>
  )
};
