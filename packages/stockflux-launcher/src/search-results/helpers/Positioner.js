import { ScreenEdge } from 'openfin-react-hooks';

const DEFAULT_LAUNCHER_SIZE = 50;
const DEFAULT_SEARCH_RESULTS_SIZE = 400;

export default (searchButtonRef, inputRef, dockedTo, windowBounds) => {
  const searchButtonRect = searchButtonRef.current.getBoundingClientRect();
  switch (dockedTo) {
    case ScreenEdge.TOP:
      const searchInputRect = inputRef.current.getBoundingClientRect();
      return {
        defaultTop: DEFAULT_LAUNCHER_SIZE,
        defaultLeft: parseInt(searchInputRect.left),
        defaultWidth: parseInt(searchInputRect.width),
        defaultHeight: DEFAULT_SEARCH_RESULTS_SIZE
      };
    case ScreenEdge.LEFT:
      return {
        defaultTop: parseInt(searchButtonRect.top),
        defaultLeft: DEFAULT_LAUNCHER_SIZE,
        defaultWidth: DEFAULT_SEARCH_RESULTS_SIZE,
        defaultHeight: DEFAULT_SEARCH_RESULTS_SIZE
      };
    case ScreenEdge.RIGHT:
      return {
        defaultTop: parseInt(searchButtonRect.top),
        defaultLeft: windowBounds.left - DEFAULT_SEARCH_RESULTS_SIZE,
        defaultWidth: DEFAULT_SEARCH_RESULTS_SIZE,
        defaultHeight: DEFAULT_SEARCH_RESULTS_SIZE
      };
    default:
      return {
        defaultTop: 0,
        defaultLeft: 0,
        defaultWidth: DEFAULT_SEARCH_RESULTS_SIZE,
        defaultHeight: DEFAULT_SEARCH_RESULTS_SIZE
      };
  }
};
