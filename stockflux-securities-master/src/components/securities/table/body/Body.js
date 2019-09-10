import React from 'react';
import PropTypes from 'prop-types';
import Row from '../row/Row';
import './Body.css';

const Body = ({ state, dispatch, fetchSecurities }) => {
  return (
    <div className="tbody scrollable-table-body">
      {state.securities &&
        state.securities.map(item => (
          <Row
            key={item.securityId}
            item={item}
            dispatch={dispatch}
            fetchSecurities={fetchSecurities}
          />
        ))}
    </div>
  );
};

Body.propTypes = {
  state: PropTypes.object.isRequired
};

export default Body;
