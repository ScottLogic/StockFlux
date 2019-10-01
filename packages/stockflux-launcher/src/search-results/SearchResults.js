import React from 'react';
import classNames from 'classnames';
import SearchResult from './SearchResult';

export default ({ results, paddingNeeded }) =>
  results &&
  results.length > 0 && (
    <div className={classNames('cards', { 'padding-top': paddingNeeded })}>
      {results.map(result => (
        <SearchResult
          key={result.symbol}
          symbol={result.symbol}
          name={result.name}
        />
      ))}
    </div>
  );
