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
import launchSearchResultsWindow from './search-result/SearchResults.launcher';
import populateSearchResultsWindow from './search-result/SearchResults.populater';
import { OpenfinApiHelpers } from 'stockflux-core/src';
import Components from 'stockflux-components';

const ALL = { uuid: '*' };
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
      populateSearchResultsWindow(
        MESSAGES.SEARCHING,
        resultsWindow,
        'childWindow.css'
      );
    } else if (results && results.length) {
      const resultCards = results.map(result => (
        <SearchResult
          key={result.symbol}
          symbol={result.symbol}
          name={result.name}
        />
      ));
      populateSearchResultsWindow(
        resultCards,
        resultsWindow,
        'childWindow.css'
      );
    } else {
      populateSearchResultsWindow(
        <p>{debouncedQuery ? MESSAGES.NO_MATCHES : MESSAGES.INITIAL}</p>,
        resultsWindow,
        'childWindow.css'
      );
    }
  }, [debouncedQuery, isSearching, results]);

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
