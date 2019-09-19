import React from 'react';
import { Intents, launchChildWindow, OpenfinApiHelpers } from 'stockflux-core';
import NewsIcon from '../../icons/news.svg';
import '../AppShortcut.css';

const NewsShortcut = ({ symbol, name, intentsEnabled }) => {
  const APP_NAME = 'stockflux-news';
  const launchAsIntent = () => {
    symbol && name ? Intents.viewNews(symbol, name) : Intents.viewNews();
  };

  const launchAsChildWindow = async () => {
    launchChildWindow(
      await OpenfinApiHelpers.getStockFluxApp(APP_NAME),
      options => {
        options.name = `${APP_NAME}${symbol ? `[${symbol}]` : ''}`;
        if (symbol) {
          options.customData.symbol = symbol;
        }
        if (name) {
          options.customData.name = name;
        }
        return options;
      }
    );
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
