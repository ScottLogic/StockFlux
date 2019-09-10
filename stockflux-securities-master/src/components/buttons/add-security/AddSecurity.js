import React from 'react';
import { Link } from 'react-router-dom';
import './AddSecurity.css';

export default () => (
  <Link to="/inputform">
    <button className="add-security">ADD SECURITY</button>
  </Link>
);
