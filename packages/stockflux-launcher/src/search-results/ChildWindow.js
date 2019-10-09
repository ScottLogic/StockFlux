import React from 'react';
import Components from 'stockflux-components';
import MESSAGES from './messages';
import SearchResults from './SearchResults';

export default ({ results, children, isSearching, debouncedQuery }) => {
  const messageJsx = isSearching ? (
    <Components.Spinner />
  ) : (
    <p>{debouncedQuery ? MESSAGES.NO_MATCHES : MESSAGES.INITIAL}</p>
  );

  return (
    <>
      {children}
      {results && results.length > 0 ? (
        <SearchResults results={results} paddingNeeded={children} />
      ) : (
        messageJsx
      )}
    </>
  );
};
