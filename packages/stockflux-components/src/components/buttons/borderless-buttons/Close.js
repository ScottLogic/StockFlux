import React from 'react';
import { FaTimes } from 'react-icons/fa';
import cx from 'classnames';
import BorderlessButton from '../borderless-button/BorderlessButton';

export default props => (
  <BorderlessButton
    {...props}
    className={cx('close', { [props.className]: props.className })}
  >
    <FaTimes />
  </BorderlessButton>
);
