(function() {
    'use strict';

    angular.module('openfin.selection', [])
        .factory('selectionService', [function() {
            var selectedStock = '';

            function select(stock) {
                selectedStock = stock;
            }

            function getSelectedStock() {
                return selectedStock;
            }

            return {
                select: select,
                selectedStock: getSelectedStock
            };
        }]);
}());
