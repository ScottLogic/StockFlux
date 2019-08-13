import React from "react";
import "./TextField.css";
import PropTypes from "prop-types";

const TextField = ({ readOnly, id, value, onChange }) => {
  return (
    <input readOnly={readOnly} id={id} value={value} onChange={onChange} className={`input-form-input ${readOnly ? "read-only" : ""}`} />
  );
};

TextField.propTypes = {
  readOnly: PropTypes.bool,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TextField;
