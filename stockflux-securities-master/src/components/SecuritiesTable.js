import React, { useEffect, useState, useCallback } from "react";
import Components from "stockflux-components";
import { Link } from "react-router-dom";
import "./SecuritiesTable.css";
import * as service from "../services/SecuritiesService";
import ValidationError from "../services/ValidationError";
import Alert from "./Alert";
import { TableState } from "../enums";
import ToolTip from "./ToolTip";
import Button from "./Button";
import { FaPen, FaTrashAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdClose, MdCheck } from "react-icons/md";

const SecuritiesTable = ({ location }) => {
  const [securitiesData, setSecuritiesData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [state, setState] = useState(TableState.LOADING);

  const handleError = err => {
    setState(TableState.ERROR);
    if (err instanceof ValidationError) {
      setMessages(err.messages);
    } else {
      setMessages([err.message]);
    }
  };

  const loadSecurities = useCallback(messages => {
    service
      .getSecuritiesData()
      .then(securities => {
        setSecuritiesData(securities);
        setState(TableState.SUCCESS);
        setMessages(messages);
      })
      .catch(err => {
        setSecuritiesData([]);
        handleError(err);
      });
  }, []);

  useEffect(() => {
    setState(TableState.LOADING);
    loadSecurities(!!location.state ? location.state.messages : []);
  }, [loadSecurities, location.state]);

  const deleteSecurity = securityId => {
    setState(TableState.DELETING);
    setMessages([]);
    service
      .deleteSecurity(securityId)
      .then(() => {
        loadSecurities(["Security Successfully Deleted"]);
      })
      .catch(err => {
        handleError(err);
      });
  };

  const patchSecurityHandler = (securityId, updates) => {
    setState(TableState.UPDATING);
    service
      .patchSecurity(securityId, updates)
      .then(() => {
        loadSecurities(["Security Updated"]);
      })
      .catch(err => {
        handleError(err);
      });
  };

  const tableBody = () => {
    return (
      <div className="table-body">
        {securitiesData.length === 0 && state !== TableState.ERROR ? (
          <div className="no-securities-container">
            <div className="no-securities-message">
              You have no securities to show
            </div>
            <Link to="/inputform">
              <Button
                text="Add Security"
                size="large"
                className="add-securities-button"
              />
            </Link>
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
                        <FaPen size={20} />
                      </button>
                    </Link>
                  </ToolTip>
                  <ToolTip message="Delete">
                    <button
                      className="securities-table-button"
                      onClick={() => deleteSecurity(item.securityId)}
                    >
                      <FaTrashAlt size={20} />
                    </button>
                  </ToolTip>
                  <ToolTip message={item.visible ? "Hide" : "Show"}>
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
                      {item.visible ? (
                        <FaEye size={20} />
                      ) : (
                        <FaEyeSlash size={20} />
                      )}
                    </button>
                  </ToolTip>
                  <ToolTip message={item.enabled ? "Disable" : "Enable"}>
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
                      {item.enabled ? (
                        <MdCheck size={20} />
                      ) : (
                        <MdClose size={20} />
                      )}
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

  return (
    <div className="securities-container">
      <div className="securities-header-container">
        <h1 className="securities-title">Securities</h1>
        <div className="add-securities-button-above-table">
          {securitiesData.length > 0 && (
            <Link to="/inputform">
              <Button
                text="Add Security"
                size="small"
                className="add-securities-button"
              />
            </Link>
          )}
        </div>
      </div>
      <div className="heading-container">
        <h2 className="securities-table-heading">Exchange</h2>
        <h2 className="securities-table-heading">Symbol</h2>
        <h2 className="securities-table-heading">Name</h2>
        <h2 className="securities-table-heading">Edit / Delete</h2>
      </div>
      {state === TableState.LOADING ? (
        <div className="spinner-container">
          <Components.LargeSpinner />
        </div>
      ) : (
        <>
          {tableBody()}
          {messages.length > 0 &&
            (state === TableState.SUCCESS || state === TableState.ERROR) && (
              <div
                className={`securities-message-container ${
                  securitiesData.length === 0 ? "no-securities" : ""
                }`}
              >
                <Alert messages={messages} type={state} />
              </div>
            )}
          {(state === TableState.DELETING || state === TableState.UPDATING) && (
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
