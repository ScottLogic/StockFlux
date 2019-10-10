import React, { useState, useEffect } from 'react';
import WatchlistCard from '../watchlist-card/WatchlistCard';
import Components from 'stockflux-components';
import { StockFluxHooks, OpenfinApiHelpers } from 'stockflux-core';
//import TransparentWindow from 'stockflux-launcher/transparent-window/';
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
  onDrop,
  onDropOutside
} from '../watchlist-card/WatchlistCard.Dragging';
import './Watchlist.css';

let latestListener;

const getDistinctElementArray = array => [...new Set(array)];

const Watchlist = () => {
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [unwatchedSymbol, setUnwatchedSymbol] = useState(null);
  const [displayPreview, setDisplayPreview] = useState(false);
  const [previewOptions, setPreviewOptions] = useState();
  const [previewPosition, setPreviewPosition] = useState({ top: 0, left: 0 });
  const [previewSize, setPreviewSize] = useState({ height: 300, width: 300 });
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

  const handlePreviewImage = (x, y) => {
    setDisplayPreview(x === 0 && y === 0);
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
      setPreviewOptions(value);
    });
  }, []);

  useEffect(() => {
    if (previewOptions) {
      const leftPosition =
        window.screen.availWidth -
          (window.outerWidth +
            window.screenLeft +
            5 +
            previewOptions.defaultWidth) >
        0
          ? window.outerWidth + window.screenLeft + 5
          : window.screenLeft - 5 - previewOptions.defaultWidth;
      setPreviewPosition({
        left:
          leftPosition > 0
            ? leftPosition
            : window.outerWidth + window.screenLeft + 5,
        top: window.screenTop
      });
      setPreviewSize({
        height: previewOptions.defaultHeight,
        width: previewOptions.defaultWidth
      });
    }
  }, [previewOptions, displayPreview]);

  return (
    <div
      className="watchlist"
      onDragStart={e => onDragStart(e, watchlist, setDragOverIndex)}
      onDragOver={e =>
        onDragOver(e, watchlist, dragOverIndex, setDragOverIndex)
      }
      onDragEnd={() => {
        setDisplayPreview(false);
        resetDragState(setDragOverIndex);
      }}
      onDrop={e => {
        setDisplayPreview(false);
        onDrop(e, watchlist, getSymbolIndex, setWatchlist, dragOverIndex);
      }}
      onDragLeave={e =>
        handlePreviewImage(e.nativeEvent.clientY, e.nativeEvent.clientX)
      }
      onDragEnter={e =>
        handlePreviewImage(e.nativeEvent.clientY, e.nativeEvent.clientX)
      }
    >
      <Components.PreviewWindow
        display={displayPreview}
        htmlfile="preview-chart.html"
        position={previewPosition}
        size={previewSize}
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
