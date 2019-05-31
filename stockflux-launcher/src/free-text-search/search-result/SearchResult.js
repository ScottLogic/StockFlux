import React from 'react';
import * as fdc3 from 'openfin-fdc3';
import { FaChartLine, FaRegListAlt  } from 'react-icons/fa'
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
        <FaRegListAlt className="buttonIcon"/>
      </button>
      <button
        type="button"
        className="buttonAction"
        onClick={() => Intents.viewChart(code, name)}
      >
        <FaChartLine className="buttonIcon"/>
      </button>
    </div>
  </div>
);

SearchResult.propTypes = {
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default SearchResult;
