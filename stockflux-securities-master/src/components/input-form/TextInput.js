import React from 'react';
import TextField from '../form-controls/text-field/TextField';
import PropTypes from 'prop-types';

const TextInput = ({ label, id, value, onChange }) => (
  <>
    <label htmlFor={id}>{label}</label>
    <TextField id={id} value={value} onChange={onChange} />
  </>
);

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default TextInput;
