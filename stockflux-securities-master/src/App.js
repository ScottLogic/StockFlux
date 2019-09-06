import React from 'react';
import 'stockflux-components';
import Components from 'stockflux-components';
import Securities from './components/securities/Securities';
import InputForm from './components/input-form/InputForm';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';

const App = () => {
  return (
    <>
      <Components.Titlebar />
      <Switch>
        <Route exact path="/" component={Securities} />
        <Route exact path="/inputform/:securityId" component={InputForm} />
        <Route exact path="/inputform" component={InputForm} />
        <Redirect to="/" />
      </Switch>
    </>
  );
};

export default App;
