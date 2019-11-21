import React from 'react';

export default ({ query, inputRef, handleOnInputChange }) => (
  <input
    onChange={handleOnInputChange}
    placeholder="Search stock name or ticker"
    value={query}
    ref={inputRef}
  />
);
