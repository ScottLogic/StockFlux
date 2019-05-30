import React, {useRef, useState, useEffect, useReducer} from 'react';
import * as fdc3 from 'openfin-fdc3';
import Components from 'stockflux-components';
import NewsItem from './components/news-item/NewsItem';
import { StockFlux } from 'stockflux-core';
import styles from './App.module.css';

let latestListener;

const SEARCHING = 'searching';
const SUCCESS = 'success';
const ERROR = 'error';

const MIN_HEIGHT = 400;
const TITLEBAR_HEIGHT = 35;
const SYMBOL_HEADER_HEIGHT = 40;
const SPINNER_CONTAINER_HEIGHT = 60;

const initialSearchState = {
  isSearching: false,
  hasErrors: false,
  results: []
};

function App() {

  const searchReducer = (state, { type, results }) => {
    switch (type) {
        case SEARCHING:
            return {
                ...state,
                hasErrors: false,
                isSearching: true,
                results: []
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
                results: []
            };
        default:
            throw new Error();
      }
    };

  const [searchState, dispatch] = useReducer(searchReducer, initialSearchState);
  const [symbol, setSymbol] = useState(null);
  const listContainer = useRef(null);

  const { isSearching, results } = searchState;
    /*
   * This is a temorary solution for
   * 1) not being able to unsubscribe intentListeners
   * 2) not being able to addIntentListener in useEffect due to the race condition
   * 3) being forced to create a new intentListener every render (memory leak)
   * This works due to us manually using only the latest intentListener
   */
  const currentListener = fdc3.addIntentListener('ViewNews', context => {
    if (context && currentListener === latestListener) {
      setSymbol(context.name);
    }
  });
  latestListener = currentListener; 

  useEffect(() => {
    if (symbol) {
      dispatch({ type: SEARCHING });
      StockFlux.getSymbolNews(symbol).then((results) => {
        dispatch({type: SUCCESS, results});
      }).catch(() => dispatch({ type: ERROR }));
    }
  }, [symbol]);

  useEffect(() => {
    (async () => {
        const win = await window.fin.Window.getCurrent();
        const bounds = await win.getBounds();
        if (results.length === 0 && isSearching) {
          win.resizeTo(bounds.width, Math.min(SPINNER_CONTAINER_HEIGHT + TITLEBAR_HEIGHT + SYMBOL_HEADER_HEIGHT, MIN_HEIGHT));
        } else {
          win.resizeTo(bounds.width, Math.min(listContainer.current.scrollHeight + TITLEBAR_HEIGHT + SYMBOL_HEADER_HEIGHT - results.length, MIN_HEIGHT));
        }
    })();
  });

  return (
    <div className={styles.stockfluxNews}> 
      <Components.Titlebar />
      <div className={styles.header}>
          {symbol}
      </div>
      <Components.ScrollWrapperY>
        <div className={styles.container} ref={listContainer}>
        {isSearching ? (
          <div className={styles.spinContainer}>
            <Components.Spinner />
          </div>
        ) : 
          (results.length > 0 ? results.map((newsItem, index) => 
            <NewsItem key={index} headline={newsItem.title} source={newsItem.source} 
                      copy={newsItem.summary} link={newsItem.url} />
          ) : (
            <div className={styles.noArticles}>
              Sorry, no news stories found for that symbol.
            </div>
            )
          )
        }
        </div>
      </Components.ScrollWrapperY>
    </div>
  );
}

export default App;
