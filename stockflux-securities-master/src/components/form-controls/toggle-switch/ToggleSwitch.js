import React from "react";
import "./ToggleSwitch.css";
import PropTypes from "prop-types";

const ToggleSwitch = ({ id, checked, onChange }) => {
  return (
    <>
      <input
        onChange={onChange}
        type="checkbox"
        checked={checked}
        className="toggle"
        id={id}
      />
      <label className="toggle-switch" htmlFor={id} />
    </>
  );
};

ToggleSwitch.propTypes = {
  id: PropTypes.any.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

export default ToggleSwitch;
