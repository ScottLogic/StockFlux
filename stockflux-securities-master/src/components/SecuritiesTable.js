import React from "react";
import Components from "stockflux-components";
import "./SecuritiesTable.css";

// hard coded data to be replaced with data from backend
let SECURITIES_DATA = [
  { Exch: "LSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "LSE", Symbol: "TSLA", Name: "Tesla inc." },
  { Exch: "NYSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "STFX", Symbol: "SCOTT", Name: "Scott Logic inc." },
  { Exch: "LSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "LSE", Symbol: "TSLA", Name: "Tesla inc." },
  { Exch: "NYSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "STFX", Symbol: "SCOTT", Name: "Scott Logic inc." },
  { Exch: "LSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "LSE", Symbol: "TSLA", Name: "Tesla inc." },
  { Exch: "NYSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "STFX", Symbol: "SCOTT", Name: "Scott Logic inc." },
  { Exch: "LSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "LSE", Symbol: "TSLA", Name: "Tesla inc." },
  { Exch: "NYSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "STFX", Symbol: "SCOTT", Name: "Scott Logic inc." },
  { Exch: "LSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "LSE", Symbol: "TSLA", Name: "Tesla inc." },
  { Exch: "NYSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "STFX", Symbol: "SCOTT", Name: "Scott Logic inc." },
  { Exch: "LSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "LSE", Symbol: "TSLA", Name: "Tesla inc." },
  { Exch: "NYSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "STFX", Symbol: "SCOTT", Name: "Scott Logic inc." },
  { Exch: "LSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "LSE", Symbol: "TSLA", Name: "Tesla inc." },
  { Exch: "NYSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "STFX", Symbol: "SCOTT", Name: "Scott Logic inc." },
  { Exch: "LSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "LSE", Symbol: "TSLA", Name: "Tesla inc." },
  { Exch: "NYSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "STFX", Symbol: "SCOTT", Name: "Scott Logic inc." },
  { Exch: "STFX", Symbol: "SCOTT", Name: "Scott Logic inc." },
  { Exch: "LSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "LSE", Symbol: "TSLA", Name: "Tesla inc." },
  { Exch: "NYSE", Symbol: "AAPL", Name: "Apple inc." },
  { Exch: "STFX", Symbol: "SCOTT", Name: "Scott Logic inc." }
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
              <div className="securities-exchange-data">{item.Exch}</div>
              <div className="securities-symbol-data">{item.Symbol}</div>
              <div className="securities-name-data">{item.Name}</div>
            </div>
          ))}
        </Components.ScrollWrapperY>
      </div>
    </div>
  );
};

export default SecuritiesTable;
