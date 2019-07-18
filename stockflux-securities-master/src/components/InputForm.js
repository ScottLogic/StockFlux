import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./InputForm.css";

const InputForm = ({ match }) => {
  const [name, setName] = useState("");
  const [exchange, setExchange] = useState("");
  const [symbol, setSymbol] = useState("");
  const [isShown, setIsShown] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  const submitForm = event => {
    event.preventDefault();
    setInProgress(true);

    const securityObject = {
      name: name,
      exchangeId: exchange,
      symbol: symbol,
      isShown: isShown,
      isEnabled: isEnabled
    };

    // call service

    setInProgress(false);
    console.log(securityObject);
  };

  return (
    <div className="input-form-container">
      <div className="input-form-title">{match.params.securityId ? "Edit Security" : "Create a Security"}</div>
      <form className="input-form-body" onSubmit={submitForm}>
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
        <div className="input-row">
          <label className="input-label" htmlFor="exchange-input">
            Exchange
          </label>
          <input
            className="input-form-input"
            id="exchange-input"
            value={exchange}
            onChange={event => setExchange(event.target.value)}
          />
        </div>
        <div className="input-row">
          <label className="input-label" htmlFor="symbol-input">
            Symbol
          </label>
          <input
            className="input-form-input"
            id="symbol-input"
            value={symbol}
            onChange={event => setSymbol(event.target.value)}
          />
        </div>
        <div className="input-checkbox-container">
          <label className="input-label" htmlFor="is-shown-toggle">
            Is Shown
          </label>
          <input
            className="input-form-toggle"
            id="is-shown-toggle"
            value={isShown}
            type="checkbox"
            onChange={() => setIsShown(!isShown)}
          />
          <label className="toggle-switch" htmlFor="is-shown-toggle" />
        </div>
        <div className="input-checkbox-container">
          <label className="input-label" htmlFor="is-enabled-toggle">
            Is Enabled
          </label>
          <input
            className="input-form-toggle"
            id="is-enabled-toggle"
            value={isEnabled}
            type="checkbox"
            onChange={() => setIsEnabled(!isEnabled)}
          />
          <label className="toggle-switch" htmlFor="is-enabled-toggle" />
        </div>
        <div className="input-submit-button-container">
          <div
            className={(inProgress ? "in-progress " : "") + "input-submit-button"}
          >
            <button>Create</button>
          </div>
        </div>
      </form>
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
