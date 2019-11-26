import React from 'react';
import { Launchers } from 'stockflux-core';
import ChartIconSmall from '../../../glyphs/small/chart.svg';
import ChartIcon from '../../../glyphs/launcher/chart.svg';
import RoundButton from '../../round-button/RoundButton';

export default ({ symbol, name, small, disabled, onClick, intentsEnabled }) => {
  if (small) {
    return <RoundButton
      className="shortcut chart"
      onClick={() => Launchers.launchChart(symbol, name, intentsEnabled)}
      disabled={disabled}
      small={small}
    >
      <ChartIconSmall />
    </RoundButton>
  } else return (
    <RoundButton
      className="shortcut chart"
      onClick={async () => {
        await Launchers.launchChart(symbol, name, intentsEnabled);
        if (onClick) onClick();
      }}
      disabled={disabled}
      small={small}
    >
      <ChartIcon />
    </RoundButton>
  )
};
