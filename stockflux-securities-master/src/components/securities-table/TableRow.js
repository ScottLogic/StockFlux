import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import ToolTip from "../tool-tip/ToolTip";
import {
  FaPen,
  FaTrashAlt,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes
} from "react-icons/fa";
import PropTypes from "prop-types";
import "./TableRow.css";

const TableRow = ({ item, deleteSecurity, patchSecurity }) => {
  const handleDelete = () => {
    deleteSecurity(item.securityId);
  };

  const handleToggleVisible = () => {
    patchSecurity(item.securityId, {
      visible: !item.visible
    });
  };

  const handleToggleEnabled = () => {
    patchSecurity(item.securityId, {
      enabled: !item.enabled
    });
  };

  return (
    <div className="securities-table-row">
      {[item.exchange, item.symbol, item.name].map(cellData => (
        <div className="securities-table-cell">{cellData}</div>
      ))}
      <div className="securities-table-cell">
        <ToolTip message="Edit">
          <Link to={`/inputform/${item.securityId}`}>
            <button className="securities-table-button">
              <FaPen size={20} />
            </button>
          </Link>
        </ToolTip>
        <ToolTip message="Delete">
          <button className="securities-table-button" onClick={handleDelete}>
            <FaTrashAlt size={20} />
          </button>
        </ToolTip>
        <ToolTip message={item.visible ? "Hide" : "Show"}>
          <button
            className={classNames("securities-table-button", {
              "feature-off": !item.visible
            })}
            onClick={handleToggleVisible}
          >
            {item.visible ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
          </button>
        </ToolTip>
        <ToolTip message={item.enabled ? "Disable" : "Enable"}>
          <button
            className={classNames("securities-table-button", {
              "feature-off": !item.enabled
            })}
            onClick={handleToggleEnabled}
          >
            {item.enabled ? <FaCheck size={20} /> : <FaTimes size={20} />}
          </button>
        </ToolTip>
      </div>
    </div>
  );
};

TableRow.propTypes = {
  item: PropTypes.object.isRequired,
  deleteSecurity: PropTypes.func.isRequired,
  patchSecurity: PropTypes.func.isRequired
};

export default TableRow;
