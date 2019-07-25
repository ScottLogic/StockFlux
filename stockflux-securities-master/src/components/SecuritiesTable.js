import React, { useEffect, useState } from "react";
import Components from "stockflux-components";
import "./SecuritiesTable.css";
import { Link } from "react-router-dom";
import { getSecuritiesData } from "../services/SecuritiesService";
import AddSecurityButton from "./AddSecurityButton";
import Alert from "./Alert";

const SecuritiesTable = () => {
  const [securitiesData, setSecuritiesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessages, setErrorMessages] = useState([null]);
  const timeoutMessage =
    "Error, unable to get securities data. Please try again!";

  useEffect(() => {
    setIsLoading(true);
    getSecuritiesData()
      .then(securities => {
        setIsLoading(false);
        setSecuritiesData(securities);
        setErrorMessages(null);
      })
      .catch(() => {
        setIsLoading(false);
        setErrorMessages([timeoutMessage]);
      });
  }, []);

  return (
    <div className="securities-container">
      <div className="securities-title-container">
        <div className="securities-title">Securities</div>
        <div className="add-securities-button-above-table">
          {securitiesData.length > 0 && !errorMessages && (
            <AddSecurityButton size="small" />
          )}
        </div>
      </div>
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
      ) : errorMessages ? (
        <div className="securities-message-container">
          <Alert messages={errorMessages} type="error" />
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
                    <Link to={`/inputform/${item.securityId}`}>
                      <div className="securities-edit-button">
                        <button>
                          <span className="material-icons">edit</span>
                        </button>
                      </div>
                    </Link>
                    <div className="securities-delete-button">
                      <button disabled>
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Components.ScrollWrapperY>
          ) : (
            <div className="no-securities-container">
              <div className="no-securities-message">
                You have no securities to show
              </div>
              <AddSecurityButton size="large" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SecuritiesTable;
