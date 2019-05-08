import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';
import 'jquery-mousewheel/jquery.mousewheel';

import './index.css';

const mountApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
};

if (window.fin) {
  window.fin.desktop.main(mountApp);
} else {
  console.error("This application can only be run in an OpenFin container.");
}
