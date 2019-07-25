import React, { useState, useEffect } from "react";
import Components from "stockflux-components";
import { Link } from "react-router-dom";
import "./InputForm.css";
import {
  getSecurity,
  postSecurity,
  ValidationError
} from "../services/SecuritiesService";
import Alert from "./Alert";
import TextField from "./TextField";
import ToggleSwitch from "./ToggleSwitch";

const InputForm = ({ match }) => {
  const [name, setName] = useState("");
  const [exchange, setExchange] = useState("");
  const [symbol, setSymbol] = useState("");
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [formState, setFormState] = useState(null);
  const [messages, setMessages] = useState([]);

  const stateEnum = {
    loading: "loading",
    sending: "sending",
    error: "error",
    success: "success"
  };

  const setSecurityState = security => {
    setName(security.name);
    setExchange(security.exchange);
    setSymbol(security.symbol);
    setVisible(security.visible);
    setEnabled(security.enabled);
  };

  useEffect(() => {
    if (match.params.securityId) {
      setFormState(stateEnum.loading);
      getSecurity(match.params.securityId)
        .then(security => {
          setFormState(null);
          setSecurityState(security);
          setMessages([]);
        })
        .catch(() => {
          setFormState(stateEnum.error);
          setMessages(["Error, cannot get security"]);
        });
    }
  }, []);

  const submitForm = event => {
    event.preventDefault();
    setFormState(stateEnum.sending);
    setMessages([]);
    const securityObject = {
      exchange,
      symbol,
      name,
      visible,
      enabled
    };

    postSecurity(securityObject)
      .then(() => {
        setMessages(["Security was successfully created"]);
        setFormState(stateEnum.success);
        setSecurityState({
          exchange: "",
          symbol: "",
          name: "",
          visible: false,
          enabled: false
        });
      })
      .catch(err => {
        if (err instanceof ValidationError) {
          setMessages(err.messages);
        } else {
          setMessages([err.message]);
        }
        setFormState(stateEnum.error);
      });
  };

  return (
    <div className="input-form-container">
      <div className="input-form-title">
        {match.params.securityId ? "Edit Security" : "Create a Security"}
      </div>
      {formState === stateEnum.loading ? (
        <Components.LargeSpinner />
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
          <div className="input-submit-button-container">
            <div
              className={
                (formState === stateEnum.sending ? "in-progress " : "") +
                "input-submit-button"
              }
            >
              <button>{match.params.securityId ? "Edit" : "Create"}</button>
            </div>
          </div>
        </form>
      )}
      {!!messages &&
        formState !== stateEnum.sending &&
        (formState === stateEnum.error || formState === stateEnum.success) && (
          <Alert type={formState} messages={messages} />
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
