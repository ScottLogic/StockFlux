import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import { truncate } from '../../services/formatters';
import Minichart from '../Minichart/Minichart';
import Confirmation from './UnwatchConfirmation';
import { Quandl } from 'stockflux-core';
import currentWindowService from '../../services/currentWindowService';
import './WatchlistCard.css';

function WatchlistCard(props) {
  const [dragging, setDragging] = useState({
    isDragging: false,
    clientX: null,
    offsetY: null
  });
  const [starTop, setStarTop] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [stockData, setStockData] = useState({
    name: 'N/A',
    price: 0,
    delta: 0,
    percentage: 0
  });

  useEffect(() => {
    Quandl.getStockData(props.symbol).then(response => {
      const data = response.stockData.data[0];

      const stockName = response.dataset.name;
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
      setChartData(response.stockData.data);
    });
  }, [props.symbol]);

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
    return name ? truncate(name) : '';
  };

  const onIconClick = e => {
    setStarTop(e.target.getBoundingClientRect().top);
    props.bindings.onIconClick(props.symbol)(e);
    e.stopPropagation();
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
      props.bindings.onDropOutside(props.symbol, stockData.name);
    }
    setDragging({ isDragging: false });
  };

  return stockData ? (
    <div
      id={`stock_${props.symbol}`}
      className={classNames({
        'card-wrapper': true,
        dragging: dragging.isDragging,
        dragOver: props.dragOver,
        dragOverBottom: props.dragOverBottom
      })}
      draggable={!props.isUnwatching}
      onDragStart={onDragStart(props.symbol)}
      onDragEnd={onDragEnd}
    >
      <div className="drop-target">
        <div className="card darkens default-background" draggable="false">
          <div className="card-top">
            <div className="button-icon star active" onClick={onIconClick}>
              &nbsp;
            </div>
            {props.isUnwatching && (
              <Confirmation
                starTop={starTop}
                onModalBackdropClick={props.bindings.onModalBackdropClick}
                onModalConfirmClick={() =>
                  props.bindings.onModalConfirmClick(props.symbol)
                }
              />
            )}
            <div className="name">{stockData.name}</div>
            <div className="symbol">{props.symbol}</div>
          </div>
          <div className="card-bottom">
            <Minichart symbol={props.symbol} chartData={chartData} />
            <div className="details">
              {<div className="price">{stockData.price || 'N/A'}</div>}
              {<div className="delta">{stockData.delta || ''}</div>}

              <div className="percentage">
                {stockData.percentage ? (
                  <>
                    <div
                      className={classNames({
                        'icon arrow-up': stockData.percentage > 0,
                        'icon arrow-down': stockData.percentage < 0
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
}

WatchlistCard.propTypes = {
  symbol: PropTypes.string.isRequired,
  bindings: PropTypes.shape({
    onIconClick: PropTypes.func.isRequired,
    onModalConfirmClick: PropTypes.func.isRequired,
    onModalBackdropClick: PropTypes.func.isRequired
  }).isRequired,
  isUnwatching: PropTypes.bool.isRequired
};

export default WatchlistCard;
