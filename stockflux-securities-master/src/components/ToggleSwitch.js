import React from "react";
import "./ToggleSwitch.css";

const ToggleSwitch = ({ value, id, checked, onChange, className }) => {
  return (
    <>
      <input
        value={value}
        id={id}
        checked={checked}
        type="checkbox"
        className={"input-form-toggle" + ` ${className}`}
        onChange={onChange}
      />
      <label className="toggle-switch" htmlFor={id} />
    </>
  );
};

export default ToggleSwitch;
