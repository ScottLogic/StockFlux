import React, { useState, useReducer, useEffect, useRef, useCallback } from 'react';
import { FaSearch } from 'react-icons/fa';
import { StockFlux } from 'stockflux-core';
import SearchResult from './search-result';
import { reducer, initialSearchState, SEARCHING, SUCCESS, ERROR, INITIALISE } from './FreeTextSearch.reducer';
import { InterApplicationBusHooks, WindowHooks, Constants } from 'openfin-react-hooks';
import './FreeTextSearch.css';
import MESSAGES from "./FreeTextSearch.messages";
import launchSearchResultsWindow from "./search-result/SearchResults.launcher";
import populateSearchResultsWindow from './search-result/SearchResults.populater';

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
  const [windowState] = WindowHooks.useCurrentWindowState();
  const [debouncedQuery, setDebouncedQuery] = useState(null);
  const { isSearching, results } = searchState;
  const searchButtonRef = useRef(null);
  const searchInputRef = useRef(null);

  const handleOnInputChange = useCallback(
    event => {
      setQuery(event.target.value);
      if (event.target.value !== null && event.target.value === "") {
        closeResultsWindow();
      } else if (!resultsWindow && !isCreatingResultWindow) {
        isCreatingResultWindow = true;
        launchSearchResultsWindow(searchButtonRef, searchInputRef, dockedTo, windowState.bounds)
            .then(win => resultsWindow = win)
            .catch(err => console.error(err))
            .finally(() => isCreatingResultWindow = false);
      }
    },
    [searchButtonRef, searchInputRef, dockedTo, windowState.bounds]
  );

  const handleSearchClick = useCallback(() => {
    if (resultsWindow) {
      closeResultsWindow();
      if (dockedTo === Constants.ScreenEdge.TOP) {
        searchInputRef.current.value = '';
      }
    } else if(!isCreatingResultWindow) {
      isCreatingResultWindow = true;
      launchSearchResultsWindow(searchButtonRef, searchInputRef, dockedTo, windowState.bounds)
          .then(win => resultsWindow = win)
          .catch(err => console.error(err))
          .finally(() => isCreatingResultWindow = false);
    }
  }, [searchButtonRef, searchInputRef, dockedTo, windowState.bounds]);

  useEffect(() => {
    closeResultsWindow();
    setQuery("");
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
    const handler = setTimeout(() => setDebouncedQuery(query), SEARCH_TIMEOUT_INTERVAL);
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
        <SearchResult
          key={result.code}
          code={result.code}
          name={result.name}
        />
      ));
      populateSearchResultsWindow(html, resultsWindow);
    } else {
      populateSearchResultsWindow(debouncedQuery ? MESSAGES.NO_MATCHES : MESSAGES.INITIAL, resultsWindow);
    }
  }, [debouncedQuery, isSearching, results]);

  useEffect(() => {
    window.fin.Window.getCurrentSync()
      .getOptions()
      .then(options => setParentUuid(options.uuid));
  }, []);

  const { data, subscribeError, isSubscribed } = InterApplicationBusHooks.useSubscription(
    parentUuid ? parentUuid : '*', '', 'search-request');

  if (!subscribeError && isSubscribed && data && debouncedQuery !== data[0]) {
    setDebouncedQuery(data[0]);
  }

  return (
    <div className="free-text-search">
      {(dockedTo === Constants.ScreenEdge.TOP || dockedTo === Constants.ScreenEdge.NONE) && (
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
