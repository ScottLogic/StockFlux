import React from 'react';
import { Intents } from 'stockflux-core';
import ChartIcon from '../../icons/chart.svg';
import '../AppShortcut.css';

const ChartShortcut = ({ symbol, name }) => {
  return (
    <div
      className="app-shortcut"
      onClick={() => {
        Intents.viewNews(symbol, name);
      }}
    >
      <ChartIcon />
    </div>
  );
};
export default ChartShortcut;
