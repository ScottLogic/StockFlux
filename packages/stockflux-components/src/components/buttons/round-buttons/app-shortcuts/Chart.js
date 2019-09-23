import React from 'react';
import { Launchers } from 'stockflux-core';
import ChartIcon from '../../../icons/chart.svg';
import RoundButton from '../../round-button/RoundButton';

export default ({ symbol, name, small, disabled, intentsEnabled }) => (
  <RoundButton
    className="app-shortcut chart"
    onClick={() => Launchers.launchChart(symbol, name, intentsEnabled)}
    disabled={disabled}
    small={small}
  >
    <ChartIcon />
  </RoundButton>
);
