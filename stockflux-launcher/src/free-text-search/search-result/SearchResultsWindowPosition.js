import { Constants } from 'openfin-react-hooks';
import ReactDOMServer from 'react-dom/server';
import getWindowPosition from "./SearchResults.positioner";

const RESULTS_WINDOW_NAME = 'child-window-search-results';

export const createWindow = async (
  searchButtonRef,
  searchInputRef,
  dockedTo,
  windowBounds,
) => {
  const { defaultTop, defaultLeft, defaultWidth, defaultHeight } = getWindowPosition(
    searchButtonRef, searchInputRef, dockedTo, windowBounds);

  const childWindow = {
    name: RESULTS_WINDOW_NAME,
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
  return window.fin.Window.create(childWindow).then(win => {
    if (dockedTo === Constants.ScreenEdge.LEFT || dockedTo === Constants.ScreenEdge.RIGHT) {
      win.getWebWindow().document.getElementById('searchbar-container').hidden = false;
    }
    return win;
  });
};

export const populateResultsContainer = (html, resultsWindow) => {
  let finalHtml = ReactDOMServer.renderToStaticMarkup(html);
  if (resultsWindow && resultsWindow.getWebWindow) {
    const webWindow = resultsWindow.getWebWindow();
    if (webWindow && webWindow.document)
      webWindow.document.getElementById(
        'results-container'
      ).innerHTML = finalHtml;
  }
};
