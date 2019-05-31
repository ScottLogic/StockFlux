import { Constants } from 'openfin-react-hooks';
import ReactDOMServer from 'react-dom/server';

const RESULTS_WINDOW_NAME = 'child-window-search-results';
const DEFAULT_LAUNCHER_SIZE = 50;
const DEFAULT_SEARCH_RESULTS_SIZE = 400;

const getRect = ref => {
  if (ref.current) {
    return ref.current.getBoundingClientRect();
  }
};

const getResultsWindowPosition = (
  searchButtonRef,
  searchInputRef,
  dockedTo,
  windowBounds
) => {
  const searchButtonRect = getRect(searchButtonRef);
  switch (dockedTo) {
    case Constants.ScreenEdge.TOP:
      const searchInputRect = getRect(searchInputRef);
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
      break;
  }
};

const spawnWindow = async (
  searchButtonRef,
  searchInputRef,
  dockedTo,
  windowBounds,
  setResultsWindow
) => {
  const { defaultTop, defaultLeft, defaultWidth, defaultHeight } = getResultsWindowPosition(
    searchButtonRef,
    searchInputRef,
    dockedTo,
    windowBounds
  );

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
  await window.fin.Window.create(childWindow).then(win => {
    setResultsWindow(win);
    if (
      dockedTo === Constants.ScreenEdge.LEFT ||
      dockedTo === Constants.ScreenEdge.RIGHT
    ) {
      win
        .getWebWindow()
        .document.getElementById('searchbar-container').hidden = false;
    }
  });
};

export const createWindow = async (
  searchButtonRef,
  searchInputRef,
  dockedTo,
  windowBounds,
  setResultsWindow
) => {
  window.fin.desktop.System.getAllWindows(function(windowInfoList) {
    if (windowInfoList[0].childWindows.length === 0) {
      spawnWindow(
        searchButtonRef,
        searchInputRef,
        dockedTo,
        windowBounds,
        setResultsWindow
      );
    }
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
