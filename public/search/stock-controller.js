(function() {
    'use strict';

    angular.module('openfin.stock', ['openfin.quandl', 'openfin.openfin'])
       .controller('StockCtrl', ['$routeParams', 'quandlService', 'openfinService',
           function($routeParams, quandlService, openfinService) {
               var self = this;
               self.stocks = [];
               self.stocksLoaded = false;

               quandlService.stock().get({ query: $routeParams.query }, function(result) {
                   // Re-fetch the cached result.
                   var fetchedStocks = result.datasets,
                       length = fetchedStocks.length,
                       i,
                       fetchedStock,
                       stock;

                   self.stocksLoaded = true;

                   for (i = 0; i < length; i++) {
                       fetchedStock = fetchedStocks[i];
                       self.stocks.push({
                           name: fetchedStock.name,
                           code: fetchedStock.dataset_code
                       });
                   }

                   // After the stock meta-data has been fetched and displayed the financial data
                   // can be retrieved and displayed
                   for (i = 0; i < length; i++) {
                       stock = self.stocks[i];
                       fetchStockData(stock);
                   }
               });

               function fetchStockData(stock) {
                   quandlService.stockData().get({ code: stock.code }, function(result) {
                       var data = result.stockData;
                       stock.data = data.data;
                       stock.startDate = data.startDate;
                       stock.endDate = data.endDate;
                   });
               }

               self.open = function(stockName) {
                   openfinService.open(stockName);
               };
           }]);
}());
