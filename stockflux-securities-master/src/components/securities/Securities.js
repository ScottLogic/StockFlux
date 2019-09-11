import React, { useReducer, useEffect, useCallback } from 'react';
import Components from 'stockflux-components';
import PageHeader from './page-header/PageHeader';
import HorizontalRule from '../horizontal-rule/HorizontalRule';
import Table from './table/Table';
import NoSecurities from './no-securities/NoSecurities';
import { FetchState } from '../../enums';
import securitiesReducer, { initialState } from '../../reducers/Securities';
import * as action from '../../actions/Fetch';
import * as service from '../../services/SecuritiesService';
import './Securities.css';

const Securities = () => {
  const [state, dispatch] = useReducer(securitiesReducer, initialState);

  const fetchSecurities = useCallback(async () => {
    dispatch({ type: 'FETCHING' });
    try {
      let securities = await service.getSecurities();
      dispatch(action.success(translateSecuritiesDTO(securities)));
    } catch (err) {
      dispatch(action.error(err));
    }
  }, []);

  // TODO: Remove this once BE gets updated to use `disabled`
  const translateSecuritiesDTO = securities => {
    return securities.map(security => ({
      disabled: !security.enabled,
      exchange: security.exchange,
      name: security.name,
      securityId: security.securityId,
      symbol: security.symbol,
      updated: security.updated,
      visible: security.visible
    }));
  };

  useEffect(() => {
    fetchSecurities();
  }, [fetchSecurities]);

  return (
    <>
      <PageHeader
        numberOfSecurities={(state.securities && state.securities.length) || 0}
      />
      <HorizontalRule />
      {state.fetchStatus === FetchState.FETCHING ? (
        <div className="spinner-container">
          <Components.Spinner />
        </div>
      ) : state.securities && state.securities.length === 0 ? (
        <NoSecurities />
      ) : (
        <>
          <Table
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

export default Securities;
