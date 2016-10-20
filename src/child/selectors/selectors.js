import { createSelector } from 'reselect';
import currentWindowService from '../services/currentWindowService';

const getChildWindows = (state) => state.childWindows;
const getClosedWindows = (state) => state.closedWindows;
const getCurrentWindowState = (state) => state.childWindows[currentWindowService.getCurrentWindowName()];
const createCurrentWindowStateSelector = (...args) => createSelector(getCurrentWindowState, ...args);

export const appSelector = createCurrentWindowStateSelector(
    (state) => {
        const { selection, windowState } = state;
        const { name, code } = selection;
        return { name, code, windowState };
    }
);

export const favouritesSelector = createCurrentWindowStateSelector(
    (state) => {
        const { favourites, selection, windowState } = state;
        return { favourites, selection, windowState, isStarting: false, hasErrors: false };
    }
);
export const initialOpenSelector = createCurrentWindowStateSelector(
    (state) => {
        const { initialOpen } = state;
        return initialOpen;
    }
);

export const searchSelector = createCurrentWindowStateSelector(
    (state) => {
        const { favourites, selection } = state;
        const { isSearching, hasErrors, results, term } = state.search;
        return { favourites, isSearching, hasErrors, results, term, selection };
    }
);

export const sidebarSelector = createSelector(
    [getClosedWindows, getCurrentWindowState],
    (closedWindows, currentWindowState) => {
        const closedWindowsCount = Object.keys(closedWindows).length;
        const { sidebar, selection, favourites, windowState } = currentWindowState;
        return { sidebar, selection, favourites, windowState, closedWindowsCount };
    }
);

export const toolbarSelector = createCurrentWindowStateSelector(
    (state) => {
        const { windowState } = state;
        return { windowState };
    }
);

export const closedWindowsSelector = createSelector(
    getClosedWindows,
    (closedWindows) => ({ closedWindows })
);

export const openWindowNamesSelector = createSelector(
    getChildWindows,
    (state) => Object.keys(state)
);
