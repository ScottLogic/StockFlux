import React, { useState, useEffect } from 'react';
import { OpenfinApiHelpers } from 'stockflux-core';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import Minichart from '../minichart/Minichart';
import Components from 'stockflux-components';
import { StockFlux, Utils } from 'stockflux-core';
import currentWindowService from '../../services/currentWindowService';
import { useOptions } from 'openfin-react-hooks';
import './WatchlistCard.css';

const WatchlistCard = ({
  symbol,
  dragOver,
  dragOverBottom,
  bindings,
  isUnwatching,
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

  const [options] = useOptions();

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

  const sendSymbolToNews = () => {
    try {
      OpenfinApiHelpers.sendInterApplicationMessage(
        { uuid: options ? options.uuid : '*' },
        'news',
        {
          symbol
        }
      );
    } catch (err) {
      console.error(err);
    }
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
        <div className="card default-background" draggable="false">
          <div className="card-top darkens">
            <div className="details-container">
              <div className="symbol">{symbol}</div>
              <div className="name">{stockData.name}</div>
            </div>
            <div className="icons">
              <div className="icon">
                <Components.Shortcuts.NewsBorderless
                  symbol={symbol}
                  name={stockData.name}
                  small={true}
                  onClick={sendSymbolToNews}
                />
              </div>
              <div className="icon">
                <Components.Shortcuts.ChartBorderless
                  symbol={symbol}
                  name={stockData.name}
                  small={true}
                  onClick={() => bindings.onDropOutside(symbol, stockData.name)}
                />
              </div>
              <div className="icon">
                <Components.Buttons.Borderless
                  onClick={e => {
                    e.stopPropagation();
                    removeFromWatchList(symbol);
                  }}
                  small={true}
                >
                  <Components.Icons.Small.Watchlist />
                </Components.Buttons.Borderless>
              </div>
            </div>
          </div>
          <div
            className="card-bottom"
            onClick={() => bindings.onDropOutside(symbol, stockData.name)}
          >
            <Minichart
              symbol={symbol}
              chartData={chartData}
              fetchError={fetchError}
            />
            <div className="details">
              {<div className="price">{stockData.price || 'N/A'}</div>}
              <div
                className={classNames({
                  'percentage price_positive': stockData.percentage > 0,
                  'percentage price_negative': stockData.percentage < 0
                })}
              >
                {stockData.percentage ? (
                  <span>
                    {stockData.percentage > 0 ? (
                      <Components.Icons.Arrows.PriceUp />
                    ) : (
                      <Components.Icons.Arrows.PriceDown />
                    )}
                    {stockData.percentage < 0 ? '-' : ''}
                    {Math.abs(stockData.percentage) + '%'}
                  </span>
                ) : (
                  ''
                )}
              </div>
              {
                <div
                  className={classNames({
                    'delta price_positive': stockData.percentage > 0,
                    'delta price_negative': stockData.percentage < 0
                  })}
                >
                  {stockData.delta || ''}
                </div>
              }
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
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  dragOver: PropTypes.bool.isRequired,
  dragOverBottom: PropTypes.bool.isRequired,
  isUnwatching: PropTypes.bool.isRequired,
  removeFromWatchList: PropTypes.func.isRequired
};

export default WatchlistCard;
