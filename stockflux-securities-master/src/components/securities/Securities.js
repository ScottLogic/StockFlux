import React, { useReducer, useEffect, useCallback } from 'react';
import Components from 'stockflux-components';
import PageHeader from './page-header/PageHeader';
import * as service from '../../services/SecuritiesService';
import Table from './table/Table';
import { securitiesReducer, initialState } from '../../reducers/securities';
import * as action from '../../actions/securities';
import NoSecurities from './no-securities/NoSecurities';
import './Securities.css';

const Securities = ({ location }) => {
  const [state, dispatch] = useReducer(securitiesReducer, initialState);

  const fetchSecurities = async () => {
    dispatch({ type: 'FETCHING' });
    try {
      const securities = await service.getSecurities();
      dispatch(
        action.success([
          ...securities,
          ...securities,
          ...securities,
          ...securities
        ])
      );
    } catch (err) {
      dispatch(action.error(err));
    }
  };

  useEffect(() => {
    fetchSecurities();
  }, []);

  return (
    <>
      <PageHeader numberOfSecurities={state.securities.length} />
      {state.securities.length === 0 && !state.hasErrors ? (
        <NoSecurities />
      ) : (
            <Table
              location={location}
              dispatch={dispatch}
              state={state}
              fetchSecurities={fetchSecurities}
            />
      )}
    </>
  );
};

Securities.prototypes = {};

export default Securities;
