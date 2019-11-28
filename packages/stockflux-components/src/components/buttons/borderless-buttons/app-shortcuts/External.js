import React from 'react';
import { Launchers } from 'stockflux-core';
import RoundButton from '../../round-button/RoundButton';

export default ({ manifest }) => {
  return (
    <RoundButton
      className="shortcut external"
      onClick={() => Launchers.launchChildWindow(manifest)}
    >
      {manifest.description}
    </RoundButton>
  );
};
