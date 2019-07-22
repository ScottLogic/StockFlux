import React from "react";
import "./TextField.css";
import PropTypes from "prop-types";

const TextField = ({ readOnly, className, ...props }) => {
  return (
    <input
      {...props}
      readOnly={readOnly}
      className={`input-form-input${readOnly ? " read-only" : ""}${
        className ? ` ${className}` : ""
      }`}
    />
  );
};

TextField.propTypes = {
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  className: PropTypes.string
};

export default TextField;
