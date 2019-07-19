import React from "react";
import "./TextField.css";

const TextField = ({ value, id, onChange, readOnly, className }) => {
  return (
    <input
      value={value}
      id={id}
      readOnly={readOnly}
      className={
        "input-form-input" + (readOnly ? " read-only" : "") + ` ${className}`
      }
      onChange={onChange}
    />
  );
};

export default TextField;
