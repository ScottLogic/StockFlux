import React, { useState, useEffect } from 'react';
import WatchlistCard from '../WatchlistCard/WatchlistCard';
import Components from 'stockflux-components';
import * as fdc3 from 'openfin-fdc3';
import './Watchlist.css';

let hasAddedListener = false;

function Watchlist() {
  const [name, setName] = useState('');
  const [unwatchedSymbol, setUnwatchedSymbol] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragStartClientY, setDragStartClientY] = useState(null);
  const [cardHeight, setCardHeight] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const initialWatchlist = ['AAPL', 'AAP', 'CC', 'MS', 'JPS'];
    const localStorageWatchlist = JSON.parse(localStorage.getItem('watchlist'));

    /*
     * Spreading the watchlist object below because it is possible
     * to get the intent before watchlist is initialised
     */
    persistWatchlist([
      ...(localStorageWatchlist || initialWatchlist),
      ...watchlist
    ]);
  }, [watchlist]);

  const persistWatchlist = tempWatchlist => {
    const watchlistToPersist = [...new Set(tempWatchlist)];
    setWatchlist(watchlistToPersist);
    localStorage.setItem('watchlist', JSON.stringify(watchlistToPersist));
  };

  const onIconClick = symbol => {
    return e => {
      setUnwatchedSymbol(symbol);
      e.preventDefault();
    };
  };

  const onModalConfirmClick = symbol => {
    setUnwatchedSymbol(null);
    const symbolIndex = getSymbolIndex(symbol);
    let tempwatchlist = watchlist;
    tempwatchlist.splice(symbolIndex, 1);
    persistWatchlist(tempwatchlist);
  };

  const onModalBackdropClick = e => {
    setUnwatchedSymbol(null);
    e.stopPropagation();
  };

  const getSymbolFromDataTransfer = types => {
    for (let i = 0; i < types.length; i += 1) {
      const dataTransferObj = JSON.parse(types[i]);
      if (Object.keys(dataTransferObj)[0] === 'symbol') {
        return dataTransferObj.symbol.toUpperCase();
      }
    }
    return undefined;
  };

  const onDragStart = e => {
    setDragOverIndex(
      watchlist.indexOf(getSymbolFromDataTransfer(e.dataTransfer.types))
    );
    setCardHeight(e.target.getBoundingClientRect().height);
    setDragStartClientY(e.nativeEvent.clientY);
  };

  const getSymbolIndex = symbol => watchlist.indexOf(symbol);

  const onDragOver = e => {
    if (dragStartClientY) {
      const dragOverIndexOffset = Math.ceil(
        ((e.nativeEvent.clientY - dragStartClientY) / (cardHeight / 2) + 1) / 2
      );
      const currentDraggedIndex = watchlist.indexOf(
        getSymbolFromDataTransfer(e.dataTransfer.types)
      );
      let nextDragOverIndex = currentDraggedIndex + dragOverIndexOffset;

      if (nextDragOverIndex <= currentDraggedIndex) {
        nextDragOverIndex -= 1;
      }
      if (watchlist[nextDragOverIndex] && nextDragOverIndex !== dragOverIndex) {
        setDragOverIndex(nextDragOverIndex);
      } else if (nextDragOverIndex >= watchlist.length) {
        setDragOverIndex(watchlist.length);
      }
    }

    e.preventDefault();
  };

  const onDrop = e => {
    const symbol = getSymbolFromDataTransfer(e.dataTransfer.types);

    if (dragStartClientY) {
      let currentIndex = getSymbolIndex(symbol);
      let tempWatchlist = watchlist;
      tempWatchlist.splice(currentIndex, 1);
      tempWatchlist.splice(
        Math.max(
          0,
          currentIndex > dragOverIndex ? dragOverIndex : dragOverIndex - 1
        ),
        0,
        symbol
      );
      persistWatchlist(tempWatchlist);
    } else if (!watchlist.includes(symbol)) {
      persistWatchlist(watchlist.push(symbol));
    }
  };

  const onDropOutside = async function(symbol, stockName) {
    await fdc3.raiseIntent(fdc3.Intents.VIEW_CHART, {
      type: 'security',
      name: symbol,
      id: {
        default: stockName
      }
    });
  };

  const resetDragState = () => {
    setDragOverIndex(null);
    setDragStartClientY(null);
  };

  const bindings = {
    onModalConfirmClick: onModalConfirmClick,
    onModalBackdropClick: onModalBackdropClick,
    onIconClick: onIconClick,
    resetDragState: resetDragState,
    onDropOutside: onDropOutside
  };

  if (!hasAddedListener) {
    fdc3.addIntentListener('WatchlistAdd', context => {
      if (context) {
        const newSymbol = context.id.default;
        persistWatchlist([newSymbol, ...watchlist]);
      }
    });
    hasAddedListener = true;
  }

  return (
    <div
      className="watchlist"
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={resetDragState}
      onDrop={onDrop}
    >
      <div className="header">
        <span className="watchlist-name">
          <input
            id="watchlist-name"
            type="text"
            placeholder="My Watchlist"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </span>
        <div className="icon star-tab" title="Star Tab">
          &nbsp;
        </div>
      </div>
      <Components.ScrollWrapperY>
        {watchlist.length === 0 ? (
          <div className="no-watchlist">
            <p>You have no stocks to display.</p>
            <p>Use stockflux search app to add new stocks to the list.</p>
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
            />
          ))
        )}
      </Components.ScrollWrapperY>
    </div>
  );
}

export default Watchlist;
