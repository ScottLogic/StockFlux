import ACTION_TYPES from '../constants/actionTypes.js';
import childReducers from '../../child/reducers/reducers.js';

function parentReducer(state = {}, action) {

    switch (action.type) {

    case ACTION_TYPES.CLOSE: {
        const newState = Object.assign({}, state);
        delete newState[action.windowName];

        if (!Object.keys(newState).length) {
            fin.desktop.Window.getCurrent().contentWindow.close();
        }

        return newState;
    }

    case ACTION_TYPES.DRAG_OUT: {
        const newState = Object.assign({}, state);
        newState.dragOut = {
            stockCode: action.code,
            stockName: action.name
        };
        console.log(newState);
        return newState;
    }

    case ACTION_TYPES.DRAG_ACCEPT: {
        const newState = Object.assign({}, state, {
            [action.windowName]: Object.assign({}, state[action.windowName], {
                selection: {
                    code: state.dragOut.stockCode,
                    name: state.dragOut.stockName
                },
                favourites: {
                    codes: [state.dragOut.stockCode],
                    names: {
                        [state.dragOut.stockCode]: state.dragOut.stockName
                    }
                },
                sidebar: {
                    showFavourites: true
                }
            })
        });
        delete newState.dragOut;
        return newState;
    }

    default: {
        const subString = action.type.substring(0, 5);

        // All child actions are prefaced with 'CHILD'; if the incoming
        // action is for the child, let the child reducers handle the action
        if (subString === 'CHILD') {
            const childState = state[action.windowName];
            let newState = {};

            if (childState) {
                newState = Object.assign({}, state, {
                    [action.windowName]: childReducers(childState, action)
                });
            } else {
                newState = Object.assign({}, state, {
                    [action.windowName]: childReducers({}, action)
                });
            }

            return newState;
        }

        return state;
    }

    }
}

export default parentReducer;
