import { PARENT as ACTION_TYPES } from '../../shared/constants/actionTypes';

export default function dragOut(state = null, action) {

    switch (action.type) {

    case ACTION_TYPES.DRAG_OUT: {
        return action.code;
    }

    case ACTION_TYPES.DRAG_ACCEPT: {
        return null;
    }

    default: {
        return state;
    }

    }
}
