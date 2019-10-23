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
        defaultLeft: windowBounds.right,
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
      const searchInputBox = inputRef.current.getBoundingClientRect();
      if (searchInputBox.x !== 0) {
        return {
          defaultTop: parseInt(windowBounds.top) + DEFAULT_LAUNCHER_SIZE,
          defaultLeft: windowBounds.left + parseInt(searchInputBox.left),
          defaultWidth: DEFAULT_SEARCH_RESULTS_SIZE,
          defaultHeight: DEFAULT_SEARCH_RESULTS_SIZE
        };
      } else {
        const rightPosition =
          windowBounds.left + windowBounds.width + DEFAULT_SEARCH_RESULTS_SIZE;
        let leftPosition = windowBounds.left + windowBounds.width;
        if (rightPosition > window.screen.width) {
          leftPosition = windowBounds.left - DEFAULT_SEARCH_RESULTS_SIZE;
        } else if (windowBounds.left < 0 && rightPosition > 0) {
          leftPosition = windowBounds.left - DEFAULT_SEARCH_RESULTS_SIZE;
        }

        return {
          defaultTop: parseInt(searchButtonRect.top),
          defaultLeft: leftPosition,
          defaultWidth: DEFAULT_SEARCH_RESULTS_SIZE,
          defaultHeight: DEFAULT_SEARCH_RESULTS_SIZE
        };
      }
  }
};
