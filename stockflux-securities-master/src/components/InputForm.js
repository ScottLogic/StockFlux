import React, { useState, useEffect } from "react";
import Components from "stockflux-components";
import { Link, Redirect } from "react-router-dom";
import "./InputForm.css";
import {
  getSecurity,
  postSecurity,
  updateSecurity,
  deleteSecurity
} from "../services/SecuritiesService";
import ValidationError from "../services/ValidationError";
import Alert from "./Alert";
import TextField from "./TextField";
import ToggleSwitch from "./ToggleSwitch";
import Button from "./Button";
import Confirmation from "./Confirmation";
import { InputFormState } from "../enums";

const InputForm = ({ match }) => {
  const [name, setName] = useState("");
  const [exchange, setExchange] = useState("");
  const [symbol, setSymbol] = useState("");
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState(
    match.params.securityId ? InputFormState.loading : null
  );
  const [messages, setMessages] = useState([]);
  const [redirect, setRedirect] = useState(false);

  const setSecurityState = security => {
    setName(security.name);
    setExchange(security.exchange);
    setSymbol(security.symbol);
    setVisible(security.visible);
    setEnabled(security.enabled);
  };

  useEffect(() => {
    if (match.params.securityId) {
      setState(InputFormState.loading);
      getSecurity(match.params.securityId)
        .then(security => {
          setState(null);
          setSecurityState(security);
          setMessages([]);
        })
        .catch(() => {
          setState(InputFormState.error);
          setMessages(["Error, cannot get security"]);
        });
    }
  }, [match.params.securityId]);

  const errorHandler = err => {
    if (err instanceof ValidationError) {
      setMessages(err.messages);
    } else {
      setMessages([err.message]);
    }
    setState(InputFormState.error);
  };

  const submitForm = event => {
    event.preventDefault();
    setState(InputFormState.sending);
    setMessages([]);
    const securityObject = {
      exchange,
      symbol,
      name,
      visible,
      enabled
    };

    if (match.params.securityId) {
      updateSecurity(match.params.securityId, securityObject)
        .then(() => {
          setMessages(["Security was successfully updated"]);
          setState(InputFormState.success);
        })
        .catch(err => {
          errorHandler(err);
        });
    } else {
      postSecurity(securityObject)
        .then(() => {
          setMessages(["Security was successfully created"]);
          setState(InputFormState.success);
          setSecurityState({
            exchange: "",
            symbol: "",
            name: "",
            visible: false,
            enabled: false
          });
        })
        .catch(err => {
          errorHandler(err);
        });
    }
  };

  const onClickDelete = () => {
    deleteSecurity(match.params.securityId)
      .then(() => {
        setState(InputFormState.success);
        setMessages(["Security Successfully Deleted"]);
        setRedirect(true);
      })
      .catch(err => {
        errorHandler(err);
      });
  };

  const renderRedirect = () => {
    if (redirect) {
      return (
        <Redirect
          push
          to={{
            pathname: "/",
            state: { messages }
          }}
        />
      );
    }
  };

  return (
    <div className="input-form-container">
      <h1 className="input-form-title">
        {match.params.securityId ? "Edit Security" : "Create a Security"}
      </h1>
      {state === InputFormState.loading ? (
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
              size="large"
              text={match.params.securityId ? "Save" : "Create"}
              className={
                (state === InputFormState.sending ? "in-progress " : "") +
                "input-submit-button"
              }
            />
            {match.params.securityId && (
              <Confirmation confirmationText="Are you sure you want to delete this security?">
                <Button
                  type="button"
                  className="input-delete-button"
                  text="Delete"
                  size="large"
                  onClick={onClickDelete}
                />
              </Confirmation>
            )}
            {renderRedirect()}
          </div>
        </form>
      )}
      {!!messages &&
        (state === InputFormState.error ||
          state === InputFormState.success) && (
          <Alert type={state} messages={messages} />
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

export default InputForm;
