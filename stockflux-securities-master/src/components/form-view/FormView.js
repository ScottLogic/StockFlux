import React from 'react';
import { Link } from 'react-router-dom';
import './FormView.css';
import * as service from '../../services/SecuritiesService';
import PropTypes from 'prop-types';
import { FaChevronLeft } from 'react-icons/fa';
import Form from './Form';
import Confirmation from '../confirmation/Confirmation';
import { FaTrashAlt } from 'react-icons/fa';

const FormView = ({ match }) => {
  const deleteSecurity = () => service.deleteSecurity(match.params.securityId);
  return (
    <>
      <div className="form-view">
        <h1 className="title">
          {match.params.securityId
            ? `Edit ${match.params.securityId}`
            : 'Create a Security'}
        </h1>
        <Form
          securityId={match.params.securityId}
        />
        <Link to="/">
          <button className="back">
            <FaChevronLeft size={20} />
          </button>
        </Link>
      </div>
      {match.params.securityId && (
        <Confirmation confirmationText="Are you sure you want to delete this security?">
          <button
            type="button"
            className="delete"
            onClick={() => deleteSecurity()}
          >
            <FaTrashAlt size={16} />
          </button>
        </Confirmation>
      )}
    </>
  );
};

FormView.propTypes = {
  match: PropTypes.object.isRequired
};

export default FormView;
