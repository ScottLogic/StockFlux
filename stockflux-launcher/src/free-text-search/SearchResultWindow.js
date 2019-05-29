import ReactDOMServer from 'react-dom/server';
import DOCK_POSITION from '../DockPosition';

const RESULTS_WINDOW_NAME = 'child-window-search-results';
const SEARCH_RESULTS_WIDTH = 407;
const SEARCH_RESULTS_HEIGHT = 400;
const LAUNCHER_WIDTH = 50;

const getLauncherInputWidth = searchInputRef => {
  if (searchInputRef.current) {
    return searchInputRef.current.getBoundingClientRect().width;
  }
};

const getSearchButtonY = searchButtonRef => {
  if (searchButtonRef.current) {
    return parseInt(searchButtonRef.current.getBoundingClientRect().y);
  }
};

const getSearchButtonX = searchButtonRef => {
  if (searchButtonRef.current) {
    return parseInt(searchButtonRef.current.getBoundingClientRect().x);
  }
};

const getResultsWindowPosition = (
  searchButtonRef,
  searchInputRef,
  dockedTo,
  windowBounds
) => {
  let left, top;
  switch (dockedTo) {
    case DOCK_POSITION.TOP:
      top = LAUNCHER_WIDTH;
      left =
        getSearchButtonX(searchButtonRef) -
        getLauncherInputWidth(searchInputRef);
      break;
    case DOCK_POSITION.LEFT:
      top = getSearchButtonY(searchButtonRef);
      left = LAUNCHER_WIDTH;
      break;
    case DOCK_POSITION.RIGHT:
      top = getSearchButtonY(searchButtonRef);
      left =
        windowBounds &&
        windowBounds.width - LAUNCHER_WIDTH - SEARCH_RESULTS_WIDTH;
      break;
    default:
      top = 50;
      left = 600;
      break;
  }
  return { defaultTop: parseInt(top), defaultLeft: parseInt(left) };
};

const spawnWindow = async (
  searchButtonRef,
  searchInputRef,
  dockedTo,
  windowBounds,
  setResultsWindow
) => {
  const { defaultTop, defaultLeft } = getResultsWindowPosition(
    searchButtonRef,
    searchInputRef,
    dockedTo,
    windowBounds
  );

  const childWindow = {
    name: RESULTS_WINDOW_NAME,
    defaultWidth: SEARCH_RESULTS_WIDTH,
    defaultHeight: SEARCH_RESULTS_HEIGHT,
    url: 'window.html',
    frame: false,
    autoShow: true,
    defaultTop,
    defaultLeft,
    saveWindowState: false
  };
  // eslint-disable-next-line no-undef
  await fin.Window.create(childWindow).then(win => {
    setResultsWindow(win);
    if (dockedTo !== DOCK_POSITION.TOP) {
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
  // eslint-disable-next-line no-undef
  fin.desktop.System.getAllWindows(function(windowInfoList) {
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
