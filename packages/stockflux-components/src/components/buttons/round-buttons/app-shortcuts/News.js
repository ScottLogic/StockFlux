import React from 'react';
import { Launchers } from 'stockflux-core';
import NewsIcon from '../../../icons/news.svg';
import RoundButton from '../../round-button/RoundButton';

export default ({ symbol, name, small, disabled, intentsEnabled }) => (
  <RoundButton
    className="shortcut news"
    onClick={() => Launchers.launchNews(symbol, name, intentsEnabled)}
    disabled={disabled}
    small={small}
  >
    <NewsIcon />
  </RoundButton>
);
