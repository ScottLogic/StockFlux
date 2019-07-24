import React, { useState, useEffect } from "react";
import Components from "stockflux-components";
import { Link } from "react-router-dom";
import "./InputForm.css";
import { getSecurity, postSecurity } from "../services/SecuritiesService";
import Message from "./Message";
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
  const [sendingMessages, setSendingMessages] = useState([]);
  const [sendingSuccess, setSendingSuccess] = useState(true);

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
          setSendingSuccess(false);
          setErrorMessage("Error, cannot get security");
        });
    }
  }, []);

  const submitForm = event => {
    event.preventDefault();
    setInProgress(true);
    const securityObject = {
      exchange,
      symbol,
      name,
      visible,
      enabled
    };

    postSecurity(securityObject)
      .then(response => {
        console.log(response);

        if (response.status >= 200 && response.status <= 299) {
          setSendingSuccess(true);
          setSendingMessages(["Security was successfully created"]);
          setSecurityState({
            exchange: "",
            symbol: "",
            name: "",
            visible: false,
            enabled: false
          });
        } else if (response.status >= 400 && response.status <= 499) {
          setSendingSuccess(false);
          setSendingMessages(response.messages);
        } else if (response.status >= 500) {
          throw new Error("Something went wrong, please try again later");
        } else {
          throw new Error("Unknown error occured, please try again later");
        }
      })

      .catch(err => {
        setSendingSuccess(false);
        setSendingMessages(err.message.split(".,"));
      });

    setInProgress(false);
  };

  return (
    <div className="input-form-container">
      <div className="input-form-title">
        {match.params.securityId ? "Edit Security" : "Create a Security"}
      </div>

      {isLoading ? (
        <Components.LargeSpinner />
      ) : errorMessage ? (
        <Message message={errorMessage} type="error" />
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
                (inProgress ? "in-progress " : "") + "input-submit-button"
              }
            >
              <button>{match.params.securityId ? "Edit" : "Create"}</button>
            </div>
          </div>
        </form>
      )}
      <ul>
        {sendingMessages.map(message => {
          return (
            <li>
              <Message
                message={inProgress ? "In Progress" : message}
                type={sendingSuccess ? "success" : "error"}
              />
            </li>
          );
        })}
      </ul>

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
