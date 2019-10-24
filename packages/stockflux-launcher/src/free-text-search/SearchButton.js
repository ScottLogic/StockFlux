import React from 'react';
import Components from 'stockflux-components';
import { ReactComponent as SearchIcon } from '../icons/search.svg';

export default ({ searchButtonRef, handleSearchClick }) => (
  <span className="searchIcon" ref={searchButtonRef}>
    <Components.Buttons.Round onClick={handleSearchClick}>
      <SearchIcon />
    </Components.Buttons.Round>
  </span>
);
