import React from 'react';
import { Launchers } from 'stockflux-core';
import NewsIcon from '../../icons/news.svg';
import '../AppShortcut.css';

export default ({ symbol, name, intentsEnabled }) => (
  <div
    className="app-shortcut news-shortcut"
    onClick={() => Launchers.launchNews(symbol, name, intentsEnabled)}
  >
    <NewsIcon />
  </div>
);
