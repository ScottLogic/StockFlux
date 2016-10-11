import { PARENT as ACTION_TYPES } from '../../shared/constants/actionTypes';
import { toggleFavourite } from '../../child/actions/favourites';
import currentWindowService from '../../child/services/currentWindowService';

export function close(windowName, date) {
    return {
        windowName,
        date,
        type: ACTION_TYPES.CLOSE
    };
}

function reopen(windowName) {
    return {
        windowName,
        type: ACTION_TYPES.REOPEN
    };
}

function dragOut(code, name) {
    return {
        type: ACTION_TYPES.DRAG_OUT,
        code,
        name
    };
}

export function dragAccept() {
    return {
        type: ACTION_TYPES.DRAG_ACCEPT
    };
}

export function favouriteDroppedOutside(code, name, position) {
    return (dispatch, getState) => {
        dispatch(dragOut(code, name));
        fin.desktop.InterApplicationBus.send(
            fin.desktop.Application.getCurrent().uuid,
            'createChildWindow',
            { position }
        );

        const currentWindowName = currentWindowService.getCurrentWindowName();
        const currentWindowFavouritesCount = getState().childWindows[currentWindowName].favourites.codes.length;
        dispatch(toggleFavourite(code));
        if (currentWindowFavouritesCount <= 1) {
            const application = fin.desktop.Application.getCurrent();
            application.getChildWindows(children => {
                children.find(childWindow => childWindow.name === currentWindowName).close();
            });
        }
    };
}

export function openClosedWindow(windowName) {
    return dispatch => {
        dispatch(reopen(windowName));
        fin.desktop.InterApplicationBus.send(
            fin.desktop.Application.getCurrent().uuid,
            'createChildWindow',
            { windowName }
        );
    };
}
