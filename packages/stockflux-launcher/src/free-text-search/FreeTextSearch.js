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
import { OpenfinApiHelpers } from 'stockflux-core/src';
import Components from 'stockflux-components';
import getResultsWindowProps from './search-result/GetResultsWindowProps';
import useChildWindow from './search-result/useChildWindow';
import ChildWindowState from './search-result/ChildWindowState';

const ALL = { uuid: '*' };
const SEARCH_TIMEOUT_INTERVAL = 250;

let latestRequest = null;
const FreeTextSearch = ({ dockedTo }) => {
  const [searchState, dispatch] = useReducer(reducer, initialSearchState);
  const [parentUuid, setParentUuid] = useState(null);
  const [query, setQuery] = useState(null);
  const bounds = useBounds();
  const [debouncedQuery, setDebouncedQuery] = useState(null);
  const [childWindow, state, launch, populateDOM, close] = useChildWindow(
    document,
    'childWindow.css'
  );
  const { isSearching, results } = searchState;
  const searchButtonRef = useRef(null);
  const searchInputRef = useRef(null);

  const handleOnInputChange = useCallback(
    event => {
      setQuery(event.target.value);
      if (!childWindow) {
        launch(
          getResultsWindowProps(
            searchButtonRef,
            searchInputRef,
            dockedTo,
            bounds
          )
        );
      }
    },
    [childWindow, launch, searchButtonRef, searchInputRef, dockedTo, bounds]
  );

  const handleSearchClick = useCallback(() => {
    console.log(
      'childWindow',
      childWindow,
      'results',
      results,
      'state === ChildWindowState.populated',
      state === ChildWindowState.populated
    );
    if (childWindow && results && state === ChildWindowState.populated) {
      close();
      if (dockedTo === ScreenEdge.TOP) {
        searchInputRef.current.value = '';
      }
    } else if (state === ChildWindowState.initial) {
      console.log('launch');
      launch(
        getResultsWindowProps(searchButtonRef, searchInputRef, dockedTo, bounds)
      );
    }
  }, [
    childWindow,
    close,
    launch,
    state,
    searchButtonRef,
    searchInputRef,
    dockedTo,
    bounds
  ]);

  useEffect(() => {
    if (query && query.length === 0) close();
  }, [dockedTo, close, query]);

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
    if (!childWindow) {
      return;
    }

    const resultsHTML =
      results && results.length > 0
        ? results.map(result => (
            <SearchResult
              key={result.symbol}
              symbol={result.symbol}
              name={result.name}
            />
          ))
        : null;

    const messageHtml = (
      <p>
        {isSearching
          ? MESSAGES.SEARCHING
          : debouncedQuery
          ? MESSAGES.NO_MATCHES
          : MESSAGES.INITIAL}
      </p>
    );
    populateDOM(resultsHTML ? resultsHTML : messageHtml);
  }, [childWindow, populateDOM, debouncedQuery, isSearching, results]);

  useEffect(() => {
    OpenfinApiHelpers.getCurrentWindowSync()
      .getOptions()
      .then(options => setParentUuid({ uuid: options.uuid }));
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
      <span ref={searchButtonRef}>
        <Components.Buttons.Round onClick={() => handleSearchClick()}>
          <FaSearch />
        </Components.Buttons.Round>
      </span>
    </div>
  );
};
export default FreeTextSearch;
