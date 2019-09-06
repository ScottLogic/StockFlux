import React, { useEffect, useReducer } from 'react';
import Components from 'stockflux-components';
import { Link, Redirect } from 'react-router-dom';
import './InputForm.css';
import * as service from '../../services/SecuritiesService';
import Alert, { AlertType } from '../alert/Alert';
import { FetchState } from '../../enums';
import { inputFormReducer } from '../../reducers/inputForm';
import PropTypes from 'prop-types';
import * as action from '../../actions/inputForm';
import { FaArrowLeft } from 'react-icons/fa';
import FormBody from './FormBody';

const InputForm = ({ match }) => {
  const initialFormState = {
    fetchStatus: match.params.securityId
      ? FetchState.FETCHING
      : FetchState.SUCCESS,
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

  const setSecurityState = security => {
    dispatch(action.setName(security.name));
    dispatch(action.setExchange(security.exchange));
    dispatch(action.setSymbol(security.symbol));
    dispatch(action.setDisabled(security.disabled));
  };

  useEffect(() => {
    if (match.params.securityId) {
      dispatch(action.fetching());
      service
        .getSecurity(match.params.securityId)
        .then(security => {
          dispatch(action.success([]));
          setSecurityState(security);
        })
        .catch(() => {
          dispatch(action.error(['Error, cannot get security']));
        });
    }
  }, [match.params.securityId]);

  const handleError = err => {
    const message = err.messages | [err.message];
    dispatch(action.error(message));
  };

  const submitForm = event => {
    event.preventDefault();
    dispatch(action.fetching());

    if (match.params.securityId) {
      service
        .updateSecurity(match.params.securityId, state.security)
        .then(() => {
          dispatch(action.success(['Security was successfully updated']));
        })
        .catch(handleError);
    } else {
      service
        .postSecurity(state.security)
        .then(() => {
          dispatch(action.success(['Security was successfully created']));
          setSecurityState({
            exchange: '',
            symbol: '',
            name: '',
            disabled: true
          });
        })
        .catch(handleError);
    }
  };

  const deleteSecurity = () => {
    service
      .deleteSecurity(match.params.securityId)
      .then(() => {
        dispatch(action.success(['Security was successfully deleted']));
        dispatch(action.setRedirect(true));
      })
      .catch(handleError);
  };

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
  return (
    <div className="input-form">
      <h1 className="title">
        {match.params.securityId ? 'Edit Security' : 'Create a Security'}
      </h1>
      {state.fetchStatus === FetchState.UPDATING ? (
        <div className="spinner-container">
          <Components.LargeSpinner />
        </div>
      ) : (
        <FormBody
          state={state}
          dispatch={dispatch}
          securityId={match.params.securityId}
          submitForm={submitForm}
          deleteSecurity={deleteSecurity}
        />
      )}
      {state.messages.length > 0 && (
        <Alert
          type={state.hasErrors ? AlertType.ERROR : AlertType.SUCCESS}
          messages={state.messages}
        />
      )}
      <Link to="/">
        <div className="back-button">
          <button>
            <FaArrowLeft size={20} />
          </button>
        </div>
      </Link>
    </div>
  );
};

InputForm.propTypes = {
  match: PropTypes.object.isRequired
};

export default InputForm;
