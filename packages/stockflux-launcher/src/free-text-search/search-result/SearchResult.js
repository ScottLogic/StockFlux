import React from 'react';
import Components from 'stockflux-components';
import * as PropTypes from 'prop-types';
import { Utils } from 'stockflux-core';

const SearchResult = ({ code, name }) => {
  return (
    <div className="card">
      <p className="name">{Utils.truncate(name)}</p>
      <p className="subtitle">{code}</p>{' '}
      <div id="actions" className="actions">
        <Components.Shortcuts.News symbol={code} name={name} small={true} />
        <Components.Shortcuts.Watchlist
          symbol={code}
          name={name}
          small={true}
        />
        <Components.Shortcuts.Chart symbol={code} name={name} small={true} />
      </div>
    </div>
  );
};

SearchResult.propTypes = {
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default SearchResult;
