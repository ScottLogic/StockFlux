import React from 'react';
import Components from 'stockflux-components';
import { OpenfinApiHelpers } from 'stockflux-core';
//import ConfirmationWindow from '../popups/ConfirmationWindow';

export default (
  <Components.Popups.ConfirmationWindow
    message="Are you sure you wish to quit?"
    onConfirm={() => OpenfinApiHelpers.getCurrentWindowSync().close()}
  >
    <Components.Buttons.Close />
  </Components.Popups.ConfirmationWindow>
);
