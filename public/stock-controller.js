(function() {
    'use strict';

    angular.module('openfin.stock', ['openfin.quandl'])
       .controller('StockCtrl', ['$routeParams', 'quandlService', function($routeParams, quandlService) {
           var self = this;

           self.results = '';

           quandlService.get({ query: $routeParams.query }, function(result) {
               // Re-fetch the cached result.
               self.results = result.datasets;
           });
       }
       ]);
}());
