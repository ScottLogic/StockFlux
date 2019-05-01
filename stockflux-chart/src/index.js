import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '../node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';
import $ from 'jquery';

window.jQuery = window.$ = $;
// eslint-disable-next-line import/first
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js';
// eslint-disable-next-line import/first
require('bootstrap');

const mountApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
};

if (window.fin) {
  window.fin.desktop.main(mountApp);
} else {
  console.error("This application can only be run in an OpenFin container.");
}
