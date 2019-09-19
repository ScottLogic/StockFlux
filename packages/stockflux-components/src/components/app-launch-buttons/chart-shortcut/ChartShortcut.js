import React from 'react';
import { Launchers } from 'stockflux-core';
import ChartIcon from '../../icons/chart.svg';
import '../AppShortcut.css';

export default ({ symbol, name, intentsEnabled }) => (
  <div
    className="app-shortcut chart-shortcut"
    onClick={() => Launchers.launchChart(symbol, name, intentsEnabled)}
  >
    <ChartIcon />
  </div>
);
