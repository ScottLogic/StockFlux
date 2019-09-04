import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import ToolTip from '../tool-tip/ToolTip';
import { FaPen, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './TableRow.css';

const TableRow = ({ item, deleteSecurity, patchSecurity }) => {
  const handleDelete = () => {
    deleteSecurity(item.securityId);
  };

  const handleToggleEnabled = () => {
    patchSecurity(item.securityId, {
      enabled: !item.enabled
    });
  };

  return (
    <div className="table-row">
      {[item.exchange, item.symbol, item.name].map((cellData, index) => (
        <div key={index} className="table-cell">
          {cellData}
        </div>
      ))}
      <div className="table-cell">
        <ToolTip message="Edit">
          <Link to={`/inputform/${item.securityId}`}>
            <button className="table-button">
              <FaPen size={20} />
            </button>
          </Link>
        </ToolTip>
        <ToolTip message="Delete">
          <button className="table-button" onClick={handleDelete}>
            <FaTrashAlt size={20} />
          </button>
        </ToolTip>
        <ToolTip message={item.enabled ? 'Disable' : 'Enable'}>
          <button
            className={classNames('table-button', {
              'feature-off': !item.enabled
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
