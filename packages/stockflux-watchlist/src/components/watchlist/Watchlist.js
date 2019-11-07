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
  const [newSymbol, setNewSymbol] = useState({ symbol: null, isNew: false });
  const [windowOptions, setWindowOptions] = useState(null);
  const [previewDetails, setPreviewDetails] = useState({
    position: { top: 0, left: 0 },
    size: { height: 300, width: 300 }
  });
  const [watchlist, setWatchlist] = StockFluxHooks.useLocalStorage(
    'watchlist',
    ['AAPL', 'AAP', 'CC', 'MS', 'JPS']
  );
  const WINDOW_OFFSET = 5;

  const [options] = useOptions();
  const notification = useNotification(NOTIFICATION_OPTIONS);

  const displayNotification = () => {
    if (notification) {
      notification.launch({
        url: 'notification.html'
      });
    }
  };
  const addToWatchlist = async incomingSymbol => {
    setNewSymbol({
      symbol: incomingSymbol,
      isNew: !watchlist.includes(incomingSymbol)
    });
    await displayNotification(incomingSymbol);
    setWatchlist(getDistinctElementArray([incomingSymbol, ...watchlist]));
  };

  const { data } = useInterApplicationBusSubscribe(
    { uuid: options ? options.uuid : '*' },
    'stockflux-watchlist'
  );

  useEffect(() => {
    if (notification.state === 'LAUNCHED') {
      notification.populate(
        <div className="notification">
          <div className="icon"></div>
          <p>
            {`${newSymbol.symbol} ${
              newSymbol.isNew
                ? 'has been added to your Watchlist'
                : 'has been moved to the top of your Watchlist'
            }`}
          </p>
        </div>
      );
    }
  });
  useEffect(() => {
    if (data && data.message && data.message.symbol) {
      addToWatchlist(data.message.symbol);
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
    if (windowOptions) {
      /*Always recalculate where the target window should drop, for is the window has been moved. */
      const dropPosition = {
        left: calcLeftPosition(windowOptions.defaultWidth, WINDOW_OFFSET),
        top: window.screenTop
      };
      Launchers.launchChart(symbol, stockName, dropPosition);
    }
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
      setWindowOptions(value);
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
    if (windowOptions) {
      setPreviewDetails({
        ...previewDetails,
        position: {
          left: calcLeftPosition(windowOptions.defaultWidth, WINDOW_OFFSET),
          top: window.screenTop
        },
        size: {
          height: windowOptions.defaultHeight,
          width: windowOptions.defaultWidth
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayPreview, windowOptions]);

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
        windowName="chart-preview"
        display={displayPreview}
        htmlPath="preview-chart.html"
        position={previewDetails.position}
        size={previewDetails.size}
      ></Components.PreviewWindow>
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
