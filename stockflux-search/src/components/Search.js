import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react';
import $ from 'jquery';
import classnames from 'classnames';
import { Quandl } from 'stockflux-core';
import SearchResult from './SearchResult';

import searchTab from './search-tab.png';

import styles from './Search.module.css';
import './custom-scroll.css';

const SEARCH_TIMEOUT_INTERVAL = 250;

const initialSearchState = {
  isSearching: false,
  hasErrors: false,
};

const SEARCHING = 'searching';
const SUCCESS = 'success';
const ERROR = 'error';
const INITIALISE = 'initialise';

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

export default function Search() {
  const searchScroll = useRef(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState();
  const [searchState, dispatch] = useReducer(searchReducer, initialSearchState);
  const { isSearching, hasErrors, results } = searchState;
  const onChange = useCallback(e => setQuery(e.target.value), []);

  useEffect(() => {
    const quandlSearch = async () => {
      if (debouncedQuery) {
        dispatch({ type: SEARCHING });

        try {
          const quandlResults = await Quandl.search(debouncedQuery);
          dispatch({ type: SUCCESS, results: quandlResults });
        } catch {
          dispatch({ type: ERROR });
        }
      } else {
        dispatch({ type: INITIALISE });
      }
    };
    quandlSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), SEARCH_TIMEOUT_INTERVAL);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    $(searchScroll.current).mCustomScrollbar({
      scrollInertia: 0,
      mouseWheel: {
        scrollAmount: 80
      }
    });
  }, []);

  return (
    <div className={styles.search}>
      <div className={styles.header}>
        <input value={query} className={styles.searchInput} type="text" maxLength="20" placeholder="Enter stock name or symbol" onChange={onChange} />
        <img src={searchTab} className={styles.searchIcon} title="Search Stocks" alt="Search Stocks" draggable="false" />
      </div>
      <div className={classnames(styles.searchScroll, 'search-scroll', 'side-scroll', 'custom-scrollbar')} ref={searchScroll}>
        <div>
          {!isSearching && !results && !hasErrors &&
            <div className={styles.message}>
              <p>Use the search tab to add new stocks to the list</p>
            </div>
          }

          {isSearching && <div className={styles.message}>Loading search results...</div>}

          {(results || []).map((stock) =>
            <SearchResult
              key={stock.code}
              stock={stock}
              onFavouriteClick={() => console.log('favourite click')}
              onResultClick={() => console.log('result click')}
            />
          )}

          {hasErrors &&
            <div className={styles.message}>
              An error occurred while retrieving data. Please check your internet connection or wait for our data services to be re-established.
            </div>
          }

          {results && results.length === 0 && !hasErrors && !isSearching &&
            <div className={styles.message}>
              Oops! Looks like no matches were found.
            </div>
          }
        </div>
      </div>
    </div>
  );
};
