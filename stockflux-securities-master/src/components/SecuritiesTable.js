import React from "react";
import Components from "stockflux-components";
import "./SecuritiesTable.css";

// hard coded data to be replaced with data from backend
const SECURITIES_DATA = [
  { exch: "LSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "LSE", symbol: "TSLA", name: "Tesla inc." },
  { exch: "NYSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "STFX", symbol: "SCOTT", name: "Scott Logic inc." },
  { exch: "LSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "LSE", symbol: "TSLA", name: "Tesla inc." },
  { exch: "NYSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "STFX", symbol: "SCOTT", name: "Scott Logic inc." },
  { exch: "LSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "LSE", symbol: "TSLA", name: "Tesla inc." },
  { exch: "NYSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "STFX", symbol: "SCOTT", name: "Scott Logic inc." },
  { exch: "LSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "LSE", symbol: "TSLA", name: "Tesla inc." },
  { exch: "NYSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "STFX", symbol: "SCOTT", name: "Scott Logic inc." },
  { exch: "LSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "LSE", symbol: "TSLA", name: "Tesla inc." },
  { exch: "NYSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "STFX", symbol: "SCOTT", name: "Scott Logic inc." },
  { exch: "LSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "LSE", symbol: "TSLA", name: "Tesla inc." },
  { exch: "NYSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "STFX", symbol: "SCOTT", name: "Scott Logic inc." },
  { exch: "LSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "LSE", symbol: "TSLA", name: "Tesla inc." },
  { exch: "NYSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "STFX", symbol: "SCOTT", name: "Scott Logic inc." },
  { exch: "LSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "LSE", symbol: "TSLA", name: "Tesla inc." },
  { exch: "NYSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "STFX", symbol: "SCOTT", name: "Scott Logic inc." },
  { exch: "STFX", symbol: "SCOTT", name: "Scott Logic inc." },
  { exch: "LSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "LSE", symbol: "TSLA", name: "Tesla inc." },
  { exch: "NYSE", symbol: "AAPL", name: "Apple inc." },
  { exch: "STFX", symbol: "SCOTT", name: "Scott Logic inc." }
];

const SecuritiesTable = () => {
  return (
    <div className="securities-container">
      <div className="securities-title">My Securities Table</div>
      <div className="header-container">
        <div className="securities-table-header">Exchange</div>
        <div className="securities-table-header">Symbol</div>
        <div className="securities-table-header">Name</div>
      </div>
      <div className="table-body">
        <Components.ScrollWrapperY>
          {SECURITIES_DATA.map((item, index) => (
            <div key={index} className="securities-table-row">
              <div className="securities-exchange-data">{item.exch}</div>
              <div className="securities-symbol-data">{item.symbol}</div>
              <div className="securities-name-data">{item.name}</div>
            </div>
          ))}
        </Components.ScrollWrapperY>
      </div>
    </div>
  );
};

export default SecuritiesTable;
