import React from "react";
import "./TextField.css";

const TextField = props => {
  return (
    <input
      {...props}
      className={
        "input-form-input" +
        (props.readOnly ? " read-only" : "") +
        ` ${props.className}`
      }
    />
  );
};

export default TextField;
