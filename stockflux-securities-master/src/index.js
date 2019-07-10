import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";

const mountApp = () => {
  ReactDOM.render(
    <Router basename="/">
      <App />
    </Router>,
    document.getElementById("root")
  );
};

if (window.fin) {
  window.fin.desktop.main(mountApp);
} else {
  console.error("This application can only be run in an OpenFin container.");
}
