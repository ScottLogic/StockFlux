import React from 'react';
import PropTypes from 'prop-types';
import SecurityShape from '../../../shapes/Security';
import Components from 'stockflux-components';
import { FetchState } from '../../../enums';
import Body from './body/Body';
import Head from './head/Head';
import './Table.css';

const Table = ({ securities, fetchStatus, dispatch, fetchSecurities }) => (
  <div className="table">
    <Head />
    {fetchStatus === FetchState.FETCHING ? (
      <div className="spinner-container">
        <Components.LargeSpinner />
      </div>
    ) : (
      <Body
        securities={securities}
        dispatch={dispatch}
        fetchSecurities={fetchSecurities}
      />
    )}
  </div>
);

Table.propTypes = {
  securities: PropTypes.arrayOf(SecurityShape),
  fetchStatus: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  fetchSecurities: PropTypes.func.isRequired
};

export default Table;
