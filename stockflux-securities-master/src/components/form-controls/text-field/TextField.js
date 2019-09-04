import React from "react";
import "./TextField.css";
import PropTypes from "prop-types";
import classNames from "classnames";

const TextField = ({ readOnly, id, value, onChange }) => {
  return (
    <input
      readOnly={readOnly}
      id={id}
      value={value}
      onChange={onChange}
      className={classNames("input-form-input", { "read-only": readOnly })}
    />
  );
};

TextField.propTypes = {
  readOnly: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default TextField;
