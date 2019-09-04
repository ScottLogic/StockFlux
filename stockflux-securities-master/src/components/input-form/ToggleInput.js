import React from 'react';
import ToggleSwitch from '../form-controls/toggle-switch/ToggleSwitch';
import PropTypes from 'prop-types';

const ToggleInput = ({ label, id, checked, onChange }) => (
  <>
    <label htmlFor={id}>{label}</label>
    <ToggleSwitch id={id} checked={checked} onChange={onChange} />
  </>
);

ToggleInput.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ToggleInput;
