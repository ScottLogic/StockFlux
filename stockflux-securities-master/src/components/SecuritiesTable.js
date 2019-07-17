import React, { useEffect, useState } from "react";
import Components from "stockflux-components";
import "./SecuritiesTable.css";
import { Link } from "react-router-dom";
import { getSecuritiesData } from "../services/SecuritiesService";

const SecuritiesTable = () => {
  const [securitiesData, setSecuritiesData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState(null);

  const timeoutMessage = "Error, unable to get securities data. Please try again!";

  useEffect(() => {
    setIsLoading(true);
    getSecuritiesData()
      .then(securities => {
        setIsLoading(false);
        setSecuritiesData(securities);
        setErrorMessage(null);
      })
      .catch(() => {
        setIsLoading(false);
        setErrorMessage(timeoutMessage);
      });
  }, []);

  return (
    <div className="securities-container">
      <div className="securities-title">My Securities Table</div>
      <div className="header-container">
        <div className="securities-table-header">Exchange</div>
        <div className="securities-table-header">Symbol</div>
        <div className="securities-table-header">Name</div>
        <div className="securities-table-header">Edit / Delete</div>
      </div>
      {isLoading ? (
        <div className="spinner-container">
          <Components.LargeSpinner />
        </div>
      ) : errorMessage ? (
        <div className="securities-error-message">
          {errorMessage}
        </div>
        ) : (
        <div className="table-body">
          {securitiesData.length > 0 ? (
            <Components.ScrollWrapperY>
              {securitiesData.map((item, index) => (
                <div key={index} className="securities-table-row">
                  <div className="securities-exchange-data">
                    {item.securityId}
                  </div>
                  <div className="securities-symbol-data">{item.symbol}</div>
                  <div className="securities-name-data">{item.name}</div>
                  <div className="securities-row-options">
                  <Link to="/inputform/edit"><div className="securities-edit-button"><button><span className="material-icons">edit</span></button></div></Link>
                  <div className="securities-delete-button"><button><span className="material-icons">delete</span></button></div>
                  </div>
                </div>
              ))}
            </Components.ScrollWrapperY>
          ) : (
            <div className="no-securities-container">
              <div className="no-securities-message">
                You have no securities to show
              </div>
              <Link to="/inputform">
                <div className="add-security-button"><button>Click to add security</button></div>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SecuritiesTable;
