
import ACTION_TYPES from './actionTypes.js';

function children(state = [], action) {
    const newState = [...state];
    switch (action.type) {

    case ACTION_TYPES.INITIALISE_STATE: {
        for (let i = 0; i < newState.length; i++) {
            newState[i].id = i;
        }
        return newState;
    }
    case ACTION_TYPES.CHILD_CONNECT: {
        if (newState.some(currentState => currentState.id === action.id)) {
            return state;
        }
        return [...state, { id: action.id, state: action.state }];
    }
    case ACTION_TYPES.CHILD_CHANGE: {
        newState.find(currentState => currentState.id === action.id).state = action.state;
        return newState;
    }
    case ACTION_TYPES.CHILD_CLOSED: {
        const index = newState.map(singleState => singleState.id).indexOf(action.id);
        newState.splice(index, 1);
        return newState;
    }
    default: {
        return state;
    }

    }
}

export default children;
