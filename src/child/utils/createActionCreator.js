import currentWindowService from '../services/currentWindowService';
import defaults from 'lodash.defaults';

// Returns an action creator which will provide a default windowName property, set to the current window's name,
// unless the windowName is set by the original action creator
export default (actionCreator) => (...args) => defaults(actionCreator(...args), { windowName: currentWindowService.getCurrentWindowName() });
