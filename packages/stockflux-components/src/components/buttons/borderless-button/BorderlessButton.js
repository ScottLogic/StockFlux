import React from 'react';
import cx from 'classnames';
import './BorderlessButton.css';

export default ({ children, small, className, onClick, disabled }) => (
  <button
    className={cx('borderless', { small, [className]: className })}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
