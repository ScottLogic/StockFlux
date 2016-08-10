import { createSelector } from 'reselect';
import currentWindowService from '../services/currentWindowService';

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

export const searchSelector = createCurrentWindowStateSelector(
    (state) => {
        const { favourites, selection } = state;
        const { isSearching, hasErrors, results, term } = state.search;
        return { favourites, isSearching, hasErrors, results, term, selection };
    }
);

export const sidebarSelector = createCurrentWindowStateSelector(
    (state) => {
        const { sidebar, selection, favourites, windowState } = state;
        return { sidebar, selection, favourites, windowState };
    }
);

export const toolbarSelector = createCurrentWindowStateSelector(
    (state) => {
        const { windowState } = state;
        return { windowState };
    }
);
