import React from 'react';
import Components from 'stockflux-components';
import * as PropTypes from 'prop-types';
import { Utils } from 'stockflux-core';

const SearchResult = ({ symbol, name }) => {
  return (
    <div className="card">
      <p className="name">{Utils.truncate(name)}</p>
      <p className="subtitle">{symbol}</p>{' '}
      <div id="actions" className="actions">
        <Components.Shortcuts.News symbol={symbol} name={name} small={true} />
        <Components.Shortcuts.Watchlist
          symbol={symbol}
          name={name}
          small={true}
        />
        <Components.Shortcuts.Chart symbol={symbol} name={name} small={true} />
      </div>
    </div>
  );
};

SearchResult.propTypes = {
  symbol: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default SearchResult;
