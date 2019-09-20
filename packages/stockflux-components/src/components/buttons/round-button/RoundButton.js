import React from 'react';
import cx from 'classnames';
import './RoundButton.css';

export default ({ children, small, className, onClick, disabled }) => (
  <button
    className={cx('round', { small, [className]: className })}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
