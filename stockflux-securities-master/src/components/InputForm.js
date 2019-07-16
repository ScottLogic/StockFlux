import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./InputForm.css";

const InputForm = () => {
  const [name, setName] = useState('');
  const [exchange, setExchange] = useState('');
  const [symbol, setSymbol] = useState('');
  const [isShown, setIsShown] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  

  const submitForm = () => {
    const securityObject = {
      name: name,
      exchange: exchange,
      symbol: symbol,
      isShown: isShown,
      isEnabled: isEnabled
    };
    console.log(securityObject);
  };

  return (
    <div className="input-form-container">
      <div className="input-form-title">Create a Security</div>
      <form className="input-form-body" onSubmit={submitForm}>
        <div className="input-row">
          <label className="input-label" for="name-input">
            Name
          </label>
          <input
            required
            className="input-form-input"
            id="name-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="input-row">
          <label className="input-label" for="exchange-input">
            Exchange
          </label>
          <input
            required
            className="input-form-input"
            id="exchange-input"
            value={exchange}
            onChange={(event) => setExchange(event.target.value)}
          />
        </div>
        <div className="input-row">
          <label className="input-label" for="symbol-input">
            Symbol
          </label>
          <input
            required
            className="input-form-input"
            id="symbol-input"
            value={symbol}
            onChange={(event) => setSymbol(event.target.value)}
          />
        </div>
        <div className="input-checkbox-container">
          <label className="input-label" for="is-shown-toggle">
            Is Shown
          </label>
          <input
            className="input-form-toggle"
            id="is-shown-toggle"
            value={isShown}
            type="checkbox"
            onChange={() => setIsShown(!isShown)}
          />
          <label className="toggle-switch" for="is-shown-toggle" />
        </div>
        <div className="input-checkbox-container">
          <label className="input-label" for="is-enabled-toggle">
            Is Enabled
          </label>
          <input
            className="input-form-toggle"
            id="is-enabled-toggle"
            value={isEnabled}
            type="checkbox"
            onChange={() => setIsEnabled(!isEnabled)}
          />
          <label className="toggle-switch" for="is-enabled-toggle" />
        </div>
        <div className="input-submit-button-container">
          <div className="input-submit-button">
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
