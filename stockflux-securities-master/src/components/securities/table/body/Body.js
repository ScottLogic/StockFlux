import React from 'react';
import PropTypes from 'prop-types';
import SecurityShape from '../../../../shapes/Security';
import Row from '../row/Row';
import './Body.css';

const Body = ({ securities, dispatch, fetchSecurities }) => {
  return (
    <div className="tbody scrollable">
      {securities.map(security => (
        <Row
          key={security.securityId}
          security={security}
          dispatch={dispatch}
          fetchSecurities={fetchSecurities}
        />
      ))}
    </div>
  );
};

Body.propTypes = {
  securities: PropTypes.arrayOf(SecurityShape).isRequired,
  dispatch: PropTypes.func.isRequired,
  fetchSecurities: PropTypes.func.isRequired
};

export default Body;
