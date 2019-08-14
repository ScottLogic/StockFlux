import React, { useState, useEffect, useReducer } from "react";
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

const InputForm = ({ match }) => {
  const [name, setName] = useState("");
  const [exchange, setExchange] = useState("");
  const [symbol, setSymbol] = useState("");
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const [redirect, setRedirect] = useState(false);

  const initialFormState = {
    fetchStatus: match.params.securityId
      ? InputFormState.LOADING
      : InputFormState.COMPLETED,
    hasErrors: false,
    messages: []
  };

  const [state, dispatch] = useReducer(inputFormReducer, initialFormState);

  const setSecurityState = security => {
    setName(security.name);
    setExchange(security.exchange);
    setSymbol(security.symbol);
    setVisible(security.visible);
    setEnabled(security.enabled);
  };

  useEffect(() => {
    if (match.params.securityId) {
      dispatch({ type: InputFormState.LOADING });
      service
        .getSecurity(match.params.securityId)
        .then(security => {
          dispatch({ type: InputFormState.SUCCESS, messages: [] });
          setSecurityState(security);
        })
        .catch(() => {
          dispatch({
            type: InputFormState.ERROR,
            messages: ["Error, cannot get security"]
          });
        });
    }
  }, [match.params.securityId]);

  const handleError = err => {
    dispatch({
      type: InputFormState.ERROR,
      messages: err instanceof ValidationError ? err.messages : [err.message]
    });
  };

  const submitForm = event => {
    event.preventDefault();
    dispatch({ type: InputFormState.SENDING });
    const securityObject = {
      exchange,
      symbol,
      name,
      visible,
      enabled
    };

    if (match.params.securityId) {
      service
        .updateSecurity(match.params.securityId, securityObject)
        .then(() => {
          dispatch({
            type: InputFormState.SUCCESS,
            messages: ["Security was successfully updated"]
          });
        })
        .catch(err => {
          handleError(err);
        });
    } else {
      service
        .postSecurity(securityObject)
        .then(() => {
          dispatch({
            type: InputFormState.SUCCESS,
            messages: ["Security was successfully created"]
          });
          setSecurityState({
            exchange: "",
            symbol: "",
            name: "",
            visible: false,
            enabled: false
          });
        })
        .catch(err => {
          handleError(err);
        });
    }
  };

  const deleteSecurity = () => {
    service
      .deleteSecurity(match.params.securityId)
      .then(() => {
        dispatch({
          type: InputFormState.SUCCESS,
          messages: ["Security Successfully Deleted"]
        });

        setRedirect(true);
      })
      .catch(err => {
        handleError(err);
      });
  };

  if (redirect) {
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
              value={exchange}
              readOnly={!!match.params.securityId}
              onChange={event => setExchange(event.target.value)}
            />
          </div>
          <div className="input-row">
            <label className="input-label" htmlFor="symbol-input">
              Symbol
            </label>
            <TextField
              id="symbol-input"
              value={symbol}
              readOnly={!!match.params.securityId}
              onChange={event => setSymbol(event.target.value)}
            />
          </div>
          <div className="input-row">
            <label className="input-label" htmlFor="name-input">
              Name
            </label>
            <TextField
              id="name-input"
              value={name}
              onChange={event => setName(event.target.value)}
            />
          </div>
          <div className="input-checkbox-container">
            <label className="input-label" htmlFor="visible-toggle">
              Visible
            </label>
            <ToggleSwitch
              id="visible-toggle"
              checked={visible}
              onChange={event => setVisible(event.target.checked)}
            />
          </div>
          <div className="input-checkbox-container">
            <label className="input-label" htmlFor="enabled-toggle">
              Enabled
            </label>
            <ToggleSwitch
              id="enabled-toggle"
              checked={enabled}
              onChange={event => setEnabled(event.target.checked)}
            />
          </div>
          <div className="input-buttons-container">
            <Button
              size={ButtonSize.LARGE}
              text={match.params.securityId ? "Save" : "Create"}
              className={`input-submit-button ${state.fetchStatus ===
                InputFormState.SENDING && " in-progress"}`}
            />
            {match.params.securityId && (
              <Confirmation confirmationText="Are you sure you want to delete this security?">
                <Button
                  type="button"
                  className="input-delete-button"
                  text="Delete"
                  size={ButtonSize.LARGE}
                  onClick={deleteSecurity}
                />
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
