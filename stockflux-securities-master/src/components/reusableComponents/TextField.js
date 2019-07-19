import React from "react";
import "./TextField.css";

const TextField = ({ value, id, onChange, readOnly }) => {
  return (
    <input
      value={value}
      id={id}
      onChange={onChange}
      readOnly={readOnly}
      className={"input-form-input" + (readOnly ? " read-only" : "")}
    />
  );
};

export default TextField;
