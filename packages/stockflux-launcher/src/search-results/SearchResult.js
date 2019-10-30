import React from 'react';
import Components from 'stockflux-components';
import * as PropTypes from 'prop-types';
import { Utils } from 'stockflux-core';

const SearchResult = ({ symbol, name }) => {
  return (
    <div className="card">
      <div className="info">
        <p className="name">{Utils.truncate(name)}</p>
        <p className="symbol">{symbol}</p>
      </div>
      <div id="actions" className="actions">
        <Components.Shortcuts.NewsBorderless
          symbol={symbol}
          name={name}
          small={true}
        />
        <Components.Shortcuts.WatchlistBorderless
          symbol={symbol}
          name={name}
          small={true}
        />
        <Components.Shortcuts.ChartBorderless
          symbol={symbol}
          name={name}
          small={true}
        />
      </div>
    </div>
  );
};

SearchResult.propTypes = {
  symbol: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default SearchResult;
