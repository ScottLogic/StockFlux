import React, {
  useState,
  useReducer,
  useEffect,
  useRef,
  useCallback
} from 'react';
import { FaSearch } from 'react-icons/fa';
import { StockFlux } from 'stockflux-core';
import SearchResult from './search-result';
import ReactDOMServer from 'react-dom/server';
import DOCK_POSITION from './DockPosition';
import { WindowHooks, InterApplicationBusHooks } from 'openfin-react-hooks';
import './FreeTextSearch.css';

const SEARCHING = 'searching';
const SUCCESS = 'success';
const ERROR = 'error';
const INITIALISE = 'initialise';
const RESULTS_WINDOW_NAME = 'child-window-search-results';
const SEARCH_TIMEOUT_INTERVAL = 250;
const SEARCH_LIST_WIDTH = 407;
const SEARCH_LIST_HEIGHT = 400;
const LAUNCHER_WIDTH = 50;

let latestRequest = null;

const initialSearchState = {
  isSearching: false,
  hasErrors: false
};

const searchReducer = (state, { type, results }) => {
  switch (type) {
    case SEARCHING:
      return {
        ...state,
        hasErrors: false,
        isSearching: true
      };
    case SUCCESS:
      return {
        ...state,
        isSearching: false,
        results
      };
    case ERROR:
      return {
        ...state,
        hasErrors: true,
        isSearching: false
      };
    case INITIALISE:
      return initialSearchState;
    default:
      throw new Error();
  }
};

let resultsWindow = null;

const Search = props => {
  const [searchState, dispatch] = useReducer(searchReducer, initialSearchState);
  const [windowState] = WindowHooks.useCurrentWindowState();

  const [parentUuid, setParentUuid] = useState(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(null);
  const { isSearching, results } = searchState;
  const searchButtonRef = useRef(null);
  const searchInputRef = useRef(null);

  window.fin.Window.getCurrentSync()
    .getOptions()
    .then(options => {
      setParentUuid(options.uuid);
    });

  const {
    data,
    subscribeError,
    isSubscribed
  } = InterApplicationBusHooks.useSubscription(
    parentUuid ? parentUuid : '*',
    '',
    'search-request'
  );

  const populateResultsWindow = useCallback(
    html => {
      if (resultsWindow && resultsWindow.getWebWindow) {
        const webWindow = resultsWindow.getWebWindow();
        if (webWindow && webWindow.document)
          if (props.dockedTo === DOCK_POSITION.TOP) {
            webWindow.document.body.innerHTML = html;
          } else {
            webWindow.document.getElementById(
              'results-container'
            ).innerHTML = html;
          }
      }
    },
    [props.dockedTo]
  );

  const getWidth = () => {
    let width;
    if (searchButtonRef.current) {
      width = searchInputRef.current.getBoundingClientRect().width;
      return width > 0
        ? width
        : searchButtonRef.current.getBoundingClientRect().width;
    }
  };

  const getY = () => {
    if (searchButtonRef.current) {
      return parseInt(searchButtonRef.current.getBoundingClientRect().y);
    }
  };

  const getX = () => {
    if (searchButtonRef.current) {
      return parseInt(searchButtonRef.current.getBoundingClientRect().x);
    }
  };

  const getChildWindowPosition = useCallback(() => {
    let left, top;
    switch (props.dockedTo) {
      case DOCK_POSITION.TOP:
        top = LAUNCHER_WIDTH;
        left = getX() - getWidth();
        break;
      case DOCK_POSITION.LEFT:
        top = getY();
        left = LAUNCHER_WIDTH;
        break;
      case DOCK_POSITION.RIGHT:
        top = getY();
        left =
          windowState.bounds &&
          windowState.bounds.width - LAUNCHER_WIDTH - SEARCH_LIST_WIDTH;
        break;
      default:
        top = 50;
        left = 600;
        break;
    }
    return { defaultTop: parseInt(top), defaultLeft: parseInt(left) };
  }, [props.dockedTo, windowState.bounds]);

  const spawnWindow = useCallback(async () => {
    const { defaultTop, defaultLeft } = getChildWindowPosition();

    const childWindow = {
      name: RESULTS_WINDOW_NAME,
      defaultWidth: SEARCH_LIST_WIDTH,
      defaultHeight: SEARCH_LIST_HEIGHT,
      url: 'window.html',
      frame: false,
      autoShow: true,
      defaultTop,
      defaultLeft,
      saveWindowState: false
    };
    // eslint-disable-next-line no-undef
    await fin.Window.create(childWindow).then(win => {
      resultsWindow = win;
      if (props.dockedTo !== DOCK_POSITION.TOP) {
        win
          .getWebWindow()
          .document.getElementById('searchbar-container')
          .classList.remove('search-hidden');
      }
    });
  }, [getChildWindowPosition, props.dockedTo]);

  const createWindow = useCallback(async () => {
    // eslint-disable-next-line no-undef
    fin.desktop.System.getAllWindows(function(windowInfoList) {
      if (windowInfoList[0].childWindows.length === 0) {
        spawnWindow();
      }
    });
  }, [spawnWindow]);

  useEffect(() => {
    const stockFluxSearch = async () => {
      if (debouncedQuery) {
        dispatch({ type: SEARCHING });
        try {
          const currentRequest = StockFlux.stockFluxSearch(debouncedQuery).then(
            stockFluxResults => {
              if (latestRequest === currentRequest) {
                dispatch({ type: SUCCESS, results: stockFluxResults });
              }
            }
          );
          latestRequest = currentRequest;
        } catch {
          dispatch({ type: ERROR });
        }
      } else {
        dispatch({ type: INITIALISE });
      }
    };
    stockFluxSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    closeChildWindow();
  }, [props.dockedTo]);

  const closeChildWindow = () => {
    if (resultsWindow) {
      resultsWindow.close();
      resultsWindow = null;
    }
  };

  const handleOnInputChange = useCallback(
    (event, isNewWindowNeeded) => {
      setQuery(event.target.value);
      if (isNewWindowNeeded) createWindow().catch(err => console.log(err));
      if (event.target.value === '') {
        closeChildWindow();
      }
    },
    [createWindow]
  );

  const handleSearchClick = useCallback(async () => {
    createWindow().catch(err => console.log(err));
  }, [createWindow]);

  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedQuery(query),
      SEARCH_TIMEOUT_INTERVAL
    );
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (results) {
      const html =
        !isSearching &&
        results &&
        results.length &&
        results.map(result => (
          <SearchResult
            key={result.code}
            code={result.code}
            name={result.name}
          />
        ));
      populateResultsWindow(ReactDOMServer.renderToStaticMarkup(html));
    }
  }, [isSearching, populateResultsWindow, props.dockedTo, results]);

  if (!subscribeError && isSubscribed) {
    if (data && debouncedQuery !== data[0]) setDebouncedQuery(data[0]);
  }

  return (
    <div className="free-text-search">
      {props.dockedTo === DOCK_POSITION.TOP && (
        <input
          onChange={event => handleOnInputChange(event, true)}
          placeholder="Search"
          ref={searchInputRef}
        />
      )}
      <button onClick={() => handleSearchClick()} ref={searchButtonRef}>
        <FaSearch />
      </button>
    </div>
  );
};
export default Search;
