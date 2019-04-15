import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react';
import $ from 'jquery';
import classnames from 'classnames';
import searchTabImage from '../styles/png/search_tab.png';
import SearchResult from './SearchResult';
import { search } from '../services/QuandlService';

import styles from './Search.module.css';

const SEARCH_TIMEOUT_INTERVAL = 250;

const initialSearchState = {
    isSearching: false,
    hasErrors: false
};

const SEARCHING = 'searching';
const SUCCESS = 'success';
const ERROR = 'error';
const INITIALISE = 'initialise';

const searchReducer = (state, {type, results}) => {
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
            }
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
}

export default function Search(props) {
    const { favourites, term, selection } = props;
    const { codes, names } = favourites;
    
    const searchScroll = useRef(null);
    const [query, setQuery] = useState();
    const [debouncedQuery, setDebouncedQuery] = useState();

    const [searchState, dispatch] = useReducer(searchReducer, initialSearchState);
    const { isSearching, hasErrors, results } = searchState;

    const onChange = useCallback(e => setQuery(e.target.value), []);
    const onIconClick = useCallback(console.log, []); // TODO
    const onClick = useCallback(console.log, []); // TODO

    const bindings = {
        onClick,
        onIconClick
    };

    useEffect(() => {
        const quandlSearch = async () => {
            if (debouncedQuery) {
                dispatch({ type: SEARCHING });
    
                try {
                    const quandlResults = await search(debouncedQuery);
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
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, SEARCH_TIMEOUT_INTERVAL);

        return () => {
            clearTimeout(handler);
        };
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
            <div>
                <img className={styles.topIcon} src={searchTabImage} title="Search Stocks" draggable="false" />
                <input value={term} className={styles.searchInput} type="text" maxLength="20" placeholder="Enter stock name or symbol" onChange={onChange} />
            </div>
            <div className={classnames(styles.searchScroll, 'side-scroll', 'custom-scrollbar')} ref={searchScroll}>
                <div>
                    {hasErrors &&
                        <div className={styles.message}>
                            An error occurred while retrieving data. Please check your internet connection or wait for our data services to be re-established.
                        </div>
                    }

                    {isSearching && <div className={styles.message}>Loading search results...</div>}

                    {!isSearching && !results && codes.map((stockCode) =>
                        <SearchResult
                            key={stockCode}
                            stock={{ code: stockCode, name: names[stockCode] }}
                            bindings={bindings}
                            selected={stockCode === selection.code}
                            isFavourite={codes.indexOf(stockCode) >= 0}
                        />)
                    }

                    {!isSearching && !results && !hasErrors && codes.length === 0 &&
                        <div className={styles.message}>
                            <p>Use the search tab to add new stocks to the list.</p>
                        </div>
                    }

                    {(results || []).map((stock) =>
                        <SearchResult
                            key={stock.code}
                            stock={stock}
                            bindings={bindings}
                            selected={stock.code === selection.code}
                            isFavourite={codes.indexOf(stock.code) >= 0}
                        />)}
                    {results && results.length === 0 && !hasErrors && !isSearching && <div className={styles.message}>
                        Oops! Looks like no matches were found.
                    </div>}
                </div>
            </div>
        </div>
    );
};
