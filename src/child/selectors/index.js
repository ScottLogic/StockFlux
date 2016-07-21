import { createSelector } from 'reselect';
import currentWindowService from '../services/currentWindowService';

const windowStateSelector = (state) => state[currentWindowService.getCurrentWindow().contentWindow.name];

export const appSelector = createSelector(
    windowStateSelector,
    (state) => {
        const { selection, windowState } = state;
        const { name, code } = selection;
        return { name, code, windowState };
    }
);

export const favouritesSelector = createSelector(
    windowStateSelector,
    (state) => {
        const { favourites, selection, windowState } = state;
        return { favourites, selection, windowState, isStarting: false, hasErrors: false };
    }
);

export const searchSelector = createSelector(
    windowStateSelector,
    (state) => {
        const { favourites, selection } = state;
        const { isSearching, hasErrors, results, term } = state.search;
        return { favourites, isSearching, hasErrors, results, term, selection };
    }
);

export const sidebarSelector = createSelector(
    windowStateSelector,
    (state) => {
        const { sidebar, selection, favourites, windowState } = state;
        return { sidebar, selection, favourites, windowState };
    }
);

export const toolbarSelector = createSelector(
    windowStateSelector,
    (state) => {
        const { windowState } = state;
        return { windowState };
    }
);
