import React from 'react';
import { FaTimes } from 'react-icons/fa';
import './CloseButton.css';

export default (
  <button
    className="close"
    onClick={() => window.fin.Window.getCurrentSync().close()}
  >
    <FaTimes />
  </button>
);
