import React, { useReducer, useEffect } from 'react';
import PageHeader from './page-header/PageHeader';
import * as service from '../../services/SecuritiesService';
import Table from './table/Table';
import { securitiesReducer, initialState } from '../../reducers/securities';
import * as action from '../../actions/securities';
import HorizontalRule from '../horizontal-rule/HorizontalRule';
import NoSecurities from './no-securities/NoSecurities';
import './Securities.css';

const Securities = ({ location }) => {
  const [state, dispatch] = useReducer(securitiesReducer, initialState);

  const fetchSecurities = async () => {
    dispatch({ type: 'FETCHING' });
    try {
      let securities = await service.getSecurities();
      securities = securities.map(security => ({
        disabled: !security.enabled,
        exchange: security.exchange,
        name: security.name,
        securityId: security.securityId,
        symbol: security.symbol,
        updated: security.updated,
        visible: security.visible
      }));
      console.log('securities', securities);
      dispatch(action.success(securities));
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
      <HorizontalRule />
      {state.securities.length === 0 && !state.hasErrors ? (
        <NoSecurities />
      ) : (
        <>
          <Table
            location={location}
            dispatch={dispatch}
            state={state}
            fetchSecurities={fetchSecurities}
          />
          <HorizontalRule />
        </>
      )}
    </>
  );
};

Securities.prototypes = {};

export default Securities;
