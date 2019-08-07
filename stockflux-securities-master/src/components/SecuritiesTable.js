import React, { useEffect, useState } from "react";
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
              <div className="securities-exchange-data">{item.exchange}</div>
              <div className="securities-symbol-data">{item.symbol}</div>
              <div className="securities-name-data">{item.name}</div>
              <div className="securities-row-options">
                <Link to={`/inputform/${item.securityId}`}>
                  <div className="securities-edit-button">
                    <button>
                      <span className="material-icons">edit</span>
                    </button>
                  </div>
                </Link>
                <div className="securities-delete-button">
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

const SecuritiesTable = ({ match }) => {
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

  const getSecuritiesHandler = messages => {
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
  };

  useEffect(() => {
    setTableState(tableEnum.loading);
    getSecuritiesHandler(!!match.params.message ? [match.params.message] : []);
  }, []);

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
      <div className="securities-title-container">
        <div className="securities-title">Securities</div>
        <div className="add-securities-button-above-table">
          {securitiesData.length > 0 && <AddSecurityButton size="small" />}
        </div>
      </div>
      <div className="header-container">
        <div className="securities-table-header">Exchange</div>
        <div className="securities-table-header">Symbol</div>
        <div className="securities-table-header">Name</div>
        <div className="securities-table-header">Edit / Delete</div>
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
