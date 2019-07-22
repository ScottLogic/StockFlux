import React from "react";
import "./TextField.css";

const TextField = ({ onChange, id, value, readOnly, className, ...props }) => {
  return (
    <input
      {...props}
      onChange={onChange}
      id={id}
      value={value}
      readOnly={readOnly}
      className={`input-form-input${readOnly ? " read-only" : ""}${
        className ? ` ${className}` : ""
      }`}
    />
  );
};

export default TextField;
