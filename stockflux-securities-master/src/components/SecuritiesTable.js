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
import { tableEnum } from "../enums";

const tableBody = (onClickDelete, securitiesData, tableState) => {
  return (
    <div className="table-body">
      {securitiesData.length === 0 && tableState !== tableEnum.error ? (
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
                  <div className="securities-table-button">
                    <button>
                      <span className="material-icons">edit</span>
                    </button>
                  </div>
                </Link>
                <div className="securities-table-button">
                  <button onClick={() => onClickDelete(item.securityId)}>
                    <span className="material-icons">delete</span>
                  </button>
                </div>
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
  const [tableState, setTableState] = useState(tableEnum.loading);

  const errorHandler = err => {
    setTableState(tableEnum.error);
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
        setTableState(tableEnum.success);
        setMessages(messages);
      })
      .catch(err => {
        setSecuritiesData([]);
        errorHandler(err);
      });
  }, []);

  useEffect(() => {
    setTableState(tableEnum.loading);
    getSecuritiesHandler(!!location.state ? location.state.messages : []);
  }, [getSecuritiesHandler, location.state]);

  const onClickDelete = securityId => {
    setTableState(tableEnum.deleting);
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
      {tableState === tableEnum.loading ? (
        <div className="spinner-container">
          <Components.LargeSpinner />
        </div>
      ) : (
        <>
          {tableBody(onClickDelete, securitiesData, tableState)}
          {messages.length > 0 &&
            (tableState === tableEnum.success ||
              tableState === tableEnum.error) && (
              <div
                className={`securities-message-container ${
                  securitiesData.length === 0 ? "no-securities" : ""
                }`}
              >
                <Alert messages={messages} type={tableState} />
              </div>
            )}
          {tableState === tableEnum.deleting && (
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
