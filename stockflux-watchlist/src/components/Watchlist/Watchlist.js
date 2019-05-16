import React, { useState } from 'react';
import WatchlistCard from '../WatchlistCard/WatchlistCard';
import Components from 'stockflux-components';
import * as fdc3 from 'openfin-fdc3';
import {
  onDragStart,
  onDragOver,
  resetDragState,
  onDrop,
  onDropOutside
} from '../WatchlistCard/WatchlistCard.Dragging';
import './Watchlist.css';

let latestListener;

const getDistinctElementArray = array => [...new Set(array)];

const Watchlist = () => {
  const [name, setName] = useState('');
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [unwatchedSymbol, setUnwatchedSymbol] = useState(null);
  const [watchlist, setWatchlist] = Components.useLocalStorage('watchlist', [
    'AAPL',
    'AAP',
    'CC',
    'MS',
    'JPS'
  ]);

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
    }
  });
  latestListener = currentListener;

  return (
    <div
      className="watchlist"
      onDragStart={e => onDragStart(e, watchlist, setDragOverIndex)}
      onDragOver={e =>
        onDragOver(e, watchlist, dragOverIndex, setDragOverIndex)
      }
      onDragEnd={() => resetDragState(setDragOverIndex)}
      onDrop={e =>
        onDrop(e, watchlist, getSymbolIndex, setWatchlist, dragOverIndex)
      }
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
};

export default Watchlist;
