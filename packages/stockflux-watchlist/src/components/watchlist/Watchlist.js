import React, { useState, useEffect } from 'react';
import WatchlistCard from '../watchlist-card/WatchlistCard';
import Components from 'stockflux-components';
import { StockFluxHooks, OpenfinApiHelpers, Launchers } from 'stockflux-core';
import * as fdc3 from 'openfin-fdc3';
import { showNotification } from '../notifications/Notification';
import {
  useInterApplicationBusSubscribe,
  useOptions
} from 'openfin-react-hooks';
import {
  onDragStart,
  onDragOver,
  resetDragState,
  onDrop
} from '../watchlist-card/WatchlistCard.Dragging';
import './Watchlist.css';

let latestListener;

const getDistinctElementArray = array => [...new Set(array)];

const Watchlist = () => {
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [unwatchedSymbol, setUnwatchedSymbol] = useState(null);
  const [displayPreview, setDisplayPreview] = useState(false);
  const [previewDetails, setPreviewDetails] = useState({
    options: null,
    position: { top: 0, left: 0 },
    size: { height: 300, width: 300 }
  });
  const [watchlist, setWatchlist] = StockFluxHooks.useLocalStorage(
    'watchlist',
    ['AAPL', 'AAP', 'CC', 'MS', 'JPS']
  );

  const [options] = useOptions();

  const displayNotification = newSymbol => {
    const alreadyInWatchlist = watchlist.includes(newSymbol);
    showNotification({
      message: {
        symbol: newSymbol,
        watchlistName: 'My Watchlist',
        alreadyInWatchlist,
        messageText: `${alreadyInWatchlist ? ' moved' : ' added'} to the top`
      }
    });
  };

  const addToWatchlist = symbol => {
    setWatchlist(getDistinctElementArray([symbol, ...watchlist]));
    displayNotification(symbol);
  };

  const { data } = useInterApplicationBusSubscribe(
    { uuid: options ? options.uuid : '*' },
    'stockflux-watchlist'
  );

  useEffect(() => {
    if (data && data.message) {
      if (data.message.symbol) {
        addToWatchlist(data.message.symbol);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onIconClick = symbol => {
    return e => {
      setUnwatchedSymbol(symbol);
      e.preventDefault();
    };
  };

  const onModalConfirmClick = symbol => {
    setUnwatchedSymbol(null);
    const symbolIndex = getSymbolIndex(symbol);
    let tempwatchlist = [
      ...watchlist.slice(0, symbolIndex),
      ...watchlist.slice(symbolIndex + 1)
    ];
    setWatchlist(tempwatchlist);
  };

  const onModalBackdropClick = e => {
    setUnwatchedSymbol(null);
    e.stopPropagation();
  };

  const getSymbolIndex = symbol => watchlist.indexOf(symbol);

  const onDropOutside = (symbol, stockName) => {
    // the 3rd param is for intents enabled.
    Launchers.launchChart(symbol, stockName, null, previewDetails.position);
  };

  const bindings = {
    onModalConfirmClick: onModalConfirmClick,
    onModalBackdropClick: onModalBackdropClick,
    onIconClick: onIconClick,
    resetDragState: resetDragState,
    onDropOutside: onDropOutside
  };

  /*
   * This is a temorary solution for
   * 1) not being able to unsubscribe intentListeners
   * 2) not being able to addIntentListener in useEffect due to the race condition
   * 3) being forced to create a new intentListener every render (memory leak)
   * This works due to us manually using only the latest intentListener
   */
  const currentListener = fdc3.addIntentListener('WatchlistAdd', context => {
    if (context && currentListener === latestListener) {
      const newSymbol = context.id.default;
      setWatchlist(getDistinctElementArray([newSymbol, ...watchlist]));
      displayNotification(newSymbol);
    }
  });
  latestListener = currentListener;

  const removeFromWatchList = symbol => {
    setWatchlist(watchlist.filter(item => item !== symbol));
  };

  const getWindowOptions = async () => {
    const targetApplication = await OpenfinApiHelpers.getStockFluxApp(
      'stockflux-chart'
    );
    const manifestContents = await fetch(targetApplication.manifest, {
      method: 'GET'
    });

    const info = await manifestContents.json();
    return info.startup_app;
  };

  useEffect(() => {
    getWindowOptions().then(value => {
      setPreviewDetails({ ...previewDetails, options: value });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const WINDOW_OFFSET = 5;
    const screenLeft =
      window.screenLeft > 0
        ? window.screenLeft
        : window.screen.availWidth + window.screenLeft;
    if (previewDetails.options) {
      const leftPosition =
        window.screen.availWidth -
          (window.outerWidth +
            screenLeft +
            WINDOW_OFFSET +
            previewDetails.options.defaultWidth) >
        0
          ? window.outerWidth + screenLeft + WINDOW_OFFSET
          : screenLeft - WINDOW_OFFSET - previewDetails.options.defaultWidth;
      setPreviewDetails({
        ...previewDetails,
        position: {
          left:
            leftPosition > window.screen.availLeft
              ? window.screenLeft > 0
                ? leftPosition
                : window.screen.availLeft + leftPosition
              : window.outerWidth + screenLeft + WINDOW_OFFSET,
          top: window.screenTop
        },
        size: {
          height: previewDetails.options.defaultHeight,
          width: previewDetails.options.defaultWidth
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayPreview]);

  return (
    <div
      className="watchlist"
      onDragStart={e => {
        onDragStart(e, watchlist, setDragOverIndex);
        setDisplayPreview(true);
      }}
      onDragOver={e => {
        onDragOver(e, watchlist, dragOverIndex, setDragOverIndex);
      }}
      onDragEnd={() => {
        setDisplayPreview(false);
        resetDragState(setDragOverIndex);
      }}
      onDrop={e => {
        setDisplayPreview(false);
        onDrop(e, watchlist, getSymbolIndex, setWatchlist, dragOverIndex);
      }}
    >
      <Components.PreviewWindow
        display={displayPreview}
        htmlfile="preview-chart.html"
        position={previewDetails.position}
        size={previewDetails.size}
      ></Components.PreviewWindow>
      <div className="header">
        <span className="watchlist-name">My Watchlist</span>
      </div>
      <Components.ScrollWrapperY>
        {watchlist.length === 0 ? (
          <div className="no-watchlist">
            <p>You have no stocks to display.</p>
            <p>Use StockFlux Search app to add new stocks to the list.</p>
          </div>
        ) : (
          watchlist.map((symbol, i) => (
            <WatchlistCard
              key={symbol}
              symbol={symbol}
              bindings={bindings}
              isUnwatching={unwatchedSymbol === symbol}
              dragOver={dragOverIndex === i}
              dragOverBottom={
                dragOverIndex === watchlist.length && i === watchlist.length - 1
              }
              removeFromWatchList={removeFromWatchList}
            />
          ))
        )}
      </Components.ScrollWrapperY>
    </div>
  );
};

export default Watchlist;
