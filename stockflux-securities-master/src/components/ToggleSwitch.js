import React from "react";
import "./ToggleSwitch.css";
import PropTypes from "prop-types";

const ToggleSwitch = ({ id, checked, className, ...props }) => {
  return (
    <>
      <input
        {...props}
        type="checkbox"
        checked={checked}
        className="input-form-toggle"
        id={id}
      />
      <label className={`toggle-switch ${className}`} htmlFor={id} />
    </>
  );
};

ToggleSwitch.propTypes = {
  id: PropTypes.any.isRequired,
  checked: PropTypes.bool,
  className: PropTypes.string
};

export default ToggleSwitch;
