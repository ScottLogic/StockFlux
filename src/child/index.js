import React from 'react';
import { Provider } from 'react-redux';
import { render, unmountComponentAtNode } from 'react-dom';
import App from './containers/App';
import 'babel-polyfill';

import { open, close } from './actions/window';

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

fin.desktop.main(() => {
    fin.desktop.Window.getCurrent().contentWindow.addEventListener('beforeunload', () => {
        fin.desktop.Window.getCurrent().contentWindow.opener.store.dispatch(close());
        unmountComponentAtNode(document.getElementById('app'));
    });

    const store = fin.desktop.Window.getCurrent().contentWindow.opener.store;
    store.dispatch(open());

    render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('app')
    );
});
