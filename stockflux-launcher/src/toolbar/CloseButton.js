import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './CloseButton.css';

export default (
  <button
    className="close"
    onClick={() => {
      // eslint-disable-next-line no-undef
      var application = fin.desktop.Application.getCurrent();
      application.close();
    }}
  >
    <FaTimes />
  </button>
);
