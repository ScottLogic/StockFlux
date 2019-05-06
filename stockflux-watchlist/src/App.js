import React from "react";
import Watchlist from "./components/Watchlist/Watchlist";
import Components from "stockflux-components";
import "./App.css";

const App = () => {
  return (
    <>
      <Components.Titlebar />
      <Watchlist />
    </>
  );
};

export default App;
