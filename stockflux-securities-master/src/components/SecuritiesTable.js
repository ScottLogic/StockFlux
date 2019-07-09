import React, { useEffect, useState } from "react";
import Components from "stockflux-components";
import "./SecuritiesTable.css";

async function getSecuritiesData() {
  const response = await fetch("http://ws00128:3001/securities");
  const securities = await response.json();
  return securities;
}

const SecuritiesTable = () => {
  const [securitiesData, setSecuritiesData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getSecuritiesData().then(securities => {
      setIsLoading(false);
      setSecuritiesData(securities);
    });
    getSecuritiesData().catch(() => {
      setIsLoading(false);
    })
  }, []);

  return (
    <div className="securities-container">
        <>
          <div className="securities-title">My Securities Table</div>
          <div className="header-container">
            <div className="securities-table-header">Exchange</div>
            <div className="securities-table-header">Symbol</div>
            <div className="securities-table-header">Name</div>
          </div>
          {isLoading ? <Components.LargeSpinner /> :
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
            <>
            <div className="no-securities-container">
              <div className="no-securities-message">You have no securities to show</div>
              <div className="add-security-button"><button>Click to add security</button></div>
            </div>
            </>
          )}
          </div>
        }
        </>
    </div>
  );
};

export default SecuritiesTable;
