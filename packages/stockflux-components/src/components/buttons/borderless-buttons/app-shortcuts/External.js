import React from 'react';
import { Launchers } from 'stockflux-core';
import RoundButton from '../../round-button/RoundButton';

export default ({ manifest, small }) => {
  if (small) {
    return (
      <RoundButton
        className="shortcut external"
        onClick={() => Launchers.launchChildWindow(manifest)}
        small={small}
      >
        {manifest.description}
      </RoundButton>
    );
  } else
    return (
      <RoundButton
        className="shortcut external"
        onClick={() => Launchers.launchChildWindow(manifest)}
        small={small}
      >
        {manifest.description}
      </RoundButton>
    );
};
