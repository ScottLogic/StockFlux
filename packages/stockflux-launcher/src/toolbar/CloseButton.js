import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { OpenfinApiHelpers } from 'stockflux-core';
import './CloseButton.css';

export default (
  <button
    className="close"
    onClick={() => OpenfinApiHelpers.getCurrentWindowSync().close()}
  >
    <FaTimes />
  </button>
);
