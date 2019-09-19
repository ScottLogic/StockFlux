import React from 'react';
import PropTypes from 'prop-types';
import Components from 'stockflux-components';
import SecurityShape from '../../../../shapes/Security';
import Row from '../row/Row';
import './Body.css';

const Body = ({ securities, dispatch, fetchSecurities }) => (
  <Components.ScrollWrapperY>
    <div className="tbody">
      {securities &&
        securities.length > 0 &&
        securities.map(security => (
          <Row
            key={security.securityId}
            security={security}
            dispatch={dispatch}
            fetchSecurities={fetchSecurities}
          />
        ))}
    </div>
  </Components.ScrollWrapperY>
);

Body.propTypes = {
  securities: PropTypes.arrayOf(SecurityShape),
  dispatch: PropTypes.func.isRequired,
  fetchSecurities: PropTypes.func.isRequired
};

export default Body;
