import React from 'react';
import PopupWindow from './PopupWindow';
import { FaCheck, FaTimes } from 'react-icons/fa';

const ConfirmationWindow = ({ message, onConfirm, onReject, children }) => {
  const modalOptions = [
    {
      name: 'Cancel',
      icon: <FaTimes></FaTimes>,
      className: 'modal-cancel',
      action: onReject
    },
    {
      name: 'Confirm',
      action: onConfirm,
      icon: <FaCheck></FaCheck>,
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
