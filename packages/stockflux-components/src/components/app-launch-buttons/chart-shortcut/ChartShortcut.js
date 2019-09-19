import React from 'react';
import { Intents, launchChildWindow, OpenfinApiHelpers } from 'stockflux-core';
import ChartIcon from '../../icons/chart.svg';
import '../AppShortcut.css';

const ChartShortcut = ({ symbol, name, intentsEnabled }) => {
  const APP_NAME = 'stockflux-chart';
  const launchAsIntent = () => {
    symbol && name ? Intents.viewChart(symbol, name) : Intents.viewChart();
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
      className="app-shortcut chart-shortcut"
      onClick={() => {
        if (intentsEnabled) {
          launchAsIntent();
        } else {
          launchAsChildWindow();
        }
      }}
    >
      <ChartIcon />
    </div>
  );
};
export default ChartShortcut;
