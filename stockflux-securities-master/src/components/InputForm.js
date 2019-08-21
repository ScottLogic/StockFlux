import React, { useEffect, useReducer } from "react";
import Components from "stockflux-components";
import { Link, Redirect } from "react-router-dom";
import "./InputForm.css";
import * as service from "../services/SecuritiesService";
import ValidationError from "../services/ValidationError";
import Alert, { AlertType } from "./Alert";
import TextField from "./TextField";
import ToggleSwitch from "./ToggleSwitch";
import Button, { ButtonSize } from "./Button";
import Confirmation from "./Confirmation";
import { InputFormState } from "../enums";
import { inputFormReducer } from "../reducers/inputFormReducer";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  formLoading,
  formSending,
  formError,
  formSuccess,
  setName,
  setExchange,
  setSymbol,
  setVisible,
  setEnabled,
  setRedirect
} from "../actions/inputFormActions";

const InputForm = ({ match }) => {
  const initialFormState = {
    fetchStatus: match.params.securityId
      ? InputFormState.LOADING
      : InputFormState.COMPLETED,
    hasErrors: false,
    messages: [],
    security: {
      name: "",
      exchange: "",
      symbol: "",
      visible: false,
      enabled: false
    },
    redirect: false
  };

  const [state, dispatch] = useReducer(inputFormReducer, initialFormState);

  const setSecurityState = security => {
    dispatch(setName(security.name));
    dispatch(setExchange(security.exchange));
    dispatch(setSymbol(security.symbol));
    dispatch(setVisible(security.visible));
    dispatch(setEnabled(security.enabled));
  };

  useEffect(() => {
    if (match.params.securityId) {
      dispatch(formLoading());
      service
        .getSecurity(match.params.securityId)
        .then(security => {
          dispatch(formSuccess([]));
          setSecurityState(security);
        })
        .catch(() => {
          dispatch(formError(["Error, cannot get security"]));
        });
    }
  }, [match.params.securityId]);

  const handleError = err => {
    const message =
      err instanceof ValidationError ? err.messages : [err.message];
    dispatch(formError(message));
  };

  const submitForm = event => {
    event.preventDefault();
    dispatch(formSending());

    if (match.params.securityId) {
      service
        .updateSecurity(match.params.securityId, state.security)
        .then(() => {
          dispatch(formSuccess(["Security was successfully updated"]));
        })
        .catch(handleError);
    } else {
      service
        .postSecurity(state.security)
        .then(() => {
          dispatch(formSuccess(["Security was successfully created"]));
          setSecurityState({
            exchange: "",
            symbol: "",
            name: "",
            visible: false,
            enabled: false
          });
        })
        .catch(handleError);
    }
  };

  const deleteSecurity = () => {
    service
      .deleteSecurity(match.params.securityId)
      .then(() => {
        dispatch(formSuccess(["Security was successfully deleted"]));
        dispatch(setRedirect(true));
      })
      .catch(handleError);
  };

  if (state.redirect) {
    return (
      <Redirect
        push
        to={{
          pathname: "/",
          state: { messages: state.messages }
        }}
      />
    );
  }
  return (
    <div className="input-form-container">
      <h1 className="input-form-title">
        {match.params.securityId ? "Edit Security" : "Create a Security"}
      </h1>
      {state.fetchStatus === InputFormState.LOADING ? (
        <div className="input-form-spinner-container">
          <Components.LargeSpinner />
        </div>
      ) : (
        <form className="input-form-body" onSubmit={submitForm}>
          <div className="input-row">
            <label className="input-label" htmlFor="exchange-input">
              Exchange
            </label>
            <TextField
              id="exchange-input"
              value={state.security.exchange}
              readOnly={!!match.params.securityId}
              onChange={event => dispatch(setExchange(event.target.value))}
            />
          </div>
          <div className="input-row">
            <label className="input-label" htmlFor="symbol-input">
              Symbol
            </label>
            <TextField
              id="symbol-input"
              value={state.security.symbol}
              readOnly={!!match.params.securityId}
              onChange={event => dispatch(setSymbol(event.target.value))}
            />
          </div>
          <div className="input-row">
            <label className="input-label" htmlFor="name-input">
              Name
            </label>
            <TextField
              id="name-input"
              value={state.security.name}
              onChange={event => dispatch(setName(event.target.value))}
            />
          </div>
          <div className="input-checkbox-container">
            <label className="input-label" htmlFor="visible-toggle">
              Visible
            </label>
            <ToggleSwitch
              id="visible-toggle"
              checked={state.security.visible}
              onChange={event => dispatch(setVisible(event.target.checked))}
            />
          </div>
          <div className="input-checkbox-container">
            <label className="input-label" htmlFor="enabled-toggle">
              Enabled
            </label>
            <ToggleSwitch
              id="enabled-toggle"
              checked={state.security.enabled}
              onChange={event => dispatch(setEnabled(event.target.checked))}
            />
          </div>
          <div className="input-buttons-container">
            <Button
              size={ButtonSize.LARGE}
              className={classNames("input-submit-button", {
                "in-progress": state.fetchStatus === InputFormState.SENDING
              })}
            >{match.params.securityId ? "Save" : "Create"}</Button>
            {match.params.securityId && (
              <Confirmation confirmationText="Are you sure you want to delete this security?">
                <Button
                  type="button"
                  className="input-delete-button"
                  size={ButtonSize.LARGE}
                  onClick={deleteSecurity}
                >Delete</Button>
              </Confirmation>
            )}
          </div>
        </form>
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
            <span className="material-icons">arrow_back</span>
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
