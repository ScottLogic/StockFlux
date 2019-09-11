import React from 'react';
import Components from 'stockflux-components';
import './Table.css';
import { FetchState } from '../../../enums';
import PropTypes from 'prop-types';
import Body from './body/Body';
import Head from './head/Head';

const Table = ({ dispatch, state, fetchSecurities }) => {
  return (
    <div className="table">
      <Head />
      {state.fetchStatus === FetchState.FETCHING ? (
        <div className="spinner-container">
          <Components.LargeSpinner />
        </div>
      ) : (
        <Body
          securities={state.securities}
          dispatch={dispatch}
          fetchSecurities={fetchSecurities}
        />
      )}
    </div>
  );
};

Table.propTypes = {
  location: PropTypes.object.isRequired
};

export default Table;
