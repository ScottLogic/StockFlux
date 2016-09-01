import { PARENT as ACTION_TYPES } from '../../shared/constants/actionTypes';

export function close(windowName) {
    return {
        windowName,
        type: ACTION_TYPES.CLOSE
    };
}

function dragOut(code) {
    return {
        type: ACTION_TYPES.DRAG_OUT,
        code
    };
}

export function dragAccept() {
    return {
        type: ACTION_TYPES.DRAG_ACCEPT
    };
}

export function favouriteDroppedOutside(code, position) {
    return (dispatch) => {
        dispatch(dragOut(code));
        fin.desktop.InterApplicationBus.send(
            fin.desktop.Application.getCurrent().uuid,
            'createChildWindow',
            position
        );
    };
}
