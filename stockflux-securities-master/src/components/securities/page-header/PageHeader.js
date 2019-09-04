import React from 'react';
import { Link } from 'react-router-dom';
import Button, { ButtonSize } from '../button/Button';
import PropTypes from 'prop-types';
import './PageHeader.css';

const PageHeader = numberOfSecurities => (
  <div className="page-header">
    <h1 className="title">Securities</h1>
    <div className="btn-add-security">
      {numberOfSecurities > 0 && (
        <Link to="/inputform">
          <Button size={ButtonSize.SMALL} className="add-securities-button">
            Add Security
          </Button>
        </Link>
      )}
    </div>
  </div>
);

PageHeader.propTypes = {
  numberOfSecurities: PropTypes.number.isRequired
};
