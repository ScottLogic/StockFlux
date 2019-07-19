import React, { useState, useEffect } from "react";
import Components from "stockflux-components";
import { Link } from "react-router-dom";
import "./InputForm.css";
import { getSecurity } from "../services/SecuritiesService";
import ErrorMessage from "./ErrorMessage";

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
      name: name,
      exchange: exchange,
      symbol: symbol,
      visible: visible,
      enabled: enabled
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
            <input
              className={`input-form-input${
                match.params.securityId ? "-read-only" : ""
              }`}
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
            <input
              className={`input-form-input${
                match.params.securityId ? "-read-only" : ""
              }`}
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
            <input
              className="input-form-input"
              id="name-input"
              value={name}
              onChange={event => setName(event.target.value)}
            />
          </div>
          <div className="input-checkbox-container">
            <label className="input-label" htmlFor="is-shown-toggle">
              Is Shown
            </label>
            <input
              className="input-form-toggle"
              id="visible-toggle"
              value={visible}
              checked={visible}
              type="checkbox"
              onChange={() => setVisible(!visible)}
            />
            <label className="toggle-switch" htmlFor="visible-toggle" />
          </div>
          <div className="input-checkbox-container">
            <label className="input-label" htmlFor="is-enabled-toggle">
              Is Enabled
            </label>
            <input
              className="input-form-toggle"
              id="enabled-toggle"
              value={enabled}
              checked={enabled}
              type="checkbox"
              onChange={() => setEnabled(!enabled)}
            />
            <label className="toggle-switch" htmlFor="enabled-toggle" />
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
