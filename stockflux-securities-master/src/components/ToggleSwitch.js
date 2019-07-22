import React from "react";
import "./ToggleSwitch.css";
import PropTypes from "prop-types";

const ToggleSwitch = ({ onChange, id, value, className, ...props }) => {
  return (
    <>
      <input
        {...props}
        value={value}
        id={id}
        type="checkbox"
        className="input-form-toggle"
        onChange={onChange}
      />
      <label className={`toggle-switch ${className}`} htmlFor={id} />
    </>
  );
};

ToggleSwitch.propTypes = {
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  className: PropTypes.string
};

export default ToggleSwitch;
