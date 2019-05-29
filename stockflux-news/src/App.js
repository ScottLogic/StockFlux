import React, {useRef, useState, useEffect} from 'react';
import * as fdc3 from 'openfin-fdc3';
import Components from 'stockflux-components';
import NewsItem from './components/news-item/NewsItem';
import { StockFlux } from 'stockflux-core';
import './App.css';

let latestListener;

const MIN_HEIGHT = 400;
const TITLEBAR_HEIGHT = 35;
const SYMBOL_HEADER_HEIGHT = 41;

function App() {

  const [symbol, setSymbol] = useState(null);
  const [articles, setArticles] = useState([]);
  const listContainer = useRef(null);

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
      StockFlux.getSymbolNews(symbol).then(setArticles);
    }
  }, [symbol]);

  useEffect(() => {
    (async () => {
        const win = await window.fin.Window.getCurrent();
        const bounds = await win.getBounds();
        win.resizeTo(bounds.width, Math.min(listContainer.current.scrollHeight + TITLEBAR_HEIGHT + SYMBOL_HEADER_HEIGHT, MIN_HEIGHT));
    })();
  });

  return (
    <div className="stockflux-news">
      <Components.Titlebar />
      <div className="stockflux-header">
          {symbol}
      </div>
      <div className="newsitems-container" ref={listContainer}>
          {articles.length > 0 ? articles.map((newsItem, index) => 
            <NewsItem key={index} headline={newsItem.title} source={newsItem.source} 
                      copy={newsItem.summary} link={newsItem.url} />
          ) : (
            <div className="no-articles">
              Sorry, no news stories found for that symbol.
            </div>
          )}
      </div>
    </div>
  );
}

export default App;
