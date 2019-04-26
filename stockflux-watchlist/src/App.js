import React from 'react';
import Watchlist from './components/Watchlist';
import Components from 'stockflux-components';

const App = () => {
  return (
    <>
      <Components.Titlebar />
      <Watchlist />
    </>
  );
};

export default App;
