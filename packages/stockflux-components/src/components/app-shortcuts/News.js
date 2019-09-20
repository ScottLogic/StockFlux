import React from 'react';
import { Launchers } from 'stockflux-core';
import NewsIcon from '../icons/news.svg';
import RoundButton from '../round-button/RoundButton';
import './AppShortcut.css';

export default ({ symbol, name, intentsEnabled }) => (
  <RoundButton
    className="app-shortcut news"
    onClick={() => Launchers.launchNews(symbol, name, intentsEnabled)}
  >
    <NewsIcon />
  </RoundButton>
);
