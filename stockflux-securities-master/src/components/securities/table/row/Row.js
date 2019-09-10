import React from 'react';
import { Link } from 'react-router-dom';
import ToolTip from '../../../tool-tip/ToolTip';
import { FaPen, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';
import * as service from '../../../../services/SecuritiesService';
import * as action from '../../../../actions/securities';
import './Row.css';

const Row = ({ item, dispatch, fetchSecurities }) => {
  const handleDelete = async () => {
    dispatch(action.fetching());
    try {
      await service.deleteSecurity(item.securityId);
      dispatch(action.success());
    } catch (err) {
      dispatch(action.error(err));
    }
    await fetchSecurities();
  };

  const handlePatch = async () => {
    dispatch(action.fetching());
    try {
      await service.patchSecurity(item.securityId, {
        enabled: item.disabled
      });
      dispatch(action.success());
    } catch (err) {
      dispatch(action.error(err));
    }
    await fetchSecurities();
  };

  return (
    <div className="tr">
      {[item.exchange, item.symbol, item.name].map((cellDatum, index) => (
        <div className="td" key={index}>
          {cellDatum}
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
            <button onClick={handlePatch}>
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
  dispatch: PropTypes.func.isRequired,
  fetchSecurities: PropTypes.func.isRequired
};

export default Row;
