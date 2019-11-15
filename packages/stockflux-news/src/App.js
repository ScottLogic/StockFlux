import React, { useRef, useState, useEffect, useReducer } from 'react';
import Components from 'stockflux-components';
import { StockFlux } from 'stockflux-core';
import NewsItem from './components/news-item/NewsItem';
import {
  useInterApplicationBusSubscribe,
  useOptions
} from 'openfin-react-hooks';
import './App.css';
import searchReducer, { initialState } from './reducers/search';
import Action from './reducers/search/Action';

function App() {
  const [searchState, dispatch] = useReducer(searchReducer, initialState);
  const [symbol, setSymbol] = useState(null);
  const [options] = useOptions();
  const listContainer = useRef(null);

  const { isSearching, results } = searchState;

  const { data } = useInterApplicationBusSubscribe(
    { uuid: options ? options.uuid : '*' },
    'stockflux-news'
  );

  useEffect(() => {
    if (data && data.message) {
      if (data.message.symbol) {
        setSymbol(data.message.symbol);
      }
    }
  }, [data, setSymbol]);

  useEffect(() => {
    if (options && options.customData.symbol) {
      setSymbol(options.customData.symbol);
    }
  }, [options, setSymbol, symbol]);

  useEffect(() => {
    if (symbol) {
      dispatch({ type: Action.SEARCHING });
      StockFlux.getSymbolNews(symbol)
        .then(results => {
          dispatch({ type: Action.SUCCESS, results });
        })
        .catch(() => dispatch({ type: Action.ERROR }));
    }
  }, [symbol]);

  return (
    <div className="stockflux-news">
      <Components.Titlebar title="News" />
      <Components.ScrollWrapperY>
        <div className="container" ref={listContainer}>
          {isSearching ? (
            <div className="spin-container">
              <Components.Spinner />
            </div>
          ) : results.length > 0 ? (
            results.map((newsItem, index) => (
              <NewsItem
                key={index}
                headline={newsItem.title}
                source={newsItem.source}
                copy={newsItem.summary}
                link={newsItem.url}
                time={newsItem.time}
              />
            ))
          ) : (
            <div className="no-articles">
              Sorry, no news stories found for that symbol.
            </div>
          )}
        </div>
      </Components.ScrollWrapperY>
    </div>
  );
}

export default App;
