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
import {
  createWindow,
  populateResultsContainer
} from './search-result/SearchResultsWindowPosition';
import {
  reducer,
  initialSearchState,
  SEARCHING,
  SUCCESS,
  ERROR,
  INITIALISE
} from './FreeTextSearch.reducer';
import {
  InterApplicationBusHooks,
  WindowHooks,
  Constants
} from 'openfin-react-hooks';
import './FreeTextSearch.css';

const SEARCH_TIMEOUT_INTERVAL = 250;
const NO_MATCHES_HTML = <p>Sorry, no matches found.</p>;
const INITIAL_MESSAGE_HTML = (
  <p>
    Use the input field above to search for instruments or click on the search
    icon to close the search.
  </p>
);

let latestRequest = null;
let resultsWindow = null;

const FreeTextSearch = props => {
  const [searchState, dispatch] = useReducer(reducer, initialSearchState);
  const [parentUuid, setParentUuid] = useState(null);
  const [query, setQuery] = useState(null);
  const [windowState] = WindowHooks.useCurrentWindowState();
  const [debouncedQuery, setDebouncedQuery] = useState(null);
  const { isSearching, results } = searchState;
  const searchButtonRef = useRef(null);
  const searchInputRef = useRef(null);

  const setResultsWindow = newReference => {
    resultsWindow = newReference;
  };

  const resetLauncherInputField = () => {
    if (searchInputRef.current) searchInputRef.current.value = '';
  };

  const closeResultsWindow = useCallback(() => {
    if (resultsWindow) {
      resultsWindow.close();
      setResultsWindow(null);
    }
  }, []);

  const handleOnInputChange = useCallback(
    event => {
      setQuery(event.target.value);
      if (event.target.value !== null && event.target.value.length === 0) {
        closeResultsWindow();
      } else if (!resultsWindow)
        createWindow(
          searchButtonRef,
          searchInputRef,
          props.dockedTo,
          windowState.bounds,
          setResultsWindow
        ).catch(err => console.error(err));
    },
    [
      searchButtonRef,
      searchInputRef,
      closeResultsWindow,
      props.dockedTo,
      windowState.bounds
    ]
  );

  const handleSearchClick = useCallback(() => {
    if (resultsWindow) {
      closeResultsWindow();
      if (props.dockedTo === Constants.ScreenEdge.TOP)
        resetLauncherInputField();
    } else {
      createWindow(
        searchButtonRef,
        searchInputRef,
        props.dockedTo,
        windowState.bounds,
        setResultsWindow
      ).catch(err => console.error(err));
    }
  }, [
    searchButtonRef,
    searchInputRef,
    closeResultsWindow,
    props.dockedTo,
    windowState.bounds
  ]);

  useEffect(() => {
    const stockFluxSearch = () => {
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
    closeResultsWindow();
  }, [closeResultsWindow, props.dockedTo]);

  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedQuery(query),
      SEARCH_TIMEOUT_INTERVAL
    );
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (!isSearching && debouncedQuery !== null) {
      if (results && results.length && debouncedQuery.length !== 0) {
        const html = results.map(result => (
          <SearchResult
            key={result.code}
            code={result.code}
            name={result.name}
          />
        ));
        populateResultsContainer(html, resultsWindow);
      } else {
        populateResultsContainer(
          debouncedQuery.length === 0 ? INITIAL_MESSAGE_HTML : NO_MATCHES_HTML,
          resultsWindow
        );
      }
    }
  }, [debouncedQuery, isSearching, props.dockedTo, results]);

  useEffect(() => {
    window.fin.Window.getCurrentSync()
      .getOptions()
      .then(options => {
        setParentUuid(options.uuid);
      });
  }, []);

  const {
    data,
    subscribeError,
    isSubscribed
  } = InterApplicationBusHooks.useSubscription(
    parentUuid ? parentUuid : '*',
    '',
    'search-request'
  );

  if (!subscribeError && isSubscribed) {
    if (data && debouncedQuery !== data[0]) setDebouncedQuery(data[0]);
  }

  return (
    <div className="free-text-search">
      {(props.dockedTo === Constants.ScreenEdge.TOP ||
        props.dockedTo === Constants.ScreenEdge.NONE) && (
        <input
          onInput={event => handleOnInputChange(event)}
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
export default FreeTextSearch;
