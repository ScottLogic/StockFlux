import React from 'react';
import Chart from './components/Chart';
import Components from 'stockflux-components';

const App = () => {
  return (
    <>
      <Components.Titlebar />
      <Chart />
    </>
  );
};

export default App;
