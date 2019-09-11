import React, { useEffect, useReducer } from 'react';
import * as action from '../../../actions/securityForm';
import './Form.css';
import PropTypes from 'prop-types';
import ToggleSwitch from '../form-controls/toggle-switch/ToggleSwitch';
import TextField from '../form-controls/text-field/TextField';
import * as service from '../../../services/SecuritiesService';
import { inputFormReducer, initialFormState } from '../../../reducers/securityForm';

const Form = ({ securityId, setAlerts, setRedirect }) => {
  const [state, dispatch] = useReducer(inputFormReducer, initialFormState);

  useEffect(() => {
    if (securityId) {
      service
        .getSecurity(securityId)
        .then(security => {
          setSecurity(security);
        })
        .catch(() => {});
    }
  }, [securityId]);

  const setSecurity = security => {
    dispatch(action.setName(security.name));
    dispatch(action.setExchange(security.exchange));
    dispatch(action.setSymbol(security.symbol));
    // TODO: Change `!security.enabled` to `security.disabled` once BE is updated
    dispatch(action.setDisabled(!security.enabled));
  };

  const submitEdit = securityId => {
    service
      .updateSecurity(securityId, getSecurityDTO())
      .then(async response => {
        if (response.status === 200) {
          setRedirect(true);
        } else {
          populateAlerts(response);
        }
      });
  };

  const submitNew = () => {
    service.postSecurity(getSecurityDTO()).then(async response => {
      if (response.status === 201) {
        setRedirect(true);
      } else {
        await populateAlerts(response);
      }
    });
  };

  const populateAlerts = async response => {
    const alerts = await response.json();
    setAlerts(
      alerts.messages.map(alertMessage => ({
        message: alertMessage,
        type: 'error'
      }))
    );
  };

  // TODO: Remove once BE is storing enabled as disabled
  const getSecurityDTO = () => ({
    name: state.name,
    exchange: state.exchange,
    symbol: state.symbol,
    enabled: !state.disabled,
    visible: true
  });

  const submitForm = event => {
    event.preventDefault();
    //dispatch(action.fetching());

    if (securityId) {
      submitEdit(securityId);
    } else {
      submitNew();
    }
  };

  return (
    <>
      <form
        className={securityId ? 'edit-form' : 'add-form'}
        onSubmit={submitForm}
      >
        <TextField
          label="EXCHANGE"
          id="name"
          disabled={securityId}
          value={state.exchange}
          onChange={event => dispatch(action.setExchange(event.target.value))}
        />
        <TextField
          label="SYMBOL"
          id="name"
          disabled={securityId}
          value={state.symbol}
          onChange={event => dispatch(action.setSymbol(event.target.value))}
        />
        <TextField
          label="NAME"
          id="name"
          value={state.name}
          onChange={event => dispatch(action.setName(event.target.value))}
        />
        <ToggleSwitch
          label="DISABLED"
          id="disabled-toggle"
          checked={state.disabled || false}
          onChange={() => dispatch(action.setDisabled(!state.disabled))}
        />
        <button className="submit">{securityId ? 'SAVE' : 'CREATE'}</button>
      </form>
    </>
  );
};

Form.propTypes = {
  securityId: PropTypes.string
};

export default Form;
