import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Form from './form/Form';
import Alerts from '../alerts/Alerts';
import FormTitle from './form-title/FormTitle';
import BackButton from './form-controls/buttons/back-button/BackButton';
import DeleteButton from './form-controls/buttons/delete-button/DeleteButton';
import './FormView.css';

const FormView = ({ match }) => {
  const [alerts, setAlerts] = useState([]);
  const [redirect, setRedirect] = useState(false);

  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <div className="form-view">
        <FormTitle securityId={match.params.securityId} />
        <Form
          securityId={match.params.securityId}
          setAlerts={setAlerts}
          match={match}
          setRedirect={setRedirect}
        />
        <BackButton />
        {match.params.securityId && (
          <DeleteButton
            securityId={match.params.securityId}
            setRedirect={setRedirect}
          />
        )}
        {/* TODO: Validation needs to be improved on both BE and FE (displaying error messages) */}
        <div className="alerts-container">
          <Alerts alerts={alerts} />
        </div>
      </div>
    </>
  );
};

FormView.propTypes = {
  match: PropTypes.object.isRequired
};

export default FormView;
