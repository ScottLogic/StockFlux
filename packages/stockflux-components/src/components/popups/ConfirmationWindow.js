import React from 'react';
import PopupWindow from './PopupWindow';

const ConfirmationWindow = ({ message, onConfirm, onReject, children }) => {
  const modalOptions = [
    {
      name: 'Cancel',
      icon: 'No',
      className: 'modal-cancel',
      action: onReject
    },
    {
      name: 'Confirm',
      action: onConfirm,
      icon: 'Yes',
      className: 'modal-confirm'
    }
  ];

  return (
    <PopupWindow message={message} options={modalOptions}>
      {children}
    </PopupWindow>
  );
};

export default ConfirmationWindow;
