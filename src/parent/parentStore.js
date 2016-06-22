import {
    createStore,
    applyMiddleware,
    compose
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from './reducer.js';
import DevTools from '../child/containers/devTools/DevTools.js';
import persistState from 'redux-localstorage';

const enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(thunkMiddleware, createLogger()),
    // Required! Enable Redux DevTools with the monitors you chose
    DevTools.instrument(),
    persistState()
);

export default function parentStore(initialState) {
    const store = createStore(
        reducer,
        initialState,
        enhancer
    );

    return store;
}
