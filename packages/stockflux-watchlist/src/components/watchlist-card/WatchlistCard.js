import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaTimes } from 'react-icons/fa';
import Minichart from '../minichart/Minichart';
import Components from 'stockflux-components';
import { StockFlux, Intents, Utils } from 'stockflux-core';
import currentWindowService from '../../services/currentWindowService';
import './WatchlistCard.css';

const WatchlistCard = ({
  symbol,
  bindings,
  isUnwatching,
  dragOver,
  dragOverBottom,
  removeFromWatchList
}) => {
  const [dragging, setDragging] = useState({
    isDragging: false,
    clientX: null,
    offsetY: null
  });
  const [chartData, setChartData] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [stockData, setStockData] = useState({
    name: 'N/A',
    price: 0,
    delta: 0,
    percentage: 0
  });

  useEffect(() => {
    const populateChart = async () => {
      const miniChartData = await StockFlux.getMiniChartData(symbol);
      if (miniChartData && miniChartData.data) {
        const data = miniChartData.data[0];
        const stockName = miniChartData.name;
        let tempStockData = { name: stockName };

        if (data) {
          tempStockData = {
            name: getName(stockName),
            price: getPrice(data.close),
            delta: getDelta(data.close - data.open),
            percentage: getPercentage(
              ((data.close - data.open) / data.open) * 100
            )
          };
        }
        setStockData(tempStockData);
        setChartData(miniChartData.data);
      } else {
        miniChartData
          ? setFetchError(miniChartData.error)
          : setFetchError('Error: data returned was undefined');
      }
    };
    populateChart();
  }, [symbol]);

  const getPrice = price => {
    return !isNaN(+price) ? (+price).toFixed(2) : null;
  };
  const getDelta = delta => {
    return !isNaN(+delta) ? (+delta).toFixed(2) : null;
  };
  const getPercentage = percentage => {
    return !isNaN(+percentage) ? (+percentage).toFixed(2) : null;
  };
  const getName = name => {
    return name ? Utils.truncate(name) : '';
  };

  const onDragStart = symbol => {
    return e => {
      const symbolData = { symbol: symbol };
      const { clientX } = e;
      const { offsetY } = e.nativeEvent;
      const windowData = {
        window: currentWindowService.getCurrentWindowName()
      };
      setDragging({ isDragging: true, clientX, offsetY });
      e.dataTransfer.setData(JSON.stringify(symbolData), '');
      e.dataTransfer.setData(JSON.stringify(windowData), '');
    };
  };

  const onDragEnd = e => {
    if (e.dataTransfer.dropEffect === 'none') {
      bindings.onDropOutside(symbol, stockData.name);
    }
    setDragging({ isDragging: false });
  };

  return stockData ? (
    <div
      id={`stock_${symbol}`}
      className={classNames({
        'card-wrapper': true,
        dragging: dragging.isDragging,
        dragOver: dragOver,
        dragOverBottom: dragOverBottom
      })}
      draggable={!isUnwatching}
      onDragStart={onDragStart(symbol)}
      onDragEnd={onDragEnd}
    >
      <div className="drop-target">
        <div className="card darkens default-background" draggable="false">
          <div className="card-top">
            <div className="details-container">
              <div className="name">{stockData.name}</div>
              <div className="symbol">{symbol}</div>
            </div>
            <div className="icons">
              <div
                className="news-symbol"
                onClick={() => {
                  Intents.viewNews(symbol, stockData.name);
                }}
              >
                <Components.News />
              </div>
              <div
                className="remove-symbol"
                onClick={e => {
                  e.stopPropagation();
                  removeFromWatchList(symbol);
                }}
              >
                <FaTimes />
              </div>
            </div>
          </div>
          <div
            className="card-bottom"
            onClick={() => Intents.viewChart(symbol, stockData.name)}
          >
            <Minichart
              symbol={symbol}
              chartData={chartData}
              fetchError={fetchError}
            />
            <div className="details">
              {<div className="price">{stockData.price || 'N/A'}</div>}
              {<div className="delta">{stockData.delta || ''}</div>}

              <div className="percentage">
                {stockData.percentage ? (
                  <>
                    <div
                      className={classNames({
                        'stockflux-icon arrow-up': stockData.percentage > 0,
                        'stockflux-icon arrow-down': stockData.percentage < 0
                      })}
                      title="Stock Arrow"
                      draggable="false"
                    />
                    {Math.abs(stockData.percentage) + '%'}
                  </>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

WatchlistCard.propTypes = {
  symbol: PropTypes.string.isRequired,
  bindings: PropTypes.shape({
    onIconClick: PropTypes.func.isRequired,
    onModalConfirmClick: PropTypes.func.isRequired,
    onModalBackdropClick: PropTypes.func.isRequired,
    onDropOutside: PropTypes.func.isRequired
  }).isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  dragOver: PropTypes.func.isRequired,
  dragOverBottom: PropTypes.func.isRequired,
  isUnwatching: PropTypes.bool.isRequired,
  removeFromWatchList: PropTypes.func.isRequired
};

export default WatchlistCard;
