import React from 'react';
import './RoundIcon.css';

export default ({ children, className, onClick }) => (
  <button
    className={className ? `round ${className}` : `round`}
    onClick={onClick}
  >
    {children}
  </button>
);
