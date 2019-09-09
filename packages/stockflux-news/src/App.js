import React, {useRef, useState, useEffect, useReducer} from 'react';
import Components from 'stockflux-components';
import { StockFlux, StockFluxHooks, OpenfinApiHelpers } from 'stockflux-core';
import { useInterApplicationBusSubscribe, useOptions } from 'openfin-react-hooks';

import NewsItem from './components/news-item/NewsItem';

import './App.css';

const ALL = { uuid: '*' };

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
  const [symbol, setSymbol] = StockFluxHooks.useLocalStorage('newsSymbol', null);
  const [name, setName] = StockFluxHooks.useLocalStorage('newsName', null);
  const [parentUuid, setParentUuid] = useState(null);
  const [listenerSymbol, setListenerSymbol] = useState(null);
  const [options] = useOptions();
  const listContainer = useRef(null);

  const { isSearching, results } = searchState;
  
  if (options && listenerSymbol !== options.customData.symbol) {
      setListenerSymbol(options.customData.symbol);
      setParentUuid({ uuid: options.uuid });
  }

  const { data } = useInterApplicationBusSubscribe(parentUuid ? parentUuid : ALL, 'stockFluxNews:'+listenerSymbol);
  if (data && data.message) {
      if (data.message.symbol && symbol !== data.message.symbol) {
        setSymbol(data.message.symbol);
      }
      if (data.message.name && name !== data.message.name) {
        setName(data.message.name);
      }
      
  }

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
        const win = await OpenfinApiHelpers.getCurrentWindow();
        const bounds = await win.getBounds();
        if (results.length === 0 && isSearching) {
          win.resizeTo(bounds.width, Math.min(SPINNER_CONTAINER_HEIGHT + TITLEBAR_HEIGHT + SYMBOL_HEADER_HEIGHT, MIN_HEIGHT));
        } else {
          win.resizeTo(bounds.width, Math.min(listContainer.current.scrollHeight + TITLEBAR_HEIGHT + SYMBOL_HEADER_HEIGHT, MIN_HEIGHT));
        }
    })();
  });

  return (
    <div className="stockflux-news">
      <Components.Titlebar />
      <div className="header">
          {symbol} {name} News
      </div>
      <Components.ScrollWrapperY>
        <div className="container" ref={listContainer}>
        {isSearching ? (
          <div className="spin-container">
            <Components.Spinner />
          </div>
        ) :
          (results.length > 0 ? results.map((newsItem, index) =>
            <NewsItem key={index} headline={newsItem.title} source={newsItem.source}
                      copy={newsItem.summary} link={newsItem.url} time={newsItem.time} />
          ) : (
            <div className="no-articles">
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
