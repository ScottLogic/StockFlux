import React from 'react';
import 'stockflux-components';
import Components from 'stockflux-components';
import Securities from './components/securities/Securities';
import FormView from './components/form-view/FormView';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';

const App = () => {
  return (
    <>
      <Components.Titlebar />
      <Switch>
        <Route exact path="/" component={Securities} />
        <Route exact path="/inputform/:securityId" component={FormView} />
        <Route exact path="/inputform" component={FormView} />
        <Redirect to="/" />
      </Switch>
    </>
  );
};

export default App;
