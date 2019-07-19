import React from "react";
import "./TextField.css";

const TextField = ({ value, id, onChange, readOnly }) => {
  return (
    <input
      value={value}
      id={id}
      readOnly={readOnly}
      className={"input-form-input" + (readOnly ? " read-only" : "")}
      onChange={onChange}
    />
  );
};

export default TextField;
