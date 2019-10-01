import React, {
  useState,
  useReducer,
  useEffect,
  useRef,
  useCallback
} from 'react';
import { StockFlux } from 'stockflux-core';
import reducer, {
  initialSearchState
} from '../reducers/free-text-search/FreeTextSearch';
import searchAction from '../reducers/free-text-search/Action';
import {
  ScreenEdge,
  useBounds,
  useInterApplicationBusSubscribe
} from 'openfin-react-hooks';
import { OpenfinApiHelpers } from 'stockflux-core/src';
import getResultsWindowProps from '../search-results/helpers/GetResultsWindowProps';
import useChildWindow from '../search-results/helpers/useChildWindow';
import ChildWindow from '../search-results/ChildWindow';
import SearchInputField from './SearchInputField';
import SearchButton from './SearchButton';
import './FreeTextSearch.css';

const ALL = { uuid: '*' };
const SEARCH_TIMEOUT_INTERVAL = 250;
const SEARCH_RESULTS_WINDOW_NAME = 'search-results';
const SEARCH_RESULTS_CSS_PATCH = 'childWindow.css';

let latestRequest = null;
const FreeTextSearch = ({ dockedTo }) => {
  const [searchState, dispatch] = useReducer(reducer, initialSearchState);
  const [query, setQuery] = useState(null);
  const bounds = useBounds();
  const [debouncedQuery, setDebouncedQuery] = useState(null);
  const childWindow = useChildWindow(
    SEARCH_RESULTS_WINDOW_NAME,
    document,
    SEARCH_RESULTS_CSS_PATCH
  );
  const { isSearching, results } = searchState;
  const searchButtonRef = useRef(null);
  const launcherInputRef = useRef(null);
  const childWindowInputRef = useRef(null);

  const parentUuid = OpenfinApiHelpers.getCurrentWindowSync()
    .getOptions()
    .then(options => options.uuid);

  const isDockedToSide = [ScreenEdge.LEFT, ScreenEdge.RIGHT].includes(dockedTo);

  const launchChildWindow = useCallback(
    () =>
      childWindow.launch(
        getResultsWindowProps(
          SEARCH_RESULTS_WINDOW_NAME,
          searchButtonRef,
          isDockedToSide ? childWindowInputRef : launcherInputRef,
          dockedTo,
          bounds
        )
      ),
    [bounds, dockedTo, childWindow, isDockedToSide]
  );

  const closeChildWindow = useCallback(() => {
    setQuery(null);
    dispatch({ type: searchAction.initialise });
    childWindow.close();
  }, [childWindow]);

  const handleOnInputChange = useCallback(
    event => {
      if (!childWindow.window) launchChildWindow();
      setQuery(event.target.value);
    },
    [childWindow, launchChildWindow]
  );

  const handleSearchClick = useCallback(() => {
    if (childWindow.window && results) {
      closeChildWindow();
    } else launchChildWindow();
  }, [childWindow, results, launchChildWindow, closeChildWindow]);

  useEffect(() => {
    const stockFluxSearch = () => {
      if (debouncedQuery) {
        dispatch({ type: searchAction.searching });
        try {
          const currentRequest = StockFlux.stockFluxSearch(debouncedQuery).then(
          stockFluxResults => {
              if (latestRequest === currentRequest) {
                dispatch({
                  type: searchAction.success,
                  results: stockFluxResults
                });
              }
            }
          );
          latestRequest = currentRequest;
        } catch {
          dispatch({ type: searchAction.error });
        }
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
    if (query === '' && childWindow.window) {
      closeChildWindow();
    }
  }, [childWindow, query, closeChildWindow]);

  useEffect(() => {
    if (childWindow) {
      closeChildWindow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dockedTo]);

  useEffect(() => {
    if (childWindow.window) {
      const childWindowJsx = (
        <ChildWindow
          results={results}
          isSearching={isSearching}
          debouncedQuery={debouncedQuery}
        >
          {isDockedToSide && (
            <div className="free-text-search">
              <SearchInputField
                query={query ? query : ''}
                handleOnInputChange={handleOnInputChange}
                inputRef={childWindowInputRef}
              />
            </div>
          )}
        </ChildWindow>
      );
      childWindow.populateDOM(childWindowJsx);
    }
  }, [
    childWindow,
    dockedTo,
    debouncedQuery,
    isSearching,
    results,
    handleOnInputChange,
    isDockedToSide,
    query
  ]);

  const {
    data,
    subscribeError,
    isSubscribed
  } = useInterApplicationBusSubscribe(
    { uuid: parentUuid ? parentUuid : ALL },
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
      {!isDockedToSide && (
        <SearchInputField
          handleOnInputChange={handleOnInputChange}
          inputRef={launcherInputRef}
        />
      )}
      <SearchButton
        searchButtonRef={searchButtonRef}
        handleSearchClick={handleSearchClick}
      />
    </div>
  );
};
export default FreeTextSearch;
