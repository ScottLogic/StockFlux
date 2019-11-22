import React from 'react';
import Components from 'stockflux-components';
import * as PropTypes from 'prop-types';
import { Utils, Launchers } from 'stockflux-core';

const SearchResult = ({ symbol, name }) => {
  return (
    <div className="card">
      <div className="info">
        <p className="name">
          {symbol.toUpperCase()} * {Utils.truncate(name)}
        </p>
      </div>
      <div id="actions" className="actions">
        <button
          className="actions-button"
          onClick={() => Launchers.launchChart(symbol, name)}
        >
          <Components.Icons.Normal.Chart /> Open Chart
        </button>
        <button
          className="actions-button"
          onClick={() => Launchers.launchNews(symbol, name)}
        >
          <Components.Icons.Normal.News /> Open News
        </button>
        <button
          className="actions-button"
          onClick={() => Launchers.launchWatchlist(symbol, name)}
        >
          <Components.Icons.Normal.Watchlist /> Show in Watchlist
        </button>
      </div>
    </div>
  );
};

SearchResult.propTypes = {
  symbol: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default SearchResult;
