import React from 'react';
import { Launchers } from 'stockflux-core';
import ChartIcon from '../icons/chart.svg';
import RoundButton from '../round-button/RoundButton';
import './AppShortcut.css';

export default ({ symbol, name, intentsEnabled }) => (
  <RoundButton
    className="app-shortcut chart"
    onClick={() => Launchers.launchChart(symbol, name, intentsEnabled)}
  >
    <ChartIcon />
  </RoundButton>
);
