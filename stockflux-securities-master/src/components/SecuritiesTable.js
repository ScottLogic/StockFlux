import React, { useEffect, useState, useCallback } from "react";
import Components from "stockflux-components";
import { Link } from "react-router-dom";
import "./SecuritiesTable.css";
import {
  getSecuritiesData,
  deleteSecurity
} from "../services/SecuritiesService";
import ValidationError from "../services/ValidationError";
import AddSecurityButton from "./ButtonAddSecurity";
import Alert from "./Alert";
import { TableState } from "../enums";

const tableBody = (onClickDelete, securitiesData, tableState) => {
  return (
    <div className="table-body">
      {securitiesData.length === 0 && tableState !== TableState.error ? (
        <div className="no-securities-container">
          <div className="no-securities-message">
            You have no securities to show
          </div>
          <AddSecurityButton size="large" />
        </div>
      ) : (
        <Components.ScrollWrapperY>
          {securitiesData.map((item, index) => (
            <div key={index} className="securities-table-row">
              <div className="securities-table-cell">{item.exchange}</div>
              <div className="securities-table-cell">{item.symbol}</div>
              <div className="securities-table-cell">{item.name}</div>
              <div className="securities-table-cell">
                <Link to={`/inputform/${item.securityId}`}>
                  <button className="securities-table-button">
                    <span className="material-icons">edit</span>
                  </button>
                </Link>
                <button
                  className="securities-table-button"
                  onClick={() => onClickDelete(item.securityId)}
                >
                  <span className="material-icons">delete</span>
                </button>
              </div>
            </div>
          ))}
        </Components.ScrollWrapperY>
      )}
    </div>
  );
};

const SecuritiesTable = ({ location }) => {
  const [securitiesData, setSecuritiesData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [state, setState] = useState(TableState.loading);

  const errorHandler = err => {
    setState(TableState.error);
    if (err instanceof ValidationError) {
      setMessages(err.messages);
    } else {
      setMessages([err.message]);
    }
  };

  const getSecuritiesHandler = useCallback(messages => {
    getSecuritiesData()
      .then(securities => {
        setSecuritiesData(securities);
        setState(TableState.success);
        setMessages(messages);
      })
      .catch(err => {
        setSecuritiesData([]);
        errorHandler(err);
      });
  }, []);

  useEffect(() => {
    setState(TableState.loading);
    getSecuritiesHandler(!!location.state ? location.state.messages : []);
  }, [getSecuritiesHandler, location.state]);

  const onClickDelete = securityId => {
    setState(TableState.deleting);
    setMessages([]);
    deleteSecurity(securityId)
      .then(response => {
        getSecuritiesHandler([response.message]);
      })
      .catch(err => {
        errorHandler(err);
      });
  };

  return (
    <div className="securities-container">
      <div className="securities-header-container">
        <h1 className="securities-title">Securities</h1>
        <div className="add-securities-button-above-table">
          {securitiesData.length > 0 && <AddSecurityButton size="small" />}
        </div>
      </div>
      <div className="heading-container">
        <h2 className="securities-table-heading">Exchange</h2>
        <h2 className="securities-table-heading">Symbol</h2>
        <h2 className="securities-table-heading">Name</h2>
        <h2 className="securities-table-heading">Edit / Delete</h2>
      </div>
      {state === TableState.loading ? (
        <div className="spinner-container">
          <Components.LargeSpinner />
        </div>
      ) : (
        <>
          {tableBody(onClickDelete, securitiesData, state)}
          {messages.length > 0 &&
            (state === TableState.success ||
              state === TableState.error) && (
              <div
                className={`securities-message-container ${
                  securitiesData.length === 0 ? "no-securities" : ""
                }`}
              >
                <Alert messages={messages} type={state} />
              </div>
            )}
          {state === TableState.deleting && (
            <div className="table-deleting-spinner-container">
              <Components.Spinner />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SecuritiesTable;
