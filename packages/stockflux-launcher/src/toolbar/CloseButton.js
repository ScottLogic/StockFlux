import React from 'react';
import { FaTimes } from 'react-icons/fa';
import Components from 'stockflux-components';
import { OpenfinApiHelpers } from 'stockflux-core';

export default (
  <Components.RoundButton
    className="close"
    onClick={() => OpenfinApiHelpers.getCurrentWindowSync().close()}
  >
    <FaTimes />
  </Components.RoundButton>
);
