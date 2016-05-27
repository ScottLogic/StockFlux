// import { combineReducers } from 'redux';
import { CHILD_CHANGE, CHILD_CONNECT } from './actions';
import configureStore from '../child/store/configureStore';

function children(state = [], action) {
    const newState = [...state];
    switch (action.type) {
    case CHILD_CONNECT:
        if (newState.some(currentState => currentState.id === action.id)) {
            return state;
        }
        return [...state, { id: action.id, state: action.state }];
    case CHILD_CHANGE:
        newState.find(currentState => currentState.id === action.id).state = action.state;
        return newState;
    default:
        return state;
    }
}

export default children;
