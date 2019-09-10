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
        value={value}
        onChange={onChange}
      />
    </span>
  );
};

TextField.propTypes = {
  readOnly: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default TextField;
