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

const Form = ({ securityId }) => {
  const initialFormState = {
    fetchStatus: securityId ? FetchState.FETCHING : FetchState.SUCCESS,
    hasErrors: false,
    messages: [],
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
          const securityToBeStored = {
            name: security.name,
            exchange: security.exchange,
            symbol: security.symbol,
            disabled: !security.enabled
          };
          setSecurityState(securityToBeStored);
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
    dispatch(action.setDisabled(security.disabled));
  };

  const submitForm = event => {
    event.preventDefault();
    dispatch(action.fetching());
    const { name, exchange, symbol, disabled } = state.security;
    const security = {
      name,
      exchange,
      symbol,
      enabled: !disabled,
      visible: true
    };
    if (securityId) {
      service
        .updateSecurity(securityId, security)
        .then(() => {
          dispatch(action.success());
        })
        .catch(action.error());
    } else {
      service
        .postSecurity(security)
        .then(() => {
          dispatch(action.success());
          setSecurityState({
            exchange: '',
            symbol: '',
            name: '',
            disabled: false
          });
        })
        .catch(error => {
          throw new Error(error);
        });
    }
  };

  useEffect(() => {
    if (state.redirect) {
      return (
        <Redirect
          push
          to={{
            pathname: '/',
            state: { messages: state.messages }
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
