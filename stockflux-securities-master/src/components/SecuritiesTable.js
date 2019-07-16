import React, { useEffect, useState } from "react";
import Components from "stockflux-components";
import "./SecuritiesTable.css";
import { Link } from "react-router-dom";

async function getSecuritiesData() {
  //temporarily using local host, will need to change to the AWS location
  const response = await fetch("http://localhost:3001/securities");
  const securities = await response.json();
  return securities;
}


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
        setErrorMessage(null)
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
