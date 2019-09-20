import React from 'react';
import { FaTimes } from 'react-icons/fa';
import cx from 'classnames';
import RoundButton from '../round-button/RoundButton';

export default props => (
  <RoundButton
    {...props}
    className={cx('close', { [props.className]: props.className })}
  >
    <FaTimes />
  </RoundButton>
);
