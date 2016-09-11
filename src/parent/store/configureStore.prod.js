import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/reducers';
import persistState from '../middleware/persistState';

const enhancer = compose(
    applyMiddleware(thunkMiddleware),
    persistState()
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
