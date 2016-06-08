import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import App from './containers/App';
import 'babel-polyfill';
import configureStore from './store/configureStore';

import { selectStock, toggleFavourite } from './actions/sidebar';
import { close } from './actions/window';

import './assets/styles/style.less';

fin.desktop.main(() => {
    let store = null;

    fin.desktop.InterApplicationBus.subscribe(
        '*',
        'initState',
        message => {
            const { state, uuid, id } = message;
            if (uuid === window.name) {
                store = configureStore(state.state);
                window.id = id;

                store.subscribe(() => {
                    fin.desktop.InterApplicationBus.publish(
                        'childUpdated',
                        { state: store.getState(), id }
                    );
                });

                render(
                    <Provider store={store}>
                        <App />
                    </Provider>,
                    document.getElementById('app')
                );
            }
        }
    );

    fin.desktop.InterApplicationBus.subscribe(
        '*',
        'initialiseDragged',
        message => {
            const { id, stockCode, stockName } = message;
            if (window.id === id) {
                store.dispatch(toggleFavourite(stockCode));
                store.dispatch(selectStock(stockCode, stockName));
            }
        }
    );

    fin.desktop.InterApplicationBus.subscribe(
        '*',
        'favouriteTransfer',
        message => {
            const { id, stockCode } = message;
            if (window.id === id) {
                if (store.getState().favourites.codes.some(favourite => favourite === message.stockCode)) {
                    store.dispatch(toggleFavourite(stockCode));
                }

                const favourites = store.getState().favourites;

                if (favourites.codes.length) {
                    // This isn't the last favourite
                    const newStockCode = favourites.codes.find(favourite => favourite !== message.stockCode);
                    const newStockName = favourites.names[newStockCode];
                    store.dispatch(selectStock(newStockCode, newStockName));
                } else {
                    // This is the last favourite
                    store.dispatch(close());
                }
            }
        }
    );

    fin.desktop.InterApplicationBus.publish(
        'childConnected',
        { uuid: window.name }
    );
});
