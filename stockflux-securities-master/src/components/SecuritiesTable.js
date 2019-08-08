import React, { useEffect, useState, useCallback } from "react";
import Components from "stockflux-components";
import { Link } from "react-router-dom";
import "./SecuritiesTable.css";
import {
  getSecuritiesData,
  deleteSecurity,
  patchSecurity
} from "../services/SecuritiesService";
import ValidationError from "../services/ValidationError";
import AddSecurityButton from "./ButtonAddSecurity";
import Alert from "./Alert";
import { TableState } from "../enums";
import ToolTip from "./ToolTip";

const tableBody = (
  onClickDelete,
  securitiesData,
  state,
  patchSecurityHandler
) => {
  return (
    <div className="table-body">
      {securitiesData.length === 0 && state !== TableState.error ? (
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
                <ToolTip message="Edit">
                  <Link to={`/inputform/${item.securityId}`}>
                    <button className="securities-table-button">
                      <span className="material-icons">edit</span>
                    </button>
                  </Link>
                </ToolTip>
                <ToolTip message="Delete">
                  <button
                    className="securities-table-button"
                    onClick={() => onClickDelete(item.securityId)}
                  >
                    <span className="material-icons">delete</span>
                  </button>
                </ToolTip>
                <ToolTip message="Visibility">
                  <button
                    className={`securities-table-button ${
                      item.visible ? "" : "greyed-out"
                    }`}
                    onClick={() =>
                      patchSecurityHandler(item.securityId, {
                        visible: !item.visible
                      })
                    }
                  >
                    <span className="material-icons">
                      {item.visible ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </ToolTip>
                <ToolTip message="Enabled?">
                  <button
                    className={`securities-table-button ${
                      item.enabled ? "" : "greyed-out"
                    }`}
                    onClick={() =>
                      patchSecurityHandler(item.securityId, {
                        enabled: !item.enabled
                      })
                    }
                  >
                    <span className="material-icons">
                      {item.enabled ? "done" : "clear"}
                    </span>
                  </button>
                </ToolTip>
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
      .then(() => {
        getSecuritiesHandler(["Security Successfully Deleted"]);
      })
      .catch(err => {
        errorHandler(err);
      });
  };

  const patchSecurityHandler = (securityId, updates) => {
    setState(TableState.updating);
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
        setState(TableState.success);
        setMessages([response.message]);
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
          {tableBody(
            onClickDelete,
            securitiesData,
            state,
            patchSecurityHandler
          )}
          {messages.length > 0 &&
            (state === TableState.success || state === TableState.error) && (
              <div
                className={`securities-message-container ${
                  securitiesData.length === 0 ? "no-securities" : ""
                }`}
              >
                <Alert messages={messages} type={state} />
              </div>
            )}
          {(state === TableState.deleting || state == TableState.updating) && (
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
