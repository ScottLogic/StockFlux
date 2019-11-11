import getWindowPosition from './helpers/Positioner';
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

  return await OpenfinApiHelpers.createWindow(childWindow);
};
