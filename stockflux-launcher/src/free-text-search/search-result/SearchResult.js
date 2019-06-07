import React from 'react';
import { FaChartLine, FaRegListAlt, FaNewspaper  } from 'react-icons/fa'
import * as PropTypes from 'prop-types';
import { Utils } from 'stockflux-core';

// Add unique classes onto buttons to allow events listeners to be attached within child window
const SearchResult = ({ code, name }) => (
  <div className="searchResult">
    <div className="name">{Utils.truncate(name)}</div>
    <div className="subtitle">{code}</div>
    <div className="containerActions">
      <button type="button" className="buttonAction newsView">
        <FaNewspaper className="buttonIcon" />
      </button>
      <button type="button" className="buttonAction watchlistAdd">
        <FaRegListAlt className="buttonIcon" />
      </button>
      <button type="button" className="buttonAction chartView">
        <FaChartLine className="buttonIcon" />
      </button>
    </div>
  </div>
);

SearchResult.propTypes = {
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default SearchResult;
