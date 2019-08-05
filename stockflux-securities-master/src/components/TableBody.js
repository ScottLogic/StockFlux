import React from "react";
import "./TableBody.css";
import Components from "stockflux-components";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { tableEnum } from "../enums";
import AddSecurityButton from "./AddSecurityButton";

const TableBody = ({ securitiesData, tableState, onClickDelete }) => {
  return (
    <div className="table-body">
      {securitiesData.length === 0 && tableState !== tableEnum.error ? (
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
              <div className="securities-exchange-data">{item.exchange}</div>
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
              </div>
            </div>
          ))}
        </Components.ScrollWrapperY>
      )}
    </div>
  );
};

TableBody.propTypes = {
  securitiesData: PropTypes.array,
  tableState: PropTypes.oneOf([
    tableEnum.success,
    tableEnum.error,
    tableEnum.loading,
    tableEnum.deleting
  ]),
  onClickDelete: PropTypes.func
};

export default TableBody;
