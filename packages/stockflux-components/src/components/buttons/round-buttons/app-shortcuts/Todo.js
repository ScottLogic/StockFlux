import React from 'react';
import { Launchers } from 'stockflux-core';
import { FaTasks } from 'react-icons/fa';
import RoundButton from '../../round-button/RoundButton';

export default ({ symbol, name, small, disabled, intentsEnabled }) => {
  return (
    <RoundButton
      className="app-shortcut todo"
      onClick={() => Launchers.launchTodo(symbol, name, intentsEnabled)}
      disabled={disabled}
      small={small}
    >
      <FaTasks />
    </RoundButton>
  );
};
