import React, { useState } from 'react';
import starIcon from 'stockflux-components/src/images/star_tab.png';
import WatchlistCard from '../WatchlistCard/WatchlistCard';
import ClosedWindows from '../ClosedWindows/ClosedWindows';
import Components from 'stockflux-components';

import './Watchlist.css';

function Watchlist() {
  const [name, setName] = useState('');
  const [unwatchedSymbol, setUnwatchedSymbol] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragStartClientY, setDragStartClientY] = useState(null);
  const [cardHeight, setCardHeight] = useState(null);
  const [watchlist, setWatchlist] = useState([
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
    watchlist.splice(symbolIndex, 1);
    setWatchlist(watchlist);
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
      setWatchlist(tempWatchlist);
    } else if (!watchlist.includes(symbol)) {
      setWatchlist(watchlist.push(symbol));
    }
  };

  const onDropOutside = (symbol, stockName, position) => {
    // TODO: Spawn chart children windows
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
        <img src={starIcon} className="icon-right" alt="Star Icon" />
      </div>
      <Components.ScrollWrapperY>
        {watchlist.length === 0 && (
          <div className="no-watchlist">
            <p>You have no watchlist stocks to display.</p>
            <p>Use the search tab to add new stocks to the list.</p>
          </div>
        )}
        {watchlist.map((symbol, i) => (
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
        ))}
      </Components.ScrollWrapperY>
      <div className="footer">
        <ClosedWindows />
      </div>
    </div>
  );
}

export default Watchlist;
