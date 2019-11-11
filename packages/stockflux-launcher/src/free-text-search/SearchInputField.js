import React from 'react';

export default ({ query, inputRef, handleOnInputChange }) => (
  <input
    onChange={handleOnInputChange}
    placeholder="Stock ticker, company name"
    value={query}
    ref={inputRef}
  />
);
