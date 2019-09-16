import { format, subYears } from 'date-fns';
import { getCurrentWindow } from '../openfin-api-utils/openfinApiHelpers';

// written in the same structure as d3fc-financial-feed
export function getStockFluxData() {
  var product, start, end;

  var stockFlux = function(cb) {
    var params = [];
    // defaulting data to minus 2 years from current date as currently UI has no influence over dates
    if (start != null) {
      params.push('/' + format(start, 'YYYY-MM-DD'));
    }
    if (end != null) {
      params.push('/' + format(end, 'YYYY-MM-DD'));
    }
    getCurrentWindow()
      .then(function(win) {
        return win.getOptions();
      })
      .then(function(options) {
        return options.customData.apiBaseUrl;
      })
      .then(function(api) {
        var todayMinusTwoYear = format(subYears(new Date(), 2), 'YYYY-MM-DD');
        var url = `${api}/ohlc/${product}/${todayMinusTwoYear}`;
        fetch(url, {
          method: 'GET'
        })
          .then(function(response) {
            return response.json();
          })
          .then(function(stockData) {
            if (stockData.success) {
              cb(
                undefined,
                stockData.data.map(item => {
                  return {
                    open: item.open,
                    close: item.close,
                    high: item.high,
                    low: item.low,
                    volume: item.volume,
                    date: new Date(item.date)
                  };
                })
              );
            } else if (!stockData.success) {
              cb(stockData);
            }
          })
          .catch(function(error) {
            cb(error);
          });
      });
  };

  stockFlux.product = function(x) {
    if (!arguments.length) {
      return product;
    }
    product = x;
    return stockFlux;
  };
  stockFlux.start = function(x) {
    if (!arguments.length) {
      return start;
    }
    start = x;
    return stockFlux;
  };
  stockFlux.end = function(x) {
    if (!arguments.length) {
      return end;
    }
    end = x;
    return stockFlux;
  };

  return stockFlux;
}

export async function stockFluxSearch(item) {
  const options = await getWindowOptions();
  try {
    const res = await fetch(
      `${options.customData.apiBaseUrl}/securities/search/${item}`,
      { method: 'GET' }
    );
    const stockData = await res.json();
    return stockData.success
      ? stockData.data.map(item => ({ code: item.symbol, name: item.name }))
      : [];
  } catch (e) {
    return [];
  }
}

export async function getMiniChartData(symbol) {
  const options = await getWindowOptions();
  try {
    const res = await fetch(
      `${options.customData.apiBaseUrl}/securities/${symbol}`,
      { method: 'GET' }
    );
    const stockData = await res.json();
    if (stockData.success) {
      return {
        data: stockData.data.ohlc.map(item => ({
          open: item.open,
          close: item.close,
          high: item.high,
          low: item.low,
          volume: item.volume,
          date: new Date(item.date)
        })),
        name: stockData.data.name
      };
    } else if (!stockData.success && stockData.error) {
      return {
        success: false,
        error: stockData.error.messages[0]
      };
    }
  } catch (e) {
    return {
      success: false,
      error: 'Request failed. ' + e
    };
  }
}

async function getWindowOptions() {
  const currentWindow = await getCurrentWindow();
  return currentWindow.getOptions();
}

export async function getSymbolNews(symbol) {
  const options = await getWindowOptions();
  try {
    const res = await fetch(`${options.customData.apiBaseUrl}/news/${symbol}`, {
      method: 'GET'
    });
    return res.json();
  } catch (e) {
    return [];
  }
}
