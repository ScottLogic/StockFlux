import React from 'react';
import Components from 'stockflux-components';
import { OpenfinApiHelpers } from 'stockflux-core';

export default (
  <Components.Buttons.Close
    onClick={() => OpenfinApiHelpers.getCurrentWindowSync().close()}
  />
);
