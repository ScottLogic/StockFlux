import React from 'react';

export default ({ query, inputRef, handleOnInputChange }) => (
  <input
    onChange={handleOnInputChange}
    placeholder="Search"
    value={query}
    ref={inputRef}
  />
);
