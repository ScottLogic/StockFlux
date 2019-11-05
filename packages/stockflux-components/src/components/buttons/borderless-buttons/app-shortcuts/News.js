import React from 'react';
import { Launchers } from 'stockflux-core';
import NewsIcon from '../../../glyphs/small/news.svg';
import BorderlessButton from '../../borderless-button/BorderlessButton';

export default ({ symbol, name, small, disabled, onClick, intentsEnabled }) => (
  <BorderlessButton
    className="shortcut news"
    onClick={async () => {
      await Launchers.launchNews(symbol, name, intentsEnabled);
      if (onClick) onClick();
    }}
    disabled={disabled}
    small={small}
  >
    <NewsIcon />
  </BorderlessButton>
);
