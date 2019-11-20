import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { OpenfinApiHelpers } from 'stockflux-core';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import Minichart from '../minichart/Minichart';
import Components from 'stockflux-components';
import { StockFlux, Utils, Launchers } from 'stockflux-core';
import currentWindowService from '../../services/currentWindowService';
import cx from 'classnames';
import reducer, { initialState } from '../../reducers/open-apps/OpenApps';
import Action from '../../reducers/open-apps/Action';
import previewOptions from '../PreviewOptions';
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
  const [openApps, dispatch] = useReducer(reducer, initialState);
  const [showMenu, setShowMenu] = useState(false);

  const determineIfNewsOpen = useCallback(async () => {
    const newsWindow = await OpenfinApiHelpers.windowAlreadyExists(
      `stockflux-news[${symbol}]`
    );
    if (newsWindow) {
      newsWindow.addListener('closed', determineIfNewsOpen);
    }
    dispatch({ type: Action.SET_NEWS_WINDOW, payload: newsWindow });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  const determineIfChartOpen = useCallback(async () => {
    const chartWindow = await OpenfinApiHelpers.windowAlreadyExists(
      `stockflux-chart[${symbol}]`
    );
    if (chartWindow) {
      chartWindow.addListener('closed', determineIfChartOpen);
    }
    dispatch({ type: Action.SET_CHART_WINDOW, payload: chartWindow });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  useEffect(() => {
    determineIfChartOpen();
    determineIfNewsOpen();
  }, [determineIfChartOpen, determineIfNewsOpen]);

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
      bindings.previewMode(previewOptions.chart);
    };
  };

  const openChart = async () => {
    await bindings.onDropOutside(symbol, stockData.name);
    determineIfChartOpen();
  };

  const onDragEnd = e => {
    if (e.dataTransfer.dropEffect === 'none') {
      openChart();
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
        <div className="card default-background" draggable="false">          
          <div className="card-details">
            <div className="card-name symbol">{symbol}</div>
            <div className="card-price">
              <span className="symbol">
                <span
                  className={`${
                    stockData.percentage < 0
                      ? 'price_negative'
                      : 'price_positive'
                  }`}
                >
                  {stockData.percentage < 0 ? (
                    <Components.Icons.Arrows.PriceDown />
                  ) : (
                    <Components.Icons.Arrows.PriceUp />
                  )}
                </span>
                {stockData.price || 'N/A'}
              </span>
              <span
                className={`delta ${
                  stockData.percentage < 0 ? 'price_negative' : 'price_positive'
                }`}
              >
                {stockData.delta > 0 && '+'}
                {stockData.delta || ''} ({Math.abs(stockData.percentage) + '%'})
              </span>
            </div>
          </div>
          <div className="card-chart">
            <Minichart
              symbol={symbol}
              chartData={chartData}
              fetchError={fetchError}
            />
          </div>
          <div className="card-menu">
            {showMenu && (
              <span>
                <button
                  className="card-menu-remove"
                  onClick={e => {
                    e.stopPropagation();
                    removeFromWatchList(symbol);
                  }}
                >
                  <span>
                    <Components.Icons.Small.RemoveIcon />
                    Remove
                  </span>
                </button>
                <button
                  className={cx('card-menu-news', { open: openApps.news })}
                  onClick={async () => {
                    await Launchers.launchNews(symbol, stockData.name);
                    determineIfNewsOpen();
                  }}
                >
                  <span>
                    <Components.Icons.Small.News />
                    News
                  </span>
                </button>
                <button
                  className={cx('card-menu-chart', { open: openApps.chart })}
                  onClick={openChart}
                >
                  <span>
                    <Components.Icons.Small.Chart />
                    Chart
                  </span>
                </button>
              </span>
            )}
            <button
              className={cx('card-menu-show', { open: showMenu })}
              onClick={() => setShowMenu(!showMenu)}
            >
              <span>
                {showMenu ? (
                  <Components.Icons.Small.ShowMenu />
                ) : (
                  <Components.Icons.Small.HideMenu />
                )}
              </span>
            </button>
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
