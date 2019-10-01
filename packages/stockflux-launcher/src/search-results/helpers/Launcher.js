import getWindowPosition from './Positioner';
import { OpenfinApiHelpers } from 'stockflux-core';

export default async (
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

  const childWindow = {
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

  const win = await OpenfinApiHelpers.createWindow(childWindow);

  // if (dockedTo === ScreenEdge.LEFT || dockedTo === ScreenEdge.RIGHT) {
  //   win
  //     .getWebWindow()
  //     .document.getElementById('searchbar-container').hidden = false;
  // }

  return win;
};
