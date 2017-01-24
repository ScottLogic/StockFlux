/* global $ */
import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import App from './containers/App';
import WindowStateService from './services/WindowStateService';
import currentWindowService from './services/currentWindowService';

import { open } from './actions/window';
import { toggleFavourite } from './actions/favourites';
import { opened } from './actions/initialOpen';
import { selectStock } from './actions/selection';
import { selectFavourites } from './actions/sidebar';
import { dragAccept } from '../parent/actions/parent';
import { favouritesSelector, initialOpenSelector } from './selectors/selectors';

import './assets/styles/style.less';
import '../../node_modules/d3fc/dist/d3fc.min.css';
import '../../node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';

/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-extraneous-dependencies */
require('script!../../node_modules/jquery/dist/jquery.min.js');
require('script!../../node_modules/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js');
require('script!../../node_modules/moment/moment.js');
require('script!../../node_modules/BitFlux/node_modules/bootstrap/js/dropdown.js');
require('script!../../node_modules/d3fc/dist/d3fc.bundle.min.js');
require('script!../../node_modules/BitFlux/dist/bitflux.js');
/* eslint-enable import/no-unresolved */
/* eslint-enable import/no-webpack-loader-syntax */
/* eslint-enable import/no-extraneous-dependencies */

currentWindowService.ready(() => {
    const currentWindow = currentWindowService.getCurrentWindow();
    const currentWindowName = currentWindowService.getCurrentWindowName();
    const store = currentWindow.contentWindow.opener.store;
    const rootElement = document.getElementById('app');

    const windowStateService = new WindowStateService(currentWindow, store, rootElement);
    windowStateService.start();

    store.dispatch(open());

    const { dragOut } = store.getState();
    const initialStock = dragOut[currentWindowName];
    if (initialStock) {
        store.dispatch(toggleFavourite(initialStock.code));
        store.dispatch(selectStock(initialStock.code, initialStock.name));
        store.dispatch(selectFavourites());
        store.dispatch(dragAccept(currentWindowName));
    } else if (initialOpenSelector(store.getState()) === true) {
        store.dispatch(opened());
        const { favourites } = favouritesSelector(store.getState());
        if (favourites.codes && favourites.codes.length > 0) {
            const stockCode = favourites.codes[0];
            const stockName = favourites.names[stockCode];
            store.dispatch(selectStock(stockCode, stockName));
            store.dispatch(selectFavourites());
        }
    }

    render(
        <Provider store={store}>
            <App />
        </Provider>,
        rootElement
    );
});
