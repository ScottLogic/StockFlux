import React from 'react';
import Components from 'stockflux-components';
import { FaSearch } from 'react-icons/fa';

export default ({ searchButtonRef, handleSearchClick }) => (
  <span ref={searchButtonRef}>
    <Components.Buttons.Round onClick={handleSearchClick}>
      <FaSearch />
    </Components.Buttons.Round>
  </span>
);