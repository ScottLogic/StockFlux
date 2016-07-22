import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';

import { PARENT, SIDEBAR } from '../../shared/constants/actionTypes';

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
        case SIDEBAR.REOPEN_WINDOW: {
            const newClosedWindow = Object.assign({}, state.closedWindows[action.reopenWindowName], {});

            delete newClosedWindow.date;

            const newClosedWindows = Object.assign({}, state.closedWindows);
            delete newClosedWindows[action.reopenWindowName];

            return {
                childWindows: Object.assign({}, state.childWindows, {
                    [action.reopenWindowName]: newClosedWindow
                }),
                closedWindows: newClosedWindows
            };
        }

        case PARENT.CLOSE: {
            const newClosedWindow = Object.assign({}, state.childWindows[action.windowName], {
                date: Date.now()
            });

            const newChildWindows = Object.assign({}, state.childWindows);

            delete newChildWindows[action.windowName];

            const numberOfFavourites = state.childWindows[action.windowName].favourites.codes.length;

            return {
                childWindows: newChildWindows,
                closedWindows: Object.assign({}, state.closedWindows, numberOfFavourites ? {
                    [action.windowName]: newClosedWindow
                } : {})
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
