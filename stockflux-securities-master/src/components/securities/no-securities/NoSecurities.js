import React from 'react';
import { Link } from 'react-router-dom';
import Button, { ButtonSize } from '../../button/Button';
import './NoSecurities.css';

const NoSecurities = () => (
  <div className="no-securities">
    <p>You have no securities to show</p>
    <Link to="/inputform">
      <Button size={ButtonSize.SMALL}>ADD SECURITY</Button>
    </Link>
  </div>
);

export default NoSecurities;
