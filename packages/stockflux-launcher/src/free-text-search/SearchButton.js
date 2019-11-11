import React from 'react';
import Components from 'stockflux-components';

export default ({ searchButtonRef, handleSearchClick }) => (
  <span className="icon" ref={searchButtonRef}>
    <Components.Buttons.Borderless onClick={handleSearchClick}>
      <Components.Icons.Launcher.SearchIcon className="searchSVG" />
    </Components.Buttons.Borderless>
  </span>
);
