import React from 'react';
import { Intents } from 'stockflux-core';
import NewsIcon from '../../icons/news.svg';
import '../AppShortcut.css';

const NewsShortcut = ({ symbol, name }) => {
  return (
    <div
      className="app-shortcut"
      onClick={() => {
        Intents.viewNews(symbol, name);
      }}
    >
      <NewsIcon />
    </div>
  );
};
export default NewsShortcut;
