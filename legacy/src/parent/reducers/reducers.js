import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';

import { PARENT as ACTION_TYPES } from '../../shared/constants/actionTypes';

import childWindows from './childWindows';
import closedWindows from './closedWindows';
import dragOut from './dragOut';

const MAX_CLOSED_WINDOWS = 5;

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
            const newClosedWindows = { ...state.closedWindows };
            const closingWindowHasFavourites = state.childWindows[action.windowName].favourites.codes.length > 0;

            if (closingWindowHasFavourites) {
                newClosedWindows[action.windowName] = {
                    ...state.childWindows[action.windowName],
                    date: action.date
                };
            }

            if (Object.keys(newClosedWindows).length > MAX_CLOSED_WINDOWS) {
                Object.entries(newClosedWindows) // [[winName1, winObject1], [winName2, winObject2], ...]
                    .sort((aEntry, bEntry) => bEntry[1].date - aEntry[1].date)
                    .slice(MAX_CLOSED_WINDOWS) // skip the five newest entries - we will keep those
                    .map((entry) => entry[0])
                    .forEach((windowName) => delete newClosedWindows[windowName]);
            }

            const newChildWindows = { ...state.childWindows };
            delete newChildWindows[action.windowName];

            return {
                childWindows: newChildWindows,
                closedWindows: newClosedWindows,
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
