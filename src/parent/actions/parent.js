import { PARENT as ACTION_TYPES } from '../../shared/constants/actionTypes';
import { toggleFavourite } from '../../child/actions/favourites';
import currentWindowService from '../../child/services/currentWindowService';

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
    return (dispatch, getState) => {
        dispatch(dragOut(code));
        fin.desktop.InterApplicationBus.send(
            fin.desktop.Application.getCurrent().uuid,
            'createChildWindow',
            position
        );

        const currentWindowName = currentWindowService.getCurrentWindowName();
        if (getState().childWindows[currentWindowName].favourites.codes.length > 1) {
            dispatch(toggleFavourite(code));
        } else {
            const application = fin.desktop.Application.getCurrent();
            application.getChildWindows(children => {
                children.find(childWindow => childWindow.name === currentWindowName).close();
            });
        }
    };
}
