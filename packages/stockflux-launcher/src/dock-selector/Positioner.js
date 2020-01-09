import { ScreenEdge } from 'openfin-react-hooks';

const DEFAULT_OFFSET_SIZE = 0;

export default (searchButtonRef, dockedTo, windowBounds, height, width) => {
  const searchButtonRect = searchButtonRef.current.getBoundingClientRect();
  switch (dockedTo) {
    case ScreenEdge.TOP:
      return {
        defaultTop: parseInt(windowBounds.bottom),
        defaultLeft: windowBounds.left + parseInt(searchButtonRect.left)
      };
    case ScreenEdge.LEFT:
      return {
        defaultTop: parseInt(searchButtonRect.top),
        defaultLeft: windowBounds.right
      };
    case ScreenEdge.RIGHT:
      return {
        defaultTop: parseInt(searchButtonRect.top),
        defaultLeft: windowBounds.left - width + DEFAULT_OFFSET_SIZE
      };
    default:
      return {
        defaultTop: windowBounds.top + parseInt(searchButtonRect.bottom),
        defaultLeft: windowBounds.left + parseInt(searchButtonRect.left)
      };
  }
};
