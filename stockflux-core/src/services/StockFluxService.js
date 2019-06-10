import {format} from 'date-fns';

// written in the same structure as d3fc-financial-feed
export function getStockFluxData() {
    var product,
        start,
        end;

    var stockFlux = function(cb) {
        var params = [];
        // defaulting data to 2016-01-01 as currently UI has no influence over dates
        if (start != null) {
            params.push('/' + format(start, 'YYYY-MM-DD'));
        }
        if (end != null) {
            params.push('/' + format(end, 'YYYY-MM-DD'));
        }
        window.fin.Window.getCurrent().then(function(win) {
            return win.getOptions();
        }).then(function(options) {
            return options.customData.apiBaseUrl;
        }).then(function(api) {
            // change to AWS endpoint
            var url = api + '/ohlc/' + product + '/2016-01-01';
            fetch(url, {
                method: 'GET'
            }).then(function(response) {
                return response.json();
            }).then(function(stockData) {
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
            }).catch(function(error) {
                cb(error);
            });
        }
    )};

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
    const currentWindow = await window.fin.Window.getCurrent();
    const options = await currentWindow.getOptions();
    const res = await fetch(`${options.customData.apiBaseUrl}/securities/search/${item}`, {method: 'GET'});
    const stockData = await res.json();
    return stockData.success ? stockData.data.map(item => ({code: item.symbol, name: item.name})) : [];
}

export function getMiniChartData(symbol) {
    return window.fin.Window.getCurrent().then(function(win) {
            return win.getOptions();
        }).then(function(options) {
            return options.customData.apiBaseUrl;
        }).then(function(api) {
            var url = api + '/securities/' + symbol;
            return fetch(url, {
                    method: 'GET'
                }).then(function(response) {
                    return response.json();
                }).then(function(stockData) {
                    if (stockData.success) {
                        return {
                            data: stockData.data.ohlc.map(function(item) {
                                return {
                                    open: item.open,
                                    close: item.close,
                                    high: item.high,
                                    low: item.low,
                                    volume: item.volume,
                                    date: new Date(item.date)
                                }
                            }),
                            name: stockData.data.name
                        }
                    } else if (!stockData.success && stockData.error) {
                        return {
                            success: false,
                            error: stockData.error.messages[0]
                        };
                    }
                }).catch(function() {
                    return [];
                });
        });
}

export function getSymbolNews(symbol) {
    return window.fin.Window.getCurrent().then(function(win) {
        return win.getOptions();
    }).then(function(options) {
        return options.customData.apiBaseUrl;
    }).then(function(api) {
        var url = api + '/news/' + symbol;
        return fetch(url, {
            method: 'GET'
        }).then(function(response) {
            return response.json();
        }).catch(function() {
            return [];
        });
    });
}
