import React from 'react';
import { Intents } from 'stockflux-core';
import NewsIcon from '../../icons/news.svg';
import '../AppShortcut.css';

const NewsShortcut = ({ symbol, name }) => {
  return (
    <div
      className="app-shortcut news-shortcut"
      onClick={() => {
        symbol && name ? Intents.viewNews(symbol, name) : Intents.viewNews();
      }}
    >
      <NewsIcon />
    </div>
  );
};
export default NewsShortcut;
