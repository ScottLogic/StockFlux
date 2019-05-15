import React, { useState, useEffect } from 'react';
import WatchlistCard from '../WatchlistCard/WatchlistCard';
import Components from 'stockflux-components';
import * as fdc3 from 'openfin-fdc3';

import {
  dragOverIndex,
  onDragStart,
  onDragOver,
  resetDragState,
  onDrop,
  onDropOutside
} from '../WatchlistCard/WatchlistCard.Dragging';
import './Watchlist.css';

let hasAddedListener = false;

function Watchlist() {
  const [name, setName] = useState('');
  const [unwatchedSymbol, setUnwatchedSymbol] = useState(null);
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
    let tempwatchlist = [
      ...watchlist.slice(0, symbolIndex),
      ...watchlist.slice(symbolIndex + 1)
    ];
    persistWatchlist(tempwatchlist);
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
      onDragStart={e => onDragStart(e, watchlist)}
      onDragOver={e => onDragOver(e, watchlist)}
      onDragEnd={resetDragState}
      onDrop={e => onDrop(e, watchlist, getSymbolIndex, persistWatchlist)}
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
