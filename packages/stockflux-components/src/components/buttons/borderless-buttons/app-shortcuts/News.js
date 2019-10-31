import React from 'react';
import { Launchers } from 'stockflux-core';
import NewsIcon from '../../../glyphs/small/news.svg';
import BorderlessButton from '../../borderless-button/BorderlessButton';

export default ({ symbol, name, small, disabled, intentsEnabled }) => (
  <BorderlessButton
    className="shortcut news"
    onClick={() => Launchers.launchNews(symbol, name, intentsEnabled)}
    disabled={disabled}
    small={small}
  >
    <NewsIcon />
  </BorderlessButton>
);
