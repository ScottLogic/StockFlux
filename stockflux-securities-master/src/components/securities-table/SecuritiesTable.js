import React, { useEffect, useCallback, useReducer } from "react";
import Components from "stockflux-components";
import { Link } from "react-router-dom";
import "./SecuritiesTable.css";
import * as service from "../../services/SecuritiesService";
import ValidationError from "../../services/ValidationError";
import Alert, { AlertType } from "../alert/Alert";
import { FetchState } from "../../enums";
import Button, { ButtonSize } from "../button/Button";
import {
  securitiesTableReducer,
  initialTableState
} from "../../reducers/securitiesTable";
import {
  tableLoading,
  tableUpdating,
  tableError,
  tableSuccess,
  setSecuritiesData
} from "../../actions/securitiesTable";
import PropTypes from "prop-types";
import classNames from "classnames";
import TableBody from "./TableBody";

const SecuritiesTable = ({ location }) => {
  const [state, dispatch] = useReducer(
    securitiesTableReducer,
    initialTableState
  );

  const handleError = err => {
    const message =
      err instanceof ValidationError ? err.messages : [err.message];
    dispatch(tableError(message));
  };

  const loadSecurities = useCallback(messages => {
    service
      .getSecuritiesData()
      .then(securities => {
        dispatch(setSecuritiesData(securities));
        dispatch(tableSuccess(messages));
      })
      .catch(err => {
        dispatch(setSecuritiesData([]));
        handleError(err);
      });
  }, []);

  useEffect(() => {
    dispatch(tableLoading());
    loadSecurities(!!location.state ? location.state.messages : []);
  }, [loadSecurities, location.state]);

  const deleteSecurity = securityId => {
    dispatch(tableUpdating());
    service
      .deleteSecurity(securityId)
      .then(() => {
        loadSecurities(["Security Successfully Deleted"]);
      })
      .catch(handleError);
  };

  const patchSecurity = (securityId, updates) => {
    dispatch(tableUpdating());
    service
      .patchSecurity(securityId, updates)
      .then(() => {
        loadSecurities(["Security Updated"]);
      })
      .catch(handleError);
  };

  return (
    <div className="securities">
      <div className="header">
        <h1 className="title">Securities</h1>
        <div className="add-securities-button-above-table">
          {state.securitiesData.length > 0 && (
            <Link to="/inputform">
              <Button size={ButtonSize.SMALL} className="add-securities-button">
                Add Security
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="headings">
        {["Exchange", "Symbol", "Name", "Options"].map(heading => (
          <h2 key={heading} className={"table-heading"}>
            {heading}
          </h2>
        ))}
      </div>
      {state.fetchStatus === FetchState.LOADING ? (
        <div className="spinner-container">
          <Components.LargeSpinner />
        </div>
      ) : (
        <>
          <TableBody
            state={state}
            deleteSecurity={deleteSecurity}
            patchSecurity={patchSecurity}
          />
          {state.messages.length > 0 && (
            <div
              className={classNames("messages-container", {
                "no-securities": state.securitiesData.length === 0
              })}
            >
              <Alert
                messages={state.messages}
                type={state.hasErrors ? AlertType.ERROR : AlertType.SUCCESS}
              />
            </div>
          )}
          {state.fetchStatus === FetchState.UPDATING && (
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
