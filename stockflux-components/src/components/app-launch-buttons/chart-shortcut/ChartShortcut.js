import React from 'react';
import { Intents } from 'stockflux-core';
import ChartIcon from '../../icons/chart.svg';
import '../AppShortcut.css';

const ChartShortcut = ({ symbol, name }) => {
  return (
    <div
      className="app-shortcut"
      onClick={() => {
        if (symbol && name) Intents.viewChart(symbol, name);
        else Intents.viewChart();
      }}
    >
      <ChartIcon />
    </div>
  );
};
export default ChartShortcut;
