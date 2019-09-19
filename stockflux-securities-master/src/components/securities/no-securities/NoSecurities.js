import React from 'react';
import AddSecurityButton from '../../buttons/add-security/AddSecurity';
import './NoSecurities.css';

const NoSecurities = () => (
  <div className="no-securities">
    <p>Sorry, no securities to be displayed.</p>
    <AddSecurityButton />
  </div>
);

export default NoSecurities;
