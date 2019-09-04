import React from "react";
import { Link } from "react-router-dom";
import Components from "stockflux-components";
import PropTypes from "prop-types";
import Button, { ButtonSize } from "../button/Button";
import TableRow from "./TableRow";
import "./TableBody.css";

const TableBody = ({ state, deleteSecurity, patchSecurity }) => (
  <div className="table-body">
    {state.securitiesData.length === 0 && !state.hasErrors ? (
      <div className="no-securities-container">
        <div className="no-securities-message">
          You have no securities to show
        </div>
        <Link to="/inputform">
          <Button size={ButtonSize.LARGE}>Add Security</Button>
        </Link>
      </div>
    ) : (
      <Components.ScrollWrapperY>
        {state.securitiesData.map(item => (
          <TableRow
            key={item.securityId}
            item={item}
            deleteSecurity={deleteSecurity}
            patchSecurity={patchSecurity}
          />
        ))}
      </Components.ScrollWrapperY>
    )}
  </div>
);

TableBody.propTypes = {
  state: PropTypes.object.isRequired,
  deleteSecurity: PropTypes.func.isRequired,
  patchSecurity: PropTypes.func.isRequired
};

export default TableBody;
