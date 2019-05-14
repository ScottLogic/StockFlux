import moment from 'moment';
import fetch from 'isomorphic-fetch';

// written in the same structure as d3fc-financial-feed
export default function getStockFluxData() {
    var product,
        start,
        end;

    var stockFlux = function(cb) {
        var params = [];
        // defaulting data to 2016-01-01 as currently UI has no influence over dates 
        if (start != null) {
            params.push('/' + moment(start).format('YYYY-MM-DD'));
        }
        if (end != null) {
            params.push('/' + moment(end).format('YYYY-MM-DD'));
        }
        // change to AWS endpoint
        var url = 'https://bkep4zhkka.execute-api.eu-west-2.amazonaws.com/dev/ohlc/' + product + '/2016-01-01';
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
