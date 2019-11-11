import getWindowPosition from './SearchResults.positioner';
import { ScreenEdge } from 'openfin-react-hooks';

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
    name: 'child-window-search-results',
    defaultWidth,
    defaultHeight,
    url: 'searchResultsWindow.html',
    frame: false,
    autoShow: true,
    defaultTop,
    defaultLeft,
    saveWindowState: false,
    showTaskbarIcon: false,
    backgroundColor: '#28313D',
    waitForPageLoad: true,
    alwaysOnTop: true
  };

  const win = await window.fin.Window.create(childWindow);

  if (dockedTo === ScreenEdge.LEFT || dockedTo === ScreenEdge.RIGHT) {
    win
      .getWebWindow()
      .document.getElementById('searchbar-container').hidden = false;
  }

  return win;
};
