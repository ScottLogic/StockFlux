import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './TextField.css';

const TextField = ({ label, id, value, disabled, onChange }) => {
  return (
    <span className="input">
      <label htmlFor={id}>{label}</label>
      <input
        className={classNames({ disabled: disabled })}
        id={id}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
    </span>
  );
};

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

export default TextField;
