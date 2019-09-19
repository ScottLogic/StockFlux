import React from 'react';
import { Intents, launchChildWindow } from 'stockflux-core';
import ChartIcon from '../../icons/chart.svg';
import '../AppShortcut.css';

const ChartShortcut = ({ symbol, name, intentsEnabled, app }) => {
  const launchAsIntent = () => {
    symbol && name ? Intents.viewChart(symbol, name) : Intents.viewChart();
  };

  const launchAsChildWindow = () => {
    launchChildWindow(app.manifest, options => {
      options.name = `stockflux-chart${symbol ? `[${symbol}]` : ''}`;
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
