import React from 'react';
import Search from './components/Search';
import Components from 'stockflux-components';

const App = () => {
  return (
    <>
      <Components.Titlebar />
      <Search />
    </>
  );
};

export default App;
