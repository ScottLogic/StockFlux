import React, { useEffect, useState, useCallback, useReducer } from "react";
import Components from "stockflux-components";
import { Link } from "react-router-dom";
import "./SecuritiesTable.css";
import * as service from "../services/SecuritiesService";
import ValidationError from "../services/ValidationError";
import Alert, { AlertType } from "./Alert";
import { TableState } from "../enums";
import ToolTip from "./ToolTip";
import Button, { ButtonSize } from "./Button";
import {
  FaPen,
  FaTrashAlt,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes
} from "react-icons/fa";
import {
  securitiesTableReducer,
  initialTableState
} from "../reducers/securitiesTableReducer";
import PropTypes from "prop-types";

const SecuritiesTable = ({ location }) => {
  const [securitiesData, setSecuritiesData] = useState([]);
  const [state, dispatch] = useReducer(
    securitiesTableReducer,
    initialTableState
  );

  const handleError = err => {
    dispatch({
      type: TableState.ERROR,
      messages: err instanceof ValidationError ? err.messages : [err.message]
    });
  };

  const loadSecurities = useCallback(messages => {
    service
      .getSecuritiesData()
      .then(securities => {
        setSecuritiesData(securities);
        dispatch({ type: TableState.SUCCESS, messages: messages });
      })
      .catch(err => {
        setSecuritiesData([]);
        handleError(err);
      });
  }, []);

  useEffect(() => {
    dispatch({ type: TableState.LOADING });
    loadSecurities(!!location.state ? location.state.messages : []);
  }, [loadSecurities, location.state]);

  const deleteSecurity = securityId => {
    dispatch({ type: TableState.UPDATING });
    service
      .deleteSecurity(securityId)
      .then(() => {
        loadSecurities(["Security Successfully Deleted"]);
      })
      .catch(err => {
        handleError(err);
      });
  };

  const patchSecurity = (securityId, updates) => {
    dispatch({ type: TableState.UPDATING });
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
        {securitiesData.length === 0 && !state.hasErrors ? (
          <div className="no-securities-container">
            <div className="no-securities-message">
              You have no securities to show
            </div>
            <Link to="/inputform">
              <Button
                text="Add Security"
                size={ButtonSize.LARGE}
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
                      className={`securities-table-button ${!item.visible &&
                        "greyed-out"}`}
                      onClick={() =>
                        patchSecurity(item.securityId, {
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
                      className={`securities-table-button ${!item.enabled &&
                        "greyed-out"}`}
                      onClick={() =>
                        patchSecurity(item.securityId, {
                          enabled: !item.enabled
                        })
                      }
                    >
                      {item.enabled ? (
                        <FaCheck size={20} />
                      ) : (
                        <FaTimes size={20} />
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
                size={ButtonSize.SMALL}
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
      {state.fetchStatus === TableState.LOADING ? (
        <div className="spinner-container">
          <Components.LargeSpinner />
        </div>
      ) : (
        <>
          {tableBody()}
          {state.messages.length > 0 && (
            <div
              className={`securities-message-container ${securitiesData.length ===
                0 && "no-securities"}`}
            >
              <Alert
                messages={state.messages}
                type={state.hasErrors ? AlertType.ERROR : AlertType.SUCCESS}
              />
            </div>
          )}
          {state.fetchStatus === TableState.UPDATING && (
            <div className="table-deleting-spinner-container">
              <Components.Spinner />
            </div>
          )}
        </>
      )}
    </div>
  );
};

SecuritiesTable.propTypes = {
  location: PropTypes.object.isRequired
};

export default SecuritiesTable;
