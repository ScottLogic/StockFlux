import React from 'react';
import Components from 'stockflux-components';
import { ReactComponent as SearchIcon } from '../icons/search.svg';

export default ({ searchButtonRef, handleSearchClick }) => (
  <span className="icon" ref={searchButtonRef}>
    <Components.Buttons.Round onClick={handleSearchClick}>
      <SearchIcon className="searchSVG" />
    </Components.Buttons.Round>
  </span>
);
