import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/reducers.js';

const enhancer = compose(
    applyMiddleware(thunkMiddleware)
);

function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        enhancer
    );

    return store;
}

export default configureStore;
