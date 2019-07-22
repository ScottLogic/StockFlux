import React from "react";
import "./ToggleSwitch.css";

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

export default ToggleSwitch;
