(function() {
    'use strict';

    angular.module('openfin.stock', [])
       .controller('StockCtrl', ['$routeParams', function($routeParams) {
           var self = this;

           self.stock = $routeParams.stock;
       }
       ]);
}());
