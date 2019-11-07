import React from 'react';
import cx from 'classnames';
import './DialogButton.css';

export default ({ children, small, className, onClick, disabled }) => (
  <button
    className={cx('dialog', { small, [className]: className })}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);
