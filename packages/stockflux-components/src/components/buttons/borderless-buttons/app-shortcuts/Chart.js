import React from 'react';
import { Launchers } from 'stockflux-core';
import ChartIcon from '../../../glyphs/small/chart.svg';
import BorderlessButton from '../../borderless-button/BorderlessButton';

export default ({ symbol, name, small, disabled, intentsEnabled }) => (
  <BorderlessButton
    className="shortcut chart"
    onClick={() => Launchers.launchChart(symbol, name, intentsEnabled)}
    disabled={disabled}
    small={small}
  >
    <ChartIcon />
  </BorderlessButton>
);
