import React, { useState, useEffect } from 'react';
import WatchlistCard from '../watchlist-card/WatchlistCard';
import Components from 'stockflux-components';
import { StockFluxHooks, OpenfinApiHelpers, Launchers } from 'stockflux-core';
import * as fdc3 from 'openfin-fdc3';
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
import { useNotification } from 'openfin-react-hooks';
import './Watchlist.css';

let latestListener;

const NOTIFICATION_OPTIONS = {
  cssUrl: './notification.css',
  parentDocument: document,
  shouldInheritCss: true
};

const getDistinctElementArray = array => [...new Set(array)];

const Watchlist = () => {
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [unwatchedSymbol, setUnwatchedSymbol] = useState(null);
  const [displayPreview, setDisplayPreview] = useState(false);
  const [newSymbol, setNewSymbol] = useState(null);
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
  const notification = useNotification(NOTIFICATION_OPTIONS);

  const displayNotification = newSymbol => {
    setNewSymbol(newSymbol);
    if (notification) {
      notification.launch({
        url: 'notification.html',
        timeout: 'never'
      });
    }
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
    if (notification.state === 'LAUNCHED') {
      const alreadyInWatchlist = watchlist.includes(newSymbol);
      notification.populate(
        <>
          <div className="notification-icon">
            <img
              id="icon"
              className={alreadyInWatchlist ? 'arrow-up' : 'card-icon'}
              src={alreadyInWatchlist ? 'ArrowUp.png' : 'CardIcon.png'}
              alt="Notification Icon"
            />
          </div>
          <div id="notification-content">
            <p id="title">WATCHLIST UPDATED</p>
            <hr />
            <p id="info">
              <span id="symbol">{newSymbol}</span>
              <span id="message">{`${
                alreadyInWatchlist ? ' moved' : ' added'
              } to the top`}</span>
            </p>
          </div>
        </>
      );
    }
  });
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
    Launchers.launchChart(symbol, stockName, previewDetails.position);
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

  const screenLeft = () =>
    window.screenLeft > 0
      ? window.screenLeft
      : window.screen.availWidth + window.screenLeft;

  const leftPosition = (targetWidth, offset) =>
    window.screen.availWidth -
      (window.outerWidth + screenLeft() + offset + targetWidth) >
    0
      ? window.outerWidth + screenLeft() + offset
      : screenLeft() - offset - targetWidth;

  const calcLeftPosition = (targetWidth, offset) =>
    leftPosition(targetWidth, offset) > window.screen.availLeft
      ? window.screenleft > 0
        ? leftPosition(targetWidth, offset)
        : window.screen.availLeft + leftPosition(targetWidth, offset)
      : window.outerWidth + screenLeft() + offset;

  useEffect(() => {
    const WINDOW_OFFSET = 5;

    if (previewDetails.options) {
      setPreviewDetails({
        ...previewDetails,
        position: {
          left: calcLeftPosition(
            previewDetails.options.defaultWidth,
            WINDOW_OFFSET
          ),
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
