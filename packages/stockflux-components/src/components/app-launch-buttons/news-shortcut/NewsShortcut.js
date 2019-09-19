import React from 'react';
import { Intents, launchChildWindow } from 'stockflux-core';
import NewsIcon from '../../icons/news.svg';
import '../AppShortcut.css';

const NewsShortcut = ({ symbol, name, intentsEnabled, app }) => {
  const launchAsIntent = () => {
    symbol && name ? Intents.viewNews(symbol, name) : Intents.viewNews();
  };

  const launchAsChildWindow = () => {
    launchChildWindow(app.manifest, options => {
      options.name = `stockflux-news${symbol ? `[${symbol}]` : ''}`;
      if (symbol) {
        options.customData.symbol = symbol;
      }
      if (name) {
        options.customData.name = name;
      }
      return options;
    });
  };

  return (
    <div
      className="app-shortcut news-shortcut"
      onClick={() => {
        if (intentsEnabled) {
          launchAsIntent();
        } else {
          launchAsChildWindow();
        }
      }}
    >
      <NewsIcon />
    </div>
  );
};
export default NewsShortcut;
