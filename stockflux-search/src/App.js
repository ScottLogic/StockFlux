import React, { useRef, useState, useEffect, useReducer } from 'react';
import { Quandl } from 'stockflux-core';
import Components from 'stockflux-components';

import SearchResult from './search-result';
import styles from './App.module.css';

const SEARCHING = 'searching';
const SUCCESS = 'success';
const ERROR = 'error';
const INITIALISE = 'initialise';

const SEARCH_TIMEOUT_INTERVAL = 250;

const initialSearchState = {
    isSearching: false,
    hasErrors: false,
};

const getMessage = (state, results) => {
    if (state.isSearching) {
        return 'Loading search results...';
    } else if (state.hasErrors) {
        return 'An error occurred while retrieving data. Please check your internet connection or wait for our data services to be re-established.';
    } else if (results && results.length === 0) {
        return 'No matches were found.'
    } else {
        return 'Use the search bar above to add new stocks / symbols.';
    }
};

const searchReducer = (state, { type, results }) => {
    switch (type) {
        case SEARCHING:
            return {
                ...state,
                hasErrors: false,
                isSearching: true,
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
                isSearching: false,
            };
        case INITIALISE:
            return initialSearchState;
        default:
            throw new Error();
    }
};

const App = () => {
    const [searchState, dispatch] = useReducer(searchReducer, initialSearchState);
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(null);
    const { isSearching, results } = searchState;
    const listContainer = useRef(null);

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
        (async () => {
            const win = await window.fin.Window.getCurrent();
            const bounds = await win.getBounds();
            win.resizeTo(bounds.width, Math.min(listContainer.current.scrollHeight + 70 + 20, 400));
        })();
    });

    return (
        <>
            <Components.Titlebar />
            <input type="text" className={styles.input} onChange={event => setQuery(event.target.value)} placeholder="Enter stock name or symbol" />
            <div className={styles.containerList} ref={listContainer}>
                { !isSearching && results && results.length ?
                    results.map((result) => (<SearchResult key={result.code} code={result.code} name={result.name} />)) :
                    <div className={styles.message}>{getMessage(searchState, results)}</div>
                }
            </div>
        </>
    );
};

export default App;
