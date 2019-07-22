import React, { useState, useEffect } from "react";
import Components from "stockflux-components";
import { Link } from "react-router-dom";
import "./InputForm.css";
import { getSecurity } from "../services/SecuritiesService";
import ErrorMessage from "./ErrorMessage";
import TextField from "./TextField";
import ToggleSwitch from "./ToggleSwitch";

const InputForm = ({ match }) => {
  const [name, setName] = useState("");
  const [exchange, setExchange] = useState("");
  const [symbol, setSymbol] = useState("");
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const setSecurityState = security => {
    setName(security.name);
    setExchange(security.exchange);
    setSymbol(security.symbol);
    setVisible(security.visible);
    setEnabled(security.enabled);
  };

  useEffect(() => {
    if (match.params.securityId) {
      setIsLoading(true);
      getSecurity(match.params.securityId)
        .then(security => {
          setIsLoading(false);
          setErrorMessage(null);
          setSecurityState(security);
        })
        .catch(() => {
          setIsLoading(false);
          setErrorMessage("Error, cannot get security");
        });
    }
  }, []);

  const submitForm = event => {
    event.preventDefault();
    setInProgress(true);

    const securityObject = {
      name,
      exchange,
      symbol,
      visible,
      enabled
    };

    // call service

    setInProgress(false);
    console.log(securityObject);
  };

  return (
    <div className="input-form-container">
      <div className="input-form-title">
        {match.params.securityId ? "Edit Security" : "Create a Security"}
      </div>
      {isLoading ? (
        <Components.LargeSpinner />
      ) : errorMessage ? (
        <ErrorMessage errorMessage={errorMessage} />
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
              value={visible}
              id="visible-toggle"
              checked={visible}
              onChange={() => setVisible(!visible)}
              className="testClass"
            />
          </div>
          <div className="input-checkbox-container">
            <label className="input-label" htmlFor="enabled-toggle">
              Enabled
            </label>
            <ToggleSwitch
              value={enabled}
              id="enabled-toggle"
              checked={enabled}
              onChange={() => setEnabled(!enabled)}
            />
          </div>
          <div className="input-submit-button-container">
            <div
              className={
                (inProgress ? "in-progress " : "") + "input-submit-button"
              }
            >
              <button>{match.params.securityId ? "Edit" : "Create"}</button>
            </div>
          </div>
        </form>
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
