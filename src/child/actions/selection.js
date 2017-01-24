import { SELECTION as ACTION_TYPES } from '../../shared/constants/actionTypes';
import createActionCreator from '../utils/createActionCreator';

export const selectStock = createActionCreator((code, name, windowName) => ({
    type: ACTION_TYPES.SELECTION,
    windowName,
    code,
    name,
    analyticsEvent: {
        category: 'Select stock',
        action: code
    }
}));

export const unselectStock = createActionCreator((windowName) => ({
    type: ACTION_TYPES.UNSELECT,
    windowName
}));
