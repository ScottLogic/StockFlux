import {
    createStore,
    applyMiddleware,
    compose
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers/reducers.js';
// import DevTools from '../containers/devTools/DevTools.js';

const enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(thunkMiddleware, createLogger())
    // Required! Enable Redux DevTools with the monitors you chose
    // DevTools.instrument()
);

export default function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        enhancer
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers/reducers.js', () => {
            const nextRootReducer = require('../reducers/reducers.js').default; // eslint-disable-line global-require
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
