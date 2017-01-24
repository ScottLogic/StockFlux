import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';

import { PARENT as ACTION_TYPES } from '../../shared/constants/actionTypes';

import childWindows from './childWindows';
import closedWindows from './closedWindows';
import dragOut from './dragOut';

const rootReducer = reduceReducers(
    combineReducers({
        childWindows,
        closedWindows,
        dragOut
    }),
    (state, action) => {
        switch (action.type) {
        case ACTION_TYPES.REOPEN: {
            const windowToReopen = Object.assign({}, state.closedWindows[action.windowName]);

            delete windowToReopen.date;

            const newClosedWindows = Object.assign({}, state.closedWindows);
            delete newClosedWindows[action.windowName];

            return {
                childWindows: Object.assign({}, state.childWindows, {
                    [action.windowName]: windowToReopen
                }),
                closedWindows: newClosedWindows,
                dragOut: state.dragOut
            };
        }

        case ACTION_TYPES.CLOSE: {
            const newClosedWindow = Object.assign({}, state.childWindows[action.windowName], {
                date: action.date
            });

            const newChildWindows = Object.assign({}, state.childWindows);

            delete newChildWindows[action.windowName];

            const closingWindowHasFavourites = state.childWindows[action.windowName].favourites.codes.length > 0;

            const newClosedWindows = Object.assign({}, state.closedWindows, closingWindowHasFavourites ? {
                [action.windowName]: newClosedWindow
            } : {});

            const limitedClosedWindows = Object.keys(newClosedWindows)
                .sort((a, b) => newClosedWindows[a].date - newClosedWindows[b].date)
                .slice(-5)
                .reduce((prev, windowName) => Object.assign(prev, {
                    [windowName]: newClosedWindows[windowName]
                }), {});

            return {
                childWindows: newChildWindows,
                closedWindows: limitedClosedWindows,
                dragOut: state.dragOut
            };
        }

        default: {
            return state;
        }
        }
    }
);

// Wrap the reducer in dev to freeze the state and action
const checkImmutable = (reducer) => {
    if (process.env.NODE_ENV === 'production') {
        return require('./reducers.prod').default(reducer);     // eslint-disable-line global-require
    }
    return require('./reducers.dev').default(reducer);          // eslint-disable-line global-require
};

export default checkImmutable(rootReducer);
