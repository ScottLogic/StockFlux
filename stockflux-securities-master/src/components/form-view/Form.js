import React, { useEffect, useReducer } from 'react';
import classNames from 'classnames';
import Button, { ButtonSize } from '../button/Button';
import * as action from '../../actions/inputForm';
import { FetchState } from '../../enums';
import './Form.css';
import PropTypes from 'prop-types';
import ToggleSwitch from './form-controls/toggle-switch/ToggleSwitch';
import TextField from './form-controls/text-field/TextField';
import * as service from '../../services/SecuritiesService';
import { inputFormReducer } from '../../reducers/inputForm';
import { Redirect } from 'react-router-dom';
import Components from 'stockflux-components';

const Form = ({ securityId, setAlerts }) => {
  const initialFormState = {
    fetchStatus: securityId ? FetchState.FETCHING : FetchState.SUCCESS,
    security: {
      name: '',
      exchange: '',
      symbol: '',
      disabled: false
    },
    redirect: false
  };

  const [state, dispatch] = useReducer(inputFormReducer, initialFormState);

  useEffect(() => {
    if (securityId) {
      dispatch(action.fetching());
      service
        .getSecurity(securityId)
        .then(security => {
          dispatch(action.success([]));
          setSecurityState(security);
        })
        .catch(() => {
          dispatch(action.error(['Error, cannot get security']));
        });
    }
  }, [securityId]);

  const setSecurityState = security => {
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
          submitSuccess();
        } else {
          submitError();
        }
      });
  };

  const submitNew = () => {
    service.postSecurity(getSecurityDTO()).then(async response => {
      if (response.status === 201) {
        submitSuccess();
      } else {
        await submitError(response);
      }
    });
  };

  const submitSuccess = () => {
    dispatch(action.success());
    dispatch(action.setRedirect(true));
  };

  const submitError = async response => {
    dispatch(action.error());
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
    name: state.security.name,
    exchange: state.security.exchange,
    symbol: state.security.symbol,
    enabled: !state.security.disabled,
    visible: true
  });

  const submitForm = event => {
    event.preventDefault();
    dispatch(action.fetching());

    if (securityId) {
      submitEdit(securityId);
    } else {
      submitNew();
    }
  };

  useEffect(() => {
    if (state.redirect) {
      return (
        <Redirect
          push
          to={{
            pathname: '/'
          }}
        />
      );
    }
  }, [state]);

  return (
    <>
      {state.fetchStatus === FetchState.UPDATING ? (
        <div className="spinner-container">
          <Components.LargeSpinner />
        </div>
      ) : (
        <form onSubmit={submitForm}>
          <TextField
            label="NAME"
            id="name-input"
            value={state.security.name}
            onChange={event => dispatch(action.setName(event.target.value))}
          />
          <TextField
            label="EXCHANGE"
            id="name-input"
            disabled={true}
            value={state.security.exchange}
            onChange={event => dispatch(action.setExchange(event.target.value))}
          />
          <TextField
            label="SYMBOL"
            id="name-input"
            disabled={true}
            value={state.security.symbol}
            onChange={event => dispatch(action.setSymbol(event.target.value))}
          />
          <ToggleSwitch
            label="DISABLED"
            id="disabled-toggle"
            checked={state.security.disabled || false}
            onChange={() =>
              dispatch(action.setDisabled(!state.security.disabled))
            }
          />
          <div className="input-buttons-container">
            <Button
              size={ButtonSize.LARGE}
              className={classNames('submit', {
                'in-progress': state.fetchStatus === FetchState.UPDATING
              })}
            >
              {securityId ? 'SAVE' : 'CREATE'}
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

Form.propTypes = {
  securityId: PropTypes.string
};

export default Form;
