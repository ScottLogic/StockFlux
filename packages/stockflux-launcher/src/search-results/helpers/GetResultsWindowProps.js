import getWindowPosition from './Positioner';

export default (
  name,
  searchButtonRef,
  searchInputRef,
  dockedTo,
  windowBounds
) => {
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
    name: name,
    defaultWidth,
    defaultHeight,
    url: 'child-window.html',
    frame: false,
    autoShow: true,
    defaultTop,
    defaultLeft,
    saveWindowState: false,
    showTaskbarIcon: false,
    backgroundColor: '#071521',
    waitForPageLoad: true,
    alwaysOnTop: false,
    maxWidth: 710,
    minWidth: 710,
    minHeight: 350,
    resizable: false
  };
};
