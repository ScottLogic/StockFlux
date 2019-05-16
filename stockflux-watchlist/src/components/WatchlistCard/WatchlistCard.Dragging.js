import * as fdc3 from 'openfin-fdc3';

let dragStartClientY = null;
let cardHeight = null;

const getSymbolFromDataTransfer = types => {
  for (let i = 0; i < types.length; i += 1) {
    const dataTransferObj = JSON.parse(types[i]);
    if (Object.keys(dataTransferObj)[0] === 'symbol') {
      return dataTransferObj.symbol.toUpperCase();
    }
  }
  return undefined;
};

export const onDragStart = (e, watchlist, setDragOverIndex) => {
  setDragOverIndex(
    watchlist.indexOf(getSymbolFromDataTransfer(e.dataTransfer.types))
  );
  cardHeight = e.target.getBoundingClientRect().height;
  dragStartClientY = e.nativeEvent.clientY;
};

export const onDragOver = (e, watchlist, dragOverIndex, setDragOverIndex) => {
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

export const onDrop = (
  e,
  watchlist,
  getSymbolIndex,
  setWatchlist,
  dragOverIndex
) => {
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

export const onDropOutside = async function(symbol, stockName) {
  await fdc3.raiseIntent(fdc3.Intents.VIEW_CHART, {
    type: 'security',
    name: symbol,
    id: {
      default: stockName
    }
  });
};

export const resetDragState = setDragOverIndex => {
  setDragOverIndex(null);
  dragStartClientY = null;
};
