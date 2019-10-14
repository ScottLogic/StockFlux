import React from 'react';
import Components from 'stockflux-components';
import messages from './messages';
import SearchResults from './SearchResults';

export default ({ results, children, isSearching, debouncedQuery }) => {
  const messageJsx = isSearching ? (
    <Components.Spinner />
  ) : (
    <p>{debouncedQuery ? messages.NO_MATCHES : messages.INITIAL}</p>
  );

  return (
    <>
      {children}
      <Components.ScrollWrapperY>
        {results && results.length > 0 ? (
          <SearchResults results={results} paddingNeeded={children} />
        ) : (
          messageJsx
        )}
      </Components.ScrollWrapperY>
    </>
  );
};
