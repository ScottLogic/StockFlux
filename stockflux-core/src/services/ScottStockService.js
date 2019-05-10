import moment from 'moment';
import fetch from 'isomorphic-fetch';

// written in the same structure as d3fc-financial-feed
export default function getScottStockData() {
    var product,
        start,
        end;

    var scottStock = function(cb) {
        var params = [];
        // defaulting data to 2016-01-01 as currently UI has no influence over dates 
        if (start != null) {
            params.push('/' + moment(start).format('YYYY-MM-DD'));
        }
        if (end != null) {
            params.push('/' + moment(end).format('YYYY-MM-DD'));
        }
        // change to AWS endpoint
        var url = 'http://ws01135:3000/ohlc/' + product + '/2016-01-01';
        fetch(url, {
                method: 'GET'
            }).then(function(response) {
                return response.json();
              })
              .then(function(stockData) {
                  if (stockData.success) {
                      cb(undefined, stockData.data.map(function(item) {
                          return {
                              open: item.open,
                              close: item.close,
                              high: item.high,
                              low: item.low,
                              volume: item.volume,
                              date: new Date(item.date)
                          };
                      }))
                  } else if (!stockData.success) {
                      cb(stockData);
                  }
                }
            ).catch(function(error) {
                cb(error);
            });
    };

    scottStock.product = function(x) {
        if (!arguments.length) {
            return product;
        }
        product = x;
        return scottStock;
    };
    scottStock.start = function(x) {
        if (!arguments.length) {
            return start;
        }
        start = x;
        return scottStock;
    };
    scottStock.end = function(x) {
        if (!arguments.length) {
            return end;
        }
        end = x;
        return scottStock;
    };

    return scottStock;
}
