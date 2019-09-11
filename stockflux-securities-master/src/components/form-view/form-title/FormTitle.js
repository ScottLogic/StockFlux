import React from 'react';
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

export default FormTitle;
