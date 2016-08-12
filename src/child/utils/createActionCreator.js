import currentWindowService from '../services/currentWindowService';

export default (actionCreator) => (...args) => Object.assign({}, actionCreator(...args), {
    windowName: currentWindowService.getCurrentWindowName()
});
