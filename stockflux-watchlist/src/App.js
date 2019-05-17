import React from 'react';
import Watchlist from './components/watchlist/Watchlist';
import Components from 'stockflux-components';
import './App.css';

const App = () => {
  return (
    <>
      <Components.Titlebar />
      <Watchlist />
    </>
  );
};

export default App;
