import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Row from '../row/Row';
import * as service from '../../../../services/SecuritiesService';
import * as action from '../../../../actions/securities';
import './Body.css';

const Body = ({ state, dispatch, location, fetchSecurities, handleError }) => {
  const deleteSecurity = async securityId => {
    dispatch(action.updating());
    try {
      await service.deleteSecurity(securityId);
    } catch (err) {
      dispatch(action.error(err));
    }
    await fetchSecurities();
  };

  const patchSecurity = async (securityId, updates) => {
    dispatch(action.updating());
    try {
      await service.patchSecurity(securityId, updates);
    } catch (err) {
      dispatch(action.error(err));
    }
    await fetchSecurities();
  };

  return (
    <tbody>
        {state.securities.map(item => (
          <Row
            key={item.securityId}
            item={item}
            deleteSecurity={deleteSecurity}
            patchSecurity={patchSecurity}
          />
        ))}
    </tbody>
  );
};

Body.propTypes = {
  state: PropTypes.object.isRequired
};

export default Body;
