import { Constants } from 'openfin-react-hooks';

const DEFAULT_LAUNCHER_SIZE = 50;
const DEFAULT_SEARCH_RESULTS_SIZE = 400;

export default (
    searchButtonRef,
    searchInputRef,
    dockedTo,
    windowBounds
) => {
    const searchButtonRect = searchButtonRef.current.getBoundingClientRect();
    switch (dockedTo) {
        case Constants.ScreenEdge.TOP:
            const searchInputRect = searchInputRef.current.getBoundingClientRect();
            return {
                defaultTop: DEFAULT_LAUNCHER_SIZE,
                defaultLeft: parseInt(searchInputRect.left),
                defaultWidth: parseInt(searchInputRect.width),
                defaultHeight: DEFAULT_SEARCH_RESULTS_SIZE
            };
        case Constants.ScreenEdge.LEFT:
            return {
                defaultTop: parseInt(searchButtonRect.top),
                defaultLeft: DEFAULT_LAUNCHER_SIZE,
                defaultWidth: DEFAULT_SEARCH_RESULTS_SIZE,
                defaultHeight: parseInt(searchButtonRect.bottom)
            };
        case Constants.ScreenEdge.RIGHT:
            return {
                defaultTop: parseInt(searchButtonRect.top),
                defaultLeft: windowBounds.left - DEFAULT_SEARCH_RESULTS_SIZE,
                defaultWidth: DEFAULT_SEARCH_RESULTS_SIZE,
                defaultHeight: parseInt(searchButtonRect.bottom)
            };
        default:
            return {
                defaultTop: 0,
                defaultLeft: 0,
                defaultWidth: DEFAULT_SEARCH_RESULTS_SIZE,
                defaultHeight: DEFAULT_SEARCH_RESULTS_SIZE,
            };
    }
};
