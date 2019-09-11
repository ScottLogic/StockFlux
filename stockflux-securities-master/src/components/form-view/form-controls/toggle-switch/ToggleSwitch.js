import React from 'react';
import PropTypes from 'prop-types';
import './ToggleSwitch.css';

const ToggleSwitch = ({ label, id, checked, onChange }) => {
  return (
    <span className="input">
      <label htmlFor={id}>{label}</label>
      <input
        onChange={onChange}
        type="checkbox"
        checked={checked}
        className="toggle"
        id={id}
      />
      <label className="toggle-switch" htmlFor={id} />
    </span>
  );
};

ToggleSwitch.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.any.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ToggleSwitch;
