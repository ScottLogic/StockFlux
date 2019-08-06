import React, { useEffect, useState } from "react";
import Components from "stockflux-components";
import "./SecuritiesTable.css";
import {
  getSecuritiesData,
  deleteSecurity,
  patchSecurity
} from "../services/SecuritiesService";
import ValidationError from "../services/ValidationError";
import AddSecurityButton from "./AddSecurityButton";
import Alert from "./Alert";
import TableBody from "./TableBody";
import { tableEnum } from "../enums";

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

  const patchSecurityHandler = (securityId, updates) => {
    setTableState(tableEnum.updating);
    patchSecurity(securityId, updates)
      .then(response => {
        const newSecuritiesData = [];
        securitiesData.forEach(item => {
          if (item.securityId === securityId) {
            newSecuritiesData.push({ ...item, ...updates });
          } else {
            newSecuritiesData.push(item);
          }
        });
        setSecuritiesData(newSecuritiesData);
        setTableState(tableEnum.success);
        setMessages([response.message]);
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
        <div className="securities-table-header">Options</div>
      </div>
      {tableState === tableEnum.loading ? (
        <div className="spinner-container">
          <Components.LargeSpinner />
        </div>
      ) : (
        <>
          <TableBody
            securitiesData={securitiesData}
            tableState={tableState}
            onClickDelete={onClickDelete}
            patchSecurityHandler={patchSecurityHandler}
          />
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
          {(tableState === tableEnum.deleting ||
            tableState == tableEnum.updating) && (
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
