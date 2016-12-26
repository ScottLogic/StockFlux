import childReducers from '../../child/reducers/reducers';

export default function childWindows(state = {}, action) {
    const subString = action.type.substring(0, 5);

    // All child actions are prefaced with 'CHILD'; if the incoming
    // action is for the child, let the child reducers handle the action
    if (subString === 'CHILD') {
        return Object.assign({}, state, {
            [action.windowName]: childReducers(state[action.windowName], action)
        });
    }

    return state;
}
