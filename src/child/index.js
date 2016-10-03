/* global $ */
import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import App from './containers/App';
import WindowStateService from './services/WindowStateService';
import currentWindowService from './services/currentWindowService';
import 'babel-polyfill';

import { open } from './actions/window';
import { toggleFavourite } from './actions/favourites';
import { selectStock } from './actions/selection';
import { selectFavourites } from './actions/sidebar';
import { dragAccept } from '../parent/actions/parent';

import './assets/styles/style.less';
import '../../node_modules/d3fc/dist/d3fc.min.css';
import '../../node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';

/* eslint-disable import/no-unresolved */
require('script!../../node_modules/jquery/dist/jquery.min.js');
require('script!../../node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js');
require('script!../../node_modules/moment/moment.js');
require('script!../../node_modules/BitFlux/node_modules/bootstrap/js/dropdown.js');
require('script!../../node_modules/d3fc/dist/d3fc.bundle.min.js');
require('script!../../node_modules/BitFlux/dist/bitflux.js');
/* eslint-enable import/no-unresolved */

const { store } = window.opener;

currentWindowService.ready(() => {
    const currentWindow = currentWindowService.getCurrentWindow();
    const rootElement = document.getElementById('app');

    const windowStateService = new WindowStateService(currentWindow, store, rootElement);
    windowStateService.start();

    window.store = store;

    store.dispatch(open());

    const { dragOut } = store.getState();
    if (dragOut !== null) {
        store.dispatch(toggleFavourite(dragOut.code));
        store.dispatch(selectStock(dragOut.code, dragOut.name));
        store.dispatch(selectFavourites());
        store.dispatch(dragAccept());
    }

    render(
        <Provider store={store}>
            <App />
        </Provider>,
        rootElement
    );
});
