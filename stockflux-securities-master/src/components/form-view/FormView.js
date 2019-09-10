import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FormView.css';
import * as service from '../../services/SecuritiesService';
import PropTypes from 'prop-types';
import { FaChevronLeft } from 'react-icons/fa';
import Form from './Form';
import Confirmation from '../confirmation/Confirmation';
import { FaTrashAlt } from 'react-icons/fa';
import Alerts from '../alerts/Alerts';

const FormView = ({ match }) => {
  const [alerts, setAlerts] = useState([]);
  const deleteSecurity = () => service.deleteSecurity(match.params.securityId);
  return (
    <>
      <div className="form-view">
        <h1 className="title">
          {match.params.securityId
            ? `Edit ${match.params.securityId}`
            : 'Create a Security'}
        </h1>
        <Form securityId={match.params.securityId} setAlerts={setAlerts} />
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
      <div className="alerts-container">
        <Alerts alerts={alerts} />
      </div>
    </>
  );
};

FormView.propTypes = {
  match: PropTypes.object.isRequired
};

export default FormView;
