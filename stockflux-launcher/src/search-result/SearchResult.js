import React from 'react';
import * as fdc3 from 'openfin-fdc3';
import * as PropTypes from 'prop-types';
import { Utils, Intents } from 'stockflux-core';

const handleWatchlistAddClick = (code, name) => {
  fdc3.raiseIntent('WatchlistAdd', {
    type: 'security',
    name,
    id: {
      default: code
    }
  });
};

const handleChartAddClick = async (code, name) => {
  Intents.viewChart(code, name);
};

const SearchResult = ({ code, name }) => (
  <div className="searchResult">
    <div className="name">{Utils.truncate(name)}</div>
    <div className="subtitle">{code}</div>
    <div className="containerActions">
      <button
        type="button"
        className="buttonAction"
        onClick={() => handleWatchlistAddClick(code, name)}
      >
        Add to Watchlist
      </button>
      <button
        type="button"
        className="buttonAction"
        onClick={() => handleChartAddClick(code, name)}
      >
        Add to Chart
      </button>
    </div>
  </div>
);

SearchResult.propTypes = {
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default SearchResult;
