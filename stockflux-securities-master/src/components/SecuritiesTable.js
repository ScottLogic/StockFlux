import React, { useEffect, useState } from "react";
import Components from "stockflux-components";
import "./SecuritiesTable.css";
import { Link } from "react-router-dom";
import {
  getSecuritiesData,
  deleteSecurity,
  patchSecurity
} from "../services/SecuritiesService";
import ValidationError from "../services/ValidationError";
import AddSecurityButton from "./AddSecurityButton";
import Alert from "./Alert";
import ToolTip from "./ToolTip";

const SecuritiesTable = () => {
  const stateEnum = {
    loading: "loading",
    deleting: "deleting",
    error: "error",
    success: "success"
  };

  const [securitiesData, setSecuritiesData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tableState, setTableState] = useState(stateEnum.loading);

  const errorHandler = err => {
    setTableState(stateEnum.error);
    if (err instanceof ValidationError) {
      setMessages(err.messages);
    } else {
      setMessages([err.message]);
    }
  };

  useEffect(() => {
    setTableState(stateEnum.loading);
    getSecuritiesData()
      .then(securities => {
        setSecuritiesData(securities);
        setTableState(stateEnum.success);
        setMessages([]);
      })
      .catch(err => {
        errorHandler(err);
      });
  }, []);

  const onClickDelete = securityId => {
    setTableState(stateEnum.deleting);
    setMessages([]);
    deleteSecurity(securityId)
      .then(response => {
        getSecuritiesData()
          .then(securities => {
            setSecuritiesData(securities);
            setTableState(stateEnum.success);
            setMessages([response.message]);
          })
          .catch(err => {
            setSecuritiesData([]);
            errorHandler(err);
          });
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
      {tableState === stateEnum.loading ? (
        <div className="spinner-container">
          <Components.LargeSpinner />
        </div>
      ) : (
        <>
          <div className="table-body">
            {securitiesData.length === 0 && tableState !== stateEnum.error ? (
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
                    <div className="securities-exchange-data">
                      {item.exchange}
                    </div>
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
                      <ToolTip message="visibility">
                        <div
                          className={`securities-visibility-button ${
                            item.visible ? "" : "greyed-out"
                          }`}
                        >
                          <button>
                            <span className="material-icons">
                              {item.visible ? "visibility" : "visibility_off"}
                            </span>
                          </button>
                        </div>
                      </ToolTip>
                      <ToolTip message="enabled?">
                        <div
                          className={`securities-enabled-button ${
                            item.enabled ? "" : "greyed-out"
                          }`}
                        >
                          <button>
                            <span className="material-icons">
                              {item.enabled ? "done" : "clear"}
                            </span>
                          </button>
                        </div>
                      </ToolTip>
                    </div>
                  </div>
                ))}
              </Components.ScrollWrapperY>
            )}
          </div>
          {messages.length > 0 &&
            (tableState === stateEnum.success ||
              tableState === stateEnum.error) && (
              <div
                className={`securities-message-container ${
                  securitiesData.length === 0 ? "no-securities" : ""
                }`}
              >
                <Alert messages={messages} type={tableState} />
              </div>
            )}
          {tableState === stateEnum.deleting && (
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
