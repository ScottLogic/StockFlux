import React from "react";
import "./ToggleSwitch.css";

const ToggleSwitch = props => {
  return (
    <>
      <input
        {...props}
        type="checkbox"
        className={"input-form-toggle" + ` ${props.className}`}
        onChange={props.onChange}
      />
      <label className="toggle-switch" htmlFor={props.id} />
    </>
  );
};

export default ToggleSwitch;
