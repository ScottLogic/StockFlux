import React, { useRef } from "react";
import { Link } from "react-router-dom";
import "./InputForm.css";

const InputForm = () => {
  const nameRef = useRef(null);
  const exchangeRef = useRef(null);
  const symbolRef = useRef(null);
  const isShownRef = useRef(true);
  const isVisibleRef = useRef(true);

  const submitForm = () => {
    const securityObject = {
      name: nameRef.current,
      exchange: exchangeRef.current,
      symbol: symbolRef.current,
      isShown: isShownRef.current,
      isVisible: isVisibleRef.current
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
            ref={nameRef}
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
            ref={exchangeRef}
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
            ref={symbolRef}
          />
        </div>
        <div className="input-checkbox-container">
          <label className="input-label" for="is-shown-toggle">
            Is Shown
          </label>
          <input
            className="input-form-toggle"
            id="is-shown-toggle"
            ref={isShownRef}
            type="checkbox"
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
            ref={isVisibleRef}
            type="checkbox"
          />
          <label className="toggle-switch" for="is-enabled-toggle" />
        </div>
        <div className="input-submit-button-container">
          <div className="input-submit-button">
            <button type="submit">Create</button>
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
