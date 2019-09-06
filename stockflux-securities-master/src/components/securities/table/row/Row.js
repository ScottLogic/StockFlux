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

  const handleToggleEnabled = () => {
    patchSecurity(item.securityId, {
      enabled: !item.enabled
    });
  };

  return (
    <tr>
      {[item.exchange, item.symbol, item.name].map((cellData, index) => (
        <td key={index}>{cellData}</td>
      ))}
      <td>
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
          <ToolTip text={item.enabled ? 'Disable' : 'Enable'}>
            <button onClick={handleToggleEnabled}>
              {item.enabled ? <FaCheck size={17} /> : <FaTimes size={17} />}
            </button>
          </ToolTip>
        </div>
      </td>
    </tr>
  );
};

Row.propTypes = {
  item: PropTypes.object.isRequired,
  deleteSecurity: PropTypes.func.isRequired,
  patchSecurity: PropTypes.func.isRequired
};

export default Row;
