import React, { useState, useEffect, useCallback, useReducer } from 'react';
import Chart from './components/Chart';
import Components from 'stockflux-components';
import { Launchers, OpenfinApiHelpers } from 'stockflux-core';
import { useOptions } from 'openfin-react-hooks';
import { format, subYears } from 'date-fns';
import { ReactComponent as D3FCIcon } from './assets/d3fc.svg';
import Action from './reducers/open-apps/Action';
import reducer, { initialState } from './reducers/open-apps/OpenApps';
import cx from 'classnames';

import './styles/app.css';

const App = () => {
  const [symbol, setSymbol] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [name, setName] = useState(null);
  const [options] = useOptions();
  const [showMenu, setShowMenu] = useState(false);
  const [openApps, dispatch] = useReducer(reducer, initialState);

  const determineIfNewsOpen = useCallback(async () => {
    const newsWindow = await OpenfinApiHelpers.windowAlreadyExists(
      `stockflux-news[${symbol}]`
    );
    if (newsWindow) {
      newsWindow.addListener('closed', determineIfNewsOpen);
    }
    dispatch({ type: Action.SET_NEWS_WINDOW, payload: newsWindow });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  const determineIfWatchlistOpen = useCallback(async () => {
    const watchlistWindow = await OpenfinApiHelpers.windowAlreadyExists(
      'stockflux-watchlist'
    );
    if (watchlistWindow) {
      watchlistWindow.addListener('closed', determineIfWatchlistOpen);
    }
    dispatch({ type: Action.SET_WATCHLIST_WINDOW, payload: watchlistWindow });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  useEffect(() => {
    if (options && options.customData && options.customData.symbol) {
      setSymbol(options.customData.symbol);
      setName(options.customData.name ? options.customData.name : null);
    }
  }, [options, setSymbol, setName]);

  const getData = useCallback(async () => {
    var date = format(subYears(new Date(), 3), 'YYYY-MM-DD');
    var url = `https://d3capoqa8f983r.cloudfront.net/api/ohlc/${symbol}/${date}`;

    const response = await fetch(url, {
      method: 'GET'
    });

    if (!response.ok) throw new Error('response not successful');

    const stockData = await response.json();
    if (!stockData.success) throw new Error('Not successful');

    const updated = stockData.data.map(item => {
      return {
        open: item.open,
        close: item.close,
        high: item.high,
        low: item.low,
        volume: item.volume,
        date: new Date(item.date)
      };
    });

    return updated;
  }, [symbol]);

  useEffect(() => {
    if (symbol) {
      getData().then(data => setChartData(data));
    } else setChartData();
  }, [symbol, getData]);

  useEffect(() => {
    determineIfWatchlistOpen();
    determineIfNewsOpen();
  }, [determineIfWatchlistOpen, determineIfNewsOpen]);
  function handleD3FCClick() {
    window.fin.System.openUrlWithBrowser('https://d3fc.io/');
  }

  return (
    <>
      <div className="main">
        <Components.Titlebar title="Chart" />
        <div className="chart-stuff">
          <div className="card-menu">
            <button
              className={cx('card-menu-show', { open: showMenu })}
              onClick={() => setShowMenu(!showMenu)}
            >
              <span>
                {showMenu ? (
                  <Components.Icons.Small.HideMenu />
                ) : (
                  <Components.Icons.Small.ShowMenu />
                )}
              </span>
            </button>
            {showMenu && (
              <span>
                <button
                  className={cx('card-menu-watchlist', {
                    open: openApps.watchlist
                  })}
                  onClick={async () => {
                    await Launchers.launchWatchlist();
                    determineIfWatchlistOpen();
                  }}
                >
                  <span>
                    <Components.Icons.Small.Watchlist />
                    Watchlist
                  </span>
                </button>
                <button
                  className={cx('card-menu-news', { open: openApps.news })}
                  onClick={async () => {
                    await Launchers.launchNews(symbol, name);
                    determineIfNewsOpen();
                  }}
                >
                  <span>
                    <Components.Icons.Small.News />
                    News
                  </span>
                </button>
                <button
                  className={cx('card-menu-watchlist', {
                    open: openApps.addToWatchlist
                  })}
                  onClick={async () => {
                    await Launchers.launchWatchlist(symbol, name);
                    determineIfWatchlistOpen();
                  }}
                >
                  <span>
                    <Components.Icons.Small.Watchlist />
                    Add to Watchlist
                  </span>
                </button>
              </span>
            )}
          </div>
          <div className="symbol-info">
            {symbol && <div className="code">{symbol}</div>}
            <div className="name">{!symbol ? 'Generated Data' : name}</div>
          </div>
          <Chart chartData={chartData} />
        </div>
        <div className="chart-info">
          <div className="chart-tool">Powered by</div>
          <div className="d3fc-button">
            <D3FCIcon onClick={() => handleD3FCClick()} />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
