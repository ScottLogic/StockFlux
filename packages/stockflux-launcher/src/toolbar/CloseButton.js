import React from 'react';
import Components from 'stockflux-components';
import { OpenfinApiHelpers } from 'stockflux-core';
import ModalPopup from '../popup/PopupWindow';

const modalOptions = [
  {
    name: 'Confirm',
    action: () => OpenfinApiHelpers.getCurrentWindowSync().close(),
    icon: 'Yes',
    className: 'modal-confirm'
  },
  { name: 'Cancel', icon: 'No', className: 'modal-cancel' }
];

export default (
  <ModalPopup message="Are you sure you wish to quit?" options={modalOptions}>
    <Components.Buttons.Close />
  </ModalPopup>
);
