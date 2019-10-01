import React from 'react';
import Components from 'stockflux-components';
import messages from './messages';
import SearchResults from './SearchResults';

export default ({ results, children, isSearching, debouncedQuery }) => {
  const messageJsx = isSearching ? (
    <Components.Spinner />
  ) : (
    <p>{debouncedQuery ? messages.no_matches : messages.initial}</p>
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
