import React from "react";
import "./ToggleSwitch.css";

const ToggleSwitch = ({ value, id, checked, onChange }) => {
  return (
    <div>
      <input
        value={value}
        id={id}
        checked={checked}
        type="checkbox"
        className="input-form-toggle"
        onChange={onChange}
      />
      <label className="toggle-switch" htmlFor={id} />
    </div>
  );
};

export default ToggleSwitch;
