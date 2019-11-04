import React from 'react';
import ReactDOM from 'react-dom';
import { OpenfinApiHelpers } from 'stockflux-core';
import App from './App';

const mountApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
};

if (OpenfinApiHelpers.getWindow()) {
  mountApp();
} else {
  console.error('This application can only be run in an OpenFin container.');
}
