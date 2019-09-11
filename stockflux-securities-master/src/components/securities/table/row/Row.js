import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SecurityShape from '../../../../shapes/Security';
import { FaPen, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';
import ToolTip from '../../../tool-tip/ToolTip';
import * as service from '../../../../services/SecuritiesService';
import * as action from '../../../../actions/Fetch';
import './Row.css';

const Row = ({ security, dispatch, fetchSecurities }) => {
  const deleteSecurity = async () => {
    dispatch(action.fetching());
    try {
      await service.deleteSecurity(security.securityId);
      dispatch(action.success());
    } catch (err) {
      dispatch(action.error(err));
    }
    await fetchSecurities();
  };

  const editSecurity = async () => {
    dispatch(action.fetching());
    try {
      await service.patchSecurity(security.securityId, {
        enabled: security.disabled
      });
      dispatch(action.success());
    } catch (err) {
      dispatch(action.error(err));
    }
    await fetchSecurities();
  };

  return (
    <div className="tr">
      {[security.exchange, security.symbol, security.name].map(
        (cellValue, index) => (
          <div className="td" key={index}>
            {cellValue}
          </div>
        )
      )}
      <div className="td">
        <div className="buttons">
          <ToolTip text="Edit">
            <Link to={`/inputform/${security.securityId}`}>
              <button>
                <FaPen size={16} />
              </button>
            </Link>
          </ToolTip>
          <ToolTip text="Delete">
            <button onClick={deleteSecurity}>
              <FaTrashAlt size={16} />
            </button>
          </ToolTip>
          <ToolTip text={security.disabled ? 'Enable' : 'Disable'}>
            <button onClick={editSecurity}>
              {security.disabled ? (
                <FaCheck size={17} />
              ) : (
                <FaTimes size={17} />
              )}
            </button>
          </ToolTip>
        </div>
      </div>
    </div>
  );
};

Row.propTypes = {
  security: SecurityShape.isRequired,
  dispatch: PropTypes.func.isRequired,
  fetchSecurities: PropTypes.func.isRequired
};

export default Row;
