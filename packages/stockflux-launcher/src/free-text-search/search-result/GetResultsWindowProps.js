import getWindowPosition from './SearchResults.positioner';

export default (searchButtonRef, searchInputRef, dockedTo, windowBounds) => {
  const {
    defaultTop,
    defaultLeft,
    defaultWidth,
    defaultHeight
  } = getWindowPosition(
    searchButtonRef,
    searchInputRef,
    dockedTo,
    windowBounds
  );
  return {
    name: 'search-results',
    defaultWidth,
    defaultHeight,
    url: 'child-window.html',
    frame: false,
    autoShow: true,
    defaultTop,
    defaultLeft,
    saveWindowState: false,
    showTaskbarIcon: false,
    backgroundColor: '#28313D',
    waitForPageLoad: true,
    alwaysOnTop: false,
    maxWidth: 400,
    minWidth: 400,
    minHeight: 300
  };
};
