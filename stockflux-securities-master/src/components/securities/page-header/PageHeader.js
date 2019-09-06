import React from 'react';
import { Link } from 'react-router-dom';
import Button, { ButtonSize } from '../../button/Button';
import PropTypes from 'prop-types';
import './PageHeader.css';

const PageHeader = ({ numberOfSecurities }) => {
  return (
    <div className="page-header">
      <h1 className="title">Securities</h1>
      <div className="btn-add-security">
        {numberOfSecurities > 0 && (
          <Link to="/inputform">
            <Button size={ButtonSize.SMALL} className="btn-add-security">
              ADD SECURITY
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  numberOfSecurities: PropTypes.number.isRequired
};

export default PageHeader;
