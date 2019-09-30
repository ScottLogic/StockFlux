import React, {
  useState,
  useReducer,
  useEffect,
  useRef,
  useCallback
} from 'react';
import { StockFlux } from 'stockflux-core';
import SearchResult from '../search-result';
import reducer, {
  initialSearchState
} from '../reducers/free-text-search/FreeTextSearch';
import searchAction from '../reducers/free-text-search/Action';
import {
  ScreenEdge,
  useBounds,
  useInterApplicationBusSubscribe
} from 'openfin-react-hooks';
import './FreeTextSearch.css';
import messages from './FreeTextSearch.messages';
import { OpenfinApiHelpers } from 'stockflux-core/src';
import Components from 'stockflux-components';
import getResultsWindowProps from '../search-result/GetResultsWindowProps';
import useChildWindow from '../search-result/useChildWindow';
import childWindowState from '../reducers/child-window/State';
import SearchInputField from './SearchInputField';
import SearchButton from './SearchButton';
import classNames from 'classnames';

const ALL = { uuid: '*' };
const SEARCH_TIMEOUT_INTERVAL = 250;

let latestRequest = null;
const FreeTextSearch = ({ dockedTo }) => {
  const [searchState, dispatch] = useReducer(reducer, initialSearchState);
  const [query, setQuery] = useState(null);
  const bounds = useBounds();
  const [debouncedQuery, setDebouncedQuery] = useState(null);
  const childWindow = useChildWindow(document, 'childWindow.css');
  const { isSearching, results } = searchState;
  const searchButtonRef = useRef(null);
  const inputRef = useRef(null);

  const parentUuid = OpenfinApiHelpers.getCurrentWindowSync()
    .getOptions()
    .then(options => options.uuid);

  const launchChildWindow = useCallback(
    () =>
      childWindow.launch(
        getResultsWindowProps(searchButtonRef, inputRef, dockedTo, bounds)
      ),
    [bounds, dockedTo, childWindow]
  );

  const handleOnInputChange = useCallback(
    event => {
      setQuery(event.target.value);
      if (!childWindow.windowRef) launchChildWindow();
    },
    [childWindow, launchChildWindow]
  );

  const handleSearchClick = useCallback(() => {
    if (
      childWindow.windowRef &&
      results &&
      childWindow.state === childWindowState.populated
    ) {
      childWindow.close();
      dispatch({ type: searchAction.initialise });
      if (dockedTo === ScreenEdge.TOP) {
        inputRef.current.value = '';
      }
    } else launchChildWindow();
  }, [childWindow, inputRef, dockedTo, results]);

  useEffect(() => {
    if (query && query.length === 0) childWindow.close();
  }, [dockedTo, childWindow, query]);

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

  const getCardsJsx = useCallback(
    paddingNeeded => (
      <div className={classNames('cards', { 'padding-top': paddingNeeded })}>
        {results.map(result => (
          <SearchResult
            key={result.symbol}
            symbol={result.symbol}
            name={result.name}
          />
        ))}
      </div>
    ),
    [results]
  );

  const isDockedToSide = () =>
    [ScreenEdge.LEFT, ScreenEdge.RIGHT].includes(dockedTo);

  const isDockedToTopOrNone = () =>
    [ScreenEdge.TOP, ScreenEdge.NONE].includes(dockedTo);

  useEffect(() => {
    if (!childWindow.windowRef) {
      return;
    }

    const messageJsx = isSearching ? (
      <Components.Spinner />
    ) : (
      <p>{debouncedQuery ? messages.no_matches : messages.initial}</p>
    );

    const jsx = (
      <>
        {isDockedToSide() && (
          <div className="free-text-search">
            <SearchInputField
              handleOnInputChange={handleOnInputChange}
              inputRef={inputRef}
            />
          </div>
        )}
        {results && results.length > 0
          ? getCardsJsx(isDockedToSide())
          : messageJsx}
      </>
    );

    childWindow.populateDOM(jsx);
  }, [
    childWindow,
    dockedTo,
    debouncedQuery,
    isSearching,
    results,
    handleOnInputChange,
    getCardsJsx
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
      {isDockedToTopOrNone() && (
        <SearchInputField
          handleOnInputChange={handleOnInputChange}
          inputRef={inputRef}
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
