import React from 'react';

export default ({ inputRef, handleOnInputChange }) => (
  <input onInput={handleOnInputChange} placeholder="Search" ref={inputRef} />
);
