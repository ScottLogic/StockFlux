import React from 'react';
import './TextField.css';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TextField = ({ disabled, id, value, onChange, label }) => {
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
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

export default TextField;
