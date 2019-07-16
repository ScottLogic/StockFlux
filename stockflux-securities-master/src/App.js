import React from "react";
import "stockflux-components";
import Components from "stockflux-components";
import SecuritiesTable from "./components/SecuritiesTable";
import InputForm from "./components/InputForm";
import { Redirect, Route, Switch } from "react-router-dom";

import "./App.css";

const App = () => {
  return (
    <div>
      <Components.Titlebar />
      <Switch>
        <Route exact path="/" component={SecuritiesTable} />
        <Route exact path="/inputform" component={InputForm} />
        <Redirect to="/" />
      </Switch>
    </div>
  );
};

export default App;
