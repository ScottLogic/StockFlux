import React from 'react';
import PropTypes from 'prop-types';
import './FormTitle.css';

const FormTitle = ({ securityId }) => (
  <h1 className="title">
    {securityId ? (
      <>
        Edit <span className="security-id">{securityId}</span>
      </>
    ) : (
      'Create a Security'
    )}
  </h1>
);

FormTitle.propTypes = {
  securityId: PropTypes.string
};

export default FormTitle;
