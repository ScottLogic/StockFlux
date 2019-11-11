import React from 'react';
import { Launchers } from 'stockflux-core';
import ChartIcon from '../../../glyphs/small/chart.svg';
import BorderlessButton from '../../borderless-button/BorderlessButton';

export default ({ symbol, name, small, disabled, onClick, intentsEnabled }) => (
  <BorderlessButton
    className="shortcut chart"
    onClick={async () => {
      await Launchers.launchChart(symbol, name, intentsEnabled);
      if (onClick) onClick();
    }}
    disabled={disabled}
    small={small}
  >
    <ChartIcon />
  </BorderlessButton>
);
