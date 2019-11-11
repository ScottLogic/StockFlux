import React, {
  useState,
  useReducer,
  useEffect,
  useRef,
  useCallback
} from 'react';
import { FaSearch } from 'react-icons/fa';
import { Intents, StockFlux } from 'stockflux-core';
import SearchResult from './search-result';
import {
  reducer,
  initialSearchState,
  SEARCHING,
  SUCCESS,
  ERROR,
  INITIALISE
} from './FreeTextSearch.reducer';
import {
  ScreenEdge,
  useBounds,
  useInterApplicationBusSubscribe
} from 'openfin-react-hooks';
import './FreeTextSearch.css';
import MESSAGES from './FreeTextSearch.messages';
import launchSearchResultsWindow from './search-result/SearchResults.launcher';
import populateSearchResultsWindow from './search-result/SearchResults.populater';

const ALL = { uuid: '*' };
const IDENTITY = { uuid: window.fin.Window.me.uuid };
const SEARCH_TIMEOUT_INTERVAL = 250;

let latestRequest = null;
let isCreatingResultWindow = false;
let resultsWindow = null;

const closeResultsWindow = () => {
  if (resultsWindow) {
    resultsWindow.close();
    resultsWindow = null;
  }
};

const FreeTextSearch = ({ dockedTo }) => {
  const [searchState, dispatch] = useReducer(reducer, initialSearchState);
  const [parentUuid, setParentUuid] = useState(null);
  const [query, setQuery] = useState(null);
  const bounds = useBounds();
  const [debouncedQuery, setDebouncedQuery] = useState(null);
  const { isSearching, results } = searchState;
  const searchButtonRef = useRef(null);
  const searchInputRef = useRef(null);

  const handleOnInputChange = useCallback(
    event => {
      setQuery(event.target.value);
      if (event.target.value !== null && event.target.value === '') {
        closeResultsWindow();
      } else if (!resultsWindow && !isCreatingResultWindow) {
        isCreatingResultWindow = true;
        launchSearchResultsWindow(
          searchButtonRef,
          searchInputRef,
          dockedTo,
          bounds
        )
          .then(win => (resultsWindow = win))
          .catch(err => console.error(err))
          .finally(() => (isCreatingResultWindow = false));
      }
    },
    [searchButtonRef, searchInputRef, dockedTo, bounds]
  );

  const handleSearchClick = useCallback(() => {
    if (resultsWindow) {
      closeResultsWindow();
      if (dockedTo === ScreenEdge.TOP) {
        searchInputRef.current.value = '';
      }
    } else if (!isCreatingResultWindow) {
      isCreatingResultWindow = true;
      launchSearchResultsWindow(
        searchButtonRef,
        searchInputRef,
        dockedTo,
        bounds
      )
        .then(win => (resultsWindow = win))
        .catch(err => console.error(err))
        .finally(() => (isCreatingResultWindow = false));
    }
  }, [searchButtonRef, searchInputRef, dockedTo, bounds]);

  useEffect(() => {
    closeResultsWindow();
    setQuery('');
  }, [dockedTo]);

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
    const handler = setTimeout(
      () => setDebouncedQuery(query),
      SEARCH_TIMEOUT_INTERVAL
    );
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (!resultsWindow) {
      return;
    }

    if (isSearching) {
      populateSearchResultsWindow(MESSAGES.SEARCHING, resultsWindow);
    } else if (results && results.length) {
      const html = results.map(result => (
        <SearchResult key={result.code} code={result.code} name={result.name} />
      ));
      populateSearchResultsWindow(html, resultsWindow);
    } else {
      populateSearchResultsWindow(
        debouncedQuery ? MESSAGES.NO_MATCHES : MESSAGES.INITIAL,
        resultsWindow
      );
    }
  }, [debouncedQuery, isSearching, results]);

  useEffect(() => {
    window.fin.Window.getCurrentSync()
      .getOptions()
      .then(options => setParentUuid({ uuid: options.uuid }));
  }, []);

  const closeAndClearSearch = () => {
    closeResultsWindow();
    searchInputRef.current.value = '';
    searchInputRef.current.blur();
  };

  useEffect(() => {
    window.fin.InterApplicationBus.subscribe(
      IDENTITY,
      'intent-request',
      message => {
        switch (message.type) {
          case 'news-view':
            Intents.viewNews(message.code);
            closeAndClearSearch();
            break;
          case 'watchlist-add':
            Intents.addWatchlist(message.code, message.name);
            closeAndClearSearch();
            break;
          case 'chart-add':
            Intents.viewChart(message.code, message.name);
            closeAndClearSearch();
            break;
          default:
            break;
        }
      }
    );
  }, []);

  const {
    data,
    subscribeError,
    isSubscribed
  } = useInterApplicationBusSubscribe(
    parentUuid ? parentUuid : ALL,
    'search-request'
  );

  if (
    !subscribeError &&
    isSubscribed &&
    data &&
    debouncedQuery !== data.message &&
    dockedTo !== ScreenEdge.TOP
  ) {
    setDebouncedQuery(data.message);
  }

  return (
    <div className="free-text-search">
      {(dockedTo === ScreenEdge.TOP || dockedTo === ScreenEdge.NONE) && (
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
