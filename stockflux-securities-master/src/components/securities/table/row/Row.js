import React from 'react';
import { Link } from 'react-router-dom';
import ToolTip from '../../../tool-tip/ToolTip';
import { FaPen, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './Row.css';

const Row = ({ item, deleteSecurity, patchSecurity }) => {
  const handleDelete = () => {
    deleteSecurity(item.securityId);
  };

  const handleToggleDisabled = () => {
    patchSecurity(item.securityId, {
      disabled: !item.disabled
    });
  };

  return (
    <div className="tr">
      {[item.exchange, item.symbol, item.name].map((cellData, index) => (
        <div className="td" key={index}>
          {cellData}
        </div>
      ))}
      <div className="td">
        <div className="buttons">
          <ToolTip text="Edit">
            <Link to={`/inputform/${item.securityId}`}>
              <button>
                <FaPen size={16} />
              </button>
            </Link>
          </ToolTip>
          <ToolTip text="Delete">
            <button onClick={handleDelete}>
              <FaTrashAlt size={16} />
            </button>
          </ToolTip>
          <ToolTip text={item.disabled ? 'Enable' : 'Disable'}>
            <button onClick={handleToggleDisabled}>
              {item.disabled ? <FaCheck size={17} /> : <FaTimes size={17} />}
            </button>
          </ToolTip>
        </div>
      </div>
    </div>
  );
};

Row.propTypes = {
  item: PropTypes.object.isRequired,
  deleteSecurity: PropTypes.func.isRequired,
  patchSecurity: PropTypes.func.isRequired
};

export default Row;
