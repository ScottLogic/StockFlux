import React from "react";
import PropTypes from "prop-types";
import TextField from "../form-controls/text-field/TextField";
import ToggleSwitch from "../form-controls/toggle-switch/ToggleSwitch";
import "./FormRow.css";

export function RowType(value) {
  this._value = value;
}

RowType.TEXT = new RowType("text");
RowType.TOGGLE = new RowType("toggle");

const FormRow = ({ label, id, value, checked, readOnly, onChange, type }) => {
  return (
    <div className="form-row">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      {type === RowType.TEXT && (
        <TextField
          id={id}
          value={value}
          readOnly={readOnly}
          onChange={onChange}
        />
      )}
      {type === RowType.TOGGLE && (
        <ToggleSwitch id={id} checked={checked} onChange={onChange} />
      )}
    </div>
  );
};

FormRow.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  checked: PropTypes.bool,
  readOnly: PropTypes.bool,
  type: PropTypes.oneOf([RowType.TEXT, RowType.TOGGLE]).isRequired
};

export default FormRow;
