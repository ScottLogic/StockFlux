import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { FaChevronLeft, FaTrashAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Form from './Form';
import { deleteSecurity } from '../../services/SecuritiesService';
import Confirmation from '../confirmation/Confirmation';
import Alerts from '../alerts/Alerts';
import RoundIcon from '../buttons/round-icon/RoundIcon';
import './FormView.css';

const FormView = ({ match }) => {
  const [alerts, setAlerts] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const confirmedDelete = () => {
    deleteSecurity(match.params.securityId);
    setRedirect(true);
  };

  if (redirect) {
    return <Redirect to="/" />;
  }

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
          setAlerts={setAlerts}
          match={match}
          setRedirect={setRedirect}
        />
        <Link to="/">
          <RoundIcon className="back">
            <FaChevronLeft size={20} />
          </RoundIcon>
        </Link>
      </div>
      {match.params.securityId && (
        <Confirmation confirmationText="Are you sure you want to delete this security?">
          <RoundIcon
            className="delete"
            onClick={() => {
              confirmedDelete();
            }}
          >
            <FaTrashAlt size={16} />
          </RoundIcon>
        </Confirmation>
      )}
      {/* TODO: Validation needs to be improved on both BE and FE (displaying error messages) */}
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
